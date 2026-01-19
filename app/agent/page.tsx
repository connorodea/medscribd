"use client";
import { useState, Suspense } from "react";
import Image from "next/image";
import { App } from "../components/App";
import Intelligence from "../components/Intelligence";
import { stsConfig } from "../lib/constants";
import {
  isConversationMessage,
  useVoiceBot,
} from "../context/VoiceBotContextProvider";
import { CaretIcon } from "../components/icons/CaretIcon";
import { PencilIcon } from "../components/icons/PencilIcon";
import InstructionInput from "../components/InstructionInput";
import { TerminalIcon } from "../components/icons/TerminalIcon";
import { BullhornIcon } from "../components/icons/BullhornIcon";
import ShareButtonsPanel from "../components/ShareButtonsPanel";
import * as WaitlistLink from "../components/WaitlistLink";
import { useStsQueryParams } from "../hooks/UseStsQueryParams";
import BehindTheScenes from "../components/BehindTheScenes";
import { VoiceBotProvider } from "../context/VoiceBotContextProvider";
import { DeepgramContextProvider } from "../context/DeepgramContextProvider";
import MedicalTranscription from "../components/medical/MedicalTranscription";
import Conversation from "../components/Conversation";
import VoiceSelector from "../components/VoiceSelector/VoiceSelector";
import { isMobile } from "react-device-detect";
import PopupButton from "../components/PopupButton";
import MobileMenu from "../components/MobileMenu";
import UploadNotes from "../components/UploadNotes";
import ThemeToggle from "../components/ThemeToggle";

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
      href="/agent/bedrock"
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors text-gray-400 hover:text-gray-200 hover:bg-gray-800"
    >
      <span>Bedrock</span>
    </a>
  );
};

export default function Home() {
  const { messages } = useVoiceBot();
  const [conversationOpen, setConversationOpen] = useState(false);
  const [behindTheScenesOpen, setBehindTheScenesOpen] = useState(false);

  const toggleConversation = () => setConversationOpen(!conversationOpen);

  const has4ConversationMessages = messages.filter(isConversationMessage).length > 3;

  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="flex-1 w-full max-w-screen-xl mx-auto px-4 py-8 relative">
        <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)_240px]">
          {/* Left panel */}
          <div className="hidden lg:flex flex-col items-start space-y-4 lg:sticky lg:top-8 h-fit">
          <Intelligence />
          {!isMobile && (
            <Suspense fallback={<div>Loading...</div>}>
              <DesktopMenuItems />
            </Suspense>
          )}
        </div>

        {/* Center panel */}
        <div className="mx-auto w-full max-w-3xl relative">
          <div className="text-center">
            <div className="flex flex-col items-center gap-3 mb-3">
              <Image
                src="/medscribd-logo.png"
                alt="medscribd logo"
                width={200}
                height={48}
                className="h-10 w-auto"
                priority
              />
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5">
                <span className="text-xs uppercase tracking-[0.3em] text-brand-mist/80">medscribd</span>
                <span className="h-1 w-1 rounded-full bg-brand-amber" />
                <span className="text-xs text-brand-mist/70">AI medical scribe</span>
              </div>
            </div>
            <h1 className="text-3xl font-semibold text-brand-cloud font-sora">
              Clinical notes, captured in real time.
            </h1>
            <p className="mt-2 text-sm text-brand-mist/70">
              Speak naturally. medscribd organizes the encounter as you talk.
            </p>
            <div className="mt-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand-teal/20 text-brand-mist border border-brand-teal/50">
                Standard
              </span>
            </div>
          </div>
          <DeepgramContextProvider>
            <VoiceBotProvider>
              <Suspense fallback={<div>Loading...</div>}>
                <App
                  defaultStsConfig={stsConfig}
                  className="flex-shrink-0 h-[130px] opacity-75 disabled:opacity-50"
                  requiresUserActionToInitialize={isMobile}
                />
                <UploadNotes />
                <MedicalTranscription />
              </Suspense>
            </VoiceBotProvider>
          </DeepgramContextProvider>
        </div>

        {/* Right panel */}
        <div className="flex flex-wrap items-center justify-end gap-3 lg:flex-col lg:items-end lg:gap-4 lg:sticky lg:top-8 h-fit order-first lg:order-none">
          <ThemeToggle />
          <ProviderToggleButton />
          <Suspense fallback={<div>Loading...</div>}>
            <VoiceSelector />
            {isMobile && <MobileMenu />}
          </Suspense>
          <button
            onClick={toggleConversation}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
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
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
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
