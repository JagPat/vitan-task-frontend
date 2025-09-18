import type React from "react"
import { AuthGuard } from "@/components/auth-guard"

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard requireAuth={true} requireSuperAdmin={true}>
      {children}
    </AuthGuard>
  )
}
