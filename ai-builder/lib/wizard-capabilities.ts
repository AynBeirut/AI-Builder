export type WizardCapability = {
  id: string
  label: string
  backend: string
  activation: string
  hostingNotes: string
}

export const WIZARD_CAPABILITIES: WizardCapability[] = [
  {
    id: 'contact-form',
    label: 'Contact / Submit Form',
    backend: 'POST /api/contact with validation + rate limiting + spam protection',
    activation: 'Create API route, connect form action, show success/error states, persist or forward payload',
    hostingNotes: 'Set mail/webhook env vars and verify domain sender policy before production deploy',
  },
  {
    id: 'newsletter',
    label: 'Newsletter',
    backend: 'POST /api/newsletter + subscriber storage/list provider sync',
    activation: 'Enable subscribe endpoint, deduplicate emails, add double opt-in flow if required',
    hostingNotes: 'Configure provider keys and webhook callbacks for confirmation/unsubscribe',
  },
  {
    id: 'blog',
    label: 'Blog / Articles',
    backend: 'Content source (CMS/DB/files) + list/detail API',
    activation: 'Define post schema, slug routing, list page, detail page, SEO metadata',
    hostingNotes: 'Set content source credentials and cache strategy for production',
  },
  {
    id: 'questionnaire',
    label: 'Quiz / Questionnaire',
    backend: 'Question set API + result calculation endpoint + optional submission storage',
    activation: 'Wire step flow, answer validation, scoring logic, result state and persistence',
    hostingNotes: 'Enable DB/storage and analytics events to track completion',
  },
  {
    id: 'booking',
    label: 'Booking / Appointments',
    backend: 'Availability API + booking create/cancel endpoints + notifications',
    activation: 'Connect slot picker to backend, lock slots, send confirmation notifications',
    hostingNotes: 'Configure timezone handling, SMTP/SMS provider, and background jobs if needed',
  },
  {
    id: 'ecommerce',
    label: 'Shop / Payments',
    backend: 'Catalog/cart/order APIs + payment provider integration',
    activation: 'Wire add-to-cart, checkout, payment callback, and order confirmation flow',
    hostingNotes: 'Set payment keys/webhooks and secure server-side order verification',
  },
]

export function getCapabilityPromptBlock(): string {
  const lines = WIZARD_CAPABILITIES.map((cap) =>
    `- ${cap.label}: backend=${cap.backend}; activation=${cap.activation}; hosting/cloud=${cap.hostingNotes}`
  )
  return `WIZARD BACKEND LIBRARY (available capabilities):\n${lines.join('\n')}`
}
