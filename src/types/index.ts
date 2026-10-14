// ── Greeting Card types ────────────────────────────────────
export interface GreetingCard {
  id: string
  title: string
  occasion: string
  description: string
  previewUrl: string
  liveUrl?: string
  tags: string[]
  year: number
}
