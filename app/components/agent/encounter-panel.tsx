"use client";

import { useState } from "react";
import type { ReactNode } from "react";
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
import { Mic, Square, Clock, User, Stethoscope } from "lucide-react";
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
      <div className="flex flex-1 flex-col items-center justify-center bg-muted/30 p-8">
        <div className="text-center">
          <Stethoscope className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium text-foreground">
            No visit selected
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Select a visit from the sidebar or create a new one to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-background">
      <div className="flex items-center justify-between border-b border-border p-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {visit.patientName}
          </h2>
          <p className="text-sm text-muted-foreground">
            {visit.time} · {visit.chiefComplaint || "No chief complaint"}
          </p>
        </div>
        <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
          <SelectTrigger className="w-40">
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
        <TabsList className="mx-4 mt-4 w-fit">
          <TabsTrigger value="record">Record</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="record" className="flex flex-1 flex-col p-4">
          <div className="mb-6 flex flex-col items-center justify-center rounded-xl border border-border bg-card p-8">
            <button
              type="button"
              onClick={isRecording ? onStopRecording : onStartRecording}
              className={cn(
                "relative flex h-24 w-24 items-center justify-center rounded-full transition-all",
                isRecording
                  ? "bg-destructive text-destructive-foreground"
                  : "bg-primary text-primary-foreground hover:bg-primary/90",
              )}
            >
              {isRecording ? (
                <>
                  <Square className="h-8 w-8" />
                  <span className="absolute inset-0 animate-ping rounded-full bg-destructive/50" />
                </>
              ) : (
                <Mic className="h-8 w-8" />
              )}
            </button>

            <p className="mt-4 text-sm font-medium text-foreground">
              {isRecording ? "Recording..." : "Click to start recording"}
            </p>

            <div className="mt-2 flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-mono text-sm text-muted-foreground">
                {formatDuration(recordingDuration)}
              </span>
            </div>

            <div className="mt-6 w-full max-w-xl">{recordingContent}</div>
          </div>

          <div className="flex-1 rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border p-3">
              <h3 className="text-sm font-medium text-foreground">Live Transcript</h3>
              {transcript.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {transcript.length} entries
                </Badge>
              )}
            </div>
            <ScrollArea className="h-64">
              {transcript.length === 0 ? (
                <div className="flex h-full items-center justify-center p-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    Transcript will appear here as you speak...
                  </p>
                </div>
              ) : (
                <div className="space-y-4 p-4">
                  {transcript.map((entry) => (
                    <div key={entry.id} className="flex gap-3">
                      <div
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                          entry.speaker === "clinician"
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {entry.speaker === "clinician" ? (
                          <Stethoscope className="h-4 w-4" />
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-foreground">
                            {entry.speaker === "clinician" ? "Clinician" : "Patient"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {entry.timestamp}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-foreground">{entry.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </TabsContent>

        <TabsContent value="upload" className="flex-1 p-4">
          <div className="h-full rounded-xl border border-border bg-card p-6">
            {uploadContent}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
