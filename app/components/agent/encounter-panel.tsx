"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Mic,
  Square,
  Pause,
  Play,
  User,
  Stethoscope,
  Upload,
  FileAudio,
  Pencil,
  Check,
  X,
  Download,
  FileText,
  FileType,
  FileCode,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { AudioController } from "./audio-controller"
import type { Visit } from "./visits-panel"

interface Word {
  text: string
  start: number
  end: number
}

interface TranscriptEntry {
  id: string
  speaker: "clinician" | "patient"
  text: string
  timestamp: string
  words?: Word[]
}

interface EncounterPanelProps {
  visit: Visit | null
  isRecording: boolean
  onStartRecording: () => void
  onStopRecording: () => void
  onRenamePatient: (newName: string) => void
  onAudioUpload?: (file: File) => void
  transcript: TranscriptEntry[]
}

export function EncounterPanel({
  visit,
  isRecording,
  onStartRecording,
  onStopRecording,
  onRenamePatient,
  onAudioUpload,
  transcript,
}: EncounterPanelProps) {
  const [recordingDuration, setRecordingDuration] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  
  // Patient name editing state
  const [isEditingName, setIsEditingName] = useState(false)
  const [editedName, setEditedName] = useState("")
  
  // Audio playback state
  const [hasAudio, setHasAudio] = useState(false)
  const [audioFileName, setAudioFileName] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackTime, setPlaybackTime] = useState(0)
  const [audioDuration, setAudioDuration] = useState(180) // 3 min default
  
  const scrollRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto-load audio for completed visits
  useEffect(() => {
    if (visit?.status === "done") {
      setHasAudio(true)
      setAudioFileName("visit-recording.mp3")
      setAudioDuration(180)
      setPlaybackTime(0)
    } else {
      setHasAudio(false)
      setAudioFileName(null)
      setPlaybackTime(0)
      setIsPlaying(false)
    }
  }, [visit])

  // Recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setRecordingDuration((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRecording, isPaused])

  // Reset on recording stop
  useEffect(() => {
    if (!isRecording) {
      setRecordingDuration(0)
      setIsPaused(false)
    }
  }, [isRecording])

  // Auto-scroll to current word during playback
  useEffect(() => {
    if (isPlaying && scrollRef.current) {
      const activeWord = scrollRef.current.querySelector('[data-active="true"]')
      if (activeWord) {
        activeWord.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }
  }, [playbackTime, isPlaying])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleStartEditName = () => {
    if (visit) {
      setEditedName(visit.patientName)
      setIsEditingName(true)
    }
  }

  const handleSaveName = () => {
    if (editedName.trim()) {
      onRenamePatient(editedName.trim())
    }
    setIsEditingName(false)
  }

  const handleCancelEditName = () => {
    setIsEditingName(false)
    setEditedName("")
  }

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveName()
    } else if (e.key === "Escape") {
      handleCancelEditName()
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setHasAudio(true)
      setAudioFileName(file.name)
      setAudioDuration(180) // Mock - would come from actual file
      setPlaybackTime(0)
      onAudioUpload?.(file)
    }
  }

  const handleExportMarkdown = () => {
    if (!visit || transcript.length === 0) return
    const content = `# Visit Transcript - ${visit.patientName}\n\n**Date:** ${visit.date} at ${visit.time}\n**Chief Complaint:** ${visit.chiefComplaint}\n\n---\n\n${transcript.map(entry => 
      `**${entry.speaker === "clinician" ? "Clinician" : "Patient"}:**\n${entry.text}`
    ).join("\n\n")}`
    
    const blob = new Blob([content], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `transcript-${visit.patientName.replace(/\s+/g, "-").toLowerCase()}-${visit.date}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleExportDocx = () => {
    if (!visit || transcript.length === 0) return
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Visit Transcript - ${visit.patientName}</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: #1a1a1a; border-bottom: 2px solid #0066cc; padding-bottom: 10px; }
          .meta { color: #666; margin-bottom: 20px; font-size: 14px; }
          .meta p { margin: 4px 0; }
          .entry { margin-bottom: 16px; }
          .speaker { font-weight: bold; color: #333; margin-bottom: 4px; }
          .clinician { color: #0066cc; }
          .patient { color: #666; }
          .text { line-height: 1.6; }
        </style>
      </head>
      <body>
        <h1>Visit Transcript</h1>
        <div class="meta">
          <p><strong>Patient:</strong> ${visit.patientName}</p>
          <p><strong>Date:</strong> ${visit.date} at ${visit.time}</p>
          <p><strong>Chief Complaint:</strong> ${visit.chiefComplaint}</p>
        </div>
        ${transcript.map(entry => `
          <div class="entry">
            <div class="speaker ${entry.speaker}">${entry.speaker === "clinician" ? "Clinician" : "Patient"}</div>
            <div class="text">${entry.text}</div>
          </div>
        `).join("")}
      </body>
      </html>
    `
    
    const blob = new Blob([htmlContent], { type: "application/vnd.ms-word" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `transcript-${visit.patientName.replace(/\s+/g, "-").toLowerCase()}-${visit.date}.doc`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleExportPdf = () => {
    if (!visit || transcript.length === 0) return
    
    const printWindow = window.open("", "_blank")
    if (!printWindow) return
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Visit Transcript - ${visit.patientName}</title>
        <style>
          @page { margin: 1in; }
          body { font-family: Arial, sans-serif; max-width: 100%; margin: 0; padding: 0; color: #1a1a1a; }
          h1 { font-size: 24px; color: #1a1a1a; border-bottom: 2px solid #0066cc; padding-bottom: 10px; margin-bottom: 16px; }
          .logo { font-weight: bold; color: #0066cc; font-size: 20px; margin-bottom: 24px; }
          .meta { color: #666; margin-bottom: 24px; font-size: 14px; }
          .meta p { margin: 4px 0; }
          .entry { margin-bottom: 16px; }
          .speaker { font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
          .clinician { color: #0066cc; }
          .patient { color: #666; }
          .text { line-height: 1.6; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="logo">MedScribd</div>
        <h1>Visit Transcript</h1>
        <div class="meta">
          <p><strong>Patient:</strong> ${visit.patientName}</p>
          <p><strong>Date:</strong> ${visit.date} at ${visit.time}</p>
          <p><strong>Chief Complaint:</strong> ${visit.chiefComplaint}</p>
        </div>
        ${transcript.map(entry => `
          <div class="entry">
            <div class="speaker ${entry.speaker}">${entry.speaker === "clinician" ? "Clinician" : "Patient"}</div>
            <div class="text">${entry.text}</div>
          </div>
        `).join("")}
      </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
    }, 250)
  }

  const handleTimeUpdate = useCallback((time: number) => {
    setPlaybackTime(time)
  }, [])

  const handlePlayingChange = useCallback((playing: boolean) => {
    setIsPlaying(playing)
  }, [])

  if (!visit) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-background">
        <Stethoscope className="h-8 w-8 text-muted-foreground/30" />
        <p className="mt-3 text-sm text-muted-foreground">
          Select a visit to begin
        </p>
      </div>
    )
  }

  const showAudioPlayer = hasAudio && !isRecording && transcript.length > 0

  return (
    <div className="flex flex-1 flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div>
            {isEditingName ? (
              <div className="flex items-center gap-1.5">
                <Input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  onKeyDown={handleNameKeyDown}
                  className="h-7 w-40 text-sm font-medium"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10"
                  onClick={handleSaveName}
                >
                  <Check className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                  onClick={handleCancelEditName}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleStartEditName}
                className="group flex items-center gap-1.5 hover:bg-muted/50 rounded-md px-1.5 py-0.5 -ml-1.5 transition-colors"
              >
                <h2 className="text-sm font-medium text-foreground">
                  {visit.patientName}
                </h2>
                <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            )}
            <p className="text-xs text-muted-foreground mt-0.5">
              {visit.chiefComplaint || visit.time}
            </p>
          </div>
        </div>
        
        {/* Recording/Upload Controls */}
        <div className="flex items-center gap-2">
          {/* Export Dropdown - only show when there's a transcript */}
          {transcript.length > 0 && !isRecording && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5 text-xs"
                >
                  <Download className="h-3.5 w-3.5" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onClick={handleExportPdf} className="gap-2 cursor-pointer">
                  <FileText className="h-3.5 w-3.5 text-red-500" />
                  <span className="text-sm">Export as PDF</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportDocx} className="gap-2 cursor-pointer">
                  <FileType className="h-3.5 w-3.5 text-blue-500" />
                  <span className="text-sm">Export as DOCX</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportMarkdown} className="gap-2 cursor-pointer">
                  <FileCode className="h-3.5 w-3.5 text-gray-500" />
                  <span className="text-sm">Export as MD</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {isRecording && (
            <div className="flex items-center gap-3 mr-2">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <span className="font-mono text-xs tabular-nums text-foreground">
                  {formatTime(recordingDuration)}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setIsPaused(!isPaused)}
              >
                {isPaused ? (
                  <Play className="h-3.5 w-3.5" />
                ) : (
                  <Pause className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
          )}
          
          {!isRecording && !hasAudio && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={handleFileUpload}
              />
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 text-xs"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-3.5 w-3.5" />
                Upload
              </Button>
            </>
          )}
          
          <Button
            size="sm"
            onClick={isRecording ? onStopRecording : onStartRecording}
            className={cn(
              "h-8 gap-1.5 text-xs",
              isRecording 
                ? "bg-red-500 hover:bg-red-600 text-white" 
                : "bg-primary hover:bg-primary/90"
            )}
          >
            {isRecording ? (
              <>
                <Square className="h-3 w-3" />
                Stop
              </>
            ) : (
              <>
                <Mic className="h-3 w-3" />
                Record
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Audio File Info */}
      {hasAudio && !isRecording && (
        <div className="flex items-center gap-2 px-6 py-2 bg-muted/30 border-b border-border/40">
          <FileAudio className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground truncate">
            {audioFileName}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground ml-auto"
            onClick={() => fileInputRef.current?.click()}
          >
            Replace
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      )}

      {/* Audio Controller */}
      {showAudioPlayer && (
        <AudioController
          duration={audioDuration}
          onTimeUpdate={handleTimeUpdate}
          onPlayingChange={handlePlayingChange}
        />
      )}

      {/* Transcript Area */}
      <ScrollArea className="flex-1" ref={scrollRef}>
        <div className="p-6 space-y-8">
          {transcript.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                <Mic className="h-5 w-5 text-muted-foreground/50" />
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                {isRecording ? "Listening..." : "Start recording or upload audio"}
              </p>
            </div>
          ) : (
            transcript.map((entry, index) => (
              <TranscriptBlock
                key={entry.id}
                entry={entry}
                entryIndex={index}
                playbackTime={playbackTime}
                isPlaying={isPlaying}
                hasAudio={hasAudio}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

// Descript-style transcript block with word-by-word highlighting
function TranscriptBlock({ 
  entry, 
  entryIndex,
  playbackTime,
  isPlaying,
  hasAudio
}: { 
  entry: TranscriptEntry
  entryIndex: number
  playbackTime: number
  isPlaying: boolean
  hasAudio: boolean
}) {
  const isClinician = entry.speaker === "clinician"
  
  // Generate word timings (in production, these come from transcription service)
  const baseTime = entryIndex * 25 // Each entry starts ~25s apart
  const words = entry.words || entry.text.split(" ").map((word, i, arr) => {
    const wordDuration = 0.4 + (word.length * 0.05) // Vary by word length
    const prevEnd = i === 0 ? baseTime : baseTime + (arr.slice(0, i).reduce((acc, w) => acc + 0.4 + (w.length * 0.05), 0))
    return {
      text: word,
      start: prevEnd,
      end: prevEnd + wordDuration
    }
  })

  // Find the current word index for cursor position
  const currentWordIndex = words.findIndex(w => playbackTime >= w.start && playbackTime < w.end)

  return (
    <div className="group">
      {/* Speaker Label */}
      <div className="flex items-center gap-2 mb-2">
        <div className={cn(
          "flex h-5 w-5 items-center justify-center rounded-full",
          isClinician 
            ? "bg-primary/10 text-primary" 
            : "bg-muted text-muted-foreground"
        )}>
          {isClinician ? (
            <Stethoscope className="h-2.5 w-2.5" />
          ) : (
            <User className="h-2.5 w-2.5" />
          )}
        </div>
        <span className={cn(
          "text-xs font-medium",
          isClinician ? "text-primary" : "text-muted-foreground"
        )}>
          {isClinician ? "Clinician" : "Patient"}
        </span>
      </div>

      {/* Transcript Text with Word Highlighting */}
      <div className="pl-7">
        <p className="text-sm leading-[1.9] text-foreground/90">
          {words.map((word, idx) => {
            const isSpoken = hasAudio && isPlaying && playbackTime >= word.start
            const isCurrent = hasAudio && isPlaying && playbackTime >= word.start && playbackTime < word.end
            
            return (
              <span
                key={idx}
                data-active={isCurrent}
                className={cn(
                  "transition-colors duration-100",
                  // Only highlight when audio is playing
                  hasAudio && isPlaying && isSpoken && !isCurrent && "bg-primary/15 rounded-[2px]",
                  isCurrent && "bg-primary text-primary-foreground rounded-[2px] px-0.5 -mx-0.5"
                )}
              >
                {word.text}
                {idx < words.length - 1 ? " " : ""}
              </span>
            )
          })}
          {/* Blinking cursor at current position */}
          {hasAudio && isPlaying && currentWordIndex >= 0 && (
            <span 
              className="inline-block w-[2px] h-[1em] bg-primary ml-0.5 align-text-bottom animate-pulse" 
              style={{ animationDuration: "530ms" }}
            />
          )}
        </p>
      </div>
    </div>
  )
}
