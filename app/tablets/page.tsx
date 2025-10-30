/* // app/tablets/page.tsx
import { createClient } from "@/lib/supabase/client"
import ProductGrid from "@/components/product-grid"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default async function TabletsPage() {
  const supabase = createClient()
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", "Tablets")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching tablets:", error)
    return (
      <>
        <SiteHeader />
        <main className="container mx-auto px-4 py-12">
          <h1 className="text-2xl font-bold mb-4">Error loading tablets</h1>
          <p className="text-red-500">{error.message}</p>
        </main>
        <SiteFooter />
      </>
    )
  }

  const mapped = (products || []).map((p: any) => ({
    id: p.id,
    name: p.name,
    price: Number(p.price ?? 0),
    originalPrice: p.original_price ? Number(p.original_price) : undefined,
    image: p.image_url ?? "",
    rating: p.rating ?? 4.5,
    reviews: p.reviews ?? 0,
    inStock: p.in_stock ?? true,
    badge: p.badge ?? undefined,
  }))

  return (
    <>
      <SiteHeader />
      <main className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-2 items-center mb-8">
          <div>
            <h1 className="text-6xl font-extrabold tracking-tight">
              Tablets
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Lightweight, portable, and powerful tablets for all your needs.
            </p>
          </div>
          <div className="hidden lg:block">
          </div>
        </div>

        {mapped.length ? (
          <ProductGrid products={mapped} />
        ) : (
          <p>No tablets available at this time.</p>
        )}
      </main>
      <SiteFooter />
    </>
  )
}
*/



// app/tablets/page.tsx
import { createClient } from "@/lib/supabase/client";
import ProductGrid from "@/components/product-grid";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default async function TabletsPage() {
  const supabase = createClient();
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", "Tablets")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching tablets:", error);
    return (
      <>
        <SiteHeader />
        <main className="container mx-auto px-4 py-12">
          <h1 className="text-2xl font-bold mb-4">Error loading tablets</h1>
          <p className="text-red-500">{error.message}</p>
        </main>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-2 items-center mb-8">
          <div>
            <h1 className="text-6xl font-extrabold tracking-tight">Tablets</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Lightweight, portable, and powerful tablets for all your needs.
            </p>
          </div>
        </div>

        {products?.length ? (
          <ProductGrid products={products} columns={3} showPercent={false} />
        ) : (
          <p>No tablets available at this time.</p>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
