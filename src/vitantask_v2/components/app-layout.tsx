"use client"

import type React from "react"

import { useState } from "react"
import { AppSidebar } from "./app-sidebar"
import { AppHeader } from "./app-header"
import { Breadcrumbs } from "./breadcrumbs"
import { useIsMobile } from "@/hooks/use-mobile"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isMobile = useIsMobile()

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen)
    } else {
      setSidebarCollapsed(!sidebarCollapsed)
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex ${sidebarCollapsed ? "w-16" : "w-64"} transition-all duration-300`}>
        <AppSidebar isCollapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64">
            <AppSidebar isCollapsed={false} onToggle={toggleSidebar} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader onMenuClick={toggleSidebar} />
        <div className="border-b bg-background px-4 py-2 lg:px-6">
          <Breadcrumbs />
        </div>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-muted/30">{children}</main>
      </div>
    </div>
  )
}
