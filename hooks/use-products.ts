"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export function useProducts(category?: string) {
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        let query = supabase.from("products").select("*")

        if (category) {
          query = query.eq("category", category)
        }

        const { data, error } = await query.order("created_at", { ascending: false })

        if (error) throw error
        setProducts(data || [])
      } catch (error) {
        console.error("Error fetching products:", error)
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()

    // Subscribe to real-time updates
    const subscription = supabase
      .channel(`products${category ? `-${category}` : ""}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "products",
          ...(category && { filter: `category=eq.${category}` }),
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setProducts((prev) => [payload.new, ...prev])
          } else if (payload.eventType === "UPDATE") {
            setProducts((prev) => prev.map((p) => (p.id === payload.new.id ? payload.new : p)))
          } else if (payload.eventType === "DELETE") {
            setProducts((prev) => prev.filter((p) => p.id !== payload.old.id))
          }
        },
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [category, supabase])

  return { products, isLoading }
}
