import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Tramicar — Transferencias Vehiculares',
  description: 'Transferí tu auto sin vueltas. Automatizamos todo el proceso de compraventa.',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor: '#4338ca',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
        <style>{`next-dev-overlay{display:none!important}`}</style>
      </head>
      <body className="min-h-screen bg-bg">
        {children}
      </body>
    </html>
  )
}
