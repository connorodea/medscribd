"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { AgentHeader } from "@/components/agent/agent-header"
import { VisitsPanel, type Visit } from "@/components/agent/visits-panel"
import { EncounterPanel } from "@/components/agent/encounter-panel"
import { ClinicalNotePanel } from "@/components/agent/clinical-note-panel"
import {
  isConversationMessage,
  useVoiceBot,
  VoiceBotStatus,
} from "@/app/context/VoiceBotContextProvider"

type TranscriptWord = {
  word: string
  punctuated_word?: string
  start: number
  end: number
}

interface TranscriptEntry {
  id: string
  speaker: "clinician" | "patient"
  text: string
  timestamp: string
  words?: { text: string; start: number; end: number }[]
}

interface ClinicalNote {
  subjective: string
  objective: string
  assessment: string
  plan: string
}

interface CodingSuggestion {
  code: string
  description: string
  confidence: number
  type: "icd10" | "cpt"
}

interface VerificationItem {
  id: string
  text: string
  resolved: boolean
}

interface ProcessResult {
  transcript: string
  word_timestamps?: TranscriptWord[]
  soap?: ClinicalNote | null
  clinical_note?: string
  verification_needed?: string[]
  icd10?: { code: string; description: string; confidence: "low" | "medium" | "high" }[]
  cpt?: { code: string; description: string; confidence: "low" | "medium" | "high" }[]
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
]

const formatTimestamp = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

const confidenceToScore = (confidence: "low" | "medium" | "high") => {
  if (confidence === "high") return 95
  if (confidence === "medium") return 80
  return 60
}

const parseClinicalNote = (input?: string): ClinicalNote | null => {
  if (!input) return null
  const extractSection = (label: string) => {
    const pattern = new RegExp(
      String.raw`(?:\\*\\*${label}:\\*\\*|${label}:)\\s*([\\s\\S]*?)(?=(?:\\n\\s*\\*\\*[A-Z ]+:\\*\\*|\\n\\s*[A-Z ]+:|$))`,
      "i",
    )
    const match = input.match(pattern)
    return match?.[1]?.trim() || ""
  }

  const subjective = extractSection("SUBJECTIVE")
  const objective = extractSection("OBJECTIVE")
  const assessment = extractSection("ASSESSMENT")
  const plan = extractSection("PLAN")

  if (!subjective && !objective && !assessment && !plan) {
    return {
      subjective: input.trim(),
      objective: "",
      assessment: "",
      plan: "",
    }
  }

  return {
    subjective,
    objective,
    assessment,
    plan,
  }
}

export default function AgentPage() {
  const { status, messages, startListening, startSleeping } = useVoiceBot()
  const [visits, setVisits] = useState<Visit[]>(initialVisits)
  const [selectedVisitId, setSelectedVisitId] = useState<string | null>(
    initialVisits[0]?.id || null,
  )
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([])
  const [note, setNote] = useState<ClinicalNote | null>(null)
  const [codingSuggestions, setCodingSuggestions] = useState<CodingSuggestion[]>([])
  const [verificationItems, setVerificationItems] = useState<VerificationItem[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const processedCountRef = useRef(0)

  const isRecording = status === VoiceBotStatus.LISTENING

  useEffect(() => {
    const conversation = messages.filter(isConversationMessage)
    if (conversation.length <= processedCountRef.current) return

    const newEntries = conversation
      .slice(processedCountRef.current)
      .map((message, index) => ({
        id: `${Date.now()}-${index}`,
        speaker: ("user" in message ? "patient" : "clinician") as
          | "patient"
          | "clinician",
        text: "user" in message ? message.user : message.assistant,
        timestamp: formatTimestamp(),
      }))

    processedCountRef.current = conversation.length
    setTranscript((prev) => [...prev, ...newEntries])
  }, [messages])

  const selectedVisit = useMemo(
    () => visits.find((visit) => visit.id === selectedVisitId) || null,
    [visits, selectedVisitId],
  )

  const handleNewVisit = useCallback(() => {
    const newVisit: Visit = {
      id: Date.now().toString(),
      patientName: "New Patient",
      status: "scheduled",
      time: formatTimestamp(),
      date: "Today",
      chiefComplaint: "",
    }
    setVisits((prev) => [newVisit, ...prev])
    setSelectedVisitId(newVisit.id)
    setTranscript([])
    setNote(null)
    setCodingSuggestions([])
    setVerificationItems([])
  }, [])

  const handleSelectVisit = useCallback((id: string) => {
    setSelectedVisitId(id)
  }, [])

  const handleStartRecording = useCallback(() => {
    startListening(true)
    if (selectedVisitId) {
      setVisits((prev) =>
        prev.map((visit) =>
          visit.id === selectedVisitId
            ? { ...visit, status: "recording" }
            : visit,
        ),
      )
    }
  }, [selectedVisitId, startListening])

  const handleStopRecording = useCallback(() => {
    startSleeping()
    if (selectedVisitId) {
      setVisits((prev) =>
        prev.map((visit) =>
          visit.id === selectedVisitId
            ? { ...visit, status: "processing" }
            : visit,
        ),
      )
      setTimeout(() => {
        setVisits((prev) =>
          prev.map((visit) =>
            visit.id === selectedVisitId
              ? { ...visit, status: "done" }
              : visit,
          ),
        )
      }, 1500)
    }
  }, [selectedVisitId, startSleeping])

  const handleRenamePatient = useCallback(
    (newName: string) => {
      if (selectedVisitId) {
        setVisits((prev) =>
          prev.map((visit) =>
            visit.id === selectedVisitId ? { ...visit, patientName: newName } : visit,
          ),
        )
      }
    },
    [selectedVisitId],
  )

  const handleAudioUpload = useCallback(
    async (file: File) => {
      setIsGenerating(true)
      if (selectedVisitId) {
        setVisits((prev) =>
          prev.map((visit) =>
            visit.id === selectedVisitId ? { ...visit, status: "processing" } : visit,
          ),
        )
      }

      try {
        const formData = new FormData()
        formData.append("files", file)
        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })
        if (!uploadResponse.ok) {
          throw new Error("Upload failed.")
        }
        const uploadData = (await uploadResponse.json()) as { saved: { storedAs: string }[] }
        const storedAs = uploadData.saved?.[0]?.storedAs
        if (!storedAs) {
          throw new Error("No uploaded file found.")
        }

        const processResponse = await fetch("/api/process-upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            storedAs,
            templateId: "primary_care",
            patientContext: "",
            noteType: "SOAP Note",
            substitutions: [],
          }),
        })
        if (!processResponse.ok) {
          throw new Error("Processing failed.")
        }

        const data = (await processResponse.json()) as ProcessResult

        const words = (data.word_timestamps || []).map((word) => ({
          text: word.punctuated_word || word.word,
          start: word.start,
          end: word.end,
        }))
        setTranscript([
          {
            id: `${Date.now()}-upload`,
            speaker: "patient",
            text: data.transcript,
            timestamp: formatTimestamp(),
            words,
          },
        ])

        const noteFromSoap = data.soap
        const noteFromText = parseClinicalNote(data.clinical_note)
        setNote(noteFromSoap ?? noteFromText)

        const icd10 = (data.icd10 || []).map((item) => ({
          code: item.code,
          description: item.description,
          confidence: confidenceToScore(item.confidence),
          type: "icd10" as const,
        }))
        const cpt = (data.cpt || []).map((item) => ({
          code: item.code,
          description: item.description,
          confidence: confidenceToScore(item.confidence),
          type: "cpt" as const,
        }))
        setCodingSuggestions([...icd10, ...cpt])

        setVerificationItems(
          (data.verification_needed || []).map((item, index) => ({
            id: `${index}`,
            text: item,
            resolved: false,
          })),
        )

        if (selectedVisitId) {
          setVisits((prev) =>
            prev.map((visit) =>
              visit.id === selectedVisitId ? { ...visit, status: "done" } : visit,
            ),
          )
        }
      } catch (error) {
        console.error("Upload processing failed:", error)
      } finally {
        setIsGenerating(false)
      }
    },
    [selectedVisitId],
  )

  const handleGenerateNote = useCallback(() => {
    if (!note) {
      setIsGenerating(false)
    }
  }, [note])

  return (
    <div className="flex h-screen flex-col bg-background">
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
          onStartRecording={handleStartRecording}
          onStopRecording={handleStopRecording}
          onRenamePatient={handleRenamePatient}
          onAudioUpload={handleAudioUpload}
          transcript={transcript}
        />

        <ClinicalNotePanel
          visit={selectedVisit}
          note={note}
          codingSuggestions={codingSuggestions}
          verificationItems={verificationItems}
          onGenerateNote={handleGenerateNote}
          isGenerating={isGenerating}
        />
      </div>
    </div>
  )
}
