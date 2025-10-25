import Script from 'next/script'

interface JsonLdProps {
  data: Record<string, unknown>
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <Script
      id="json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// Helper function to generate activity JSON-LD
export function generateActivityJsonLd(activity: {
  title: string
  description: string
  location: string
  price: number
  images: string[]
  rating?: number
  reviewCount?: number
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: activity.title,
    description: activity.description,
    image: activity.images,
    offers: {
      '@type': 'Offer',
      price: activity.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    ...(activity.rating && activity.reviewCount && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: activity.rating,
        reviewCount: activity.reviewCount,
      },
    }),
  }
}

// Helper function to generate organization JSON-LD
export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'movinature',
    url: 'https://movinature.com',
    logo: 'https://movinature.com/logo.png',
    description: 'Outdoor activities and physical experiences for kids and families',
    sameAs: [
      'https://twitter.com/movinature',
      'https://facebook.com/movinature',
      'https://instagram.com/movinature',
    ],
  }
}
