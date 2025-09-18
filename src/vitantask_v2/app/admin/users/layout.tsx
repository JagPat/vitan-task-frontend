import type React from "react"
import { AuthGuard } from "@/components/auth-guard"

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard requireAuth={true} requireAdmin={true}>
      {children}
    </AuthGuard>
  )
}
