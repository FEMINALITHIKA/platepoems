import './globals.css'
import type { Metadata } from 'next'
import { Playfair_Display, Lato } from 'next/font/google'

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })
const lato = Lato({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-lato' })

export const metadata: Metadata = {
  title: 'PlatePoems - Discover Culinary Inspirations',
  description: 'Explore and save your favorite recipes with PlatePoems',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${lato.variable} font-sans`}>{children}</body>
    </html>
  )
}

