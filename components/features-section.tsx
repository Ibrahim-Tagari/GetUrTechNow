import { Shield, Headphones, CreditCard } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Secure Payment",
    description: "Safe and encrypted transactions",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Dedicated customer service team",
  },
  {
    icon: CreditCard,
    title: "Easy Returns",
    description: "30-day money-back guarantee",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-16 md:py-24 border-y">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div key={feature.title} className="flex flex-col items-center text-center gap-4">
                <div className="rounded-full bg-primary/10 p-4">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground text-pretty leading-relaxed">{feature.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
