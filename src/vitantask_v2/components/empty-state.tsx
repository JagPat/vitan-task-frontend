"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <Card className={className}>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
          <Icon className="h-10 w-10 text-muted-foreground" />
        </div>
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription className="text-base max-w-sm">{description}</CardDescription>
        </CardHeader>
        {action && (
          <Button onClick={action.onClick} className="mt-2">
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
