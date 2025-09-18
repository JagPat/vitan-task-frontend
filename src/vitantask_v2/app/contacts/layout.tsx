import type React from "react"
import { AuthGuard } from "@/components/auth-guard"

export default function ContactsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthGuard requireAuth={true}>{children}</AuthGuard>
}
