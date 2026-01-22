"use client"

import { Button } from "@/components/ui/button"
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
    dotColor: "bg-red-500",
    animate: true,
  },
  processing: {
    icon: Loader2,
    dotColor: "bg-amber-500",
    animate: true,
  },
  done: {
    icon: CheckCircle2,
    dotColor: "bg-emerald-500",
    animate: false,
  },
  scheduled: {
    icon: Clock,
    dotColor: "bg-muted-foreground/40",
    animate: false,
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
    {} as Record<string, Visit[]>,
  )

  return (
    <div className="flex h-full w-64 flex-col border-r border-border/40">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-3">
        <h2 className="text-sm font-semibold text-foreground">Visits</h2>
        <Button 
          size="sm" 
          variant="ghost"
          onClick={onNewVisit} 
          className="h-7 w-7 p-0 hover:bg-primary/10"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Visit List */}
      <ScrollArea className="flex-1">
        <div className="px-2 pb-4">
          {Object.entries(groupedVisits).map(([date, dateVisits]) => (
            <div key={date} className="mb-3">
              <p className="mb-1.5 px-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
                {date}
              </p>
              <div className="space-y-0.5">
                {dateVisits.map((visit) => {
                  const status = statusConfig[visit.status]
                  const isSelected = selectedVisitId === visit.id

                  return (
                    <button
                      key={visit.id}
                      type="button"
                      onClick={() => onSelectVisit(visit.id)}
                      className={cn(
                        "group w-full rounded-lg px-2 py-2 text-left transition-colors",
                        isSelected
                          ? "bg-primary/10"
                          : "hover:bg-muted/50"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={cn(
                          "h-2 w-2 rounded-full shrink-0",
                          status.dotColor,
                          status.animate && "animate-pulse"
                        )} />
                        <div className="min-w-0 flex-1">
                          <p className={cn(
                            "truncate text-sm",
                            isSelected ? "font-medium text-foreground" : "text-foreground/80"
                          )}>
                            {visit.patientName}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {visit.time}
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
