/* import { createClient } from "@/lib/supabase/client"
import ProductGrid from "@/components/product-grid"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default async function DealsPage() {
  const supabase = createClient()

  const { data: allProducts, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching deals:", error)
    return (
      <>
        <SiteHeader />
        <main className="container mx-auto px-4 py-12">
          <h1 className="text-2xl font-bold mb-4">Error loading deals</h1>
          <p className="text-red-500">{error.message}</p>
        </main>
        <SiteFooter />
      </>
    )
  }

  const dealProducts = (allProducts || []).filter((p: any) => {
    const categoryMatch =
      typeof p.category === "string" &&
      p.category.toLowerCase().includes("deal")
    const discountMatch =
      p.original_price && Number(p.original_price) > Number(p.price ?? 0)
    return categoryMatch || discountMatch
  })

  return (
    <>
      <SiteHeader />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-6xl font-extrabold tracking-tight mb-8">
          Special Deals
        </h1>

        <ProductGrid products={dealProducts} columns={3} />
      </main>
      <SiteFooter />
    </>
  )
} */


// app/deals/page.tsx
import { createClient } from "@/lib/supabase/client";
import ProductGrid from "@/components/product-grid";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default async function DealsPage() {
  const supabase = createClient();

  const { data: allProducts, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching deals:", error);
    return (
      <>
        <SiteHeader />
        <main className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-6">Special Deals</h1>
          <p className="text-sm text-red-400">There was an error loading deals.</p>
        </main>
        <SiteFooter />
      </>
    );
  }

  // Filter products that have a real discount
  const dealProducts = (allProducts ?? []).filter(
    (p: any) =>
      typeof p?.original_price === "number" &&
      p.original_price > 0 &&
      Number(p.original_price) > Number(p.price ?? 0)
  );

  return (
    <>
      <SiteHeader />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-6xl font-extrabold tracking-tight mb-8">Special Deals</h1>
        <ProductGrid products={dealProducts} columns={3} showPercent={true} />
      </main>
      <SiteFooter />
    </>
  );
}
