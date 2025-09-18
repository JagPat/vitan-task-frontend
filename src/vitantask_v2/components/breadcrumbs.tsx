"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  label: string
  href: string
}

const pathMappings: Record<string, string> = {
  dashboard: "Dashboard",
  tasks: "Tasks",
  projects: "Projects",
  contacts: "Contacts",
  profile: "Profile",
  admin: "Admin",
  users: "Users",
  roles: "Roles",
  settings: "Settings",
  analytics: "Analytics",
  "super-admin": "Super Admin",
}

export function Breadcrumbs({ className }: { className?: string }) {
  const pathname = usePathname()
  const pathSegments = pathname.split("/").filter(Boolean)

  const breadcrumbs: BreadcrumbItem[] = [{ label: "Home", href: "/dashboard" }]

  let currentPath = ""
  pathSegments.forEach((segment) => {
    currentPath += `/${segment}`
    const label = pathMappings[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
    breadcrumbs.push({ label, href: currentPath })
  })

  if (breadcrumbs.length <= 1) return null

  return (
    <nav className={cn("flex items-center space-x-1 text-sm text-muted-foreground", className)}>
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={breadcrumb.href} className="flex items-center">
          {index === 0 && <Home className="h-4 w-4 mr-1" />}
          {index < breadcrumbs.length - 1 ? (
            <Link href={breadcrumb.href} className="hover:text-foreground transition-colors">
              {breadcrumb.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{breadcrumb.label}</span>
          )}
          {index < breadcrumbs.length - 1 && <ChevronRight className="h-4 w-4 mx-1" />}
        </div>
      ))}
    </nav>
  )
}
