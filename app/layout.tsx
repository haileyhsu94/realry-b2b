import type { Metadata } from 'next'
import './carbon.scss'
import './globals.css'
import { FeatureFlags, Theme } from '@carbon/react'

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
        <FeatureFlags
          enableV12TileDefaultIcons
          enableV12TileRadioIcons
          enableV12Overflowmenu
          enableV12DynamicFloatingStyles
        >
          <Theme theme="g10">{children}</Theme>
        </FeatureFlags>
      </body>
    </html>
  )
}
