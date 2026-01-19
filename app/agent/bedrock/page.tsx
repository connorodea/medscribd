"use client";
import { Suspense } from "react";
import Image from "next/image";
import { App } from "../../components/App";
import { stsBedrockConfig as stsConfig } from "../../lib/constants";
import {
  isConversationMessage,
  useVoiceBot,
} from "../../context/VoiceBotContextProvider";
import MedicalTranscription from "../../components/medical/MedicalTranscription";
import VoiceSelector from "../../components/VoiceSelector/VoiceSelector";
import { isMobile } from "react-device-detect";
import MobileMenu from "../../components/MobileMenu";
import ThemeToggle from "../../components/ThemeToggle";

const ProviderToggleButton = () => {
  return (
    <a
      href="/agent"
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors text-gray-400 hover:text-gray-200 hover:bg-gray-800"
    >
      <span>Standard</span>
    </a>
  );
};

export default function PreviewHome() {
  const { messages } = useVoiceBot();
  const conversation = messages.filter(isConversationMessage);

  return (
    <main className="min-h-screen">
      <div className="mx-auto w-full max-w-screen-xl px-4 py-6 lg:px-8">
        <header className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/medscribd-logo.png"
              alt="medscribd logo"
              width={200}
              height={48}
              className="h-9 w-auto"
              priority
            />
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-brand-mist">
              HIPAA
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <ThemeToggle />
            <ProviderToggleButton />
            <Suspense fallback={<div>Loading...</div>}>
              <VoiceSelector />
              {isMobile && <MobileMenu />}
            </Suspense>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-brand-mist">
              DR
            </div>
          </div>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)_380px]">
          <aside className="space-y-4">
            <button className="w-full rounded-xl bg-brand-amber px-4 py-2 text-sm font-semibold text-brand-ink">
              + New Visit
            </button>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-semibold text-brand-cloud">John Smith</div>
              <div className="text-xs text-brand-mist/60">Today · 09:31 PM</div>
              <div className="mt-2 inline-flex items-center rounded-full bg-white/10 px-2 py-1 text-[10px] text-brand-mist">
                Completed
              </div>
            </div>
          </aside>

          <section className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_24px_60px_-40px_rgba(0,0,0,0.6)] backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-brand-cloud">John Smith</div>
                  <div className="text-xs text-brand-mist/60">Duration: 14m 7s</div>
                </div>
                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-brand-mist">
                  Visit in progress
                </span>
              </div>
              <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
                <Suspense fallback={<div>Loading...</div>}>
                  <App
                    defaultStsConfig={stsConfig}
                    className="flex-shrink-0 h-[140px] opacity-75 disabled:opacity-50"
                    requiresUserActionToInitialize={isMobile}
                  />
                </Suspense>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_24px_60px_-40px_rgba(0,0,0,0.6)] backdrop-blur">
              <div className="text-sm font-semibold text-brand-cloud">Transcript</div>
              <div className="mt-3 space-y-3 text-xs text-brand-mist/70">
                {conversation.length === 0 && (
                  <div className="text-brand-mist/50">Conversation will appear here.</div>
                )}
                {conversation.map((msg, index) => (
                  <div key={`${index}`} className="leading-relaxed text-brand-mist/80">
                    {"user" in msg ? `Patient: ${msg.user}` : `Clinician: ${msg.assistant}`}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_24px_60px_-40px_rgba(0,0,0,0.6)] backdrop-blur">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-brand-cloud">Clinical Note</div>
                <div className="flex items-center gap-2 text-xs text-brand-mist/60">
                  <span>↻</span>
                  <span>Copy</span>
                </div>
              </div>
              <div className="mt-4">
                <Suspense fallback={<div>Loading...</div>}>
                  <MedicalTranscription />
                </Suspense>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
