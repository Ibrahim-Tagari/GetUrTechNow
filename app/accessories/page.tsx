"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProductGrid } from "@/components/product-grid"
import { ProductFilters } from "@/components/product-filters"
import { useState, useMemo, useEffect } from "react"
import type { FilterState } from "@/components/product-filters"

const defaultAccessories = [
  {
    id: "1",
    name: "AirPods Pro (2nd Gen)",
    price: 4999,
    originalPrice: 5499,
    image: "/airpods-pro-2nd-gen.jpg",
    rating: 4.9,
    reviews: 1243,
    inStock: true,
    badge: "Best Seller",
    brand: "Apple",
    processor: "H2 Chip",
  },
  {
    id: "2",
    name: "Sony WH-1000XM5 Headphones",
    price: 6999,
    image: "/sony-wh-1000xm5.jpg",
    rating: 4.8,
    reviews: 876,
    inStock: true,
    brand: "Sony",
    processor: "V1 Processor",
  },
  {
    id: "3",
    name: "Logitech MX Master 3S Mouse",
    price: 1899,
    image: "/logitech-mx-master-3s.jpg",
    rating: 4.7,
    reviews: 654,
    inStock: true,
    brand: "Logitech",
    processor: "N/A",
  },
  {
    id: "4",
    name: "Apple Magic Keyboard",
    price: 2499,
    originalPrice: 2799,
    image: "/apple-magic-keyboard.jpg",
    rating: 4.6,
    reviews: 432,
    inStock: true,
    badge: "Sale",
    brand: "Apple",
    processor: "N/A",
  },
  {
    id: "5",
    name: "Anker PowerCore 20000mAh",
    price: 899,
    image: "/anker-powercore-20000.jpg",
    rating: 4.7,
    reviews: 1567,
    inStock: true,
    badge: "Budget Pick",
    brand: "Anker",
    processor: "N/A",
  },
  {
    id: "6",
    name: "Samsung T7 Portable SSD 1TB",
    price: 2299,
    image: "/samsung-t7-ssd.jpg",
    rating: 4.8,
    reviews: 789,
    inStock: true,
    brand: "Samsung",
    processor: "N/A",
  },
  {
    id: "7",
    name: "Belkin USB-C Hub 7-in-1",
    price: 1499,
    image: "/belkin-usb-c-hub.jpg",
    rating: 4.5,
    reviews: 345,
    inStock: true,
    brand: "Belkin",
    processor: "N/A",
  },
  {
    id: "8",
    name: "Apple Pencil (2nd Gen)",
    price: 2799,
    image: "/apple-pencil-2nd-gen.jpg",
    rating: 4.9,
    reviews: 923,
    inStock: false,
    brand: "Apple",
    processor: "N/A",
  },
  {
    id: "9",
    name: "Razer DeathAdder V3 Gaming Mouse",
    price: 1299,
    originalPrice: 1499,
    image: "/razer-deathadder-v3.jpg",
    rating: 4.7,
    reviews: 567,
    inStock: true,
    badge: "Gaming",
    brand: "Razer",
    processor: "N/A",
  },
  {
    id: "10",
    name: "JBL Flip 6 Bluetooth Speaker",
    price: 2199,
    image: "/jbl-flip-6.jpg",
    rating: 4.6,
    reviews: 1098,
    inStock: true,
    brand: "JBL",
    processor: "N/A",
  },
  {
    id: "11",
    name: "Spigen Tough Armor Case",
    price: 499,
    image: "/spigen-tough-armor-case.jpg",
    rating: 4.5,
    reviews: 2341,
    inStock: true,
    brand: "Spigen",
    processor: "N/A",
  },
  {
    id: "12",
    name: "Anker 65W USB-C Charger",
    price: 799,
    image: "/anker-65w-charger.jpg",
    rating: 4.8,
    reviews: 1876,
    inStock: true,
    brand: "Anker",
    processor: "N/A",
  },
]

export default function AccessoriesPage() {
  const [accessories, setAccessories] = useState(defaultAccessories)
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 60000],
    brands: [],
    processors: [],
    inStockOnly: false,
  })

  useEffect(() => {
    const adminProducts = JSON.parse(localStorage.getItem("admin_products") || "[]")
    const accessoryProducts = adminProducts.filter((p: any) => p.category === "accessories")
    setAccessories([...defaultAccessories, ...accessoryProducts])
  }, [])

  const filteredProducts = useMemo(() => {
    return accessories.filter((product) => {
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false
      }

      if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
        return false
      }

      if (filters.processors.length > 0 && !filters.processors.includes(product.processor)) {
        return false
      }

      if (filters.inStockOnly && !product.inStock) {
        return false
      }

      return true
    })
  }, [filters, accessories])

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Page Header */}
        <div className="bg-muted/30 border-b">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-2">Accessories</h1>
            <p className="text-muted-foreground text-lg">Essential tech gear to enhance your devices</p>
          </div>
        </div>

        {/* Products Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:w-64 flex-shrink-0">
              <ProductFilters category="accessories" onFilterChange={setFilters} />
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">{filteredProducts.length} products found</p>
              </div>
              <ProductGrid products={filteredProducts} />
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
