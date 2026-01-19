import type { ReactNode } from "react";
import { Sora, Source_Sans_3, Fira_Code } from "next/font/google";
import { DeepgramContextProvider } from "./context/DeepgramContextProvider";
import { MicrophoneContextProvider } from "./context/MicrophoneContextProvider";
import { VoiceBotProvider } from "./context/VoiceBotContextProvider";
import AnimatedBackground from "./components/AnimatedBackground";
import VendorScripts from "./components/VendorScripts";

import "./globals.css";
import { sharedOpenGraphMetadata } from "./lib/constants";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "fallback",
});
const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source",
  display: "fallback",
});
const fira = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira",
  display: "fallback",
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_PATH || ""),
  title: "medscribd | AI medical scribe",
  description: "Clinical notes, captured in real time.",
  openGraph: sharedOpenGraphMetadata,
  twitter: {
    card: "summary_large_image",
    site: "@medscribd",
    creator: "@medscribd",
  },
};

const fonts = [sora, sourceSans, fira].map((font) => font.variable).join(" ");

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${fonts} font-source`}>
      <body>
        <AnimatedBackground>
          <VoiceBotProvider>
            <MicrophoneContextProvider>
              <DeepgramContextProvider>{children}</DeepgramContextProvider>
            </MicrophoneContextProvider>
          </VoiceBotProvider>
        </AnimatedBackground>
        <VendorScripts />
      </body>
    </html>
  );
}
