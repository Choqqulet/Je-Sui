"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

// 🔗 CONNECTION POINT 5: Auth Callback Handler
interface AuthCallbackProps {
  onSuccess?: (userData: any) => void
  onError?: (error: string) => void
  dashboardUrl?: string
}

export function AuthCallback({ onSuccess, onError, dashboardUrl = "/dashboard" }: AuthCallbackProps) {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [userData, setUserData] = useState<any>(null)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    // 🔗 REPLACE THIS WITH YOUR AUTH VERIFICATION LOGIC
    const handleAuthCallback = async () => {
      try {
        // Get URL parameters or tokens
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get("code")
        const state = urlParams.get("state")

        if (!code) {
          throw new Error("No authorization code received")
        }

        // 🔗 Replace with your backend verification
        // const response = await fetch('/api/auth/verify', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ code, state })
        // })
        // const result = await response.json()

        // Mock successful authentication
        const mockUserData = {
          id: "123",
          email: "user@example.com",
          name: "John Doe",
          provider: state || "google",
        }

        setUserData(mockUserData)
        setStatus("success")
        onSuccess?.(mockUserData)

        // Auto-redirect after 2 seconds
        setTimeout(() => {
          window.location.href = dashboardUrl
        }, 2000)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Authentication failed"
        setError(errorMessage)
        setStatus("error")
        onError?.(errorMessage)
      }
    }

    handleAuthCallback()
  }, [onSuccess, onError, dashboardUrl])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            {status === "loading" && <Loader2 className="w-5 h-5 animate-spin" />}
            {status === "success" && <CheckCircle className="w-5 h-5 text-green-500" />}
            {status === "error" && <XCircle className="w-5 h-5 text-red-500" />}

            {status === "loading" && "Verifying..."}
            {status === "success" && "Success!"}
            {status === "error" && "Error"}
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center space-y-4">
          {status === "loading" && (
            <p className="text-muted-foreground">Please wait while we verify your authentication...</p>
          )}

          {status === "success" && (
            <div className="space-y-2">
              <p className="text-green-600 font-medium">Authentication successful!</p>
              <p className="text-sm text-muted-foreground">Welcome back, {userData?.name}</p>
              <p className="text-xs text-muted-foreground">Redirecting to dashboard...</p>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4">
              <p className="text-red-600 font-medium">Authentication failed</p>
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button onClick={() => (window.location.href = "/login")} variant="outline">
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
