"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Mic, Loader2, CheckCircle2, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Visit {
  id: string
  patientName: string
  status: "recording" | "processing" | "done" | "scheduled"
  time: string
  date: string
  chiefComplaint?: string
}

interface VisitsPanelProps {
  visits: Visit[]
  selectedVisitId: string | null
  onSelectVisit: (id: string) => void
  onNewVisit: () => void
}

const statusConfig = {
  recording: {
    icon: Mic,
    label: "Recording",
    className: "bg-destructive/10 text-destructive",
    iconClassName: "animate-pulse",
  },
  processing: {
    icon: Loader2,
    label: "Processing",
    className: "bg-amber-500/10 text-amber-600",
    iconClassName: "animate-spin",
  },
  done: {
    icon: CheckCircle2,
    label: "Complete",
    className: "bg-success/10 text-success",
    iconClassName: "",
  },
  scheduled: {
    icon: Clock,
    label: "Scheduled",
    className: "bg-muted text-muted-foreground",
    iconClassName: "",
  },
}

export function VisitsPanel({
  visits,
  selectedVisitId,
  onSelectVisit,
  onNewVisit,
}: VisitsPanelProps) {
  // Group visits by date
  const groupedVisits = visits.reduce(
    (acc, visit) => {
      const bucket = acc[visit.date] ?? []
      bucket.push(visit)
      acc[visit.date] = bucket
      return acc
    },
    {} as Record<string, Visit[]>
  )

  const totalVisits = visits.length
  const completedVisits = visits.filter((v) => v.status === "done").length

  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-4">
        <h2 className="font-semibold text-foreground">Visits</h2>
        <Button size="sm" onClick={onNewVisit} className="gap-1.5">
          <Plus className="h-4 w-4" />
          New
        </Button>
      </div>

      {/* Visit List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {Object.entries(groupedVisits).map(([date, dateVisits]) => (
            <div key={date} className="mb-4">
              <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {date}
              </p>
              <div className="space-y-1">
                {dateVisits.map((visit) => {
                  const status = statusConfig[visit.status]
                  const StatusIcon = status.icon
                  const isSelected = selectedVisitId === visit.id

                  return (
                    <button
                      key={visit.id}
                      type="button"
                      onClick={() => onSelectVisit(visit.id)}
                      className={cn(
                        "w-full rounded-lg p-3 text-left transition-colors",
                        isSelected
                          ? "bg-primary/10 border border-primary/20"
                          : "hover:bg-muted"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-foreground">
                            {visit.patientName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {visit.time}
                          </p>
                          {visit.chiefComplaint && (
                            <p className="mt-1 truncate text-xs text-muted-foreground">
                              {visit.chiefComplaint}
                            </p>
                          )}
                        </div>
                        <Badge
                          variant="secondary"
                          className={cn("shrink-0 gap-1 text-xs", status.className)}
                        >
                          <StatusIcon
                            className={cn("h-3 w-3", status.iconClassName)}
                          />
                          <span className="sr-only">{status.label}</span>
                        </Badge>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-border p-4">
        <p className="text-center text-xs text-muted-foreground">
          {completedVisits} of {totalVisits} visits complete
        </p>
      </div>
    </div>
  )
}
