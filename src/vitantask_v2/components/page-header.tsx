"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    variant?: "default" | "outline" | "secondary" | "destructive" | "ghost" | "link"
  }
  className?: string
  children?: React.ReactNode
}

export function PageHeader({ title, description, action, className, children }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", className)}>
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-balance">{title}</h1>
        {description && <p className="text-sm sm:text-base text-muted-foreground">{description}</p>}
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        {children}
        {action && (
          <Button onClick={action.onClick} variant={action.variant || "default"} className="w-full sm:w-auto">
            {action.label}
          </Button>
        )}
      </div>
    </div>
  )
}
