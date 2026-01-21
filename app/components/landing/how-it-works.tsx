import { ClipboardList, Mic, FileCheck } from "lucide-react"

const steps = [
  {
    icon: ClipboardList,
    title: "Before the Visit",
    description: "MedScribd automatically pulls patient history, recent labs, and medications. Your visit prep is done before you walk in.",
    number: "01",
  },
  {
    icon: Mic,
    title: "During the Visit",
    description: "Simply have your conversation. MedScribd listens and captures everything—chief complaint, history, exam findings, and plan.",
    number: "02",
  },
  {
    icon: FileCheck,
    title: "After the Visit",
    description: "Review your AI-generated note, make quick edits if needed, and send directly to your EHR. Documentation complete.",
    number: "03",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Three simple steps to transform your documentation workflow
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative rounded-2xl border border-border bg-card p-8 transition-shadow hover:shadow-lg"
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <span className="text-4xl font-bold text-muted-foreground/30">
                  {step.number}
                </span>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
              {index < steps.length - 1 && (
                <div className="absolute -right-4 top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background text-muted-foreground md:flex">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
