"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProductGrid } from "@/components/product-grid"
import { ProductFilters } from "@/components/product-filters"
import { useState, useMemo, useEffect } from "react"
import type { FilterState } from "@/components/product-filters"

const defaultTablets = [
  {
    id: "1",
    name: 'iPad Pro 12.9" M2 256GB',
    price: 19999,
    originalPrice: 21999,
    image: "/ipad-pro-12-9.jpg",
    rating: 4.9,
    reviews: 387,
    inStock: true,
    badge: "Best Seller",
    brand: "Apple",
    processor: "Apple M2",
  },
  {
    id: "2",
    name: "Samsung Galaxy Tab S9 Ultra",
    price: 17999,
    image: "/samsung-galaxy-tab-s9-ultra.jpg",
    rating: 4.8,
    reviews: 264,
    inStock: true,
    brand: "Samsung",
    processor: "Snapdragon 8 Gen 2",
  },
  {
    id: "3",
    name: 'iPad Air 11" M2 128GB',
    price: 12999,
    image: "/ipad-air-11.jpg",
    rating: 4.7,
    reviews: 512,
    inStock: true,
    brand: "Apple",
    processor: "Apple M2",
  },
  {
    id: "4",
    name: "Microsoft Surface Pro 9",
    price: 16999,
    originalPrice: 18999,
    image: "/microsoft-surface-pro-9.jpg",
    rating: 4.6,
    reviews: 198,
    inStock: true,
    badge: "Sale",
    brand: "Microsoft",
    processor: "Intel Core i7",
  },
  {
    id: "5",
    name: "Samsung Galaxy Tab S9 FE",
    price: 8999,
    image: "/samsung-galaxy-tab-s9-fe.jpg",
    rating: 4.5,
    reviews: 342,
    inStock: true,
    badge: "Budget Pick",
    brand: "Samsung",
    processor: "Exynos 1380",
  },
  {
    id: "6",
    name: 'iPad 10.9" 64GB',
    price: 7999,
    image: "/ipad-10-9.jpg",
    rating: 4.6,
    reviews: 687,
    inStock: true,
    brand: "Apple",
    processor: "Apple A14",
  },
  {
    id: "7",
    name: "Lenovo Tab P12 Pro",
    price: 13999,
    image: "/lenovo-tab-p12-pro.jpg",
    rating: 4.4,
    reviews: 156,
    inStock: false,
    brand: "Lenovo",
    processor: "Snapdragon 870",
  },
]

export default function TabletsPage() {
  const [tablets, setTablets] = useState(defaultTablets)
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 60000],
    brands: [],
    processors: [],
    inStockOnly: false,
  })

  useEffect(() => {
    const adminProducts = JSON.parse(localStorage.getItem("admin_products") || "[]")
    const tabletProducts = adminProducts.filter((p: any) => p.category === "tablets")
    setTablets([...defaultTablets, ...tabletProducts])
  }, [])

  const filteredProducts = useMemo(() => {
    return tablets.filter((product) => {
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
  }, [filters, tablets])

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Page Header */}
        <div className="bg-muted/30 border-b">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-2">Tablets</h1>
            <p className="text-muted-foreground text-lg">Portable computing for work, creativity, and entertainment</p>
          </div>
        </div>

        {/* Products Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:w-64 flex-shrink-0">
              <ProductFilters category="tablets" onFilterChange={setFilters} />
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
