"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  CheckSquare,
  FolderOpen,
  User,
  Settings,
  BarChart3,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
  className?: string
}

const userNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Tasks",
    href: "/tasks",
    icon: CheckSquare,
  },
  {
    title: "Projects",
    href: "/projects",
    icon: FolderOpen,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
  },
]

const adminNavItems = [
  {
    title: "Admin Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Roles",
    href: "/admin/roles",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
]

export function AppSidebar({ isCollapsed, onToggle, className }: SidebarProps) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith("/admin") || false // In real app, get from auth context

  return (
    <TooltipProvider>
      <div
        className={cn(
          "flex h-full flex-col border-r bg-sidebar transition-all duration-300",
          isCollapsed ? "w-16" : "w-64",
          className,
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b">
          {!isCollapsed && (
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <CheckSquare className="h-4 w-4" />
              </div>
              <span className="font-serif font-bold text-lg">VitanTask</span>
            </Link>
          )}
          <Button variant="ghost" size="icon" onClick={onToggle} className="h-8 w-8">
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-2 px-2">
            {/* User Navigation */}
            <div className="space-y-1">
              {!isCollapsed && (
                <div className="px-2 py-1">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Main</h3>
                </div>
              )}
              {userNavItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon

                const navItem = (
                  <Button
                    key={item.href}
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      isCollapsed && "px-2",
                      isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
                    )}
                    asChild
                  >
                    <Link href={item.href}>
                      <Icon className="h-4 w-4" />
                      {!isCollapsed && <span className="ml-2">{item.title}</span>}
                    </Link>
                  </Button>
                )

                if (isCollapsed) {
                  return (
                    <Tooltip key={item.href}>
                      <TooltipTrigger asChild>{navItem}</TooltipTrigger>
                      <TooltipContent side="right">{item.title}</TooltipContent>
                    </Tooltip>
                  )
                }

                return navItem
              })}
            </div>

            {/* Admin Navigation - Only show admin nav if user has admin access */}
            {(isAdmin || process.env.NODE_ENV === "development") && (
              <div className="space-y-1">
                {!isCollapsed && (
                  <>
                    <Separator className="my-4" />
                    <div className="px-2 py-1">
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Admin</h3>
                    </div>
                  </>
                )}
                {adminNavItems.map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon

                  const navItem = (
                    <Button
                      key={item.href}
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start",
                        isCollapsed && "px-2",
                        isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
                      )}
                      asChild
                    >
                      <Link href={item.href}>
                        <Icon className="h-4 w-4" />
                        {!isCollapsed && <span className="ml-2">{item.title}</span>}
                      </Link>
                    </Button>
                  )

                  if (isCollapsed) {
                    return (
                      <Tooltip key={item.href}>
                        <TooltipTrigger asChild>{navItem}</TooltipTrigger>
                        <TooltipContent side="right">{item.title}</TooltipContent>
                      </Tooltip>
                    )
                  }

                  return navItem
                })}
              </div>
            )}
          </nav>
        </div>
      </div>
    </TooltipProvider>
  )
}
