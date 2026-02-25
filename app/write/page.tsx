'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useEditor, EditorContent, JSONContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import TextAlign from '@tiptap/extension-text-align'
import { common, createLowlight } from 'lowlight'
import { ResizableImage } from '@/components/editor/extensions/ResizableImage'
import { EditorToolbar } from '@/components/editor/EditorToolbar'
import { EditorActionBar } from '@/components/editor/EditorActionBar'
import { useAuth } from '@/components/providers/AuthContext'
import AppNavigation from '@/components/layout/AppNavigation'
import { useAutoSave } from '@/hooks/useAutoSave'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { toast } from 'sonner'

const lowlight = createLowlight(common)

export default function WritePage() {
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [tags, setTags] = useState('')
  const [isPublishing, setIsPublishing] = useState(false)
  const [articleId, setArticleId] = useState<string | undefined>()
  const [editorContent, setEditorContent] = useState<JSONContent | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [publishStatus, setPublishStatus] = useState<{published: boolean, publishedAt: Date | null}>({
    published: false,
    publishedAt: null
  })
  const [editorContentWidth, setEditorContentWidth] = useState<number | null>(null)
  const editorLayoutRef = useRef<HTMLDivElement>(null)

  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  
  // Convex mutations
  const createArticleMutation = useMutation(api.articles.createArticle)
  const publishArticleMutation = useMutation(api.articles.publishArticle)

  // Initialize editor with proper configuration
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6]
        },
        codeBlock: false
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer hover:text-blue-800'
        }
      }),
      ResizableImage.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg my-4'
        }
      }),
      Placeholder.configure({
        placeholder: 'Start writing your story...'
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: 'rounded-lg bg-gray-900 text-gray-100 p-4 my-4 overflow-x-auto'
        }
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] })
    ],
    content: '',
    editorProps: {
      attributes: {
        // No horizontal padding/margin so text starts at left red line, ends at right; wrap there
        class: 'prose prose-lg max-w-full w-full focus:outline-none min-h-[400px] py-6 px-0 mx-0 break-words'
      }
    },
    onCreate: ({ editor }) => {
      // Set initial content state when editor is created
      const json = editor.getJSON()
      setEditorContent(json)
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON()
      setEditorContent(json)
      setHasUnsavedChanges(true)
    }
  })

  // Auto-save hook - enable when we have a user and any content
  const { isSaving, lastSavedAt, error, saveNow } = useAutoSave({
    content: editorContent,
    articleId,
    title: title || 'Untitled',
    excerpt,
    enabled: isAuthenticated && (hasUnsavedChanges || !!title),
    onSaveSuccess: (response) => {
      if (!articleId && response.id) {
        setArticleId(response.id)
      }
      setHasUnsavedChanges(false)
    },
    onSaveError: (error) => {
      console.error('Auto-save error:', error)
    }
  })

  // Log article ID for development (F12 console)
  useEffect(() => {
    if (articleId && process.env.NODE_ENV === 'development') {
      console.log('[QuillTip] Article ID:', articleId)
    }
  }, [articleId])

  // Constrain content width to toolbar icon group (red box) – measure by DOM position, no toolbar changes
  useEffect(() => {
    const el = editorLayoutRef.current
    if (!el) return
    const toolbar = el.firstElementChild
    if (!toolbar) return
    const iconGroup = toolbar.children[1]
    if (!iconGroup || !(iconGroup instanceof HTMLElement)) return
    const setWidth = () => {
      const w = iconGroup.offsetWidth
      if (w > 0) setEditorContentWidth(w)
    }
    let cancelled = false
    const t1 = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!cancelled) setWidth()
      })
    })
    const t2 = setTimeout(() => { if (!cancelled) setWidth() }, 150)
    const t3 = setTimeout(() => { if (!cancelled) setWidth() }, 400)
    const t4 = setTimeout(() => { if (!cancelled) setWidth() }, 800)
    const ro = new ResizeObserver(setWidth)
    ro.observe(iconGroup)
    return () => {
      cancelled = true
      cancelAnimationFrame(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      ro.disconnect()
    }
  }, [editor])

  // Get draft ID from URL params
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
  const draftId = urlParams?.get('id')
  
  // Load draft using Convex query
  const draft = useQuery(
    api.articles.getArticleById, 
    draftId ? { id: draftId as Id<"articles"> } : "skip"
  )

  // Load draft data when it arrives
  useEffect(() => {
    if (draft && editor) {
      setArticleId(draft._id)
      setTitle(draft.title)
      setExcerpt(draft.excerpt || '')
      setPublishStatus({
        published: draft.published,
        publishedAt: draft.publishedAt ? new Date(draft.publishedAt) : null
      })
      if (draft.content) {
        editor.commands.setContent(draft.content)
        setEditorContent(draft.content)
      }
      // Reset unsaved changes flag after loading draft
      setHasUnsavedChanges(false)
    }
  }, [draft, editor])

  // Handle publish
  const handlePublish = useCallback(async () => {
    if (!title || !editorContent) {
      toast.warning('Please add a title and content before publishing')
      return
    }

    setIsPublishing(true)
    try {
      // Save one final time before publishing
      await saveNow()
      
      let resultId: string;
      
      if (articleId) {
        // Publish existing draft
        resultId = await publishArticleMutation({ id: articleId as Id<"articles"> })
      } else {
        // Create and publish new article
        resultId = await createArticleMutation({
          title,
          content: editorContent,
          excerpt: excerpt || undefined,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
          published: true, // Publishing immediately
        })
      }

      // If it was a new article, update the articleId
      if (!articleId) {
        setArticleId(resultId)
      }
      
      // Update publish status
      setPublishStatus({
        published: true,
        publishedAt: new Date()
      })
      
      toast.success('Article published successfully!')
    } catch (error) {
      console.error('Publish error:', error)
      toast.error(`Failed to publish: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsPublishing(false)
    }
  }, [title, editorContent, excerpt, tags, saveNow, articleId, publishArticleMutation, createArticleMutation])

  // Authentication checks
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    router.push('/login')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <AppNavigation />
      <div className="flex flex-col pt-16">
        {/* Action bar - full width, Back | Undo | Redo | Save | Preview | Publish */}
        <EditorActionBar
          editor={editor}
          onBack={() => router.back()}
          onSave={() => {
            saveNow()
            setHasUnsavedChanges(false)
          }}
          onPreview={() => toast.info('Preview coming soon')}
          onPublish={handlePublish}
          isSaving={isSaving}
          error={error}
          isPublished={publishStatus.published}
          isPublishing={isPublishing}
          hasUnsavedChanges={hasUnsavedChanges}
          canPublish={!!(title && editorContent)}
          lastSavedAt={lastSavedAt ?? undefined}
        />
        <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 w-full pt-6 pb-8 px-4 sm:px-6 lg:px-8">
        {/* Title Input */}
        <div className="mb-6" id="field-article-title">
          <input
            id="article-title"
            type="text"
            placeholder="Article Title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              setHasUnsavedChanges(true)
            }}
            className="w-full text-3xl font-bold border-0 border-b-2 border-gray-200 focus:border-blue-500 outline-none pb-2 bg-transparent placeholder-gray-400"
          />
        </div>

        {/* Editor with Toolbar - full width, toolbar + blue line extend to viewport edges */}
        <div className="mb-6 flex flex-col w-full max-w-full write-page-editor-wrap -mx-4 sm:-mx-6 lg:-mx-8" ref={editorLayoutRef}>
          <div className="relative w-screen">
            <EditorToolbar
            editor={editor}
            onFocusTitle={() => {
              const el = document.getElementById('article-title') as HTMLInputElement | null
              document.getElementById('field-article-title')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
              el?.focus()
            }}
            onFocusExcerpt={() => {
              const el = document.getElementById('article-excerpt') as HTMLTextAreaElement | null
              document.getElementById('field-excerpt')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
              el?.focus()
            }}
            onFocusTags={() => {
              const el = document.getElementById('article-tags') as HTMLInputElement | null
              document.getElementById('field-tags')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
              el?.focus()
            }}
          />
            {/* Full-width blue line - spans viewport */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-sky-400 pointer-events-none"
              aria-hidden
            />
          </div>
          <div className="flex w-full">
            <div className="flex-1 min-w-0 shrink-0" aria-hidden />
            <div
              className="min-w-0 shrink-0 overflow-x-hidden box-border overflow-hidden p-0 m-0 w-screen"
              style={{
                minHeight: 400,
              }}
            >
              <EditorContent
                editor={editor}
                className="editor-content write-page-editor-content h-full min-h-[400px] w-full max-w-full p-0 m-0"
              />
            </div>
            <div className="flex-1 min-w-0 shrink-0" aria-hidden />
          </div>
        </div>

        {/* Excerpt */}
        <div className="mb-6" id="field-excerpt">
          <label htmlFor="article-excerpt" className="block text-sm font-medium text-gray-700 mb-2">
            Article Excerpt
          </label>
          <textarea
            id="article-excerpt"
            placeholder="Brief description of your article (optional)"
            value={excerpt}
            onChange={(e) => {
              setExcerpt(e.target.value)
              setHasUnsavedChanges(true)
            }}
            rows={3}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-blue-500 outline-none resize-none placeholder-gray-400"
          />
        </div>

        {/* Tags */}
        <div className="mb-6" id="field-tags">
          <label htmlFor="article-tags" className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <input
            id="article-tags"
            type="text"
            placeholder="Add tags separated by commas (e.g., technology, programming, web)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-blue-500 outline-none placeholder-gray-400"
          />
        </div>
        </div>
      </div>
      </div>
    </div>
  )
}