const sections = [
  {
    title: "Ambient capture, structured output",
    description:
      "Medscribd listens to the visit and organizes the conversation into a clean, ready-to-review note.",
  },
  {
    title: "Clinician-first prompts",
    description:
      "One question at a time, no fluff. Medscribd keeps the encounter moving and documents precisely.",
  },
  {
    title: "Flexible note formats",
    description:
      "Start with SOAP and adapt to your specialty with custom fields and phrasing.",
  },
  {
    title: "Real-time visibility",
    description:
      "See transcription live, validate key fields, and finalize with confidence.",
  },
];

const workflowSteps = [
  {
    title: "Start the visit",
    description: "Say “Clinical Note” and Medscribd begins the encounter flow.",
  },
  {
    title: "Speak naturally",
    description: "Capture HPI, ROS, exam, assessment, and plan as you talk.",
  },
  {
    title: "Review and finish",
    description: "Scan the structured note, add edits, and save.",
  },
];

const faqs = [
  {
    question: "Does Medscribd work for specialty clinics?",
    answer:
      "Yes. The note flow can be tuned with specialty prompts, custom fields, and structured outputs.",
  },
  {
    question: "Can I keep control of what gets saved?",
    answer:
      "Always. The interface keeps the draft visible and editable before you finalize.",
  },
  {
    question: "How do I get started?",
    answer:
      "Launch the live demo or request a walkthrough for your workflow and templates.",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen text-brand-cloud">
      <div className="max-w-screen-xl mx-auto px-6 py-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold tracking-wide text-brand-cloud font-sora">
              medscribd
            </span>
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
            <a href="#notes" className="hover:text-brand-cloud transition-colors">
              Notes
            </a>
            <a href="#faq" className="hover:text-brand-cloud transition-colors">
              FAQ
            </a>
          </div>
          <div className="flex items-center gap-3">
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

        <section className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10 mt-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.3em] text-brand-mist/70">
              Built for modern clinical teams
            </div>
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-semibold text-brand-cloud font-sora leading-tight">
              Clinical documentation that writes itself.
            </h1>
            <p className="mt-5 text-lg text-brand-mist/70 max-w-xl">
              Medscribd captures conversations in real time, structures the visit,
              and delivers a clean note without slowing down care.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/agent"
                className="inline-flex items-center rounded-full bg-brand-teal px-6 py-3 text-sm font-semibold text-brand-cloud shadow-lg shadow-brand-teal/20 hover:bg-[#0b4c4c] transition-colors"
              >
                Try the live agent
              </a>
              <a
                href="#notes"
                className="inline-flex items-center rounded-full border border-brand-mist/30 px-6 py-3 text-sm font-semibold text-brand-cloud hover:border-brand-mist/70 transition-colors"
              >
                See sample note
              </a>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-brand-mist/60">
              <div>
                <div className="text-brand-cloud text-lg font-semibold">SOAP-first</div>
                <div>Structured by default</div>
              </div>
              <div>
                <div className="text-brand-cloud text-lg font-semibold">Real-time</div>
                <div>Live transcription</div>
              </div>
              <div>
                <div className="text-brand-cloud text-lg font-semibold">Clinician-led</div>
                <div>One question at a time</div>
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
                Documentation without the back-office grind.
              </h2>
              <p className="mt-4 text-brand-mist/70">
                Medscribd keeps clinicians focused on the patient while producing
                structured notes that are ready for review.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {sections.map((item) => (
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
                A simple, repeatable workflow.
              </h2>
              <p className="mt-4 text-brand-mist/70">
                Medscribd guides the visit with the right prompts and stays out of the way.
              </p>
            </div>
            <div className="flex-1 grid gap-5">
              {workflowSteps.map((step, index) => (
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

      <section id="notes" className="border-t border-white/5">
        <div className="max-w-screen-xl mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
            <div>
              <h2 className="text-3xl font-semibold text-brand-cloud font-sora">
                Notes you can trust at a glance.
              </h2>
              <p className="mt-4 text-brand-mist/70">
                Medscribd delivers structured outputs that mirror how clinicians
                review and sign notes. SOAP comes standard with flexible additions.
              </p>
              <div className="mt-8 grid sm:grid-cols-2 gap-5 text-sm text-brand-mist/70">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-brand-cloud font-semibold">SOAP format</div>
                  <p className="mt-2">
                    Subjective, Objective, Assessment, Plan assembled automatically.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-brand-cloud font-semibold">Structured fields</div>
                  <p className="mt-2">
                    Patient demographics, visit details, and clinical findings captured cleanly.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-[#0b1220] p-6 shadow-2xl shadow-black/40">
              <div className="text-xs uppercase tracking-[0.3em] text-brand-mist/60">
                Sample SOAP note
              </div>
              <pre className="mt-4 whitespace-pre-wrap text-sm text-brand-mist/80 font-fira">
{`S: 52 y/o male with 3-day cough, fatigue, low-grade fever.
O: Vitals stable. Lungs clear, no wheeze. SpO2 98%.
A: Viral URI, low concern for pneumonia today.
P: Supportive care, fluids, rest, return precautions discussed.`}
              </pre>
              <div className="mt-6 flex items-center justify-between text-xs text-brand-mist/60">
                <span>Time saved: ~12 minutes</span>
                <span>Ready for signature</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="border-t border-white/5">
        <div className="max-w-screen-xl mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10">
            <div>
              <h2 className="text-3xl font-semibold text-brand-cloud font-sora">
                Questions clinicians ask first.
              </h2>
              <p className="mt-4 text-brand-mist/70">
                We keep the answers straightforward, just like the documentation flow.
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
              Ready to hear Medscribd in action?
            </h2>
            <p className="mt-3 text-brand-mist/70">
              Launch the live demo or schedule a walkthrough for your clinical team.
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
          <div>© 2025 medscribd. All rights reserved.</div>
        </div>
      </footer>
    </main>
  );
}
