"use client";
import { useState, Suspense } from "react";
import Image from "next/image";
import { App } from "../../components/App";
import Intelligence from "../../components/Intelligence";
import { stsBedrockConfig as stsConfig } from "../../lib/constants";
import {
  isConversationMessage,
  useVoiceBot,
} from "../../context/VoiceBotContextProvider";
import { CaretIcon } from "../../components/icons/CaretIcon";
import { PencilIcon } from "../../components/icons/PencilIcon";
import InstructionInput from "../../components/InstructionInput";
import { TerminalIcon } from "../../components/icons/TerminalIcon";
import { BullhornIcon } from "../../components/icons/BullhornIcon";
import ShareButtonsPanel from "../../components/ShareButtonsPanel";
import * as WaitlistLink from "../../components/WaitlistLink";
import { useStsQueryParams } from "../../hooks/UseStsQueryParams";
import BehindTheScenes from "../../components/BehindTheScenes";
import MedicalTranscription from "../../components/medical/MedicalTranscription";
import Conversation from "../../components/Conversation";
import VoiceSelector from "../../components/VoiceSelector/VoiceSelector";
import { isMobile } from "react-device-detect";
import PopupButton from "../../components/PopupButton";
import MobileMenu from "../../components/MobileMenu";
import ThemeToggle from "../../components/ThemeToggle";

const DesktopMenuItems = () => {
  const { instructions } = useStsQueryParams();
  return (
    <>
      <PopupButton
        buttonIcon={<PencilIcon />}
        buttonText={
          <span>Prompt {instructions && <span className="text-green-spring">*</span>}</span>
        }
        popupContent={<InstructionInput className="w-96" focusOnMount />}
        tooltipText={instructions ? "Using your custom prompt. Click to edit." : null}
      />
      <PopupButton
        buttonIcon={<BullhornIcon />}
        buttonText="Share"
        popupContent={<ShareButtonsPanel label="Share:" />}
      />
      <WaitlistLink.Plaintext />
    </>
  );
};

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
  const [behindTheScenesOpen, setBehindTheScenesOpen] = useState(false);

  const toggleConversation = () => setConversationOpen(!conversationOpen);

  const has4ConversationMessages = messages.filter(isConversationMessage).length > 3;

  return (
    <main className="min-h-screen">
      <div className="mx-auto w-full max-w-screen-xl px-4 py-8 lg:px-8">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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
              <h1 className="text-2xl font-semibold text-brand-cloud font-sora">
                Clinical notes, captured in real time.
              </h1>
              <p className="text-sm text-brand-mist/70">
                Speak naturally. medscribd organizes the encounter as you talk.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand-teal/20 text-brand-mist border border-brand-teal/50">
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

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <Suspense fallback={<div>Loading...</div>}>
                <App
                  defaultStsConfig={stsConfig}
                  className="flex-shrink-0 h-[140px] opacity-75 disabled:opacity-50"
                  requiresUserActionToInitialize={isMobile}
                />
              </Suspense>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <Suspense fallback={<div>Loading...</div>}>
                <MedicalTranscription />
              </Suspense>
            </div>
          </section>

          <aside className="space-y-4 lg:sticky lg:top-8 h-fit">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-4">
              <Intelligence />
              {!isMobile && (
                <Suspense fallback={<div>Loading...</div>}>
                  <DesktopMenuItems />
                </Suspense>
              )}
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2">
              <button
                onClick={toggleConversation}
                className={`flex w-full items-center justify-between gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
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
              {has4ConversationMessages && (
                <button
                  onClick={() => setBehindTheScenesOpen(!behindTheScenesOpen)}
                  className={`flex w-full items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    behindTheScenesOpen
                      ? "bg-gray-800 text-gray-200"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  <TerminalIcon />
                  <span>Behind the scenes</span>
                </button>
              )}
            </div>
          </aside>
        </div>

        {/* Overlays */}
        {conversationOpen && (
          <Suspense fallback={<div>Loading...</div>}>
            <Conversation toggleConversation={toggleConversation} />
          </Suspense>
        )}
        {behindTheScenesOpen && (
          <Suspense fallback={<div>Loading...</div>}>
            <BehindTheScenes onClose={() => setBehindTheScenesOpen(false)} />
          </Suspense>
        )}
      </div>
    </main>
  );
}
