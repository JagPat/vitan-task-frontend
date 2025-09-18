import type React from "react"
import { AuthGuard } from "@/components/auth-guard"

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard requireAuth={true} requireAdmin={false}>
      {children}
    </AuthGuard>
  )
}
