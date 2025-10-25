"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X, Grid3x3 } from "lucide-react"

interface ImageGalleryProps {
  images: string[]
  title: string
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [isGridView, setIsGridView] = useState(false)

  const handlePrevious = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1)
    }
  }

  const handleNext = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === images.length - 1 ? 0 : selectedImage + 1)
    }
  }

  const visibleImages = images.slice(0, 5)
  const remainingCount = images.length - 5

  return (
    <>
      <div className="grid md:grid-cols-2 gap-2 mb-8 rounded-2xl overflow-hidden">
        {visibleImages.length > 0 ? (
          <>
            {/* Main large image */}
            <div
              className="relative h-96 md:row-span-2 cursor-pointer group overflow-hidden"
              onClick={() => setSelectedImage(0)}
            >
              <Image
                src={visibleImages[0]}
                alt={title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                priority
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
            </div>

            {/* Smaller images */}
            {visibleImages.slice(1, 5).map((image, idx) => (
              <div
                key={idx}
                className="relative h-48 cursor-pointer group overflow-hidden"
                onClick={() => setSelectedImage(idx + 1)}
              >
                <Image
                  src={image}
                  alt={`${title} ${idx + 2}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />

                {/* Show remaining count on last image */}
                {idx === 3 && remainingCount > 0 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Grid3x3 className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-xl font-bold">+{remainingCount} more</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </>
        ) : (
          <div className="relative h-96 md:col-span-2 bg-muted flex items-center justify-center rounded-2xl">
            <p className="text-muted-foreground">No images available</p>
          </div>
        )}
      </div>

      {/* View All Photos Button */}
      {images.length > 1 && (
        <Button
          variant="outline"
          size="sm"
          className="mb-8 border-2"
          onClick={() => setIsGridView(true)}
        >
          <Grid3x3 className="h-4 w-4 mr-2" />
          View all {images.length} photos
        </Button>
      )}

      {/* Image Modal - Single View */}
      <Dialog open={selectedImage !== null && !isGridView} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-5xl p-0 bg-black/95 border-0">
          {selectedImage !== null && (
            <div className="relative">
              {/* Close button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-50 bg-white/10 hover:bg-white/20 text-white rounded-full"
                onClick={() => setSelectedImage(null)}
              >
                <X className="h-6 w-6" />
              </Button>

              {/* Previous button */}
              {images.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-white/10 hover:bg-white/20 text-white rounded-full h-12 w-12"
                  onClick={handlePrevious}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
              )}

              {/* Next button */}
              {images.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-white/10 hover:bg-white/20 text-white rounded-full h-12 w-12"
                  onClick={handleNext}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              )}

              {/* Image */}
              <div className="relative h-[600px] w-full">
                <Image
                  src={images[selectedImage]}
                  alt={`${title} ${selectedImage + 1}`}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Image counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm">
                {selectedImage + 1} / {images.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Grid View Modal */}
      <Dialog open={isGridView} onOpenChange={setIsGridView}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold">All Photos</h3>
            <Button variant="ghost" size="icon" onClick={() => setIsGridView(false)}>
              <X className="h-6 w-6" />
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image, idx) => (
              <div
                key={idx}
                className="relative h-48 cursor-pointer group overflow-hidden rounded-lg"
                onClick={() => {
                  setSelectedImage(idx)
                  setIsGridView(false)
                }}
              >
                <Image
                  src={image}
                  alt={`${title} ${idx + 1}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
