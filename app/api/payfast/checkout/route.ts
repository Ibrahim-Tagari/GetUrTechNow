import { supabaseAdmin } from "@/lib/supabase/admin";
import { type NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// Server-side PayFast checkout endpoint
export async function POST(request: NextRequest) {
  try {
    const { items, total, userId } = await request.json();

    if (!items || !total || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify user is authenticated (check from session cookie)
    const accessToken = request.cookies.get("sb-access-token")?.value;
    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // DEBUG: log raw cookie header and parsed cookies
    const rawCookieHeader = request.headers.get("cookie") || "";
    console.log("[PayFast/Checkout] raw Cookie header:", rawCookieHeader);

    try {
      const cookieList = request.cookies.getAll();
      console.log("[PayFast/Checkout] request.cookies.getAll():", cookieList);
    } catch (err) {
      console.warn("[PayFast/Checkout] request.cookies.getAll() failed:", err);
    }

    // Log whether sb-access-token cookie is present
    console.log("[PayFast/Checkout] sb-access-token present:", !!accessToken);

    // Create transaction record in database
    const { data: transaction, error: transactionError } = await supabaseAdmin
      .from("orders")
      .insert([
        {
          user_id: userId,
          items,
          total_amount: total,
          status: "pending",
          payment_method: "payfast",
        },
      ])
      .select()
      .single();

    if (transactionError) {
      return NextResponse.json({ error: transactionError.message }, { status: 400 });
    }

    // Generate PayFast payment form data
    const paymentData = {
      merchant_id: process.env.PAYFAST_MERCHANT_ID,
      merchant_key: process.env.PAYFAST_MERCHANT_KEY,
      return_url: `${request.nextUrl.origin}/checkout/success`,
      cancel_url: `${request.nextUrl.origin}/checkout/cancel`,
      notify_url: `${request.nextUrl.origin}/api/payfast/notify`,
      name_first: "Customer",
      name_last: "Name",
      email_address: "customer@example.com",
      m_payment_id: transaction.id,
      amount: (total * 100).toFixed(0), // PayFast expects amount in cents
      item_name: "Tech Products",
      item_description: `Order ${transaction.id}`,
      custom_int1: userId,
      custom_str1: transaction.id,
    };

    // Generate signature
    const signatureString = Object.keys(paymentData)
      .sort()
      .map(
        (key) =>
          `${key}=${encodeURIComponent(paymentData[key as keyof typeof paymentData] || "")}`
      )
      .join("&");

    const signature = crypto.createHash("md5").update(signatureString).digest("hex");

    // Return minimal OK for now (extend to send paymentData if needed)
    return NextResponse.json({
      ok: true,
      paymentData,
      signature,
      transactionId: transaction.id,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
