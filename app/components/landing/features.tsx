import { 
  Sparkles, 
  Settings2, 
  Wand2, 
  MessageSquare, 
  Lock, 
  Zap 
} from "lucide-react"

const features = [
  {
    icon: Sparkles,
    title: "Smart Visit Prep",
    description: "Automatically surfaces relevant patient history, medications, and recent results before every encounter.",
  },
  {
    icon: Settings2,
    title: "Note Customization",
    description: "Choose from multiple note templates—SOAP, H&P, Progress Notes—and customize to match your documentation style.",
  },
  {
    icon: Wand2,
    title: "Magic Edit",
    description: "Make natural language requests to modify your notes. Say 'add allergy to penicillin' and watch it update instantly.",
  },
  {
    icon: MessageSquare,
    title: "Patient Instructions",
    description: "Generate clear, patient-friendly after-visit summaries and care instructions automatically.",
  },
  {
    icon: Lock,
    title: "HIPAA Compliant",
    description: "Enterprise-grade security with SOC 2 Type II certification. Your patient data is always protected.",
  },
  {
    icon: Zap,
    title: "EHR Integration",
    description: "Seamless integration with Epic, Cerner, Athena, and 50+ other EHR systems. One-click export.",
  },
]

export function Features() {
  return (
    <section id="features" className="bg-muted/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need to document smarter
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Powerful features designed by clinicians, for clinicians
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
