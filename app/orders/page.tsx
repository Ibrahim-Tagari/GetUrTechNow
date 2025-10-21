"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Truck, CheckCircle, Clock } from "lucide-react"

const mockOrders = [
  {
    id: "#ORD-2024-001",
    date: "2024-01-15",
    status: "Delivered",
    total: 45999,
    items: [
      {
        name: 'MacBook Pro 16"',
        quantity: 1,
        price: 45999,
        image: "/macbook-pro-laptop.png",
      },
    ],
  },
  {
    id: "#ORD-2024-002",
    date: "2024-01-18",
    status: "Shipped",
    total: 28999,
    trackingNumber: "TRK123456789",
    items: [
      {
        name: "iPhone 15 Pro Max",
        quantity: 1,
        price: 28999,
        image: "/iphone-15-pro-smartphone.jpg",
      },
    ],
  },
  {
    id: "#ORD-2024-003",
    date: "2024-01-20",
    status: "Processing",
    total: 23998,
    items: [
      {
        name: "Sony WH-1000XM5",
        quantity: 2,
        price: 7999,
        image: "/sony-wh-1000xm5.jpg",
      },
      {
        name: "Anker PowerCore 20000",
        quantity: 1,
        price: 8000,
        image: "/anker-powercore-20000.jpg",
      },
    ],
  },
]

export default function OrdersPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "Shipped":
        return <Truck className="h-5 w-5 text-blue-500" />
      case "Processing":
        return <Clock className="h-5 w-5 text-orange-500" />
      default:
        return <Package className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Delivered":
        return "default"
      case "Shipped":
        return "secondary"
      case "Processing":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-3xl font-bold mb-8">My Orders</h1>

          {mockOrders.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Package className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
                <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
                <Button onClick={() => router.push("/")}>Start Shopping</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {mockOrders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <CardTitle className="text-lg">{order.id}</CardTitle>
                        <CardDescription>Placed on {new Date(order.date).toLocaleDateString()}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Order Items */}
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex gap-4 pb-3 border-b last:border-0">
                            <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium line-clamp-1">{item.name}</h4>
                              <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                              <p className="text-sm font-medium mt-1">R{item.price.toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Summary */}
                      <div className="flex items-center justify-between pt-3 border-t">
                        <span className="font-medium">Total</span>
                        <span className="text-xl font-bold">R{order.total.toLocaleString()}</span>
                      </div>

                      {/* Tracking Info */}
                      {order.trackingNumber && (
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <p className="text-sm font-medium mb-1">Tracking Number</p>
                          <p className="text-sm text-muted-foreground font-mono">{order.trackingNumber}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-3 pt-2">
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          View Details
                        </Button>
                        {order.status === "Delivered" && (
                          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                            Leave Review
                          </Button>
                        )}
                        {order.status === "Shipped" && (
                          <Button variant="default" size="sm" className="flex-1">
                            Track Order
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
