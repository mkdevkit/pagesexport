import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Astro Content Manager',
  description: 'Content management tool for Astro sites',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
