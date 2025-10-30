"use client"

import type React from "react"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin, Clock } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
    })

    // Reset form
    setName("")
    setEmail("")
    setSubject("")
    setMessage("")
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-muted/30 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
              <p className="text-lg text-muted-foreground">
                Have a question or need assistance? We're here to help! Reach out to our team and we'll get back to you
                as soon as possible.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information & Form */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Contact Information */}
              <div className="lg:col-span-1 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Get in Touch</CardTitle>
                    <CardDescription>We're available to assist you</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium mb-1">Email</p>
                        <a
                          href="mailto:support@geturtechnow.co.za"
                          className="text-sm text-muted-foreground hover:text-primary"
                        >
                          support@geturtechnow.co.za
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium mb-1">Phone</p>
                        <a href="tel:+27123456789" className="text-sm text-muted-foreground hover:text-primary">
                          +27 11 025 1494/5
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium mb-1">Address</p>
                        <p className="text-sm text-muted-foreground">
                          123 Tech Street
                          <br />
                          Johannesburg, 2000
                          <br />
                          South Africa
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium mb-1">Business Hours</p>
                        <p className="text-sm text-muted-foreground">
                          Monday - Friday: 8:00 AM - 5:00 PM
                          <br />
                          Saturday: Closed
                          <br />
                          Sunday: Closed
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Send us a Message</CardTitle>
                    <CardDescription>Fill out the form below and we'll respond within 24 hours</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          placeholder="How can we help you?"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          placeholder="Tell us more about your inquiry..."
                          rows={6}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          required
                        />
                      </div>

                      <Button type="submit" size="lg" className="w-full md:w-auto" disabled={loading}>
                        {loading ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Returns Section */}
                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle>Product Returns</CardTitle>
                    <CardDescription>Log a return request for your products</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="returnName">Full Name</Label>
                          <Input id="returnName" placeholder="John Doe" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="returnEmail">Email Address</Label>
                          <Input id="returnEmail" type="email" placeholder="you@example.com" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="orderNumber">Order Number</Label>
                        <Input id="orderNumber" placeholder="e.g., #ORD-1234" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="productName">Product Name</Label>
                        <Input id="productName" placeholder="e.g., MacBook Pro 16-inch" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="returnReason">Reason for Return</Label>
                        <Textarea
                          id="returnReason"
                          placeholder="Please explain why you want to return this product..."
                          rows={4}
                        />
                      </div>

                      <Button type="submit" size="lg" className="w-full md:w-auto">
                        Submit Return Request
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
