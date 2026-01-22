"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mic, Square, User, Stethoscope, Radio } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Visit } from "./visits-panel";

interface TranscriptEntry {
  id: string;
  speaker: "clinician" | "patient";
  text: string;
  timestamp: string;
}

interface EncounterPanelProps {
  visit: Visit | null;
  isRecording: boolean;
  recordingDuration: number;
  onStartRecording: () => void;
  onStopRecording: () => void;
  transcript: TranscriptEntry[];
  recordingContent: ReactNode;
  uploadContent: ReactNode;
}

const templates = [
  { value: "soap", label: "SOAP Note" },
  { value: "hp", label: "H&P" },
  { value: "progress", label: "Progress Note" },
  { value: "procedure", label: "Procedure Note" },
];

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export function EncounterPanel({
  visit,
  isRecording,
  recordingDuration,
  onStartRecording,
  onStopRecording,
  transcript,
  recordingContent,
  uploadContent,
}: EncounterPanelProps) {
  const [selectedTemplate, setSelectedTemplate] = useState("soap");

  if (!visit) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-white p-8 dark:from-slate-900 dark:to-slate-950">
        <div className="max-w-sm text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5">
            <Stethoscope className="h-10 w-10 text-primary/60" />
          </div>
          <h3 className="mt-6 text-xl font-semibold text-foreground">
            Select a Visit
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Choose a patient visit from the sidebar or create a new one to start documenting.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-gradient-to-b from-slate-50/50 to-white dark:from-slate-900/50 dark:to-slate-950">
      <div className="flex items-center justify-between border-b border-border/60 bg-white/80 px-6 py-4 backdrop-blur-sm dark:bg-slate-900/80">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-foreground">
              {visit.patientName}
            </h2>
            {visit.status === "recording" && (
              <Badge className="gap-1.5 rounded-full border-0 bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400">
                <Radio className="h-3 w-3 animate-pulse" />
                Live
              </Badge>
            )}
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {visit.time} {visit.chiefComplaint && `· ${visit.chiefComplaint}`}
          </p>
        </div>
        <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
          <SelectTrigger className="h-9 w-44 rounded-full border-border/60 bg-white dark:bg-slate-800">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {templates.map((template) => (
              <SelectItem key={template.value} value={template.value}>
                {template.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="record" className="flex flex-1 flex-col">
        <div className="px-6 pt-4">
          <TabsList className="h-10 rounded-full bg-slate-100 p-1 dark:bg-slate-800">
            <TabsTrigger
              value="record"
              className="rounded-full px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700"
            >
              Record
            </TabsTrigger>
            <TabsTrigger
              value="upload"
              className="rounded-full px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700"
            >
              Upload
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="record" className="flex flex-1 flex-col p-6 pt-4">
          <div className="mb-6 flex flex-col items-center justify-center rounded-2xl border border-border/40 bg-white p-8 shadow-sm dark:bg-slate-900">
            <div className="relative">
              {isRecording && (
                <>
                  <span
                    className="absolute inset-0 rounded-full bg-red-500/20 animate-ping"
                    style={{ animationDuration: "2s" }}
                  />
                  <span className="absolute -inset-4 rounded-full border-2 border-red-300/50 animate-pulse" />
                </>
              )}
              <button
                type="button"
                onClick={isRecording ? onStopRecording : onStartRecording}
                className={cn(
                  "relative flex h-28 w-28 items-center justify-center rounded-full transition-all duration-300 shadow-lg",
                  isRecording
                    ? "bg-gradient-to-br from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
                    : "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70",
                )}
              >
                {isRecording ? (
                  <Square className="h-10 w-10" />
                ) : (
                  <Mic className="h-10 w-10" />
                )}
              </button>
            </div>

            <p className="mt-6 text-base font-medium text-foreground">
              {isRecording ? "Recording in progress" : "Ready to record"}
            </p>

            {isRecording ? (
              <div className="mt-3 flex items-center gap-4">
                <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 dark:bg-slate-800">
                  <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="font-mono text-lg font-semibold text-foreground">
                    {formatDuration(recordingDuration)}
                  </span>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                Click to start real-time transcription
              </p>
            )}

            <div className="mt-6 w-full max-w-xl">{recordingContent}</div>
          </div>

          <div className="flex-1 overflow-hidden rounded-2xl border border-border/40 bg-white shadow-sm dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-border/60 bg-slate-50/50 px-5 py-3 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-foreground">Live Transcript</h3>
                {isRecording && (
                  <span className="flex h-2 w-2">
                    <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                  </span>
                )}
              </div>
              {transcript.length > 0 && (
                <Badge variant="secondary" className="rounded-full text-xs">
                  {transcript.length} entries
                </Badge>
              )}
            </div>
            <ScrollArea className="h-[280px]">
              {transcript.length === 0 ? (
                <div className="flex h-full items-center justify-center p-8 text-center">
                  <div>
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                      <Mic className="h-6 w-6 text-muted-foreground/50" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Transcript will appear here as you speak
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-1 p-4">
                  {transcript.map((entry) => (
                    <div
                      key={entry.id}
                      className={cn(
                        "flex gap-3 rounded-xl p-3 transition-colors",
                        entry.speaker === "clinician"
                          ? "bg-primary/5 dark:bg-primary/10"
                          : "bg-slate-50 dark:bg-slate-800/50",
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                          entry.speaker === "clinician"
                            ? "bg-primary text-primary-foreground"
                            : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
                        )}
                      >
                        {entry.speaker === "clinician" ? (
                          <Stethoscope className="h-4 w-4" />
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="text-xs font-semibold text-foreground">
                            {entry.speaker === "clinician" ? "Clinician" : "Patient"}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {entry.timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed">
                          {entry.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </TabsContent>

        <TabsContent value="upload" className="flex-1 p-6">
          <div className="h-full rounded-2xl border border-border/60 bg-white p-6 shadow-sm dark:bg-slate-900">
            {uploadContent}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
