/*"use client";

import React from "react";
import ProductCard from "@/components/product-card";
import type { Product } from "@/components/product-card";

type Props = {
  products: any[]; // We accept any shape and normalize below
  columns?: number;
};

const ProductGrid: React.FC<Props> = ({ products, columns = 3 }) => {
  const gridColsClass =
    columns === 1 ? "grid-cols-1" : columns === 2 ? "grid-cols-2" : "grid-cols-3";

  // ✅ Normalize field names here so all pages work consistently
  const normalizedProducts: Product[] = products.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    image: p.image || p.image_url,
    price: Number(p.price ?? 0),
    original_price: p.original_price
      ? Number(p.original_price)
      : p.originalPrice
      ? Number(p.originalPrice)
      : null,
    ram: p.ram ?? null,
    category: p.category ?? null,
  }));

  return (
    <section>
      <div className={`grid gap-6 ${gridColsClass}`}>
        {normalizedProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid; */


// components/product-grid.tsx
'use client';

import React from 'react';
import ProductCard, { Product } from '@/components/product-card';

type Props = {
  products: any[]; // accept raw rows from DB / different pages
  columns?: number;
  showPercent?: boolean;
};

function normalizeProduct(raw: any): Product {
  // Normalize all possible fields so ProductCard always gets the same shape
  // Common Supabase column names we handle: name, title, description, specs, details, short_description, image, images, price, original_price, ram, category, id
  const id = raw.id ?? raw.product_id ?? raw.uuid ?? raw._id ?? (raw.name ? raw.name.toString().slice(0, 12) : undefined);
  const name = raw.name ?? raw.title ?? 'Unnamed Product';
  // description priority: description -> short_description -> specs -> details -> notes -> summary
  const description =
    raw.description ??
    raw.short_description ??
    raw.specs ??
    raw.details ??
    raw.notes ??
    raw.summary ??
    raw.product_description ??
    null;

  // Image priority: image -> images[0] -> thumbnail -> picture
  let image: string | null = null;
  if (raw.image) image = raw.image;
  else if (raw.images && Array.isArray(raw.images) && raw.images.length) image = raw.images[0];
  else if (raw.thumbnail) image = raw.thumbnail;
  else if (raw.picture) image = raw.picture;

  // Price priority and numeric conversion
  const price = raw.price !== undefined && raw.price !== null ? Number(raw.price) : 0;
  const original_price =
    raw.original_price !== undefined && raw.original_price !== null ? Number(raw.original_price) : raw.compare_at_price ? Number(raw.compare_at_price) : null;

  const ram = raw.ram ?? raw.memory ?? null;
  const category = raw.category ?? raw.category_name ?? null;

  return {
    id,
    name,
    description,
    image,
    price,
    original_price,
    ram,
    category,
    // preserve original raw for advanced operations in card if needed
    raw,
  } as Product;
}

const ProductGrid: React.FC<Props> = ({ products = [], columns = 3, showPercent = true }) => {
  const gridColsClass = columns === 1 ? 'grid-cols-1' : columns === 2 ? 'grid-cols-2' : 'grid-cols-3';

  const normalizedProducts: Product[] = React.useMemo(() => {
    if (!Array.isArray(products)) return [];
    return products.map((p) => normalizeProduct(p));
  }, [products]);

  return (
    <section>
      <div className={`grid gap-6 ${gridColsClass}`}>
        {normalizedProducts.map((p) => (
          <ProductCard key={String(p.id ?? p.name)} product={p} showPercent={showPercent} />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;
