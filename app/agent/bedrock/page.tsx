"use client";
import { Suspense } from "react";
import { App } from "../../components/App";
import { stsBedrockConfig as stsConfig } from "../../lib/constants";
import {
  isConversationMessage,
  useVoiceBot,
} from "../../context/VoiceBotContextProvider";
import MedicalTranscription from "../../components/medical/MedicalTranscription";
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
    <main className="medscribe-ui min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-screen-2xl px-4 py-6 lg:px-8">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary text-primary-foreground shadow-soft">
                <span className="text-sm font-bold">MS</span>
              </div>
              <span className="font-display text-lg font-bold text-foreground">MedScribd</span>
            </div>
            <div className="hidden items-center gap-1.5 rounded-full border border-success/20 bg-success/10 px-3 py-1.5 text-xs font-semibold text-success sm:flex">
              HIPAA
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <ProviderToggleButton />
            <Suspense fallback={<div>Loading...</div>}>
              {isMobile && <MobileMenu />}
            </Suspense>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary text-xs font-bold text-primary-foreground shadow-soft">
              DR
            </div>
          </div>
        </header>

        <div className="mt-6 grid h-[calc(100vh-112px)] gap-6 lg:grid-cols-[260px_minmax(0,1fr)_420px]">
          <aside className="rounded-2xl border border-border gradient-sidebar shadow-card">
            <div className="border-b border-border p-4">
              <button className="w-full rounded-xl gradient-primary py-2 text-sm font-semibold text-primary-foreground shadow-soft">
                + New Visit
              </button>
            </div>
            <div className="border-b border-border px-4 py-3 text-xs font-medium text-muted-foreground">
              Today
            </div>
            <div className="space-y-3 p-3">
              <button className="w-full rounded-xl border border-primary/20 bg-background px-3 py-3 text-left shadow-card-hover">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                    JS
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">John Smith</div>
                    <div className="text-xs text-muted-foreground">Today · 09:31 PM</div>
                  </div>
                </div>
                <div className="mt-3 inline-flex items-center rounded-md border border-success/20 bg-success/10 px-2 py-1 text-[10px] font-medium text-success">
                  Completed
                </div>
              </button>
            </div>
          </aside>

          <section className="flex flex-col gap-6 overflow-hidden">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-foreground">John Smith</div>
                  <div className="text-xs text-muted-foreground">Duration: 14m 7s</div>
                </div>
                <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  Visit in progress
                </span>
              </div>
              <div className="mt-4 rounded-xl border border-border bg-muted/40 p-4">
                <Suspense fallback={<div>Loading...</div>}>
                  <App
                    defaultStsConfig={stsConfig}
                    className="flex-shrink-0 h-[140px] opacity-75 disabled:opacity-50"
                    requiresUserActionToInitialize={isMobile}
                  />
                </Suspense>
              </div>
            </div>

            <div className="flex-1 rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="text-sm font-semibold text-foreground">Transcript</div>
              <div className="mt-3 h-[260px] space-y-3 overflow-auto text-xs text-muted-foreground scrollbar-thin">
                {conversation.length === 0 && (
                  <div className="text-muted-foreground/70">Conversation will appear here.</div>
                )}
                {conversation.map((msg, index) => (
                  <div key={`${index}`} className="leading-relaxed text-foreground/80">
                    {"user" in msg ? `Patient: ${msg.user}` : `Clinician: ${msg.assistant}`}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-foreground">Clinical Note</div>
              <div className="text-xs text-muted-foreground">Last updated just now</div>
            </div>
            <div className="mt-4">
              <Suspense fallback={<div>Loading...</div>}>
                <MedicalTranscription />
              </Suspense>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
