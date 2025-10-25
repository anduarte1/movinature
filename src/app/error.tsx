"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 to-white px-4">
      <div className="max-w-md w-full text-center">
        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="h-12 w-12 text-red-600" />
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Something went wrong!
        </h1>

        <p className="text-gray-600 mb-8">
          We encountered an error while loading this page. Please try again.
        </p>

        <div className="flex gap-4 justify-center">
          <Button
            onClick={reset}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            Try Again
          </Button>

          <Button
            variant="outline"
            onClick={() => window.location.href = "/"}
          >
            Go Home
          </Button>
        </div>

        {process.env.NODE_ENV === "development" && error.message && (
          <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
            <p className="text-sm font-mono text-red-800">{error.message}</p>
          </div>
        )}
      </div>
    </div>
  )
}
