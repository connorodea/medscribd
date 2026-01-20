import type { ReactNode } from "react";
import VendorScripts from "../components/VendorScripts";
import { DeepgramContextProvider } from "../context/DeepgramContextProvider";
import { MicrophoneContextProvider } from "../context/MicrophoneContextProvider";
import { VoiceBotProvider } from "../context/VoiceBotContextProvider";

export default function AgentLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <VoiceBotProvider>
        <MicrophoneContextProvider>
          <DeepgramContextProvider>{children}</DeepgramContextProvider>
        </MicrophoneContextProvider>
      </VoiceBotProvider>
      <VendorScripts />
    </>
  );
}
