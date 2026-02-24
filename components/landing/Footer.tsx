'use client';

import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Logo } from '@/components/ui/Logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-neutral-900 to-black text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.03),transparent_50%)]" />

      <div className="container mx-auto max-w-7xl px-8 relative z-10">
        {/* Main Footer Content */}
        <div className="py-16">
          {/* Brand Section */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-4">
              <Logo href="/" variant="light" iconSize="md" />
            </div>
            <p className="text-neutral-400 text-[15px] leading-relaxed max-w-2xl mx-auto">
              Empowering writers with blockchain-powered micro-tipping and content monetization.
            </p>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="py-8 border-t border-white/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-2 text-neutral-400 text-[13px]">
            <span>© {currentYear} QuillTip. Built with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" />
            <span>for writers everywhere</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}