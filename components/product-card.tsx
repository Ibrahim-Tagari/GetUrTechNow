/* "use client";

import React from "react";

export interface Product {
  id?: string;
  name: string;
  description?: string | null;
  image?: string | null;
  price: number;
  original_price?: number | null;
  ram?: string | null;
  category?: string | null;
}

export default function ProductCard({
  product,
  isAdmin = false,
  onEdit,
  onDelete,
}: {
  product: Product;
  isAdmin?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}) {
  const {
    id,
    name,
    description,
    image,
    price,
    original_price: originalPrice,
    ram,
  } = product;

  const isDeal =
    typeof originalPrice === "number" &&
    originalPrice > 0 &&
    originalPrice > price;

  const percentOff =
    isDeal && originalPrice
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  return (
    <div className="bg-[#1E293B] rounded-2xl shadow-md overflow-hidden border border-gray-700 text-white">
      <div className="relative w-full h-52 bg-gray-800 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No Image
          </div>
        )}

        {isDeal && (
          <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
            {percentOff}% OFF
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold truncate">{name}</h3>

        {ram && (
          <p className="text-sm text-gray-300 mt-1">
            RAM: <span className="font-medium">{ram}</span>
          </p>
        )}

        {description && (
          <p className="text-sm text-gray-400 mt-1 line-clamp-2">{description}</p>
        )}

        <div className="mt-3">
          <p className="text-blue-400 text-lg font-bold">
            R{price.toLocaleString()}
          </p>

          {isDeal && originalPrice && (
            <p className="text-sm text-gray-400 line-through">
              Was R{originalPrice.toLocaleString()}
            </p>
          )}
        </div>

        {isAdmin && (
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => id && onEdit?.(id)}
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded-md"
            >
              Edit
            </button>
            <button
              onClick={() => id && onDelete?.(id)}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
} */


// components/product-card.tsx
'use client';

import React from 'react';
import { useCart } from '@/contexts/cart-context';
import { supabase } from '@/lib/supabase/client';

export interface Product {
  id?: string | number;
  name: string;
  description?: string | null;
  image?: string | null;
  price: number;
  original_price?: number | null;
  ram?: string | null;
  category?: string | null;
  raw?: any;
}

type Props = {
  product: Product;
  showPercent?: boolean;
  onEdit?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
  compact?: boolean;
};

export default function ProductCard({
  product,
  showPercent = true,
  onEdit,
  onDelete,
  compact = false,
}: Props) {
  const { addToCart } = useCart();

  const {
    id,
    name = 'Unnamed Product',
    description: rawDesc,
    image = '/placeholder.png',
    price = 0,
    original_price: originalPrice,
  } = product || ({} as Product);

  const description =
    rawDesc && typeof rawDesc === 'string' && rawDesc.trim().length > 0
      ? rawDesc.trim()
      : null;

  const defaultDesc = 'No description available';
  const maxDescLength = compact ? 90 : 140;
  const shortDesc =
    description && description.length > maxDescLength
      ? description.slice(0, maxDescLength - 1).trim() + '…'
      : description ?? defaultDesc;

  const isDeal =
    typeof originalPrice === 'number' && originalPrice > 0 && originalPrice > price;
  const percentOff =
    isDeal && originalPrice
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  const [message, setMessage] = React.useState<string | null>(null);
  const [adding, setAdding] = React.useState(false);

  async function handleAddToCart() {
    setMessage(null);
    setAdding(true);
    try {
      // Create a clean copy of product without duplicate keys
      const { name: _n, price: _p, ...rest } = product;
      const cartItem = {
        id: id ?? String(Math.random()).slice(2),
        name,
        price: Number(price) || 0,
        image,
        ...rest,
      };

      addToCart(cartItem, 1);

      // Persist to Supabase
      try {
        await supabase.from('cart_items').insert([
          {
            product_id: id,
            product_name: name,
            price: Number(price) || 0,
            quantity: 1,
            image: image ?? null,
            created_at: new Date().toISOString(),
          },
        ]);
      } catch {
        /* silent fail for UI smoothness */
      }

      setMessage('Product added to cart');
    } catch (err) {
      console.error(err);
      setMessage('Failed to add to cart');
    } finally {
      setAdding(false);
      setTimeout(() => setMessage(null), 3000);
    }
  }

  const formatPrice = (n: number) =>
    `R${n.toLocaleString('en-ZA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <div className="bg-white/3 rounded-lg overflow-hidden shadow-md">
      <div className="p-0 relative">
        <img
          src={image ?? '/placeholder.png'}
          alt={name}
          className="w-full h-52 object-cover rounded-t-lg"
          onError={(e: any) => {
            e.currentTarget.src = '/placeholder.png';
          }}
        />
        {isDeal && showPercent && (
          <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            {percentOff}% OFF
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-800 text-white">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="mt-2 text-sm text-white/80">{shortDesc}</p>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <div className="text-xl font-bold">
              {formatPrice(Number(price || 0))}
            </div>
            {isDeal && (
              <div className="text-xs line-through text-white/60">
                R
                {Number(originalPrice).toLocaleString('en-ZA', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            )}
          </div>

          <div>
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className={`px-4 py-2 rounded-md font-semibold ${
                adding ? 'opacity-70 cursor-wait' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {adding ? 'Adding…' : 'Add to cart'}
            </button>
          </div>
        </div>

        {message && (
          <p
            className={`text-xs mt-2 ${
              message.includes('added') ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {message}
          </p>
        )}

        {(onEdit || onDelete) && (
          <div className="mt-2 flex items-center gap-2">
            {onEdit && id && (
              <button
                onClick={() => id && onEdit?.(String(id))}
                className="text-sm px-2 py-1 rounded-md border border-white/10 hover:bg-white/5"
              >
                Edit
              </button>
            )}
            {onDelete && id && (
              <button
                onClick={() => id && onDelete?.(String(id))}
                className="text-sm px-2 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
