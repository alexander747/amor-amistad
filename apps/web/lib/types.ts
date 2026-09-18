export type CoupleNames = {
  a?: string
  b?: string
}

export type PageRecord = {
  id: string
  order_id: string
  slug: string
  template_slug: string
  couple_names: CoupleNames
  anniversary_date: string | null
  youtube_url: string | null
  theme: Record<string, unknown>
  published_at: string | null
  expires_at: string | null
  created_at: string
}

export type PageMessage = {
  id: string
  body: string
  position: number
  origin: 'client' | 'ai'
}

export type PagePhoto = {
  id: string
  url: string
  r2_key: string
  position: number
  alt: string | null
}

export type PageData = {
  page: PageRecord
  messages: PageMessage[]
  photos: PagePhoto[]
}

export type EventType = 'view' | 'reveal' | 'share' | 'cta_click'

export type IntakePhotoInput = {
  url: string
  r2_key?: string
  alt?: string
  position?: number
}

export type IntakeMessageInput = {
  body: string
  origin?: 'client' | 'ai'
  position?: number
}

export type IntakePayload = {
  code: string
  template_slug?: string
  couple_names?: CoupleNames
  anniversary_date?: string | null
  youtube_url?: string | null
  theme?: Record<string, unknown>
  messages?: IntakeMessageInput[]
  photos?: IntakePhotoInput[]
}
