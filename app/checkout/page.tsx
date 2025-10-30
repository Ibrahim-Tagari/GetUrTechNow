"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/AuthContext";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  // Redirect to home if cart is empty
  useEffect(() => {
    if (items.length === 0) router.push("/");
  }, [items, router]);

  if (items.length === 0) return null;

  // Safely split name
  const [firstName = "", lastName = ""] = user?.name?.split(" ") ?? [];

  // ---------- helper to validate checkout form ----------
  function isFormValid() {
    const required = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "city",
      "province",
      "postal",
    ];
    for (const id of required) {
      const el = document.getElementById(id) as HTMLInputElement | null;
      if (!el || !el.value.trim()) return false;
    }
    return true;
  }

  async function handlePlaceOrder() {
    if (!isFormValid()) {
      toast({
        title: "Incomplete form",
        description: "Please fill in all required fields before continuing.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      router.push("/confirm-payment"); // go to confirm-payment page
    } finally {
      setSubmitting(false);
    }
  }

  // ---------- UI ----------
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 py-12 bg-muted/30">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">Checkout</h1>
              <p className="text-muted-foreground">Complete your order</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              {/* Left column */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Delivery Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" defaultValue={firstName} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" defaultValue={lastName} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue={user?.email ?? ""} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" placeholder="+27 XX XXX XXXX" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address</Label>
                      <Input id="address" placeholder="123 Main Street" />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" placeholder="Johannesburg" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="province">Province</Label>
                        <Input id="province" placeholder="Gauteng" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postal">Postal Code</Label>
                        <Input id="postal" placeholder="2000" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right column */}
              <div className="lg:col-span-1">
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={item.id} className="flex gap-3">
                          <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium line-clamp-2">{item.name}</p>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                            <p className="text-sm font-semibold text-primary">
                              R {(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>R {totalPrice.toLocaleString()}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span>R {totalPrice.toLocaleString()}</span>
                      </div>
                    </div>

                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handlePlaceOrder}
                      disabled={submitting}
                    >
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      {submitting ? "Processing..." : "Place Order"}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      By placing your order, you agree to our Terms of Service and Privacy Policy.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    </ProtectedRoute>
  );
}
