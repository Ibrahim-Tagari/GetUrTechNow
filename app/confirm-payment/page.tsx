"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import Image from "next/image";

export default function ConfirmPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  async function handleConfirmPayment() {
    // TEMPORARY BYPASS (preserves gateway code below)
    // When user clicks Confirm Payment, send them to the "payment coming soon" page.
    // To re-enable the real gateway, remove these three lines.
    setLoading(true);
    router.push("/payment-coming-soon");
    setLoading(false);
    return;

    // --- Original payment gateway code preserved below ---
    try {
      const res = await fetch("/api/payfast/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          total: totalPrice,
          userId: user?.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Checkout failed");

      // Redirect user to PayFast gateway
      const query = new URLSearchParams(data.paymentData).toString();
      window.location.href = `https://www.payfast.co.za/eng/process?${query}`;
      clearCart();
    } catch (err: any) {
      console.error("Checkout failed:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl w-full mx-auto">
        <CardHeader>
          <CardTitle>Confirm Your Payment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            {items.map((item: any) => (
              <div key={item.id} className="flex gap-3 border-b pb-3 mb-3">
                <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                  <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  <p className="text-sm font-semibold">R {(item.price * item.quantity).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>R {totalPrice.toLocaleString()}</span>
          </div>

          <Button onClick={handleConfirmPayment} disabled={loading} className="w-full" size="lg">
            {loading ? "Redirecting..." : "Confirm Payment"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
