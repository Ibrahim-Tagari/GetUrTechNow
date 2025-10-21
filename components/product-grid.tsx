import { ProductCard } from "@/components/product-card"

type Product = {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviews: number
  inStock: boolean
  badge?: string
}

type ProductGridProps = {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
