export const revalidate = 0;

export default function PaymentComingSoon() {
  return (
    <main className="container mx-auto px-4 py-20">
      <div className="grid gap-8 lg:grid-cols-2 items-center">
        <div>
          <h1 className="text-6xl font-extrabold tracking-tight">
            Payment feature <span className="text-primary">coming soon</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            We&apos;re still working on integrating the payment gateway. To complete your purchase for now, please contact our sales team:
          </p>
          <div className="mt-6 space-y-2 text-sm">
            <div>Email: <a className="underline" href="mailto:sales@geturtechnow.co.za">sales@geturtechnow.co.za</a></div>
            <div>Phone: <a className="underline" href="tel:+27123456789">+27 11 025 1494/5</a></div>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
             <span className="text-primary">Preferrably</span>Give us a call on: 011 025 1494.
          </p>
        </div>

        <div className="hidden lg:block">
          <div className="rounded-lg overflow-hidden shadow-lg">
         <img src="/modern-laptop-computer.jpg" alt="Payment coming soon" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </main>
  )
}
