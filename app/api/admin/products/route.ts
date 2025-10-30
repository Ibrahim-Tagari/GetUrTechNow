// app/api/admin/products/route.ts
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

// ---------------------------------------------------------------------------
// ✅ Helpers
// ---------------------------------------------------------------------------

async function isAdminRequest() {
  try {
    const server = await createServerSupabaseClient();
    const {
      data: { user },
    } = await server.auth.getUser();

    if (!user && process.env.NODE_ENV === "development") return true;
    if (!user) return false;

    const email = (user.email || "").toLowerCase();
    const admins = (process.env.ADMIN_EMAIL || "")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    return admins.includes(email);
  } catch {
    return false;
  }
}

async function uploadFile(file: File) {
  const filename = `${Date.now()}-${(file as any).name}`;
  const { error } = await supabaseAdmin.storage
    .from("product-images")
    .upload(filename, file as any, { upsert: false } as any);
  if (error) throw error;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${filename}`;
}

// ---------------------------------------------------------------------------
// ✅ GET
// ---------------------------------------------------------------------------

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// ✅ POST (create product)
// ---------------------------------------------------------------------------

export async function POST(req: Request) {
  if (!(await isAdminRequest()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const form = await req.formData();
    const name = (form.get("name") || form.get("title") || "").toString().trim();
    if (!name)
      return NextResponse.json({ error: "Product name required" }, { status: 400 });

    const category = (form.get("category")?.toString() || "").trim();
    const price = Number(form.get("price"));
    if (Number.isNaN(price))
      return NextResponse.json({ error: "Valid price required" }, { status: 400 });

    const product: any = {
      name,
      title: name,
      category,
      price,
      brand: form.get("brand")?.toString() || "",
      description: form.get("description")?.toString() || "",
      stock: form.get("stock") ? Number(form.get("stock")) : 0,
    };

    // Deals require a valid original_price
    if (category.toLowerCase() === "deals") {
      const op = form.get("originalPrice");
      const originalPrice = op ? Number(op) : NaN;
      if (Number.isNaN(originalPrice) || originalPrice <= price) {
        return NextResponse.json(
          { error: "Deals require a 'Was' price higher than the 'Now' price." },
          { status: 400 }
        );
      }
      product.original_price = originalPrice;
    }

    const imageFile = form.get("image") as File | null;
    if (imageFile && imageFile.size > 0) {
      try {
        const url = await uploadFile(imageFile);
        product.image = url;
        product.image_url = url;
      } catch (err) {
        console.warn("Image upload failed:", err);
      }
    }

    const { data, error } = await supabaseAdmin.from("products").insert([product]);
    if (error) {
      console.error("INSERT product error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("POST /api/admin/products error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// ✅ PUT (update)
// ---------------------------------------------------------------------------

export async function PUT(req: Request) {
  if (!(await isAdminRequest()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  try {
    const form = await req.formData();
    const updates: any = {};

    for (const key of [
      "name",
      "brand",
      "description",
      "category",
      "stock",
      "price",
    ]) {
      if (form.has(key)) {
        const val = form.get(key);
        if (val !== null && val !== undefined && val !== "") {
          updates[key] = key === "price" || key === "stock" ? Number(val) : val;
        }
      }
    }

    const cat =
      updates.category || form.get("category")?.toString() || "Laptops";
    if (cat.toLowerCase() === "deals" && form.has("originalPrice")) {
      const op = form.get("originalPrice");
      const originalPrice = op ? Number(op) : NaN;
      if (!Number.isNaN(originalPrice) && originalPrice > 0) {
        updates.original_price = originalPrice;
      }
    }

    const imageFile = form.get("image") as File | null;
    if (imageFile && imageFile.size > 0) {
      try {
        const url = await uploadFile(imageFile);
        updates.image = url;
        updates.image_url = url;
      } catch (err) {
        console.warn("Image upload failed:", err);
      }
    }

    const { error } = await supabaseAdmin
      .from("products")
      .update(updates)
      .eq("id", id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// ✅ DELETE
// ---------------------------------------------------------------------------

export async function DELETE(req: Request) {
  if (!(await isAdminRequest()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  try {
    const { data: productData } = await supabaseAdmin
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    await supabaseAdmin.from("products").delete().eq("id", id);

    if (productData?.image_url) {
      const filename = productData.image_url.split("/").pop();
      if (filename)
        await supabaseAdmin.storage
          .from("product-images")
          .remove([filename])
          .catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
