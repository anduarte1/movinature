"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { useState, useTransition } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface ActivityFiltersProps {
  categories: { id: string; name: string; slug: string }[]
}

export function ActivityFilters({ categories }: ActivityFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState(false)

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "all",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    minAge: searchParams.get("minAge") || "",
    maxAge: searchParams.get("maxAge") || "",
    location: searchParams.get("location") || "",
  })

  const updateURL = (newFilters: typeof filters) => {
    const params = new URLSearchParams()

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== "all") {
        params.set(key, value)
      }
    })

    startTransition(() => {
      router.push(`/activities?${params.toString()}`)
    })
  }

  const handleSearchChange = (value: string) => {
    const newFilters = { ...filters, search: value }
    setFilters(newFilters)
  }

  const handleSearchSubmit = () => {
    updateURL(filters)
  }

  const handleCategoryChange = (value: string) => {
    const newFilters = { ...filters, category: value }
    setFilters(newFilters)
    updateURL(newFilters)
  }

  const handleAdvancedFilters = () => {
    updateURL(filters)
    setIsOpen(false)
  }

  const clearFilters = () => {
    const emptyFilters = {
      search: "",
      category: "all",
      minPrice: "",
      maxPrice: "",
      minAge: "",
      maxAge: "",
      location: "",
    }
    setFilters(emptyFilters)
    updateURL(emptyFilters)
  }

  const hasActiveFilters = Object.entries(filters).some(
    ([, value]) => value && value !== "all" && value !== ""
  )

  return (
    <div className="bg-white/80 backdrop-blur-sm border-2 border-green-100 rounded-2xl shadow-lg shadow-green-100/50 p-6 mb-10 hover:shadow-xl transition-shadow">
      <div className="grid md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search activities..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
            className="pl-12 h-12 border-2 border-gray-200 focus:border-green-400 rounded-xl bg-white"
          />
        </div>

        {/* Category Filter */}
        <Select value={filters.category} onValueChange={handleCategoryChange}>
          <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-green-400 rounded-xl bg-white">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="bg-white/95 backdrop-blur-lg border-green-100">
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.slug}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* More Filters Dialog */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="gap-2 h-12 border-2 border-green-200 hover:border-green-400 hover:bg-green-50 rounded-xl font-semibold text-green-700"
            >
              <SlidersHorizontal className="h-4 w-4" />
              More Filters
              {hasActiveFilters && (
                <span className="ml-1 h-2 w-2 bg-green-500 rounded-full" />
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Advanced Filters</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* Price Range */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">Price Range</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minPrice" className="text-sm text-gray-600">Min Price</Label>
                    <Input
                      id="minPrice"
                      type="number"
                      placeholder="$0"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxPrice" className="text-sm text-gray-600">Max Price</Label>
                    <Input
                      id="maxPrice"
                      type="number"
                      placeholder="Any"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Age Range */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">Age Range</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minAge" className="text-sm text-gray-600">Min Age</Label>
                    <Input
                      id="minAge"
                      type="number"
                      placeholder="0"
                      value={filters.minAge}
                      onChange={(e) => setFilters({ ...filters, minAge: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxAge" className="text-sm text-gray-600">Max Age</Label>
                    <Input
                      id="maxAge"
                      type="number"
                      placeholder="Any"
                      value={filters.maxAge}
                      onChange={(e) => setFilters({ ...filters, maxAge: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location" className="text-base font-semibold">Location</Label>
                <Input
                  id="location"
                  placeholder="City or area..."
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
                <Button
                  onClick={handleAdvancedFilters}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-green-100">
          <span className="text-sm text-gray-600 font-medium">Active filters:</span>
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                Search: {filters.search}
              </span>
            )}
            {filters.category !== "all" && filters.category && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                {categories.find(c => c.slug === filters.category)?.name}
              </span>
            )}
            {filters.location && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                Location: {filters.location}
              </span>
            )}
            {(filters.minPrice || filters.maxPrice) && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                ${filters.minPrice || "0"} - ${filters.maxPrice || "∞"}
              </span>
            )}
            {(filters.minAge || filters.maxAge) && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                Age: {filters.minAge || "0"} - {filters.maxAge || "∞"}
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-7 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
