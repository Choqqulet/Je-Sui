"use client"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Separator } from "../components/ui/separator"
import { Badge } from "../components/ui/badge"
import { Chrome, Twitter, Facebook, Github, MessageCircle, Linkedin, Apple } from "lucide-react"

// 🔗 CONNECTION POINT 1: OAuth Provider Configuration
const OAUTH_PROVIDERS = [
  {
    id: "google",
    name: "Google",
    icon: Chrome,
    color: "bg-red-500 hover:bg-red-600",
    // 🔗 Replace with your actual OAuth URLs
    authUrl: "/auth/google",
  },
  {
    id: "twitter",
    name: "Twitter",
    icon: Twitter,
    color: "bg-blue-400 hover:bg-blue-500",
    authUrl: "/auth/twitter",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: Facebook,
    color: "bg-blue-600 hover:bg-blue-700",
    authUrl: "/auth/facebook",
  },
  {
    id: "github",
    name: "GitHub",
    icon: Github,
    color: "bg-gray-800 hover:bg-gray-900",
    authUrl: "/auth/github",
  },
  {
    id: "discord",
    name: "Discord",
    icon: MessageCircle,
    color: "bg-indigo-500 hover:bg-indigo-600",
    authUrl: "/auth/discord",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: Linkedin,
    color: "bg-blue-700 hover:bg-blue-800",
    authUrl: "/auth/linkedin",
  },
  {
    id: "apple",
    name: "Apple",
    icon: Apple,
    color: "bg-black hover:bg-gray-800",
    authUrl: "/auth/apple",
  },
]

interface ZKLoginProps {
  // 🔗 CONNECTION POINT 2: Callback Props
  onAuthSuccess?: (provider: string, userData: any) => void
  onAuthError?: (error: string) => void
  redirectUrl?: string
  // 🔗 CONNECTION POINT 3: Customization Props
  title?: string
  description?: string
  showZKBadge?: boolean
}

export default function ZKLogin({
  onAuthSuccess,
  onAuthError,
  redirectUrl = "/dashboard",
  title = "Welcome Back",
  description = "Sign in to your account using Zero Knowledge authentication",
  showZKBadge = true,
}: ZKLoginProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)

  // 🔗 CONNECTION POINT 4: Authentication Handler
  const handleOAuthLogin = async (provider: (typeof OAUTH_PROVIDERS)[0]) => {
    setIsLoading(provider.id)

    try {
      // 🔗 REPLACE THIS SECTION WITH YOUR ZK AUTH LOGIC
      console.log(`Initiating ${provider.name} OAuth...`)

      // Example: Redirect to OAuth provider
      if (typeof window !== "undefined") {
        // Option 1: Direct redirect (simple approach)
        window.location.href = `${provider.authUrl}?redirect=${encodeURIComponent(redirectUrl)}`

        // Option 2: Use your existing auth service
        // const result = await yourAuthService.authenticate(provider.id)
        // if (result.success) {
        //   onAuthSuccess?.(provider.id, result.user)
        //   window.location.href = redirectUrl
        // }
      }
    } catch (error) {
      console.error(`${provider.name} authentication failed:`, error)
      onAuthError?.(`Failed to authenticate with ${provider.name}`)
      setIsLoading(null)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            {showZKBadge && (
              <Badge variant="secondary" className="mb-2">
                🔐 Zero Knowledge Auth
              </Badge>
            )}
          </div>
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <CardDescription className="text-base">{description}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* OAuth Providers Grid */}
          <div className="grid grid-cols-2 gap-3">
            {OAUTH_PROVIDERS.map((provider) => {
              const Icon = provider.icon
              const isCurrentlyLoading = isLoading === provider.id

              return (
                <Button
                  key={provider.id}
                  variant="outline"
                  className={`h-12 transition-all duration-200 ${
                    isCurrentlyLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => handleOAuthLogin(provider)}
                  disabled={isLoading !== null}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{provider.name}</span>
                  </div>
                  {isCurrentlyLoading && (
                    <div className="ml-2 w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  )}
                </Button>
              )
            })}
          </div>

          <Separator className="my-6" />

          {/* Security Notice */}
          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              🛡️ Your privacy is protected with Zero Knowledge authentication
            </p>
            <p className="text-xs text-muted-foreground">We never store your passwords or personal data</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
