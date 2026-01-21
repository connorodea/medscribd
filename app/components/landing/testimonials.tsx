import { Star } from "lucide-react"

const testimonials = [
  {
    quote: "MedScribd has completely transformed my practice. I used to spend 2-3 hours every evening catching up on notes. Now I leave on time, every day.",
    author: "Dr. Sarah Chen",
    role: "Family Medicine",
    location: "San Francisco, CA",
  },
  {
    quote: "The accuracy is remarkable. It captures nuances in patient conversations that I would have missed writing manually. My documentation has never been better.",
    author: "Dr. Michael Torres",
    role: "Internal Medicine",
    location: "Austin, TX",
  },
  {
    quote: "As a hospitalist seeing 20+ patients daily, MedScribd is a game-changer. The specialty-specific templates for cardiology consults are spot-on.",
    author: "Dr. Emily Rodriguez",
    role: "Hospital Medicine",
    location: "Boston, MA",
  },
]

export function Testimonials() {
  return (
    <section className="bg-muted/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Loved by clinicians everywhere
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join thousands of healthcare providers who have reclaimed their time
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.author}
              className="flex flex-col rounded-2xl border border-border bg-card p-8"
            >
              <div className="mb-4 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-primary text-primary"
                  />
                ))}
              </div>
              <blockquote className="flex-1 text-foreground leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <div className="mt-6 border-t border-border pt-6">
                <p className="font-semibold text-foreground">
                  {testimonial.author}
                </p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.role} · {testimonial.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
