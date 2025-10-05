"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CreateActivityFormProps {
  categories: Array<{
    id: string
    name: string
    slug: string
  }>
  userId: string
}

export function CreateActivityForm({ categories, userId }: CreateActivityFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      location: formData.get("location"),
      address: formData.get("address"),
      price: parseFloat(formData.get("price") as string),
      duration: parseInt(formData.get("duration") as string),
      minAge: parseInt(formData.get("minAge") as string),
      maxAge: parseInt(formData.get("maxAge") as string),
      capacity: parseInt(formData.get("capacity") as string),
      categoryId: formData.get("categoryId"),
      images: ["/placeholder.jpg"], // Default placeholder - implement image upload later
      hostId: userId,
    }

    try {
      const response = await fetch("/api/activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const activity = await response.json()
        router.push(`/host`)
      } else {
        const error = await response.json()
        alert(error.message || "Failed to create activity")
      }
    } catch (error) {
      console.error("Error creating activity:", error)
      alert("An error occurred while creating the activity")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Activity Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title */}
          <div>
            <Label htmlFor="title">Activity Title *</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g., Family Nature Hike Adventure"
              required
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe your activity in detail..."
              rows={5}
              required
            />
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="categoryId">Category *</Label>
            <Select name="categoryId" required>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Location (City) *</Label>
              <Input
                id="location"
                name="location"
                placeholder="e.g., Portland, OR"
                required
              />
            </div>
            <div>
              <Label htmlFor="address">Full Address</Label>
              <Input
                id="address"
                name="address"
                placeholder="123 Nature Trail Rd"
              />
            </div>
          </div>

          {/* Price and Duration */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price per Person ($) *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="50.00"
                required
              />
            </div>
            <div>
              <Label htmlFor="duration">Duration (minutes) *</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                min="1"
                placeholder="120"
                required
              />
            </div>
          </div>

          {/* Age Range */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minAge">Minimum Age *</Label>
              <Input
                id="minAge"
                name="minAge"
                type="number"
                min="0"
                placeholder="5"
                required
              />
            </div>
            <div>
              <Label htmlFor="maxAge">Maximum Age *</Label>
              <Input
                id="maxAge"
                name="maxAge"
                type="number"
                min="0"
                placeholder="12"
                required
              />
            </div>
          </div>

          {/* Capacity */}
          <div>
            <Label htmlFor="capacity">Maximum Participants *</Label>
            <Input
              id="capacity"
              name="capacity"
              type="number"
              min="1"
              placeholder="10"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Creating..." : "Create Activity"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
