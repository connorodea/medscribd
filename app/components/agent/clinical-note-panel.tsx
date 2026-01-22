"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import {
  Sparkles,
  Copy,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  Loader2,
  ChevronDown,
  ChevronRight,
  FileType,
  FileCode,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { Visit } from "./visits-panel"

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

interface ClinicalNotePanelProps {
  visit: Visit | null
  note: ClinicalNote | null
  codingSuggestions: CodingSuggestion[]
  verificationItems: VerificationItem[]
  onGenerateNote: () => void
  isGenerating: boolean
}

export function ClinicalNotePanel({
  visit,
  note,
  codingSuggestions,
  verificationItems,
  onGenerateNote,
  isGenerating,
}: ClinicalNotePanelProps) {
  const [copied, setCopied] = useState(false)
  const [editedNote, setEditedNote] = useState<ClinicalNote | null>(null)
  const [expandedSections, setExpandedSections] = useState<string[]>(["subjective", "objective", "assessment", "plan"])
  const [localVerification, setLocalVerification] = useState(verificationItems)

  const currentNote = editedNote || note
  const unresolvedCount = localVerification.filter((item) => !item.resolved).length

  const formatNoteAsText = () => {
    if (!currentNote) return ""
    return `SUBJECTIVE:\n${currentNote.subjective}\n\nOBJECTIVE:\n${currentNote.objective}\n\nASSESSMENT:\n${currentNote.assessment}\n\nPLAN:\n${currentNote.plan}`
  }

  const handleCopy = () => {
    if (!currentNote) return
    navigator.clipboard.writeText(formatNoteAsText())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleExportMarkdown = () => {
    if (!currentNote || !visit) return
    const content = `# Clinical Note - ${visit.patientName}\n\n**Date:** ${visit.date} at ${visit.time}\n**Chief Complaint:** ${visit.chiefComplaint}\n\n---\n\n## Subjective\n${currentNote.subjective}\n\n## Objective\n${currentNote.objective}\n\n## Assessment\n${currentNote.assessment}\n\n## Plan\n${currentNote.plan}`
    
    const blob = new Blob([content], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `clinical-note-${visit.patientName.replace(/\s+/g, "-").toLowerCase()}-${visit.date}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleExportDocx = async () => {
    if (!currentNote || !visit) return
    
    // Create a simple HTML structure that can be opened in Word
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Clinical Note - ${visit.patientName}</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: #1a1a1a; border-bottom: 2px solid #0066cc; padding-bottom: 10px; }
          h2 { color: #333; margin-top: 24px; }
          .meta { color: #666; margin-bottom: 20px; }
          .section { margin-bottom: 16px; line-height: 1.6; }
        </style>
      </head>
      <body>
        <h1>Clinical Note</h1>
        <div class="meta">
          <p><strong>Patient:</strong> ${visit.patientName}</p>
          <p><strong>Date:</strong> ${visit.date} at ${visit.time}</p>
          <p><strong>Chief Complaint:</strong> ${visit.chiefComplaint}</p>
        </div>
        <h2>Subjective</h2>
        <div class="section">${currentNote.subjective.replace(/\n/g, "<br>")}</div>
        <h2>Objective</h2>
        <div class="section">${currentNote.objective.replace(/\n/g, "<br>")}</div>
        <h2>Assessment</h2>
        <div class="section">${currentNote.assessment.replace(/\n/g, "<br>")}</div>
        <h2>Plan</h2>
        <div class="section">${currentNote.plan.replace(/\n/g, "<br>")}</div>
      </body>
      </html>
    `
    
    const blob = new Blob([htmlContent], { type: "application/vnd.ms-word" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `clinical-note-${visit.patientName.replace(/\s+/g, "-").toLowerCase()}-${visit.date}.doc`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleExportPdf = () => {
    if (!currentNote || !visit) return
    
    // Create a printable HTML page and trigger print dialog (save as PDF)
    const printWindow = window.open("", "_blank")
    if (!printWindow) return
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Clinical Note - ${visit.patientName}</title>
        <style>
          @page { margin: 1in; }
          body { font-family: Arial, sans-serif; max-width: 100%; margin: 0; padding: 0; color: #1a1a1a; }
          h1 { font-size: 24px; color: #1a1a1a; border-bottom: 2px solid #0066cc; padding-bottom: 10px; margin-bottom: 16px; }
          h2 { font-size: 16px; color: #333; margin-top: 20px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
          .meta { color: #666; margin-bottom: 24px; font-size: 14px; }
          .meta p { margin: 4px 0; }
          .section { margin-bottom: 16px; line-height: 1.6; font-size: 14px; white-space: pre-wrap; }
          .logo { font-weight: bold; color: #0066cc; font-size: 20px; margin-bottom: 24px; }
        </style>
      </head>
      <body>
        <div class="logo">MedScribd</div>
        <h1>Clinical Note</h1>
        <div class="meta">
          <p><strong>Patient:</strong> ${visit.patientName}</p>
          <p><strong>Date:</strong> ${visit.date} at ${visit.time}</p>
          <p><strong>Chief Complaint:</strong> ${visit.chiefComplaint}</p>
        </div>
        <h2>Subjective</h2>
        <div class="section">${currentNote.subjective}</div>
        <h2>Objective</h2>
        <div class="section">${currentNote.objective}</div>
        <h2>Assessment</h2>
        <div class="section">${currentNote.assessment}</div>
        <h2>Plan</h2>
        <div class="section">${currentNote.plan}</div>
      </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
    }, 250)
  }

  const handleNoteChange = (section: keyof ClinicalNote, value: string) => {
    setEditedNote((prev) => ({
      subjective: prev?.subjective || note?.subjective || "",
      objective: prev?.objective || note?.objective || "",
      assessment: prev?.assessment || note?.assessment || "",
      plan: prev?.plan || note?.plan || "",
      [section]: value,
    }))
  }

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    )
  }

  const toggleVerification = (id: string) => {
    setLocalVerification((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, resolved: !item.resolved } : item
      )
    )
  }

  if (!visit) {
    return (
      <div className="flex h-full w-80 shrink-0 flex-col border-l border-border/40 bg-muted/20">
        <div className="flex h-full items-center justify-center">
          <div className="text-center px-6">
            <FileText className="h-8 w-8 text-muted-foreground/30 mx-auto" />
            <p className="mt-3 text-sm text-muted-foreground">
              Select a visit to view notes
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full w-80 shrink-0 flex-col border-l border-border/40 bg-muted/20 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-border/40">
        <h3 className="text-sm font-semibold text-foreground">Clinical Note</h3>
        {currentNote && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={handleCopy}
            >
              {copied ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                >
                  <Download className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
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
          </div>
        )}
      </div>

      {/* Content */}
      {!currentNote ? (
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <Button
            onClick={onGenerateNote}
            disabled={isGenerating}
            className="gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Note
              </>
            )}
          </Button>
          <p className="mt-3 text-xs text-muted-foreground text-center max-w-[200px]">
            AI will analyze the transcript and generate a clinical note
          </p>
        </div>
      ) : (
        <ScrollArea className="flex-1 overflow-hidden">
          <div className="p-3 space-y-2.5">
            {/* SOAP Sections */}
            {[
              { key: "subjective" as const, label: "S", fullLabel: "Subjective" },
              { key: "objective" as const, label: "O", fullLabel: "Objective" },
              { key: "assessment" as const, label: "A", fullLabel: "Assessment" },
              { key: "plan" as const, label: "P", fullLabel: "Plan" },
            ].map((section) => {
              const isExpanded = expandedSections.includes(section.key)
              
              return (
                <div key={section.key} className="rounded-md border border-border/40 bg-card overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleSection(section.key)}
                    className="flex items-center gap-1.5 w-full px-2.5 py-1.5 text-left hover:bg-muted/50 transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-3 w-3 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-3 w-3 text-muted-foreground" />
                    )}
                    <span className="text-xs font-bold text-primary">{section.label}</span>
                    <span className="text-xs font-medium text-foreground">{section.fullLabel}</span>
                  </button>
                  
                  {isExpanded && (
                    <div className="px-2.5 pb-2.5">
                      <Textarea
                        value={currentNote[section.key]}
                        onChange={(e) => handleNoteChange(section.key, e.target.value)}
                        className="min-h-[60px] resize-none text-xs border-0 bg-transparent p-0 focus-visible:ring-0 leading-relaxed"
                        placeholder={`Enter ${section.fullLabel.toLowerCase()}...`}
                      />
                    </div>
                  )}
                </div>
              )
            })}

            {/* Coding Suggestions */}
            {codingSuggestions.length > 0 && (
              <div className="pt-1">
                <p className="text-[11px] font-medium text-muted-foreground mb-1.5">Suggested Codes</p>
                <div className="space-y-1">
                  {codingSuggestions.map((suggestion) => (
                    <div
                      key={suggestion.code}
                      className="flex items-center justify-between rounded-md bg-card border border-border/40 px-2 py-1.5"
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-[9px] font-mono px-1 shrink-0",
                            suggestion.type === "icd10"
                              ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                              : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          )}
                        >
                          {suggestion.code}
                        </Badge>
                        <span className="text-[11px] text-foreground truncate">
                          {suggestion.description}
                        </span>
                      </div>
                      <span className="text-[9px] text-muted-foreground shrink-0 ml-1">
                        {suggestion.confidence}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Verification Items */}
            {localVerification.length > 0 && unresolvedCount > 0 && (
              <div className="pt-1">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <AlertCircle className="h-3 w-3 text-amber-500" />
                  <p className="text-[11px] font-medium text-amber-600 dark:text-amber-400">
                    {unresolvedCount} item{unresolvedCount > 1 ? "s" : ""} to verify
                  </p>
                </div>
                <div className="space-y-1">
                  {localVerification.filter(item => !item.resolved).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleVerification(item.id)}
                      className="flex items-start gap-1.5 w-full text-left rounded-md bg-amber-500/5 border border-amber-500/20 px-2 py-1.5 hover:bg-amber-500/10 transition-colors"
                    >
                      <div className="h-3.5 w-3.5 shrink-0 rounded border border-amber-500/40 mt-0.5" />
                      <span className="text-[11px] text-foreground leading-relaxed">
                        {item.text}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}
