"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AgentHeader } from "@/components/agent/agent-header";
import { VisitsPanel, type Visit } from "@/components/agent/visits-panel";
import { EncounterPanel } from "@/components/agent/encounter-panel";
import { ClinicalNotePanel } from "@/components/agent/clinical-note-panel";
import { App } from "@/app/components/App";
import UploadNotes from "@/app/components/UploadNotes";
import MedicalTranscription from "@/app/components/medical/MedicalTranscription";
import { stsConfig } from "@/app/lib/constants";
import {
  isConversationMessage,
  useVoiceBot,
  VoiceBotStatus,
} from "@/app/context/VoiceBotContextProvider";

interface TranscriptEntry {
  id: string;
  speaker: "clinician" | "patient";
  text: string;
  timestamp: string;
}

const initialVisits: Visit[] = [
  {
    id: "current",
    patientName: "New Patient",
    status: "recording",
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    date: "Today",
    chiefComplaint: "",
  },
];

const formatTimestamp = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export default function AgentPage() {
  const { status, messages, startListening, startSleeping } = useVoiceBot();
  const [visits, setVisits] = useState<Visit[]>(initialVisits);
  const [selectedVisitId, setSelectedVisitId] = useState<string | null>(
    initialVisits[0]?.id || null,
  );
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const processedCountRef = useRef(0);

  const isRecording = status === VoiceBotStatus.LISTENING;

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  useEffect(() => {
    const conversation = messages.filter(isConversationMessage);
    if (conversation.length <= processedCountRef.current) return;

    const newEntries = conversation
      .slice(processedCountRef.current)
      .map((message, index) => ({
        id: `${Date.now()}-${index}`,
        speaker: ("user" in message ? "patient" : "clinician") as
          | "patient"
          | "clinician",
        text: "user" in message ? message.user : message.assistant,
        timestamp: formatTimestamp(),
      }));

    processedCountRef.current = conversation.length;
    setTranscript((prev) => [...prev, ...newEntries]);
  }, [messages]);

  const selectedVisit = useMemo(
    () => visits.find((visit) => visit.id === selectedVisitId) || null,
    [visits, selectedVisitId],
  );

  const handleNewVisit = useCallback(() => {
    const newVisit: Visit = {
      id: Date.now().toString(),
      patientName: "New Patient",
      status: "scheduled",
      time: formatTimestamp(),
      date: "Today",
      chiefComplaint: "",
    };
    setVisits((prev) => [newVisit, ...prev]);
    setSelectedVisitId(newVisit.id);
    setTranscript([]);
    setRecordingDuration(0);
  }, []);

  const handleSelectVisit = useCallback((id: string) => {
    setSelectedVisitId(id);
  }, []);

  const handleStartRecording = useCallback(() => {
    setRecordingDuration(0);
    startListening(true);
    if (selectedVisitId) {
      setVisits((prev) =>
        prev.map((visit) =>
          visit.id === selectedVisitId
            ? { ...visit, status: "recording" }
            : visit,
        ),
      );
    }
  }, [selectedVisitId, startListening]);

  const handleStopRecording = useCallback(() => {
    startSleeping();
    if (selectedVisitId) {
      setVisits((prev) =>
        prev.map((visit) =>
          visit.id === selectedVisitId
            ? { ...visit, status: "processing" }
            : visit,
        ),
      );
      setTimeout(() => {
        setVisits((prev) =>
          prev.map((visit) =>
            visit.id === selectedVisitId
              ? { ...visit, status: "done" }
              : visit,
          ),
        );
      }, 1500);
    }
  }, [selectedVisitId, startSleeping]);

  return (
    <div className="medscribe-ui flex h-screen flex-col bg-background">
      <AgentHeader />

      <div className="flex flex-1 overflow-hidden">
        <VisitsPanel
          visits={visits}
          selectedVisitId={selectedVisitId}
          onSelectVisit={handleSelectVisit}
          onNewVisit={handleNewVisit}
        />

        <EncounterPanel
          visit={selectedVisit}
          isRecording={isRecording}
          recordingDuration={recordingDuration}
          onStartRecording={handleStartRecording}
          onStopRecording={handleStopRecording}
          transcript={transcript}
          recordingContent={
            <App
              defaultStsConfig={stsConfig}
              className="flex-shrink-0 h-[140px] opacity-75 disabled:opacity-50"
            />
          }
          uploadContent={<UploadNotes />}
        />

        <ClinicalNotePanel visit={selectedVisit}>
          <MedicalTranscription />
        </ClinicalNotePanel>
      </div>
    </div>
  );
}
