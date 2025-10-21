import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Cpu, HardDrive, Zap } from "lucide-react"

const upgradeOptions = [
  {
    id: 1,
    title: "RAM Upgrades",
    description: "Boost your system performance with additional memory",
    icon: Cpu,
    link: "/accessories?filter=ram",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    title: "SSD Upgrades",
    description: "Increase storage capacity and speed with faster drives",
    icon: HardDrive,
    link: "/accessories?filter=ssd",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    id: 3,
    title: "Performance Boost",
    description: "Maximize your device potential with premium upgrades",
    icon: Zap,
    link: "/accessories?filter=performance",
    gradient: "from-orange-500 to-red-500",
  },
]

export function UpgradeCards() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl mb-4">Upgrade Your Tech</h2>
          <p className="text-muted-foreground text-lg text-pretty leading-relaxed">
            Customize your devices with our premium upgrade options
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {upgradeOptions.map((option) => {
            const Icon = option.icon
            return (
              <Link key={option.id} href={option.link}>
                <Card className="group overflow-hidden transition-all hover:shadow-lg cursor-pointer h-full">
                  <CardContent className="p-0">
                    <div className={`bg-gradient-to-br ${option.gradient} p-8 text-white`}>
                      <Icon className="h-12 w-12 mb-4" />
                      <h3 className="font-bold text-2xl mb-2 text-balance">{option.title}</h3>
                      <p className="text-white/90 text-pretty leading-relaxed">{option.description}</p>
                    </div>
                    <div className="p-6 bg-card">
                      <Button
                        variant="ghost"
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      >
                        Explore Options
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
