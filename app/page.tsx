import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { StatsBar } from "@/components/landing/stats-bar";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Features } from "@/components/landing/features";
import { Specialties } from "@/components/landing/specialties";
import { Testimonials } from "@/components/landing/testimonials";
import { FAQ } from "@/components/landing/faq";
import { CTASection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";

export default function HomePage() {
  return (
    <main className="medscribe-ui min-h-screen bg-background text-foreground">
      <Header />
      <Hero />
      <StatsBar />
      <HowItWorks />
      <Features />
      <Specialties />
      <Testimonials />
      <FAQ />
      <CTASection />
      <Footer />
    </main>
  );
}
