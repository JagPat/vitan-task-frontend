"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Loader2, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireAdmin?: boolean
}

// Mock auth state - in real app this would come from context/store
const mockAuthState = {
  isAuthenticated: true,
  isAdmin: false,
  user: {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "user" as "user" | "admin",
  },
}

export function AuthGuard({ children, requireAuth = true, requireAdmin = false }: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Simulate auth check
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Check for development mode bypass
        if (process.env.NODE_ENV === "development" && process.env.VITE_NO_AUTH === "true") {
          setIsAuthorized(true)
          setIsLoading(false)
          return
        }

        const { isAuthenticated, user } = mockAuthState
        const isAdmin = user?.role === "admin"

        // Check if auth is required
        if (requireAuth && !isAuthenticated) {
          router.push("/login")
          return
        }

        // Check if admin is required
        if (requireAdmin && !isAdmin) {
          setError("Access denied. Administrator privileges required.")
          setIsLoading(false)
          return
        }

        setIsAuthorized(true)
        setIsLoading(false)
      } catch (error) {
        setError("Authentication failed. Please try again.")
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [pathname, router, requireAuth, requireAdmin])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="h-12 w-12 text-destructive" />
            </div>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                {requireAdmin
                  ? "You need administrator privileges to access this page."
                  : "Please sign in to continue."}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.push("/dashboard")} className="flex-1 bg-transparent">
                Go to Dashboard
              </Button>
              <Button onClick={() => router.push("/login")} className="flex-1">
                Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}
