"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ReturnsPage() {
  const { isAdmin } = useAuth()
  const [returns, setReturns] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!isAdmin) return

    const fetchReturns = async () => {
      setIsLoading(true)
      try {
        const { data, error } = await supabase
          .from("returns")
          .select("*, users(name, email), products(name), orders(order_number)")
          .order("created_at", { ascending: false })

        if (error) throw error
        setReturns(data || [])
      } catch (error) {
        console.error("Error fetching returns:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReturns()

    const subscription = supabase
      .channel("returns")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "returns",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setReturns((prev) => [payload.new, ...prev])
          } else if (payload.eventType === "UPDATE") {
            setReturns((prev) => prev.map((r) => (r.id === payload.new.id ? payload.new : r)))
          }
        },
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [isAdmin, supabase])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Access denied. Admin only.</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading returns...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Manage Returns</h1>
        <p className="text-gray-600">View and process product returns</p>
      </div>

      {returns.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">No returns found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {returns.map((returnItem) => (
            <Card key={returnItem.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{returnItem.products?.name}</CardTitle>
                    <CardDescription>Order: {returnItem.orders?.order_number}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(returnItem.status)}>{returnItem.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Customer</p>
                    <p className="font-semibold">{returnItem.users?.name}</p>
                    <p className="text-sm text-gray-600">{returnItem.users?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Reason</p>
                    <p className="font-semibold">{returnItem.reason}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Approve
                  </Button>
                  <Button variant="outline" size="sm">
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
