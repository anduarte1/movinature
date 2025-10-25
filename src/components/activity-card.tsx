"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Users, Clock, Star, Heart, Sparkles } from "lucide-react"

interface ActivityCardProps {
  id: string
  title: string
  location: string
  price: number
  duration: number
  capacity: number
  images: string[]
  category: {
    name: string
  }
  rating?: number
  reviewCount?: number
  featured?: boolean
  isNew?: boolean
}

export function ActivityCard({
  id,
  title,
  location,
  price,
  duration,
  capacity,
  images,
  category,
  rating = 0,
  reviewCount = 0,
  featured = false,
  isNew = false,
}: ActivityCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFavorited(!isFavorited)
  }

  return (
    <Link href={`/activities/${id}`} className="group block">
      <Card className="overflow-hidden border-2 border-gray-100 hover:border-green-300 hover:shadow-2xl hover:shadow-green-100/50 transition-all duration-300 cursor-pointer group-hover:-translate-y-2 h-full">
        <div className="relative h-56 w-full overflow-hidden bg-gray-100">
          {/* Image skeleton loader */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
          )}

          <Image
            src={images[0] || "/placeholder.jpg"}
            alt={title}
            fill
            className={`object-cover group-hover:scale-110 transition-all duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Favorite button */}
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-3 left-3 h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg transition-all ${isFavorited ? 'scale-110' : ''}`}
            onClick={handleFavoriteClick}
          >
            <Heart className={`h-5 w-5 transition-all ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
          </Button>

          {/* Category badge */}
          <Badge className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-900 border-0 shadow-lg hover:bg-white transition-all font-semibold px-3 py-1">
            {category.name}
          </Badge>

          {/* NEW or POPULAR badge */}
          {(isNew || featured) && (
            <Badge className="absolute top-12 right-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 shadow-lg font-semibold px-3 py-1 flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              {isNew ? 'NEW' : 'POPULAR'}
            </Badge>
          )}

          {/* Rating badge on image */}
          {rating > 0 && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg group-hover:scale-105 transition-transform">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-sm text-gray-900">{rating.toFixed(1)}</span>
              <span className="text-xs text-gray-600">({reviewCount})</span>
            </div>
          )}
        </div>

        <CardContent className="p-5">
          <h3 className="font-bold text-xl mb-3 line-clamp-1 text-gray-900 group-hover:text-green-600 transition-colors">
            {title}
          </h3>

          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <MapPin className="h-4 w-4 text-green-600 flex-shrink-0" />
            <span className="line-clamp-1">{location}</span>
          </div>

          <div className="flex items-center gap-5 text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-green-600" />
              <span className="font-medium">{duration} min</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-green-600" />
              <span className="font-medium">Max {capacity}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-gray-100 group-hover:border-green-200 transition-colors">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 font-medium">From</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent group-hover:from-green-700 group-hover:to-emerald-700">
                ${price}
              </span>
              <span className="text-xs text-gray-500">/ person</span>
            </div>
          </div>

          <div className="px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg group-hover:from-green-600 group-hover:to-emerald-600 group-hover:shadow-md transition-all">
            <span className="text-sm font-semibold text-green-700 group-hover:text-white transition-colors">View Details</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
