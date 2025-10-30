import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Instagram } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Image src="/logo.png" alt="GetUrTechNow Logo" width={160} height={53}  className="h-10 w-auto"  style={{ width: 'auto' }} />
            <p className="text-sm text-muted-foreground text-pretty leading-relaxed">
              Your trusted source for premium tech products in South Africa.
            </p>
            <div className="flex gap-3">
              <Link
                href="#"
                className="rounded-full bg-primary/10 p-2 transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Facebook className="h-4 w-4" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="#"
                className="rounded-full bg-primary/10 p-2 transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="#"
                className="rounded-full bg-primary/10 p-2 transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Instagram className="h-4 w-4" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-semibold mb-4">Shop</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/laptops" className="text-muted-foreground transition-colors hover:text-primary">
                  Laptops
                </Link>
              </li>
              <li>
                <Link href="/smartphones" className="text-muted-foreground transition-colors hover:text-primary">
                  Smartphones
                </Link>
              </li>
              <li>
                <Link href="/tablets" className="text-muted-foreground transition-colors hover:text-primary">
                  Tablets
                </Link>
              </li>
              <li>
                <Link href="/accessories" className="text-muted-foreground transition-colors hover:text-primary">
                  Accessories
                </Link>
              </li>
              <li>
                <Link href="/deals" className="text-muted-foreground transition-colors hover:text-primary">
                  Special Deals
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/contact" className="text-muted-foreground transition-colors hover:text-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-muted-foreground transition-colors hover:text-primary">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="text-muted-foreground transition-colors hover:text-primary">
                  Warranty
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground transition-colors hover:text-primary">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground transition-colors hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground transition-colors hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground transition-colors hover:text-primary">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} GetUrTechNow.co.za. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
