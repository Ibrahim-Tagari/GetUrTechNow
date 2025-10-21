"use client"

import { useState, useEffect, useMemo } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProductGrid } from "@/components/product-grid"
import { ProductFilters } from "@/components/product-filters"
import type { FilterState } from "@/components/product-filters"

const defaultDesktops = [
  {
    id: "desktop-1",
    name: "iMac 27-inch M3 Max",
    price: 89999,
    category: "desktops",
    brand: "Apple",
    image: "/imac-desktop-computer.jpg",
    rating: 4.8,
    reviews: 156,
    inStock: true,
    description: "Stunning 27-inch Retina display with M3 Max chip",
    tags: ["premium", "best seller"],
  },
  {
    id: "desktop-2",
    name: "Dell XPS Desktop 8960",
    price: 54999,
    category: "desktops",
    brand: "Dell",
    image: "/dell-xps-desktop.jpg",
    rating: 4.6,
    reviews: 98,
    inStock: true,
    description: "High-performance desktop with Intel Core i9",
    tags: ["gaming", "workstation"],
  },
  {
    id: "desktop-3",
    name: "HP Pavilion Gaming Desktop",
    price: 34999,
    category: "desktops",
    brand: "HP",
    image: "/hp-gaming-desktop.jpg",
    rating: 4.5,
    reviews: 87,
    inStock: true,
    description: "Powerful gaming desktop with RTX 4070",
    tags: ["gaming", "budget pick"],
  },
  {
    id: "desktop-4",
    name: "Lenovo ThinkCentre M90",
    price: 28999,
    category: "desktops",
    brand: "Lenovo",
    image: "/lenovo-thinkcentre-desktop.jpg",
    rating: 4.4,
    reviews: 72,
    inStock: true,
    description: "Professional workstation for business",
    tags: ["workstation"],
  },
  {
    id: "desktop-5",
    name: "ASUS ROG Strix G10DK",
    price: 64999,
    category: "desktops",
    brand: "ASUS",
    image: "/asus-rog-gaming-desktop.jpg",
    rating: 4.7,
    reviews: 124,
    inStock: true,
    description: "Ultimate gaming desktop with RTX 4090",
    tags: ["gaming", "premium"],
  },
  {
    id: "desktop-6",
    name: "Corsair One i500",
    price: 79999,
    category: "desktops",
    brand: "Corsair",
    image: "/corsair-gaming-desktop.jpg",
    rating: 4.6,
    reviews: 91,
    inStock: true,
    description: "Compact high-performance gaming desktop",
    tags: ["gaming", "premium"],
  },
  {
    id: "desktop-7",
    name: "MSI Trident X Plus",
    price: 44999,
    category: "desktops",
    brand: "MSI",
    image: "/msi-trident-gaming-desktop.jpg",
    rating: 4.5,
    reviews: 78,
    inStock: true,
    description: "Compact gaming desktop with powerful specs",
    tags: ["gaming"],
  },
  {
    id: "desktop-8",
    name: "Razer Tomahawk",
    price: 69999,
    category: "desktops",
    brand: "Razer",
    image: "/razer-tomahawk-gaming-desktop.jpg",
    rating: 4.7,
    reviews: 103,
    inStock: true,
    description: "Premium gaming desktop with custom cooling",
    tags: ["gaming", "premium"],
  },
]

export default function DesktopsPage() {
  const [desktops, setDesktops] = useState(defaultDesktops)
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 100000],
    brands: [],
    processors: [],
    inStockOnly: false,
  })

  useEffect(() => {
    const adminProducts = JSON.parse(localStorage.getItem("admin_products") || "[]")
    const desktopProducts = adminProducts.filter((p: any) => p.category === "desktops")
    setDesktops([...defaultDesktops, ...desktopProducts])
  }, [])

  const filteredProducts = useMemo(() => {
    return desktops.filter((product) => {
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false
      }

      if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
        return false
      }

      if (filters.inStockOnly && !product.inStock) {
        return false
      }

      return true
    })
  }, [filters, desktops])

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Page Header */}
        <div className="bg-muted/30 border-b">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-2">Desktop Computers</h1>
            <p className="text-muted-foreground text-lg">High-performance desktop computers for work and gaming</p>
          </div>
        </div>

        {/* Products Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:w-64 flex-shrink-0">
              <ProductFilters category="desktops" onFilterChange={setFilters} />
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
