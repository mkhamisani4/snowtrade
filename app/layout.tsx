import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SnowTrade - Scenario-Based Trading Simulator',
  description: 'Learn trading through gamified scenarios with AI-powered feedback',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

