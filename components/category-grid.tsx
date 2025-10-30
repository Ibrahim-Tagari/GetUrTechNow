import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Laptop, Smartphone, Tablet, Headphones } from "lucide-react"

const categories = [
  {
    name: "Laptops",
    icon: Laptop,
    href: "/laptops",
    image: "/modern-laptop-computer.jpg",
    description: "High-performance laptops",
  },
  {
    name: "Smartphones",
    icon: Smartphone,
    href: "/smartphones",
    image: "/modern-smartphone.png",
    description: "Latest mobile devices",
  },
  {
    name: "Tablets",
    icon: Tablet,
    href: "/tablets",
    image: "/modern-tablet.png",
    description: "Portable computing",
  },
  {
    name: "Accessories",
    icon: Headphones,
    href: "/accessories",
    image: "/tech-accessories-headphones-mouse-keyboard.jpg",
    description: "Essential tech gear",
  },
]

export function CategoryGrid() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl mb-4">Shop by Category</h2>
          <p className="text-muted-foreground text-lg text-pretty leading-relaxed">
            Find exactly what you need from our wide range of tech products
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Link key={category.name} href={category.href}>
                <Card className="group overflow-hidden transition-all hover:shadow-lg hover:border-primary/50">
                  <CardContent className="p-0">
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        className="object-cover w-full h-full transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <Icon className="h-8 w-8 mb-2" />
                        <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                        <p className="text-sm text-white/90">{category.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
