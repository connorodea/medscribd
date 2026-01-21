import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Clock, FileText, ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 pb-20 pt-16 sm:pb-32 sm:pt-24">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column - Copy */}
          <div className="text-center lg:text-left">
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm">
              Trusted by 20,000+ clinicians
            </Badge>
            
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Let&apos;s take documentation off your to‑do list.
            </h1>
            
            <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Accurate clinical notes, effortless workflow, real support. 
              MedScribd listens to your patient encounters and generates 
              comprehensive documentation in seconds.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Button size="lg" asChild className="gap-2">
                <Link href="/agent">
                  Try the live agent
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#how-it-works">See how it works</Link>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 lg:justify-start">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-5 w-5 text-primary" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-5 w-5 text-primary" />
                <span>2+ Hours Saved Daily</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-5 w-5 text-primary" />
                <span>99% Accuracy</span>
              </div>
            </div>
          </div>

          {/* Right Column - Live Preview Card */}
          <div className="relative lg:ml-auto">
            <div className="relative mx-auto max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl shadow-primary/10">
              {/* Card Header */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                    <div className="h-3 w-3 animate-pulse rounded-full bg-success" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Live Session</p>
                    <p className="text-xs text-muted-foreground">Recording in progress</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">SOAP Note</Badge>
              </div>

              {/* Note Preview */}
              <div className="space-y-4 rounded-lg bg-muted/50 p-4">
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary">Subjective</p>
                  <p className="text-sm text-foreground">
                    Patient presents with intermittent chest pain for 3 days. 
                    Pain is described as sharp, non-radiating...
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary">Objective</p>
                  <p className="text-sm text-foreground">
                    BP 128/82, HR 76 bpm, RR 16. Lungs clear to auscultation. 
                    No chest wall tenderness...
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                    R07.9
                  </span>
                  <span className="text-xs text-muted-foreground">Chest pain, unspecified</span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>Auto-saving to EHR...</span>
                <span>98% confidence</span>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -right-4 -top-4 rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
              <p className="text-xs font-medium text-foreground">ICD-10 Suggested</p>
              <p className="text-xs text-muted-foreground">3 codes detected</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
