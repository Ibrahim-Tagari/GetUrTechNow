"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type CartItem = {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  category: string
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart)
        setItems(parsedCart)
      } catch (error) {
        console.error("[v0] Error parsing stored cart", error)
        localStorage.removeItem("cart")
      }
    }
    setIsLoading(false)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("cart", JSON.stringify(items))
    }
  }, [items, isLoading])

  const addItem = (item: Omit<CartItem, "quantity">) => {
    console.log("[v0] Adding item to cart:", item)
    setItems((currentItems) => {
      const existingItem = currentItems.find((i) => i.id === item.id)
      if (existingItem) {
        return currentItems.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
      }
      return [...currentItems, { ...item, quantity: 1 }]
    })
  }

  const removeItem = (id: string) => {
    console.log("[v0] Removing item from cart:", id)
    setItems((currentItems) => currentItems.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    console.log("[v0] Updating item quantity:", id, quantity)
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    setItems((currentItems) => currentItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    console.log("[v0] Clearing cart")
    setItems([])
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (isLoading) {
    return null
  }

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
