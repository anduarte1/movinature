"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, TreePine } from "lucide-react"
import { FadeIn } from "@/components/animations/fade-in"

export function HeroSection() {
  const [searchFocused, setSearchFocused] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/activities?search=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      router.push('/activities')
    }
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-24 md:py-32">
      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,transparent,black)] opacity-30"></div>

      {/* Animated gradient blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <FadeIn delay={100}>
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-green-100 mb-6 hover:shadow-md transition-shadow">
              <TreePine className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">Trusted by 10,000+ families</span>
            </div>
          </FadeIn>

          {/* Main Heading */}
          <FadeIn delay={200}>
            <h1 className="text-6xl md:text-7xl font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent animate-gradient">
                Discover Nature&apos;s
              </span>
              <br />
              <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent animate-gradient" style={{ animationDelay: "0.5s" }}>
                Playground
              </span>
            </h1>
          </FadeIn>

          {/* Description */}
          <FadeIn delay={300}>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Book amazing outdoor activities and physical experiences for kids and families
            </p>
          </FadeIn>

          {/* Search Bar */}
          <FadeIn delay={400}>
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-8">
              <div className={`relative flex-1 transition-all duration-300 ${searchFocused ? 'scale-105' : ''}`}>
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search activities, locations..."
                  className="pl-12 h-14 text-lg border-2 border-green-100 focus:border-green-400 focus:ring-2 focus:ring-green-200 rounded-xl shadow-sm bg-white/80 backdrop-blur-sm hover:bg-white transition-all"
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="h-14 px-8 text-lg rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-200 hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Search
              </Button>
            </form>
          </FadeIn>

          {/* Stats */}
          <FadeIn delay={500}>
            <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2 hover:scale-110 transition-transform cursor-default">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>50+ Activities</span>
              </div>
              <div className="flex items-center gap-2 hover:scale-110 transition-transform cursor-default">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                <span>Verified Hosts</span>
              </div>
              <div className="flex items-center gap-2 hover:scale-110 transition-transform cursor-default">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                <span>Instant Booking</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
