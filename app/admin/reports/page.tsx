"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type ReportPeriod = "daily" | "monthly" | "yearly"

export default function ReportsPage() {
  const { isAdmin } = useAuth()
  const [period, setPeriod] = useState<ReportPeriod>("daily")
  const [reportData, setReportData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!isAdmin) return

    const fetchReports = async () => {
      setIsLoading(true)
      try {
        const { data: orders, error } = await supabase.from("orders").select("*").eq("status", "delivered")

        if (error) throw error

        const now = new Date()
        let filteredOrders = orders || []

        if (period === "daily") {
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          filteredOrders = filteredOrders.filter((o) => new Date(o.created_at) >= today)
        } else if (period === "monthly") {
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
          filteredOrders = filteredOrders.filter((o) => new Date(o.created_at) >= monthStart)
        } else if (period === "yearly") {
          const yearStart = new Date(now.getFullYear(), 0, 1)
          filteredOrders = filteredOrders.filter((o) => new Date(o.created_at) >= yearStart)
        }

        const totalRevenue = filteredOrders.reduce((sum, o) => sum + Number.parseFloat(o.total_amount), 0)
        const totalOrders = filteredOrders.length
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

        setReportData({
          totalRevenue,
          totalOrders,
          averageOrderValue,
          orders: filteredOrders,
        })
      } catch (error) {
        console.error("Error fetching reports:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReports()
  }, [period, isAdmin, supabase])

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
        <p>Loading reports...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">View Reports</h1>
        <p className="text-gray-600">Analyze sales and business metrics</p>
      </div>

      <div className="flex gap-2 mb-8">
        <Button variant={period === "daily" ? "default" : "outline"} onClick={() => setPeriod("daily")}>
          Daily
        </Button>
        <Button variant={period === "monthly" ? "default" : "outline"} onClick={() => setPeriod("monthly")}>
          Monthly
        </Button>
        <Button variant={period === "yearly" ? "default" : "outline"} onClick={() => setPeriod("yearly")}>
          Yearly
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
            <CardDescription>
              {period === "daily" && "Today"}
              {period === "monthly" && "This Month"}
              {period === "yearly" && "This Year"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">R {reportData?.totalRevenue.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
            <CardDescription>
              {period === "daily" && "Today"}
              {period === "monthly" && "This Month"}
              {period === "yearly" && "This Year"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{reportData?.totalOrders}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Order Value</CardTitle>
            <CardDescription>
              {period === "daily" && "Today"}
              {period === "monthly" && "This Month"}
              {period === "yearly" && "This Year"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">R {reportData?.averageOrderValue.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Orders in this period</CardDescription>
        </CardHeader>
        <CardContent>
          {reportData?.orders.length === 0 ? (
            <p className="text-gray-500">No orders in this period</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Order Number</th>
                    <th className="text-left py-3 px-4">Amount</th>
                    <th className="text-left py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData?.orders.map((order: any) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{order.order_number}</td>
                      <td className="py-3 px-4">R {order.total_amount.toFixed(2)}</td>
                      <td className="py-3 px-4">{new Date(order.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
