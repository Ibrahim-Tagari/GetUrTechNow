"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-7xl">
              Get Your Tech <span className="text-primary">Now</span>
            </h1>
            <p className="text-lg text-muted-foreground text-pretty md:text-xl leading-relaxed">
              Discover the latest laptops, smartphones, tablets, and accessories. Premium quality tech products
              delivered across South Africa.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="text-base">
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-base bg-transparent">
                View Deals
              </Button>
            </div>
          </div>
          <div className="relative aspect-square lg:aspect-auto lg:h-[500px]">
            <Image
              src="/modern-tech-devices-laptop-smartphone-tablet-on-de.jpg"
              alt="Modern tech devices - laptops, smartphones, and tablets"
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
