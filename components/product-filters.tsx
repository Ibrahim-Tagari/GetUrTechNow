"use client"

import React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"

type ProductFiltersProps = {
  category: string
  onFilterChange?: (filters: FilterState) => void
}

export type FilterState = {
  priceRange: [number, number]
  brands: string[]
  processors: string[]
  inStockOnly: boolean
}

export function ProductFilters({ category, onFilterChange }: ProductFiltersProps) {
  const brands = ["Apple", "Dell", "HP", "Lenovo", "ASUS", "Microsoft", "Acer", "MSI"]
  const processors = ["Intel Core i5", "Intel Core i7", "Intel Core i9", "AMD Ryzen 5", "AMD Ryzen 7", "Apple M3"]

  const [priceRange, setPriceRange] = React.useState<[number, number]>([0, 60000])
  const [selectedBrands, setSelectedBrands] = React.useState<string[]>([])
  const [selectedProcessors, setSelectedProcessors] = React.useState<string[]>([])
  const [inStockOnly, setInStockOnly] = React.useState(false)

  React.useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        priceRange,
        brands: selectedBrands,
        processors: selectedProcessors,
        inStockOnly,
      })
    }
  }, [priceRange, selectedBrands, selectedProcessors, inStockOnly, onFilterChange])

  const handleBrandChange = (brand: string, checked: boolean) => {
    if (checked) {
      setSelectedBrands([...selectedBrands, brand])
    } else {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand))
    }
  }

  const handleProcessorChange = (processor: string, checked: boolean) => {
    if (checked) {
      setSelectedProcessors([...selectedProcessors, processor])
    } else {
      setSelectedProcessors(selectedProcessors.filter((p) => p !== processor))
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Price Range */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Price Range</Label>
            <div className="pt-2">
              <Slider
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number, number])}
                max={60000}
                step={1000}
                className="mb-2"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>R{priceRange[0].toLocaleString()}</span>
                <span>R{priceRange[1].toLocaleString()}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Brands */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Brand</Label>
            <div className="space-y-2">
              {brands.map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand}`}
                    checked={selectedBrands.includes(brand)}
                    onCheckedChange={(checked) => handleBrandChange(brand, checked as boolean)}
                  />
                  <Label htmlFor={`brand-${brand}`} className="text-sm font-normal cursor-pointer">
                    {brand}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Processor */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Processor</Label>
            <div className="space-y-2">
              {processors.map((processor) => (
                <div key={processor} className="flex items-center space-x-2">
                  <Checkbox
                    id={`processor-${processor}`}
                    checked={selectedProcessors.includes(processor)}
                    onCheckedChange={(checked) => handleProcessorChange(processor, checked as boolean)}
                  />
                  <Label htmlFor={`processor-${processor}`} className="text-sm font-normal cursor-pointer">
                    {processor}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* In Stock */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="in-stock"
              checked={inStockOnly}
              onCheckedChange={(checked) => setInStockOnly(checked as boolean)}
            />
            <Label htmlFor="in-stock" className="text-sm font-normal cursor-pointer">
              In Stock Only
            </Label>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
