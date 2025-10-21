"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function UsersPage() {
  const { isAdmin } = useAuth()
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!isAdmin) return

    const fetchUsers = async () => {
      setIsLoading(true)
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*, orders(count)")
          .order("created_at", { ascending: false })

        if (error) throw error
        setUsers(data || [])
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()

    const subscription = supabase
      .channel("users")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "users",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setUsers((prev) => [payload.new, ...prev])
          } else if (payload.eventType === "UPDATE") {
            setUsers((prev) => prev.map((u) => (u.id === payload.new.id ? payload.new : u)))
          }
        },
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [isAdmin, supabase])

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
        <p>Loading users...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Manage Users</h1>
        <p className="text-gray-600">View and manage customer accounts</p>
      </div>

      {users.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">No users found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4">Role</th>
                <th className="text-left py-3 px-4">Orders</th>
                <th className="text-left py-3 px-4">Joined</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{user.name}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">
                    <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
                  </td>
                  <td className="py-3 px-4">{user.orders?.length || 0}</td>
                  <td className="py-3 px-4">{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
