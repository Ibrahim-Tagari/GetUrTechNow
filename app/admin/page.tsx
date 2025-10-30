"use client";

import React, { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Product {
  id?: string;
  name: string;
  description?: string;
  image?: string;
  category: string;
  price: number;
  original_price?: number;
  brand?: string;
  stock?: number;
  created_at?: string;
}

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    brand: "",
    stock: "",
    image: null as File | null,
  });

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/products");
      const json = await res.json();
      if (json?.data) setProducts(json.data);
    } catch (err) {
      console.error("Fetch products error:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, image: file }));
  };

  // Reset form
  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      originalPrice: "",
      category: "",
      brand: "",
      stock: "",
      image: null,
    });
    setSelected(null);
  };

  // Save product (Create / Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== "") fd.append(key, value as any);
      });

      const url = selected
        ? `/api/admin/products?id=${selected.id}`
        : "/api/admin/products";
      const method = selected ? "PUT" : "POST";

      const res = await fetch(url, { method, body: fd });
      const json = await res.json();

      if (!res.ok) {
        console.error("Save product error:", json);
        toast({
          title: json?.error || "Failed to save product",
          variant: "destructive",
        });
      } else {
        toast({
          title: selected ? "Product updated!" : "Product added!",
        });
        fetchProducts();
        resetForm();
      }
    } catch (err: any) {
      console.error("Submit error:", err);
      toast({ title: "Failed to save product", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Edit
  const handleEdit = (p: Product) => {
    setSelected(p);
    setForm({
      name: p.name || "",
      description: p.description || "",
      price: p.price?.toString() || "",
      originalPrice: p.original_price?.toString() || "",
      category: p.category || "",
      brand: p.brand || "",
      stock: p.stock?.toString() || "",
      image: null,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) {
        toast({ title: json?.error || "Delete failed", variant: "destructive" });
      } else {
        toast({ title: "Product deleted" });
        fetchProducts();
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow"
      >
        <Input
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          className="dark:text-white"
          required
        />
        <Input
          name="brand"
          placeholder="Brand"
          value={form.brand}
          onChange={handleChange}
          className="dark:text-white"
        />

        <Select
          value={form.category}
          onValueChange={(val) => setForm((f) => ({ ...f, category: val }))}
        >
          <SelectTrigger className="dark:text-white">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Laptops">Laptops</SelectItem>
            <SelectItem value="Phones">Phones</SelectItem>
            <SelectItem value="Accessories">Accessories</SelectItem>
            <SelectItem value="Deals">Deals</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="number"
          name="price"
          placeholder="Price (R)"
          value={form.price}
          onChange={handleChange}
          className="dark:text-white"
          required
        />

        {form.category === "Deals" && (
          <Input
            type="number"
            name="originalPrice"
            placeholder="Was Price (R)"
            value={form.originalPrice}
            onChange={handleChange}
            className="dark:text-white"
          />
        )}

        <Input
          type="number"
          name="stock"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          className="dark:text-white"
        />

        <Textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="md:col-span-2 dark:text-white"
        />

        <Input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFile}
          className="md:col-span-2 dark:text-white"
        />

        <div className="md:col-span-2 flex gap-3">
          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {selected ? "Update Product" : "Save Product"}
          </Button>
          {selected && (
            <Button
              type="button"
              variant="secondary"
              onClick={resetForm}
              className="bg-gray-500 hover:bg-gray-600 text-white"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>

      {/* Product List */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="relative bg-white dark:bg-gray-800 p-4 rounded-xl shadow flex flex-col justify-between"
          >
            {p.image ? (
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-40 object-cover rounded-md mb-3"
              />
            ) : (
              <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 mb-3 flex items-center justify-center text-gray-500 dark:text-gray-400">
                No Image
              </div>
            )}
            <h3 className="font-semibold text-lg">{p.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {p.description || "No description"}
            </p>
            <p className="mt-1 text-blue-600 dark:text-blue-400 font-bold">
              R{p.price.toFixed(2)}
            </p>
            {p.category === "Deals" && p.original_price && (
              <p className="text-sm text-gray-500 dark:text-gray-400 line-through">
                Was R{p.original_price.toFixed(2)}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1 uppercase">
              {p.category}
            </p>

            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                onClick={() => handleEdit(p)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                Edit
              </Button>
              <Button
                size="sm"
                onClick={() => handleDelete(p.id!)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
