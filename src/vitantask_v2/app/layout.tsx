import type React from "react"
import type { Metadata } from "next"
import { Source_Sans_3 } from "next/font/google"
import { Playfair_Display } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { ToastProvider } from "@/components/toast-provider"
import "./globals.css"

const sourceSansPro = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans-pro",
  display: "swap",
})

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  display: "swap",
})

export const metadata: Metadata = {
  title: "VitanTask - Task Management Platform",
  description: "Professional task management and project collaboration platform",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`font-sans ${sourceSansPro.variable} ${playfairDisplay.variable} ${GeistMono.variable} antialiased`}
      >
        <Suspense fallback={null}>{children}</Suspense>
        <ToastProvider />
        <Analytics />
      </body>
    </html>
  )
}
