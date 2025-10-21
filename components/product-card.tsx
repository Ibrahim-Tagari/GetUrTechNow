"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

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
  category?: string
  upgrades?: {
    ram?: { options: string[]; prices: number[] }
    ssd?: { options: string[]; prices: number[] }
  }
}

type ProductCardProps = {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const { toast } = useToast()

  const [selectedRam, setSelectedRam] = useState(0)
  const [selectedSsd, setSelectedSsd] = useState(0)

  const ramUpgradePrice = product.upgrades?.ram?.prices[selectedRam] || 0
  const ssdUpgradePrice = product.upgrades?.ssd?.prices[selectedSsd] || 0
  const totalPrice = product.price + ramUpgradePrice + ssdUpgradePrice

  const handleAddToCart = () => {
    const upgradeName = []
    if (product.upgrades?.ram && selectedRam > 0) {
      upgradeName.push(product.upgrades.ram.options[selectedRam])
    }
    if (product.upgrades?.ssd && selectedSsd > 0) {
      upgradeName.push(product.upgrades.ssd.options[selectedSsd])
    }

    const itemName = upgradeName.length > 0 ? `${product.name} (${upgradeName.join(", ")})` : product.name

    addItem({
      id: `${product.id}-${selectedRam}-${selectedSsd}`,
      name: itemName,
      price: totalPrice,
      image: product.image,
      category: product.category || "product",
    })
    toast({
      title: "Added to cart",
      description: `${itemName} has been added to your cart.`,
    })
  }

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {product.badge && (
            <Badge
              className="absolute top-3 left-3 z-10"
              variant={product.badge === "Sale" ? "destructive" : "default"}
            >
              {product.badge}
            </Badge>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
              <Badge variant="secondary">Out of Stock</Badge>
            </div>
          )}
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="object-cover w-full h-full transition-transform group-hover:scale-105"
          />
        </div>

        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-2 mb-1">{product.name}</h3>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="font-medium">{product.rating}</span>
              </div>
              <span className="text-muted-foreground">({product.reviews} reviews)</span>
            </div>
          </div>

          {product.inStock && (
            <div className="space-y-3 pt-2 border-t">
              <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400">
                In Stock
              </Badge>

              {product.upgrades?.ram && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">RAM</Label>
                  <RadioGroup value={selectedRam.toString()} onValueChange={(v) => setSelectedRam(Number(v))}>
                    {product.upgrades.ram.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem value={index.toString()} id={`ram-${product.id}-${index}`} />
                        <Label htmlFor={`ram-${product.id}-${index}`} className="text-sm cursor-pointer flex-1">
                          {option}
                          {index > 0 && (
                            <span className="text-muted-foreground ml-1">
                              (+R{product.upgrades.ram.prices[index].toLocaleString()})
                            </span>
                          )}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {product.upgrades?.ssd && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Storage (SSD)</Label>
                  <RadioGroup value={selectedSsd.toString()} onValueChange={(v) => setSelectedSsd(Number(v))}>
                    {product.upgrades.ssd.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem value={index.toString()} id={`ssd-${product.id}-${index}`} />
                        <Label htmlFor={`ssd-${product.id}-${index}`} className="text-sm cursor-pointer flex-1">
                          {option}
                          {index > 0 && (
                            <span className="text-muted-foreground ml-1">
                              (+R{product.upgrades.ssd.prices[index].toLocaleString()})
                            </span>
                          )}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}
            </div>
          )}

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">R{totalPrice.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                R{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <Button className="w-full" disabled={!product.inStock} onClick={handleAddToCart}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
