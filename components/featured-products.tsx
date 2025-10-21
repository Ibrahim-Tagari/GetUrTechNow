import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart } from "lucide-react"

const products = [
  {
    id: 1,
    name: 'MacBook Pro 16"',
    price: "R 45,999",
    originalPrice: "R 52,999",
    rating: 4.8,
    reviews: 124,
    image: "/macbook-pro-laptop.png",
    badge: "Best Seller",
    inStock: true,
  },
  {
    id: 2,
    name: "iPhone 15 Pro Max",
    price: "R 28,999",
    rating: 4.9,
    reviews: 256,
    image: "/iphone-15-pro-smartphone.jpg",
    badge: "New Arrival",
    inStock: true,
  },
  {
    id: 3,
    name: "Samsung Galaxy Tab S9",
    price: "R 15,499",
    originalPrice: "R 17,999",
    rating: 4.7,
    reviews: 89,
    image: "/samsung-galaxy-tab-tablet.jpg",
    badge: "Sale",
    inStock: true,
  },
  {
    id: 4,
    name: "Dell XPS 15",
    price: "R 38,999",
    rating: 4.6,
    reviews: 167,
    image: "/dell-xps-laptop.png",
    inStock: true,
  },
  {
    id: 5,
    name: "Sony WH-1000XM5",
    price: "R 7,999",
    originalPrice: "R 9,499",
    rating: 4.9,
    reviews: 342,
    image: "/wireless-headphones.png",
    badge: "Hot Deal",
    inStock: true,
  },
  {
    id: 6,
    name: 'iPad Pro 12.9"',
    price: "R 24,999",
    rating: 4.8,
    reviews: 198,
    image: "/ipad-pro-tablet.png",
    inStock: true,
  },
]

export function FeaturedProducts() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl mb-4">Featured Products</h2>
          <p className="text-muted-foreground text-lg text-pretty leading-relaxed">
            Handpicked selection of our most popular tech products
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className="group overflow-hidden transition-all hover:shadow-lg">
              <CardContent className="p-0">
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="object-cover w-full h-full transition-transform group-hover:scale-105"
                  />
                  {product.badge && (
                    <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">{product.badge}</Badge>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2 text-balance">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span className="ml-1 text-sm font-medium">{product.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">{product.originalPrice}</span>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button className="w-full" size="lg">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  )
}
