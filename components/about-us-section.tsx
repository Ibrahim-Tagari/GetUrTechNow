import { Award, Shield, Truck, Headphones } from "lucide-react"

export function AboutUsSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">About GetUrTechNow</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Your trusted partner for premium technology products in South Africa. We're committed to bringing you the
            latest and greatest tech at competitive prices, backed by exceptional customer service.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
              <Award className="h-8 w-8" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Premium Quality</h3>
            <p className="text-sm text-muted-foreground">
              Only authentic products from authorized distributors and manufacturers
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
              <Shield className="h-8 w-8" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Secure Shopping</h3>
            <p className="text-sm text-muted-foreground">
              Your data is protected with industry-standard encryption and security
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
              <Truck className="h-8 w-8" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Fast Delivery</h3>
            <p className="text-sm text-muted-foreground">
              Quick and reliable shipping across South Africa with tracking
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
              <Headphones className="h-8 w-8" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Expert Support</h3>
            <p className="text-sm text-muted-foreground">
              Dedicated customer service team ready to assist you with any questions
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
