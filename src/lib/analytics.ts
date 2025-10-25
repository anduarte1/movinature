// Google Analytics event tracking utilities

declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'config' | 'js',
      targetId: string,
      config?: Record<string, unknown>
    ) => void
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

// Track page views
export const pageview = (url: string) => {
  if (!GA_MEASUREMENT_ID || !window.gtag) return

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  })
}

// Track custom events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (!window.gtag) return

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}

// Predefined event tracking functions
export const trackActivityView = (activityId: string, activityTitle: string) => {
  event({
    action: 'view_activity',
    category: 'engagement',
    label: activityTitle,
  })
}

export const trackBookingStart = (activityId: string, activityTitle: string) => {
  event({
    action: 'begin_checkout',
    category: 'ecommerce',
    label: activityTitle,
  })
}

export const trackBookingComplete = (
  activityId: string,
  activityTitle: string,
  amount: number
) => {
  event({
    action: 'purchase',
    category: 'ecommerce',
    label: activityTitle,
    value: amount,
  })
}

export const trackSearch = (searchQuery: string) => {
  event({
    action: 'search',
    category: 'engagement',
    label: searchQuery,
  })
}

export const trackSignUp = (method: string) => {
  event({
    action: 'sign_up',
    category: 'engagement',
    label: method,
  })
}

export const trackSignIn = (method: string) => {
  event({
    action: 'login',
    category: 'engagement',
    label: method,
  })
}

export const trackShare = (contentType: string, contentId: string) => {
  event({
    action: 'share',
    category: 'engagement',
    label: `${contentType}:${contentId}`,
  })
}

export const trackFilterUsage = (filterType: string, filterValue: string) => {
  event({
    action: 'filter',
    category: 'engagement',
    label: `${filterType}:${filterValue}`,
  })
}
