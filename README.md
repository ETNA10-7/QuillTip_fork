# QuillTip - Decentralized Publishing Platform

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live%20Demo-quilltip.me-blue?style=for-the-badge)](https://quilltip.me)
[![Stellar Contract](https://img.shields.io/badge/Stellar%20Contract-View%20on%20Explorer-yellow?style=for-the-badge)](https://stellar.expert/explorer/testnet/contract/CASU4I45DVK3ZMXA3T34A3XF3BM4NBTFDW3QVCB3XA7PIWJSTN4HCVWG)
[![Arweave Storage](https://img.shields.io/badge/Arweave-Permanent%20Storage-blue?style=for-the-badge)](https://arweave.net)

</div>

**🔗 Live Application:** [https://quilltip.me](https://quilltip.me)
**📜 Tipping Contract:** [`CASU4I45DVK3ZMXA3T34A3XF3BM4NBTFDW3QVCB3XA7PIWJSTN4HCVWG`](https://stellar.expert/explorer/testnet/contract/CASU4I45DVK3ZMXA3T34A3XF3BM4NBTFDW3QVCB3XA7PIWJSTN4HCVWG)
**🎨 NFT Contract:** [`CAS44OQK7A6W5FDRAH3K3ZN7TTQTJ5ESRVG6MB2HBVFWZ5TVH26UUB4S`](https://stellar.expert/explorer/testnet/contract/CAS44OQK7A6W5FDRAH3K3ZN7TTQTJ5ESRVG6MB2HBVFWZ5TVH26UUB4S)

## 🎭 Demo Account

| Field | Value |
|-------|-------|
| **Email** | demo@example.com |
| **Password** | Stellar123 |

## 🎥 Demo Video

[![QuillTip Demo Video](./QuillTip_Cover.jpg)](https://youtu.be/OqOkbAm9_T8?si=onogkL495LIzwaki)

*Click the image above to watch the demo video*

## 🚀 Overview

QuillTip is a decentralized publishing platform where writers can earn money through reader tips. Built with Next.js 16, Convex backend, Stellar blockchain for payments, and Arweave for permanent content storage. QuillTip enables writers to earn direct income from readers while providing an interactive, engaging reading experience with content that lasts forever.

## 🎯 Key Features

- **Direct Payments**: Authors receive 97.5% of tips via Stellar
- **Permanent Storage**: Articles stored forever on Arweave blockchain
- **Free Access**: No subscription required to read or write
- **Real-time Features**: Live tips and text highlights
- **NFT Support**: Articles can be minted as NFTs
- **Microtipping**: Tip highlights for as low as $0.01

## 🏗️ Technical Stack

### Frontend

- **Next.js 16**: React framework with App Router
- **TypeScript 5**: Type safety
- **Tailwind CSS 4**: Styling
- **Radix UI**: UI components
- **TipTap 3**: Rich text editor
- **Motion**: Animations
- **Lucide React**: Icons

### Backend

- **Convex 1.31**: Real-time backend
  - Type-safe APIs
  - Real-time subscriptions
  - Authentication (@convex-dev/auth)
  - File storage
  - Caching

### Blockchain

- **Stellar Network**: Payment processing
- **Soroban Smart Contracts**: Rust contracts for:
  - Unified article + highlight tipping with fee distribution
  - NFT minting with Arweave metadata
  - NFT ownership transfers
- **Arweave Network**: Permanent content storage via Turbo SDK
  - FREE uploads for articles under 100 KiB
  - Immutable, censorship-resistant storage
  - Real transaction IDs for verification

### Database Schema

```text
// Core Tables (Convex)
- users          // User profiles and authentication
- articles       // Published content and drafts
- tips           // Transaction records
- highlights     // Interactive annotations
- articleNFTs    // Minted article NFTs
- earnings       // Author revenue tracking
- fileUploads    // Media storage metadata
- withdrawals    // Payout history
- tags           // Content categorization
- authTables     // Convex Auth system tables
```

## 📦 Project Structure

```text
QuillTip/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── [username]/        # User profiles
│   ├── articles/          # Article views
│   ├── write/             # Editor interface
│   └── drafts/            # Draft management
├── components/            # React components
│   ├── article/           # Article-specific components
│   ├── editor/            # TipTap editor components
│   ├── ui/                # Shared UI components
│   └── user/              # User-related components
├── convex/                # Backend functions
│   ├── articles.ts        # Article CRUD operations
│   ├── auth.ts            # Authentication logic
│   ├── highlights.ts      # Highlight management
│   ├── nfts.ts            # NFT operations
│   ├── tips.ts            # Tipping transactions
│   ├── uploads.ts         # File storage
│   └── users.ts           # User management
├── contracts/             # Stellar smart contracts
│   ├── tipping/           # Tip distribution contract
│   └── article-nft/       # NFT minting contract
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
└── types/                 # TypeScript definitions
```

## 🌟 Key Features

### For Writers

- **Rich Text Editor**
  - Advanced formatting (headings, lists, code blocks)
  - Image uploads with automatic compression
  - YouTube video embeds
  - Syntax highlighting for code
  - Auto-save every 30 seconds
  - Draft management system

- **Analytics Dashboard**
  - Real-time earnings tracking
  - Article performance metrics
  - Reader engagement statistics
  - Tip history and trends

- **NFT Minting**
  - Automatic eligibility after tip threshold
  - One-click minting process
  - Full ownership and transfer rights

### For Readers

- **Interactive Reading**
  - Text highlighting with notes
  - Public/private annotations
  - Color-coded highlights
  - Persistent across sessions

- **Microtipping**
  - Support authors with $0.01 - $100
  - Article tip presets ($1, $5, $10)
  - Highlight tip presets (10¢, 50¢, $1)
  - Instant Stellar transactions
  - Transaction history

- **Content Discovery**
  - Full-text search
  - Tag-based filtering
  - Author collections
  - Trending articles

### For Collectors

- **Article NFTs**
  - Unique digital collectibles
  - Transferable ownership
  - On-chain provenance
  - Future marketplace integration

## 🔧 Installation & Setup

### Prerequisites

- Node.js 20+ and npm/yarn
- Git
- Stellar wallet (for blockchain features)

### Quick Start

1. **Clone the repository**

```bash
git clone https://github.com/pragya-shar/QuillTip.git
cd QuillTip
```

1. **Install dependencies**

```bash
npm install
```

1. **Set up environment variables**

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Convex (auto-generated on first run)
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=

# Site URL (for auth redirects)
SITE_URL=http://localhost:3000

# Stellar Configuration (optional for local dev)
STELLAR_TIPPING_CONTRACT_ID=
STELLAR_DEPLOYER_ADDRESS=
STELLAR_NETWORK=testnet
```

1. **Initialize Convex**

```bash
npx convex dev
```

This will:

- Create a new Convex project
- Generate type definitions
- Set up real-time sync

1. **Deploy Stellar contracts (optional)**

```bash
cd contracts/tipping
cargo build --target wasm32-unknown-unknown --release
stellar contract deploy --wasm target/wasm32-unknown-unknown/release/tipping.wasm

cd ../article-nft
cargo build --target wasm32-unknown-unknown --release
stellar contract deploy --wasm target/wasm32-unknown-unknown/release/article_nft.wasm
```

1. **Start development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment

### Production Build

```bash
npm run build
npm start
```

### Deploy to Vercel

```bash
vercel
```

### Deploy Convex Functions

```bash
npx convex deploy --prod
```

## 📝 Development Commands

```bash
# Development
npm run dev              # Start frontend + Convex dev server
npm run dev:frontend     # Frontend only
npm run dev:backend      # Convex only

# Testing
npm test                 # Run tests with Vitest
npm run test:coverage    # Generate coverage report
npm run test:debug       # Debug tests

# Code Quality
npm run lint             # ESLint checks
npm run typecheck        # TypeScript validation

# Convex Management
npx convex dashboard     # Open Convex dashboard
npx convex deploy        # Deploy to production
npx convex logs          # View function logs
```

## 🔐 Security Features

- **Authentication**: Secure password hashing with Scrypt (via Convex Auth)
- **Authorization**: Role-based access control
- **Data Validation**: Zod schemas for all inputs
- **XSS Protection**: Content sanitization
- **CSRF Protection**: Built into Convex
- **Rate Limiting**: API throttling
- **Secure File Uploads**: Type validation and size limits

## 🎨 UI Components

The platform uses a comprehensive component library:

- **Primitives**: Button, Input, Card, Dialog, Toast
- **Article**: ArticleCard, ArticleGrid, ArticleViewer
- **Editor**: RichTextEditor, ToolbarButton, ImageUpload
- **User**: ProfileHeader, UserStats, EarningsDashboard
- **Engagement**: TipButton, HighlightPopover, NFTCard

## 📊 Real-time Features

Powered by Convex subscriptions:

- **Live Article Updates**: Content changes reflect instantly
- **Real-time Tips**: See tips as they happen
- **Active Highlights**: Watch readers engage with content
- **Instant Notifications**: Toast messages for all actions
- **Auto-save Sync**: Drafts saved across devices

## 🌐 Stellar Integration

### Tipping Contract

- **Immediate Settlement**: Direct XLM transfers
- **Fee Distribution**: 97.5% author, 2.5% platform
- **Minimum Tip**: $0.01 USD
- **Transaction Records**: On-chain tip storage and Arweave-linked events

### NFT Contract

- **Threshold Minting**: Requires minimum tip amount
- **Unique Tokens**: One NFT per article
- **Transfer Support**: Transferable ownership on Soroban
- **Arweave Metadata**: Permanent on-chain article reference

## 🗄️ Arweave Integration

QuillTip uses [Arweave](https://arweave.org) via the [Turbo SDK](https://docs.ar.io) for permanent, censorship-resistant content storage.

### How It Works

1. **Publish**: When an article is published, it's automatically queued for Arweave upload
2. **Upload**: Background job uploads article JSON to Arweave (FREE for <100KB)
3. **Verify**: Verification job confirms transaction is permanently stored
4. **Display**: Article page shows "Permanent Storage" status with Arweave link

### What's Stored

```json
{
  "title": "Article Title",
  "body": { /* TipTap JSON content */ },
  "author": "username",
  "authorId": "convex_user_id",
  "timestamp": 1234567890,
  "version": 1
}
```

### View on Blockchain

- **Arweave Gateway**: `https://arweave.net/{txId}`

### Article Status Flow

```
pending → uploaded → verified
```

| Status | Description |
|--------|-------------|
| `pending` | Queued for upload |
| `uploaded` | Successfully uploaded, awaiting confirmation |
| `verified` | Permanently confirmed on Arweave |
| `failed` | Upload failed (will retry)

## 📈 Performance Optimizations

- **Code Splitting**: Dynamic imports for routes
- **Image Optimization**: Automatic compression and WebP
- **Lazy Loading**: Components loaded on demand
- **Caching Strategy**: Convex automatic query caching
- **CDN Delivery**: Static assets via Vercel Edge
- **Database Indexing**: Optimized query patterns

## 🧪 Testing

```bash
# Unit Tests
npm test

# Coverage Report
npm run test:coverage
```

## 📚 API Documentation

### Convex Functions

#### Articles

- `listArticles`: Paginated article feed
- `getArticleBySlug`: Single article fetch
- `createArticle`: New article creation
- `updateArticle`: Edit existing article
- `publishArticle`: Make article public
- `deleteArticle`: Remove article

#### Tips

- `sendTip`: Process tip transaction
- `getArticleTips`: Fetch tip history
- `getUserEarnings`: Calculate revenue

#### NFTs

- `mintNFT`: Create article NFT
- `transferNFT`: Change ownership
- `getNFTDetails`: Fetch metadata

## 🤝 Contributing

Contributions are welcome! Fork the repo, create a feature branch, and open a pull request.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Powered by [Convex](https://convex.dev)
- Payments via [Stellar](https://stellar.org)
- UI components from [Radix UI](https://radix-ui.com)
- Editor by [TipTap](https://tiptap.dev)

## 📞 Support

- **Twitter/X**: [@QuillTip_me](https://x.com/QuillTip_me)
- **Issues**: [github.com/pragya-shar/QuillTip/issues](https://github.com/pragya-shar/QuillTip/issues)
- **Repository**: [github.com/pragya-shar/QuillTip](https://github.com/pragya-shar/QuillTip)

## 🚦 Status

- **Version**: 0.1.0 (Beta)
- **Network**: Stellar Testnet
- **Database**: Convex Cloud
- **Hosting**: Vercel Edge

---

**QuillTip** - Empowering writers through decentralized monetization. Built with ❤️ for the creator economy on Stellar.
