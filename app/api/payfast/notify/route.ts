import { supabaseAdmin } from "@/lib/supabase/admin"
import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

// PayFast ITN (Instant Transaction Notification) endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const params = new URLSearchParams(body)
    const data = Object.fromEntries(params)

    // Verify signature
    const signature = data.signature
    delete data.signature

    const signatureString = Object.keys(data)
      .sort()
      .map((key) => `${key}=${encodeURIComponent(data[key])}`)
      .join("&")

    const expectedSignature = crypto.createHash("md5").update(signatureString).digest("hex")

    if (signature !== expectedSignature) {
      console.error("[v0] PayFast signature verification failed")
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    // Verify with PayFast
    const verifyUrl =
      process.env.NODE_ENV === "production"
        ? "https://www.payfast.co.za/eng/query/validate"
        : "https://sandbox.payfast.co.za/eng/query/validate"

    const verifyResponse = await fetch(verifyUrl, {
      method: "POST",
      body: body,
    })

    const verifyText = await verifyResponse.text()

    if (verifyText !== "VALID") {
      console.error("[v0] PayFast verification failed:", verifyText)
      return NextResponse.json({ error: "Verification failed" }, { status: 400 })
    }

    // Update transaction status
    const transactionId = data.custom_str1
    const paymentStatus = data.payment_status

    let orderStatus = "pending"
    if (paymentStatus === "COMPLETE") {
      orderStatus = "paid"
    } else if (paymentStatus === "FAILED") {
      orderStatus = "failed"
    }

    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update({
        status: orderStatus,
        payment_reference: data.pf_payment_id,
      })
      .eq("id", transactionId)

    if (updateError) {
      console.error("[v0] Failed to update order:", updateError)
      return NextResponse.json({ error: "Failed to update order" }, { status: 400 })
    }

    // Log ITN (redact PII)
    console.log(`[v0] PayFast ITN processed: Transaction ${transactionId}, Status: ${orderStatus}`)

    return NextResponse.json({ message: "ITN processed successfully" })
  } catch (error) {
    console.error("[v0] ITN processing error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
