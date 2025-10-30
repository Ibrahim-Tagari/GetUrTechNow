
export type Product = {
  id: string
  name: string
  price: number
  originalPrice?: number
  image?: string
  image_url?: string
  rating?: number
  reviews?: number
  inStock?: boolean
  badge?: string
  category?: string
  description?: string;
  upgrades?: {
    ram?: { options: string[]; prices: number[] }
    ssd?: { options: string[]; prices: number[] }
  }
  [key: string]: any
}
