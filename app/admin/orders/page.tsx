"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function OrdersPage() {
  const { user, isAdmin } = useAuth()
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!user) return

    const fetchOrders = async () => {
      setIsLoading(true)
      try {
        let query = supabase.from("orders").select("*, invoices(*)")

        if (!isAdmin) {
          query = query.eq("user_id", user.id)
        }

        const { data, error } = await query.order("created_at", { ascending: false })

        if (error) throw error
        setOrders(data || [])
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()

    // Subscribe to real-time updates
    const subscription = supabase
      .channel("orders")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setOrders((prev) => [payload.new, ...prev])
          } else if (payload.eventType === "UPDATE") {
            setOrders((prev) => prev.map((o) => (o.id === payload.new.id ? payload.new : o)))
          }
        },
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [user, isAdmin, supabase])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Please log in to view orders</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading orders...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{isAdmin ? "All Orders" : "My Orders"}</h1>
        <p className="text-gray-600">View and manage orders</p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">No orders found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{order.order_number}</CardTitle>
                    <CardDescription>{new Date(order.created_at).toLocaleDateString()}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-lg font-semibold">R {order.total_amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Items</p>
                    <p className="text-lg font-semibold">{order.items?.length || 0}</p>
                  </div>
                </div>

                {order.invoices && order.invoices.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold mb-2">Invoices</p>
                    <div className="space-y-2">
                      {order.invoices.map((invoice: any) => (
                        <div key={invoice.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm">{invoice.invoice_number}</span>
                          <span className="text-sm font-semibold">R {invoice.amount.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Link href={`/admin/orders/${order.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                  {isAdmin && (
                    <Button variant="outline" size="sm">
                      Update Status
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
