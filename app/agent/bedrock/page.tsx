"use client";
import { useState, Suspense } from "react";
import Image from "next/image";
import { App } from "../../components/App";
import { stsBedrockConfig as stsConfig } from "../../lib/constants";
import { useVoiceBot } from "../../context/VoiceBotContextProvider";
import { CaretIcon } from "../../components/icons/CaretIcon";
import MedicalTranscription from "../../components/medical/MedicalTranscription";
import Conversation from "../../components/Conversation";
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
  const [conversationOpen, setConversationOpen] = useState(false);

  const toggleConversation = () => setConversationOpen(!conversationOpen);

  const hasConversation = messages.length > 0;

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
              Bedrock
            </span>
            <ThemeToggle />
            <ProviderToggleButton />
            <Suspense fallback={<div>Loading...</div>}>
              <VoiceSelector />
              {isMobile && <MobileMenu />}
            </Suspense>
          </div>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
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

          <aside className="space-y-4 lg:sticky lg:top-8 h-fit">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_24px_60px_-40px_rgba(0,0,0,0.6)] backdrop-blur">
              <button
                onClick={toggleConversation}
                className={`flex w-full items-center justify-between gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  conversationOpen
                    ? "bg-gray-800 text-gray-200"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <span>Conversation</span>
                <CaretIcon
                  className={`transform transition-transform ${
                    conversationOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div className="mt-3 text-xs text-brand-mist/60">
                {hasConversation
                  ? "View the live conversation transcript."
                  : "Start recording to populate the conversation."}
              </div>
            </div>
          </aside>
        </div>

        {/* Overlays */}
        {conversationOpen && (
          <Suspense fallback={<div>Loading...</div>}>
            <Conversation toggleConversation={toggleConversation} />
          </Suspense>
        )}
      </div>
    </main>
  );
}
