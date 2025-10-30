'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import type { Product } from '@/types/product'

export type CartItem = {
  id: string
  name: string
  price: number
  image?: string
  product: Product
  quantity: number
}

export type CartContextType = {
  items: CartItem[]
  addToCart: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  clearCart: () => void
  updateQuantity: (productId: string, quantity: number) => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

type Props = {
  children: ReactNode
}

export const CartProvider: React.FC<Props> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([])

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id)
      if (existingIndex >= 0) {
        const next = [...prev]
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        }
        return next
      }

      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          product,
          quantity,
        },
      ]
    })
  }

  const removeItem = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId))
  }

  const clearCart = () => setCart([])

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  const value: CartContextType = {
    items: cart,
    addToCart,
    removeItem,
    clearCart,
    updateQuantity,
    totalItems,
    totalPrice,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}

export default CartContext