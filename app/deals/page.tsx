"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProductGrid } from "@/components/product-grid"
import { Badge } from "@/components/ui/badge"

const dealProducts = [
  {
    id: "deal-1",
    name: 'MacBook Pro 16" M3 Max',
    price: 54999,
    originalPrice: 59999,
    image: "/macbook-pro-laptop.png",
    rating: 4.9,
    reviews: 234,
    inStock: true,
    badge: "15% OFF",
    category: "laptops",
  },
  {
    id: "deal-2",
    name: 'HP Spectre x360 14"',
    price: 35999,
    originalPrice: 38999,
    image: "/hp-spectre-laptop.png",
    rating: 4.6,
    reviews: 156,
    inStock: true,
    badge: "8% OFF",
    category: "laptops",
  },
  {
    id: "deal-3",
    name: "Samsung Galaxy Tab S9",
    price: 15499,
    originalPrice: 17999,
    image: "/samsung-galaxy-tab-tablet.jpg",
    rating: 4.7,
    reviews: 89,
    inStock: true,
    badge: "14% OFF",
    category: "tablets",
  },
  {
    id: "deal-4",
    name: "Sony WH-1000XM5",
    price: 7999,
    originalPrice: 9499,
    image: "/sony-wh-1000xm5.jpg",
    rating: 4.9,
    reviews: 342,
    inStock: true,
    badge: "16% OFF",
    category: "accessories",
  },
  {
    id: "deal-5",
    name: "Acer Swift 3 AMD Ryzen 7",
    price: 18999,
    originalPrice: 21999,
    image: "/acer-swift-laptop.jpg",
    rating: 4.4,
    reviews: 98,
    inStock: true,
    badge: "14% OFF",
    category: "laptops",
  },
  {
    id: "deal-6",
    name: "Samsung Galaxy A54",
    price: 8999,
    originalPrice: 10999,
    image: "/samsung-galaxy-a54.jpg",
    rating: 4.5,
    reviews: 178,
    inStock: true,
    badge: "18% OFF",
    category: "smartphones",
  },
  {
    id: "deal-7",
    name: "Logitech MX Master 3S",
    price: 1799,
    originalPrice: 2199,
    image: "/logitech-mx-master-3s.jpg",
    rating: 4.8,
    reviews: 456,
    inStock: true,
    badge: "18% OFF",
    category: "accessories",
  },
  {
    id: "deal-8",
    name: "Samsung T7 Portable SSD 1TB",
    price: 2299,
    originalPrice: 2799,
    image: "/samsung-t7-ssd.jpg",
    rating: 4.7,
    reviews: 289,
    inStock: true,
    badge: "18% OFF",
    category: "accessories",
  },
]

export default function DealsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-secondary/20 border-b">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <div className="max-w-3xl">
              <Badge className="mb-4 bg-destructive text-destructive-foreground">Limited Time Offers</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Special Deals</h1>
              <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
                Save big on premium tech products. These exclusive deals won't last long - grab them while you can!
              </p>
            </div>
          </div>
        </div>

        {/* Deals Grid */}
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Hot Deals</h2>
            <p className="text-muted-foreground">{dealProducts.length} amazing deals available now</p>
          </div>
          <ProductGrid products={dealProducts} />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
