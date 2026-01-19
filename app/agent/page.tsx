"use client";
import { Suspense } from "react";
import Image from "next/image";
import { App } from "../components/App";
import { stsConfig } from "../lib/constants";
import MedicalTranscription from "../components/medical/MedicalTranscription";
import VoiceSelector from "../components/VoiceSelector/VoiceSelector";
import { isMobile } from "react-device-detect";
import MobileMenu from "../components/MobileMenu";
import UploadNotes from "../components/UploadNotes";
import ThemeToggle from "../components/ThemeToggle";

const ProviderToggleButton = () => {
  return (
    <a
      href="/agent/bedrock"
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors text-gray-400 hover:text-gray-200 hover:bg-gray-800"
    >
      <span>Bedrock</span>
    </a>
  );
};

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto w-full max-w-screen-xl px-4 py-8 lg:px-8">
        <header className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/medscribd-logo.png"
              alt="medscribd logo"
              width={200}
              height={48}
              className="h-10 w-auto"
              priority
            />
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-mist/70">
                Live Scribe
              </div>
              <h1 className="text-xl font-semibold text-brand-cloud font-sora">
                Clinical notes, captured in real time
              </h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center rounded-full border border-brand-teal/30 bg-brand-teal/20 px-3 py-1 text-xs font-semibold text-brand-mist">
              Standard
            </span>
            <ThemeToggle />
            <ProviderToggleButton />
            <Suspense fallback={<div>Loading...</div>}>
              <VoiceSelector />
              {isMobile && <MobileMenu />}
            </Suspense>
          </div>
        </header>

        <div className="mt-8">
          <section className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_-40px_rgba(0,0,0,0.6)] backdrop-blur">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-mist/70">
                    Capture
                  </div>
                  <h2 className="text-lg font-semibold text-brand-cloud">Ambient scribe</h2>
                </div>
                <span className="rounded-full border border-brand-teal/30 bg-brand-teal/20 px-3 py-1 text-xs text-brand-mist">
                  Listening
                </span>
              </div>
              <Suspense fallback={<div>Loading...</div>}>
                <App
                  defaultStsConfig={stsConfig}
                  className="flex-shrink-0 h-[140px] opacity-75 disabled:opacity-50"
                  requiresUserActionToInitialize={isMobile}
                />
              </Suspense>
            </div>
            <UploadNotes />
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_-40px_rgba(0,0,0,0.6)] backdrop-blur">
              <div className="mb-4">
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-mist/70">
                  Output
                </div>
                <h2 className="text-lg font-semibold text-brand-cloud">Clinical panels</h2>
              </div>
              <Suspense fallback={<div>Loading...</div>}>
                <MedicalTranscription />
              </Suspense>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
