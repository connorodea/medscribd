import Image from "next/image";
import ThemeToggle from "./components/ThemeToggle";

const features = [
  {
    title: "Ambient capture",
    description:
      "Record the visit in real time and keep your attention on the patient, not the keyboard.",
  },
  {
    title: "Auto SOAP notes",
    description:
      "Generate structured notes instantly with clear Subjective, Objective, Assessment, and Plan.",
  },
  {
    title: "ICD-10 + CPT suggestions",
    description:
      "Get draft billing codes with confidence tags, then confirm with one click.",
  },
  {
    title: "Specialty templates",
    description:
      "Pick a specialty and Medscribd adapts the note flow to your clinic style.",
  },
];

const workflow = [
  {
    title: "Start the encounter",
    description: "Choose a template or say “Clinical Note” to begin capturing the visit.",
  },
  {
    title: "Speak naturally",
    description: "Medscribd listens, transcribes, and organizes details as you go.",
  },
  {
    title: "Review + approve",
    description: "Scan the note, validate codes, and sign off in seconds.",
  },
];

const specialties = [
  "Primary Care",
  "Cardiology",
  "Orthopedics",
  "Psychiatry",
  "Physical Therapy",
  "Urgent Care",
  "Pediatrics",
  "Women's Health",
];

const faqs = [
  {
    question: "Does Medscribd work for different specialties?",
    answer:
      "Yes. Select a template and the workflow adapts to the encounter type and clinical focus.",
  },
  {
    question: "How are codes generated?",
    answer:
      "ICD-10 and CPT suggestions are derived from the transcript and SOAP note, with confidence labels for quick review.",
  },
  {
    question: "Can I control what gets saved?",
    answer:
      "Always. Medscribd keeps the draft visible so you can edit and approve before finalizing.",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen text-brand-cloud">
      <div className="max-w-screen-xl mx-auto px-6 py-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/medscribd-logo.png"
              alt="medscribd logo"
              width={180}
              height={44}
              className="h-8 w-auto"
              priority
            />
            <span className="hidden sm:inline text-xs uppercase tracking-[0.3em] text-brand-mist/60">
              AI medical scribe
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-brand-mist/70">
            <a href="#features" className="hover:text-brand-cloud transition-colors">
              Features
            </a>
            <a href="#workflow" className="hover:text-brand-cloud transition-colors">
              Workflow
            </a>
            <a href="#specialties" className="hover:text-brand-cloud transition-colors">
              Specialties
            </a>
            <a href="#faq" className="hover:text-brand-cloud transition-colors">
              FAQ
            </a>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a
              href="/agent"
              className="hidden sm:inline-flex items-center rounded-full border border-brand-mist/30 px-4 py-2 text-sm text-brand-cloud hover:border-brand-mist/60 transition-colors"
            >
              Launch demo
            </a>
            <a
              href="mailto:hello@medscribd.com"
              className="inline-flex items-center rounded-full bg-brand-amber px-4 py-2 text-sm font-semibold text-brand-ink shadow-sm hover:bg-[#f2a94a] transition-colors"
            >
              Request a demo
            </a>
          </div>
        </nav>

        <section className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 mt-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.3em] text-brand-mist/70">
              Built for clinician happiness
            </div>
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-semibold text-brand-cloud font-sora leading-tight">
              The AI medical scribe that keeps you in the visit.
            </h1>
            <p className="mt-5 text-lg text-brand-mist/70 max-w-xl">
              Medscribd captures the conversation, drafts the SOAP note, and suggests billing codes so you can finish charting faster.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/agent"
                className="inline-flex items-center rounded-full bg-brand-teal px-6 py-3 text-sm font-semibold text-brand-cloud shadow-lg shadow-brand-teal/20 hover:bg-[#0b4c4c] transition-colors"
              >
                Try the live agent
              </a>
              <a
                href="#features"
                className="inline-flex items-center rounded-full border border-brand-mist/30 px-6 py-3 text-sm font-semibold text-brand-cloud hover:border-brand-mist/70 transition-colors"
              >
                See how it works
              </a>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-3 text-sm text-brand-mist/60">
              <div>
                <div className="text-brand-cloud text-lg font-semibold">Less after-hours</div>
                <div>Reduce night charting</div>
              </div>
              <div>
                <div className="text-brand-cloud text-lg font-semibold">Ambient + accurate</div>
                <div>Clinical detail preserved</div>
              </div>
              <div>
                <div className="text-brand-cloud text-lg font-semibold">Codes included</div>
                <div>Draft ICD/CPT review</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-8 -right-6 h-32 w-32 rounded-full bg-brand-amber/30 blur-3xl" />
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.3em] text-brand-mist/60">
                  Live note
                </span>
                <span className="text-xs font-semibold text-brand-amber">Draft</span>
              </div>
              <div className="mt-6 space-y-5 text-sm">
                <div>
                  <div className="text-brand-mist/60">Chief Complaint</div>
                  <div className="text-brand-cloud">
                    Persistent cough and low-grade fever for 3 days.
                  </div>
                </div>
                <div>
                  <div className="text-brand-mist/60">History of Present Illness</div>
                  <div className="text-brand-cloud">
                    Reports dry cough, fatigue, mild chills. Denies shortness of breath.
                  </div>
                </div>
                <div>
                  <div className="text-brand-mist/60">Assessment</div>
                  <div className="text-brand-cloud">
                    Viral upper respiratory infection. No red flag symptoms noted.
                  </div>
                </div>
                <div>
                  <div className="text-brand-mist/60">Plan</div>
                  <div className="text-brand-cloud">
                    Supportive care, fluids, rest, follow-up if symptoms worsen.
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-brand-amber animate-pulse" />
                <span className="text-xs text-brand-mist/70">
                  Listening and updating the note
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section id="features" className="mt-20 border-t border-white/5">
        <div className="max-w-screen-xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-[0.9fr_1.1fr] gap-10 items-start">
            <div>
              <h2 className="text-3xl font-semibold text-brand-cloud font-sora">
                Everything you need to finish notes fast.
              </h2>
              <p className="mt-4 text-brand-mist/70">
                Medscribd combines real-time transcription, structured note generation, and coding suggestions in one flow.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <h3 className="text-lg font-semibold text-brand-cloud">{item.title}</h3>
                  <p className="mt-2 text-sm text-brand-mist/70">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="workflow" className="border-t border-white/5">
        <div className="max-w-screen-xl mx-auto px-6 py-16">
          <div className="flex flex-col lg:flex-row items-start gap-10">
            <div className="lg:w-1/3">
              <h2 className="text-3xl font-semibold text-brand-cloud font-sora">
                A familiar workflow, automated.
              </h2>
              <p className="mt-4 text-brand-mist/70">
                Capture the visit, generate the note, and confirm billing codes without extra clicks.
              </p>
            </div>
            <div className="flex-1 grid gap-5">
              {workflow.map((step, index) => (
                <div
                  key={step.title}
                  className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-teal text-brand-cloud font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-brand-cloud">{step.title}</h3>
                    <p className="mt-1 text-sm text-brand-mist/70">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="specialties" className="border-t border-white/5">
        <div className="max-w-screen-xl mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10">
            <div>
              <h2 className="text-3xl font-semibold text-brand-cloud font-sora">
                Built for busy specialties.
              </h2>
              <p className="mt-4 text-brand-mist/70">
                Choose the template that matches your practice and generate notes with the right clinical focus.
              </p>
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-brand-mist/70">
                <div className="text-brand-cloud font-semibold">Template highlights</div>
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
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-brand-mist/80"
                >
                  {specialty}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="border-t border-white/5">
        <div className="max-w-screen-xl mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10">
            <div>
              <h2 className="text-3xl font-semibold text-brand-cloud font-sora">
                Common questions.
              </h2>
              <p className="mt-4 text-brand-mist/70">
                A quick overview of how Medscribd supports your documentation flow.
              </p>
            </div>
            <div className="space-y-4">
              {faqs.map((item) => (
                <div
                  key={item.question}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <div className="text-brand-cloud font-semibold">{item.question}</div>
                  <p className="mt-2 text-sm text-brand-mist/70">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/5">
        <div className="max-w-screen-xl mx-auto px-6 py-16">
          <div className="rounded-3xl border border-white/10 bg-white/5 px-8 py-12 text-center">
            <h2 className="text-3xl font-semibold text-brand-cloud font-sora">
              Ready to try Medscribd?
            </h2>
            <p className="mt-3 text-brand-mist/70">
              Launch the live demo or request a walkthrough for your clinic.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="/agent"
                className="inline-flex items-center rounded-full bg-brand-teal px-6 py-3 text-sm font-semibold text-brand-cloud shadow-lg shadow-brand-teal/20 hover:bg-[#0b4c4c] transition-colors"
              >
                Launch demo
              </a>
              <a
                href="mailto:hello@medscribd.com"
                className="inline-flex items-center rounded-full border border-brand-mist/30 px-6 py-3 text-sm font-semibold text-brand-cloud hover:border-brand-mist/70 transition-colors"
              >
                Request a demo
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5">
        <div className="max-w-screen-xl mx-auto px-6 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 text-sm text-brand-mist/60">
          <div className="font-sora text-brand-cloud">medscribd</div>
          <div className="flex flex-wrap gap-4">
            <a href="/agent" className="hover:text-brand-cloud transition-colors">
              Live demo
            </a>
            <a href="mailto:hello@medscribd.com" className="hover:text-brand-cloud transition-colors">
              Contact
            </a>
            <a href="#features" className="hover:text-brand-cloud transition-colors">
              Features
            </a>
          </div>
          <div>© 2026 medscribd. All rights reserved.</div>
        </div>
      </footer>
    </main>
  );
}
