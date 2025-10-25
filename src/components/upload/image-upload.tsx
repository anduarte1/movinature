"use client"

import { useState } from "react"
import { useUploadThing } from "@/lib/uploadthing"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Upload, Image as ImageIcon, Loader2 } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  value: string[]
  onChange: (urls: string[]) => void
  maxFiles?: number
  disabled?: boolean
}

export function ImageUpload({ value = [], onChange, maxFiles = 10, disabled }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)

  const { startUpload, isUploading: uploadthingIsUploading } = useUploadThing("activityImages", {
    onClientUploadComplete: (res) => {
      const urls = res.map((file) => file.url)
      onChange([...value, ...urls])
      setIsUploading(false)
    },
    onUploadError: (error: Error) => {
      console.error("Upload error:", error)
      alert(`Upload failed: ${error.message}`)
      setIsUploading(false)
    },
  })

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    if (value.length + files.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} images`)
      return
    }

    setIsUploading(true)
    await startUpload(files)
  }

  const removeImage = (url: string) => {
    onChange(value.filter((v) => v !== url))
  }

  const canUploadMore = value.length < maxFiles

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {canUploadMore && !disabled && (
        <label
          className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
            isUploading || uploadthingIsUploading
              ? "border-gray-300 bg-gray-50 cursor-not-allowed"
              : "border-gray-300 hover:border-green-500 hover:bg-green-50/50"
          }`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {isUploading || uploadthingIsUploading ? (
              <>
                <Loader2 className="h-12 w-12 text-green-600 animate-spin mb-4" />
                <p className="text-sm text-gray-600">Uploading...</p>
              </>
            ) : (
              <>
                <Upload className="h-12 w-12 text-gray-400 mb-4" />
                <p className="mb-2 text-sm text-gray-600">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 4MB</p>
                <p className="text-xs text-gray-500 mt-1">
                  {value.length} / {maxFiles} images uploaded
                </p>
              </>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleUpload}
            disabled={isUploading || uploadthingIsUploading || disabled}
          />
        </label>
      )}

      {/* Image Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {value.map((url, index) => (
            <Card key={url} className="relative group overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={url}
                  alt={`Uploaded image ${index + 1}`}
                  fill
                  className="object-cover"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeImage(url)}
                    disabled={disabled}
                    className="rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {/* Index badge */}
                <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                  #{index + 1}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty state */}
      {value.length === 0 && !canUploadMore && (
        <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-xl">
          <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">No images uploaded yet</p>
        </div>
      )}
    </div>
  )
}
