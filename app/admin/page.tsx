"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Package, ShoppingCart, DollarSign, TrendingUp, Upload, X, Edit, Trash } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminDashboardPage() {
  const { user, isAdmin } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [showManageProducts, setShowManageProducts] = useState(false)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [showEditProduct, setShowEditProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    category: "",
    brand: "",
    description: "",
    stock: "",
    image: "",
    inStock: true,
    tags: [] as string[],
    specs: "" as string,
    upgrades: {
      ram: { options: ["16GB (Base)", "32GB", "64GB"], prices: [0, 4000, 8000] },
      ssd: { options: ["512GB (Base)", "1TB", "2TB"], prices: [0, 3000, 6000] },
    },
  })
  const [dragActive, setDragActive] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [tagInput, setTagInput] = useState("")

  useEffect(() => {
    if (!user) {
      router.push("/login")
    } else if (!isAdmin) {
      router.push("/")
    } else {
      loadProducts()
    }
  }, [user, isAdmin, router])

  const loadProducts = () => {
    const adminProducts = JSON.parse(localStorage.getItem("admin_products") || "[]")
    setProducts(adminProducts)
  }

  const handleAddProduct = () => {
    setEditingProduct(null)
    setProductForm({
      name: "",
      price: "",
      category: "",
      brand: "",
      description: "",
      stock: "",
      image: "",
      inStock: true,
      tags: [],
      specs: "",
      upgrades: {
        ram: { options: ["16GB (Base)", "32GB", "64GB"], prices: [0, 4000, 8000] },
        ssd: { options: ["512GB (Base)", "1TB", "2TB"], prices: [0, 3000, 6000] },
      },
    })
    setImagePreview(null)
    setShowAddProduct(true)
  }

  const handleEditProduct = (product: any) => {
    setEditingProduct(product)
    setProductForm(product)
    setImagePreview(product.image)
    setShowEditProduct(true)
  }

  const handleDeleteProduct = (productId: string) => {
    const updatedProducts = products.filter((p) => p.id !== productId)
    localStorage.setItem("admin_products", JSON.stringify(updatedProducts))
    setProducts(updatedProducts)
    toast({
      title: "Success",
      description: "Product deleted successfully.",
    })
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
        setProductForm({ ...productForm, image: result })
      }
      reader.readAsDataURL(file)
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      })
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !productForm.tags.includes(tagInput.trim())) {
      setProductForm({
        ...productForm,
        tags: [...productForm.tags, tagInput.trim()],
      })
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setProductForm({
      ...productForm,
      tags: productForm.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  const handleSubmitProduct = () => {
    if (!productForm.name || !productForm.price || !productForm.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields (Name, Price, Category)",
        variant: "destructive",
      })
      return
    }

    if (editingProduct) {
      const updatedProducts = products.map((p) =>
        p.id === editingProduct.id
          ? {
              ...productForm,
              id: editingProduct.id,
              price: Number.parseFloat(productForm.price),
              stock: Number.parseInt(productForm.stock) || 0,
              updatedAt: new Date().toISOString(),
            }
          : p,
      )
      localStorage.setItem("admin_products", JSON.stringify(updatedProducts))
      setProducts(updatedProducts)
      toast({
        title: "Success",
        description: `Product "${productForm.name}" has been updated successfully!`,
      })
      setShowEditProduct(false)
    } else {
      const newProduct = {
        id: `product-${Date.now()}`,
        ...productForm,
        price: Number.parseFloat(productForm.price),
        stock: Number.parseInt(productForm.stock) || 0,
        createdAt: new Date().toISOString(),
      }
      const allProducts = [...products, newProduct]
      localStorage.setItem("admin_products", JSON.stringify(allProducts))
      setProducts(allProducts)
      toast({
        title: "Success",
        description: `Product "${productForm.name}" has been added successfully!`,
      })
      setShowAddProduct(false)
    }

    setProductForm({
      name: "",
      price: "",
      category: "",
      brand: "",
      description: "",
      stock: "",
      image: "",
      inStock: true,
      tags: [],
      specs: "",
      upgrades: {
        ram: { options: ["16GB (Base)", "32GB", "64GB"], prices: [0, 4000, 8000] },
        ssd: { options: ["512GB (Base)", "1TB", "2TB"], prices: [0, 3000, 6000] },
      },
    })
    setImagePreview(null)
  }

  if (!user || !isAdmin) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 py-12 bg-muted/30">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground text-lg">Manage your store efficiently</p>
          </div>

          {/* Main Dashboard Cards */}
          {!showManageProducts ? (
            <>
              {/* Quick Action Cards */}
              <div className="grid gap-6 md:grid-cols-2 mb-12">
                {/* Manage Products Card */}
                <button
                  onClick={() => setShowManageProducts(true)}
                  className="group relative overflow-hidden rounded-lg border border-input bg-background p-8 text-left transition-all hover:shadow-lg hover:border-primary"
                >
                  <div className="flex flex-col items-center justify-center gap-4 h-48">
                    <div className="rounded-full bg-blue-100 p-4 group-hover:bg-blue-200 transition-colors">
                      <Package className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-2xl font-bold">Manage Products</h3>
                      <p className="text-sm text-muted-foreground mt-1">Add, edit, or delete products</p>
                    </div>
                  </div>
                </button>

                {/* View Orders Card */}
                <div className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 p-8 text-left transition-all hover:shadow-lg cursor-pointer">
                  <div className="flex flex-col items-center justify-center gap-4 h-48">
                    <div className="rounded-full bg-white/20 p-4">
                      <ShoppingCart className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-white">View Orders</h3>
                      <p className="text-sm text-white/80 mt-1">Track customer orders</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Manage Users Card */}
                <div className="group relative overflow-hidden rounded-lg border border-input bg-background p-8 text-left transition-all hover:shadow-lg hover:border-primary cursor-pointer">
                  <div className="flex flex-col items-center justify-center gap-4 h-48">
                    <div className="rounded-full bg-purple-100 p-4 group-hover:bg-purple-200 transition-colors">
                      <Users className="h-8 w-8 text-purple-600" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-2xl font-bold">Manage Users</h3>
                      <p className="text-sm text-muted-foreground mt-1">View and manage users</p>
                    </div>
                  </div>
                </div>

                {/* View Reports Card */}
                <div className="group relative overflow-hidden rounded-lg border border-input bg-background p-8 text-left transition-all hover:shadow-lg hover:border-primary cursor-pointer">
                  <div className="flex flex-col items-center justify-center gap-4 h-48">
                    <div className="rounded-full bg-green-100 p-4 group-hover:bg-green-200 transition-colors">
                      <DollarSign className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-2xl font-bold">View Reports</h3>
                      <p className="text-sm text-muted-foreground mt-1">Analytics and insights</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Back Button */}
              <Button variant="outline" onClick={() => setShowManageProducts(false)} className="mb-6">
                Back to Dashboard
              </Button>

              {/* Stats Grid */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">R 245,890</div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span className="text-green-500">+12.5%</span> from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,234</div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span className="text-green-500">+8.2%</span> from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{products.length}</div>
                    <p className="text-xs text-muted-foreground mt-1">Across all categories</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2,847</div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span className="text-green-500">+15.3%</span> from last month
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Products Management Table */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Products Management</CardTitle>
                      <CardDescription>Manage all your products</CardDescription>
                    </div>
                    <Button onClick={handleAddProduct}>
                      <Package className="mr-2 h-4 w-4" />
                      Add Product
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Name</th>
                          <th className="text-left py-3 px-4">Category</th>
                          <th className="text-left py-3 px-4">Price</th>
                          <th className="text-left py-3 px-4">Stock</th>
                          <th className="text-left py-3 px-4">Status</th>
                          <th className="text-left py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr key={product.id} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-4 font-medium">{product.name}</td>
                            <td className="py-3 px-4 capitalize">{product.category}</td>
                            <td className="py-3 px-4">R {product.price.toLocaleString()}</td>
                            <td className="py-3 px-4">{product.stock}</td>
                            <td className="py-3 px-4">
                              <Badge variant={product.inStock ? "default" : "secondary"}>
                                {product.inStock ? "In Stock" : "Out of Stock"}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
      <SiteFooter />

      {/* Add/Edit Product Dialog */}
      <Dialog
        open={showAddProduct || showEditProduct}
        onOpenChange={(open) => {
          setShowAddProduct(open && !editingProduct)
          setShowEditProduct(open && !!editingProduct)
        }}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
            <DialogDescription>
              {editingProduct
                ? "Update product details"
                : "Fill in the details to add a new product to your inventory."}
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="upgrades">Upgrades</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">
                  Product Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g., MacBook Pro 16-inch"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">
                  Price (R) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  placeholder="e.g., 45999"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">
                  Category <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={productForm.category}
                  onValueChange={(value) => setProductForm({ ...productForm, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="laptops">Laptops</SelectItem>
                    <SelectItem value="smartphones">Smartphones</SelectItem>
                    <SelectItem value="tablets">Tablets</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                    <SelectItem value="desktops">Desktops</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  value={productForm.brand}
                  onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                  placeholder="e.g., Apple, Samsung, Dell"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  type="number"
                  value={productForm.stock}
                  onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                  placeholder="e.g., 50"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="inStock">In Stock</Label>
                  <p className="text-sm text-muted-foreground">Mark this product as available for purchase</p>
                </div>
                <Switch
                  id="inStock"
                  checked={productForm.inStock}
                  onCheckedChange={(checked) => setProductForm({ ...productForm, inStock: checked })}
                />
              </div>

              <div className="grid gap-2">
                <Label>Product Image</Label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="max-h-48 mx-auto rounded-md object-contain"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setImagePreview(null)
                          setProductForm({ ...productForm, image: "" })
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm font-medium mb-2">Drag and drop an image here</p>
                      <p className="text-xs text-muted-foreground mb-4">or</p>
                      <label htmlFor="file-upload">
                        <Button type="button" variant="outline" size="sm" asChild>
                          <span>Browse Files</span>
                        </Button>
                        <input
                          id="file-upload"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileInput}
                        />
                      </label>
                    </>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="upgrades" className="space-y-4 py-4">
              {(productForm.category === "laptops" || productForm.category === "desktops") && (
                <>
                  <div className="space-y-4">
                    <h3 className="font-semibold">RAM Upgrades</h3>
                    {productForm.upgrades.ram.options.map((option, index) => (
                      <div key={index} className="grid gap-2">
                        <Label>
                          Option {index + 1}: {option}
                        </Label>
                        <Input
                          type="number"
                          value={productForm.upgrades.ram.prices[index]}
                          onChange={(e) => {
                            const newPrices = [...productForm.upgrades.ram.prices]
                            newPrices[index] = Number(e.target.value)
                            setProductForm({
                              ...productForm,
                              upgrades: {
                                ...productForm.upgrades,
                                ram: { ...productForm.upgrades.ram, prices: newPrices },
                              },
                            })
                          }}
                          placeholder="Price in R"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">SSD Upgrades</h3>
                    {productForm.upgrades.ssd.options.map((option, index) => (
                      <div key={index} className="grid gap-2">
                        <Label>
                          Option {index + 1}: {option}
                        </Label>
                        <Input
                          type="number"
                          value={productForm.upgrades.ssd.prices[index]}
                          onChange={(e) => {
                            const newPrices = [...productForm.upgrades.ssd.prices]
                            newPrices[index] = Number(e.target.value)
                            setProductForm({
                              ...productForm,
                              upgrades: {
                                ...productForm.upgrades,
                                ssd: { ...productForm.upgrades.ssd, prices: newPrices },
                              },
                            })
                          }}
                          placeholder="Price in R"
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}
              {productForm.category !== "laptops" && productForm.category !== "desktops" && (
                <p className="text-muted-foreground">Upgrades are only available for Laptops and Desktops</p>
              )}
            </TabsContent>

            <TabsContent value="details" className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="specs">Product Specifications</Label>
                <Textarea
                  id="specs"
                  value={productForm.specs}
                  onChange={(e) => setProductForm({ ...productForm, specs: e.target.value })}
                  placeholder="Enter product specifications..."
                  rows={4}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="tags">Product Tags</Label>
                <p className="text-xs text-muted-foreground">
                  Add tags like "sale", "best seller", "budget pick", "gaming"
                </p>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddTag()
                      }
                    }}
                    placeholder="Enter a tag and press Enter"
                  />
                  <Button type="button" onClick={handleAddTag} variant="outline">
                    Add
                  </Button>
                </div>
                {productForm.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {productForm.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Enter product description..."
                  rows={4}
                />
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddProduct(false)
                setShowEditProduct(false)
                setEditingProduct(null)
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmitProduct}>{editingProduct ? "Update Product" : "Add Product"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
