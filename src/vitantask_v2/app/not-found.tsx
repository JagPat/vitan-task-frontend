import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckSquare, Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <CheckSquare className="h-8 w-8" />
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl">Page Not Found</CardTitle>
            <CardDescription>The page you're looking for doesn't exist or has been moved.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-6xl font-bold text-muted-foreground">404</div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button asChild variant="outline" className="flex-1 bg-transparent">
              <Link href="javascript:history.back()">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Link>
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
