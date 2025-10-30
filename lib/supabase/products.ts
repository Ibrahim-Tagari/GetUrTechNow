import { createClient } from "./client"

export async function getProductsByCategory(category: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", category)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching products:", error)
    return []
  }

  return data || []
}

export async function getAllProducts() {
  const supabase = createClient()

  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching products:", error)
    return []
  }

  return data || []
}

export async function searchProducts(query: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .or(`name.ilike.%${query}%,brand.ilike.%${query}%,description.ilike.%${query}%`)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error searching products:", error)
    return []
  }

  return data || []
}

export async function addProduct(product: any) {
  const supabase = createClient()

  const { data, error } = await supabase.from("products").insert([product]).select()

  if (error) {
    console.error("Error adding product:", error)
    return null
  }

  return data?.[0] || null
}

export async function updateProduct(id: string, updates: any) {
  const supabase = createClient()

  const { data, error } = await supabase.from("products").update(updates).eq("id", id).select()

  if (error) {
    console.error("Error updating product:", error)
    return null
  }

  return data?.[0] || null
}

export async function deleteProduct(id: string) {
  const supabase = createClient()

  const { error } = await supabase.from("products").delete().eq("id", id)

  if (error) {
    console.error("Error deleting product:", error)
    return false
  }

  return true
}
