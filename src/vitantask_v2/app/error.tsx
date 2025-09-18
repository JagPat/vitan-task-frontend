"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckSquare, RefreshCw, Home } from "lucide-react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-destructive text-destructive-foreground">
              <CheckSquare className="h-8 w-8" />
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl">Something went wrong!</CardTitle>
            <CardDescription>
              An unexpected error occurred. Please try again or contact support if the problem persists.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {process.env.NODE_ENV === "development" && (
            <div className="text-left p-3 bg-muted rounded-md">
              <p className="text-xs font-mono text-muted-foreground">{error.message}</p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={reset} variant="outline" className="flex-1 bg-transparent">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button asChild className="flex-1">
              <Link href="/dashboard">
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
