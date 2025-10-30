"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProductGrid } from "@/components/product-grid"
import { Search } from "lucide-react"

// Import all products from different categories
import { laptops } from "@/data/products/laptops"
import { smartphones } from "@/data/products/smartphones"
import { tablets } from "@/data/products/tablets"
import { accessories } from "@/data/products/accessories"

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  // Combine all products
  const allProducts = [
    ...laptops.map((p) => ({ ...p, category: "laptops" })),
    ...smartphones.map((p) => ({ ...p, category: "smartphones" })),
    ...tablets.map((p) => ({ ...p, category: "tablets" })),
    ...accessories.map((p) => ({ ...p, category: "accessories" })),
  ]

  // Search products
  const searchResults = query
    ? allProducts.filter((product) => {
        const searchLower = query.toLowerCase()
        return (
          product.name.toLowerCase().includes(searchLower) ||
          product.brand?.toLowerCase().includes(searchLower) ||
          product.category.toLowerCase().includes(searchLower) ||
          product.badge?.toLowerCase().includes(searchLower)
        )
      })
    : []

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Page Header */}
        <div className="bg-muted/30 border-b">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-2">Search Results</h1>
            {query && <p className="text-muted-foreground text-lg">Showing results for "{query}"</p>}
          </div>
        </div>

        {/* Search Results */}
        <div className="container mx-auto px-4 py-8">
          {!query ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Search className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">No search query</h2>
              <p className="text-muted-foreground">Please enter a search term to find products</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Search className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">No results found</h2>
              <p className="text-muted-foreground">
                We couldn't find any products matching "{query}". Try different keywords.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-sm text-muted-foreground">
                  {searchResults.length} product{searchResults.length !== 1 ? "s" : ""} found
                </p>
              </div>
              <ProductGrid products={searchResults} />
            </>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResults />
    </Suspense>
  )
}
