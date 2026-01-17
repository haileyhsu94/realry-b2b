import type { Metadata } from 'next'
import './globals.css'
import { Theme } from '@carbon/react'

export const metadata: Metadata = {
  title: 'Partner Performance Dashboard',
  description: 'E-commerce Partner Performance Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Theme theme="g10">
          {children}
        </Theme>
      </body>
    </html>
  )
}
