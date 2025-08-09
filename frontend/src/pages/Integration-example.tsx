"use client"

import ZKLogin from "./Zk-login-panel"
import { AuthCallback } from "./Authentication-callback"

// 🔗 CONNECTION POINT 6: Integration Example
export function LoginIntegrationExample() {
  // Example of how to integrate with your existing dashboard
  const handleAuthSuccess = (provider: string, userData: any) => {
    console.log("Auth successful:", { provider, userData })

    // 🔗 CONNECT TO YOUR DASHBOARD HERE
    // Example: Store user data in your state management
    // dispatch(setUser(userData))
    // localStorage.setItem('user', JSON.stringify(userData))
    // redirect to your dashboard
  }

  const handleAuthError = (error: string) => {
    console.error("Auth error:", error)
    // Handle error (show toast, etc.)
  }

  return (
    <ZKLogin
      onAuthSuccess={handleAuthSuccess}
      onAuthError={handleAuthError}
      redirectUrl="/your-dashboard"
      title="Your App Name"
      description="Sign in securely with Zero Knowledge authentication"
    />
  )
}

// 🔗 For your auth callback page (e.g., /auth/callback)
export function CallbackPage() {
  return (
    <AuthCallback
      onSuccess={(userData) => {
        // Store user session
        // Redirect to dashboard
      }}
      onError={(error) => {
        // Handle error
      }}
      dashboardUrl="/your-dashboard"
    />
  )
}
