import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans'
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono'
})

export const metadata: Metadata = {
  title: 'Word to HTML - Clean HTML Conversion SaaS',
  description: 'Convert Microsoft Word content to clean, optimized HTML. Remove unwanted formatting while preserving essential structure.',
  keywords: ['word to html', 'html cleaner', 'word converter', 'html optimization', 'saas'],
  authors: [{ name: 'Word to HTML SaaS' }],
  creator: 'Word to HTML SaaS',
  publisher: 'Word to HTML SaaS',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Word to HTML - Clean HTML Conversion SaaS',
    description: 'Convert Microsoft Word content to clean, optimized HTML. Remove unwanted formatting while preserving essential structure.',
    url: '/',
    siteName: 'Word to HTML SaaS',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Word to HTML SaaS',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Word to HTML - Clean HTML Conversion SaaS',
    description: 'Convert Microsoft Word content to clean, optimized HTML',
    images: ['/og-image.png'],
    creator: '@wordtohtmlsaas',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <div className="relative flex min-h-screen flex-col">
          <main className="flex-1">
            {children}
          </main>
        </div>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'hsl(var(--card))',
              color: 'hsl(var(--card-foreground))',
              border: '1px solid hsl(var(--border))',
            },
          }}
        />
      </body>
    </html>
  )
} 