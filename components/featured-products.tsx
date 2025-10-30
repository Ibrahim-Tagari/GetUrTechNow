// components/featured-products.tsx
"use client"

import React from "react"
import { createClient } from "@/lib/supabase/client"
import ProductGrid from "@/components/product-grid"

export default function FeaturedProducts() {
  const [products, setProducts] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      try {
        // Use anon client to fetch latest 6
        const supabase = createClient()
        const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false }).limit(6)

        if (error) {
          console.error("Featured: supabase error", error)
          setProducts([])
        } else {
          const mapped = (data || []).map((p: any) => ({
            ...p,
            image: p.image_url ?? "",
            price: Number(p.price ?? 0),
          }))
          if (mounted) setProducts(mapped)
        }
      } catch (err) {
        console.error("Featured fetch error", err)
        if (mounted) setProducts([])
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  if (loading) return <div className="p-6">Loading featured products…</div>

  return (
    <section className="container mx-auto py-12">
      <h2 className="text-2xl font-bold mb-6">Featured products</h2>
      <ProductGrid products={products} />
    </section>
  )
}
