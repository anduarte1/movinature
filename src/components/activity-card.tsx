import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Clock, Star } from "lucide-react"

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
}: ActivityCardProps) {
  return (
    <Link href={`/activities/${id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        <div className="relative h-48 w-full">
          <Image
            src={images[0] || "/placeholder.jpg"}
            alt={title}
            fill
            className="object-cover"
          />
          <Badge className="absolute top-2 right-2">{category.name}</Badge>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-1">{title}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{location}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{duration} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>Max {capacity}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <div>
            {rating > 0 && (
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{rating.toFixed(1)}</span>
                <span className="text-muted-foreground">({reviewCount})</span>
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="font-bold text-lg">${price}</div>
            <div className="text-xs text-muted-foreground">per person</div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
