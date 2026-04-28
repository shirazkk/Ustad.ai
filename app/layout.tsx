import type { Metadata, Viewport } from 'next';
import './globals.css';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github-dark.css';
import BackgroundBlobs from '@/components/BackgroundBlobs';

export const metadata: Metadata = {
  title: 'Ustaad.ai — Pakistan ka apna AI tutor',
  description:
    'Ustaad Bilal — Roman Urdu + English mein parhao, desi analogies ke saath. Built for Pakistan’s next generation.',
};

export const viewport: Viewport = {
  themeColor: '#0D0D1A',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-dvh bg-brand-bg text-brand-text font-nunito">
        <BackgroundBlobs />
        {children}
      </body>
    </html>
  );
}
