import Image from "next/image";
import ThemeToggle from "./components/ThemeToggle";

const stats = [
  { label: "clinicians use Medscribd", value: "20K+" },
  { label: "health orgs trust Medscribd", value: "1,000+" },
  { label: "hours saved every day", value: "2+" },
];

const testimonials = [
  {
    quote:
      "Medscribd makes it possible for me to focus on my patients and still finish notes on time.",
    name: "Blake T. Thompson",
    title: "Family Medicine",
  },
  {
    quote:
      "After my first day, I couldn’t believe how much time I saved without sacrificing quality.",
    name: "Ali Roberts",
    title: "Urgent Care",
  },
  {
    quote:
      "It’s not just the time saved. The pressure during the day is finally gone.",
    name: "Vera Tarman, MD",
    title: "Addictions Medicine",
  },
];

const featureHighlights = [
  {
    title: "Smart visit prep",
    description:
      "Summaries and follow-ups from previous visits so you start ready.",
  },
  {
    title: "Note customization",
    description:
      "Templates that learn your format and adapt to your specialty.",
  },
  {
    title: "Magic edit",
    description:
      "Request sweeping changes in plain language and update the note instantly.",
  },
  {
    title: "Patient instructions",
    description:
      "Turn complex notes into clear patient guidance in seconds.",
  },
];

const workflow = [
  {
    title: "Before the visit",
    description:
      "Start with patient context, summaries, and follow-up reminders.",
  },
  {
    title: "During the visit",
    description:
      "Capture every detail with ambient listening and clinical transcription.",
  },
  {
    title: "After the visit",
    description:
      "Generate codes, letters, and patient instructions, then push to the EHR.",
  },
];

const specialties = [
  "Family Medicine",
  "Internal Medicine",
  "Cardiology",
  "Orthopedics",
  "Psychiatry",
  "Urgent Care",
  "Pediatrics",
  "OB-GYN",
];

const faqs = [
  {
    question: "Is Medscribd secure and compliant?",
    answer:
      "Yes. Medscribd is built for HIPAA workflows with encryption, audit logs, and secure storage.",
  },
  {
    question: "Does Medscribd work with my EHR?",
    answer:
      "Copy/paste into any EHR or use our push workflow for browser-based systems.",
  },
  {
    question: "How accurate are the notes?",
    answer:
      "Clinical terminology is preserved, filler is removed, and every note stays editable.",
  },
];

export default function LandingPage() {
  return (
    <main className="medscribe-ui min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-screen-xl px-6 py-8">
        <nav className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
          <div className="flex items-center gap-3">
            <Image
              src="/medscribd-logo.png"
              alt="MedScribd logo"
              width={180}
              height={44}
              className="h-8 w-auto"
              priority
            />
            <span className="hidden text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground sm:inline">
              AI medical scribe
            </span>
          </div>
          <div className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <a href="#features" className="transition-colors hover:text-foreground">
              Features
            </a>
            <a href="#workflow" className="transition-colors hover:text-foreground">
              Workflow
            </a>
            <a href="#specialties" className="transition-colors hover:text-foreground">
              Specialties
            </a>
            <a href="#faq" className="transition-colors hover:text-foreground">
              FAQ
            </a>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a
              href="/agent"
              className="hidden items-center rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 sm:inline-flex"
            >
              Launch demo
            </a>
            <a
              href="mailto:hello@medscribd.com"
              className="inline-flex items-center rounded-full gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition-shadow hover:shadow-elevated"
            >
              Request a demo
            </a>
          </div>
        </nav>

        <section className="mt-14 grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              Purpose-built AI medical scribe
            </div>
            <h1 className="mt-6 font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Let’s take documentation off your to-do list.
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              Medscribd delivers accurate clinical notes, effortless workflow, and real support — so you can finish your day on time.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/agent"
                className="inline-flex items-center rounded-full gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-shadow hover:shadow-elevated"
              >
                Try the live agent
              </a>
              <a
                href="#features"
                className="inline-flex items-center rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/40"
              >
                See how it works
              </a>
            </div>
            <div className="mt-10 grid gap-6 text-sm text-muted-foreground sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-border bg-card p-4 shadow-card">
                  <div className="text-xl font-semibold text-foreground">{stat.value}</div>
                  <div>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-10 -right-6 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
            <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                  Live note
                </span>
                <span className="rounded-full border border-success/20 bg-success/10 px-3 py-1 font-semibold text-success">
                  Draft
                </span>
              </div>
              <div className="mt-6 space-y-5 text-sm">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Chief Complaint
                  </div>
                  <div className="mt-2 text-foreground">
                    Persistent cough and low-grade fever for 3 days.
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    History of Present Illness
                  </div>
                  <div className="mt-2 text-foreground">
                    Reports dry cough, fatigue, mild chills. Denies shortness of breath.
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Assessment
                  </div>
                  <div className="mt-2 text-foreground">
                    Viral upper respiratory infection. No red flag symptoms noted.
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Plan
                  </div>
                  <div className="mt-2 text-foreground">
                    Supportive care, fluids, rest, follow-up if symptoms worsen.
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                <span className="text-xs text-muted-foreground">
                  Listening and updating the note
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section id="features" className="border-t border-border">
        <div className="mx-auto w-full max-w-screen-xl px-6 py-16">
          <div className="grid items-start gap-10 md:grid-cols-[0.9fr_1.1fr]">
            <div>
              <h2 className="font-display text-3xl font-semibold">Our most-loved features.</h2>
              <p className="mt-4 text-muted-foreground">
                Medscribd is built for clinicians — every feature is designed to reduce charting friction.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {featureHighlights.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-border bg-card p-5 shadow-card"
                >
                  <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="workflow" className="border-t border-border">
        <div className="mx-auto w-full max-w-screen-xl px-6 py-16">
          <div className="flex flex-col items-start gap-10 lg:flex-row">
            <div className="lg:w-1/3">
              <h2 className="font-display text-3xl font-semibold">Off-the-charts simplicity.</h2>
              <p className="mt-4 text-muted-foreground">
                Medscribd supports you through every step of the visit.
              </p>
            </div>
            <div className="flex-1 space-y-5">
              {workflow.map((step, index) => (
                <div
                  key={step.title}
                  className="flex items-start gap-4 rounded-2xl border border-border bg-muted/20 p-5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-primary text-sm font-semibold text-primary-foreground shadow-soft">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="specialties" className="border-t border-border">
        <div className="mx-auto w-full max-w-screen-xl px-6 py-16">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <h2 className="font-display text-3xl font-semibold">Built for every specialty.</h2>
              <p className="mt-4 text-muted-foreground">
                Specialty-aware templates deliver the right structure for every visit type.
              </p>
              <div className="mt-6 rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground shadow-card">
                <div className="text-foreground font-semibold">Template highlights</div>
                <ul className="mt-3 space-y-2">
                  <li>Primary Care: HPI + ROS + plan structure</li>
                  <li>Cardiology: cardiac symptoms + diagnostics focus</li>
                  <li>Orthopedics: injury mechanism + imaging + MSK exam</li>
                  <li>Psychiatry: mental status + safety assessment</li>
                </ul>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {specialties.map((specialty) => (
                <div
                  key={specialty}
                  className="rounded-full border border-border bg-muted/30 px-4 py-2 text-xs text-muted-foreground"
                >
                  {specialty}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto w-full max-w-screen-xl px-6 py-16">
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground shadow-card"
              >
                <div className="text-foreground font-semibold">“{testimonial.quote}”</div>
                <div className="mt-4 text-xs text-muted-foreground">
                  {testimonial.name} · {testimonial.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="border-t border-border">
        <div className="mx-auto w-full max-w-screen-xl px-6 py-16">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <h2 className="font-display text-3xl font-semibold">Common questions.</h2>
              <p className="mt-4 text-muted-foreground">
                A quick overview of how Medscribd supports your documentation flow.
              </p>
            </div>
            <div className="space-y-4">
              {faqs.map((item) => (
                <div
                  key={item.question}
                  className="rounded-2xl border border-border bg-card p-5 shadow-card"
                >
                  <div className="text-foreground font-semibold">{item.question}</div>
                  <p className="mt-2 text-sm text-muted-foreground">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto w-full max-w-screen-xl px-6 py-16">
          <div className="rounded-3xl border border-border bg-muted/20 px-8 py-12 text-center shadow-card">
            <h2 className="font-display text-3xl font-semibold">Ready to try Medscribd?</h2>
            <p className="mt-3 text-muted-foreground">
              Launch the live demo or request a walkthrough for your clinic.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="/agent"
                className="inline-flex items-center rounded-full gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-shadow hover:shadow-elevated"
              >
                Launch demo
              </a>
              <a
                href="mailto:hello@medscribd.com"
                className="inline-flex items-center rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/40"
              >
                Request a demo
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-screen-xl flex-col gap-6 px-6 py-10 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <div className="font-display text-foreground">MedScribd</div>
          <div className="flex flex-wrap gap-4">
            <a href="/agent" className="transition-colors hover:text-foreground">
              Live demo
            </a>
            <a href="mailto:hello@medscribd.com" className="transition-colors hover:text-foreground">
              Contact
            </a>
            <a href="#features" className="transition-colors hover:text-foreground">
              Features
            </a>
          </div>
          <div>© 2026 MedScribd. All rights reserved.</div>
        </div>
      </footer>
    </main>
  );
}
