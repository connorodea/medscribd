"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "Is MedScribd HIPAA compliant?",
    answer: "Yes, absolutely. MedScribd is fully HIPAA compliant and SOC 2 Type II certified. We use end-to-end encryption for all audio and text data. Patient information is never stored longer than necessary, and we maintain strict access controls. We also sign Business Associate Agreements (BAAs) with all healthcare organizations.",
  },
  {
    question: "Which EHR systems does MedScribd integrate with?",
    answer: "MedScribd integrates seamlessly with 50+ EHR systems including Epic, Cerner, Athena, eClinicalWorks, NextGen, Allscripts, and many more. We offer one-click export to your EHR, and our team can help set up custom integrations for enterprise clients.",
  },
  {
    question: "How accurate are the generated notes?",
    answer: "MedScribd achieves 99% accuracy on clinical documentation. Our AI is trained on millions of medical encounters and uses specialty-specific models. Every note includes a confidence score, and our system highlights any areas that may need review. You always have final approval before saving.",
  },
  {
    question: "Can I customize the note templates?",
    answer: "Yes! MedScribd offers extensive customization options. Choose from pre-built templates (SOAP, H&P, Progress Notes, Procedure Notes) or create your own. You can customize section headers, default phrases, and formatting to match your personal documentation style.",
  },
  {
    question: "What happens if my internet connection drops during a visit?",
    answer: "MedScribd works offline too. Audio is recorded locally on your device and synced when connectivity returns. You'll never lose a recording due to internet issues. The app will notify you of the connection status and automatically resume uploading when back online.",
  },
  {
    question: "How does billing code suggestion work?",
    answer: "As MedScribd generates your note, it analyzes the documentation to suggest appropriate ICD-10 diagnosis codes and CPT procedure codes. Suggestions are based on the clinical content captured during the visit. This helps ensure accurate coding and reduces claim denials.",
  },
]

export function FAQ() {
  return (
    <section id="faq" className="py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to know about MedScribd
          </p>
        </div>

        <Accordion type="single" collapsible className="mt-12">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-foreground">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
