"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Mic,
  Loader2,
  CheckCircle2,
  Clock,
  Search,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface Visit {
  id: string;
  patientName: string;
  status: "recording" | "processing" | "done" | "scheduled";
  time: string;
  date: string;
  chiefComplaint?: string;
}

interface VisitsPanelProps {
  visits: Visit[];
  selectedVisitId: string | null;
  onSelectVisit: (id: string) => void;
  onNewVisit: () => void;
}

const statusConfig = {
  recording: {
    icon: Mic,
    label: "Recording",
    className:
      "border-red-200 bg-red-100 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400",
    iconClassName: "animate-pulse",
    dotColor: "bg-red-500",
  },
  processing: {
    icon: Loader2,
    label: "Processing",
    className:
      "border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-400",
    iconClassName: "animate-spin",
    dotColor: "bg-amber-500",
  },
  done: {
    icon: CheckCircle2,
    label: "Complete",
    className:
      "border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-400",
    iconClassName: "",
    dotColor: "bg-emerald-500",
  },
  scheduled: {
    icon: Clock,
    label: "Scheduled",
    className:
      "border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400",
    iconClassName: "",
    dotColor: "bg-slate-400",
  },
};

export function VisitsPanel({
  visits,
  selectedVisitId,
  onSelectVisit,
  onNewVisit,
}: VisitsPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVisits = visits.filter(
    (visit) =>
      visit.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visit.chiefComplaint?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const groupedVisits = filteredVisits.reduce(
    (acc, visit) => {
      const bucket = acc[visit.date] ?? [];
      bucket.push(visit);
      acc[visit.date] = bucket;
      return acc;
    },
    {} as Record<string, Visit[]>,
  );

  const totalVisits = visits.length;
  const completedVisits = visits.filter((v) => v.status === "done").length;

  return (
    <div className="flex h-full w-72 flex-col border-r border-border/60 bg-slate-50/50 dark:bg-slate-900/50">
      <div className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Visits</h2>
            <p className="text-xs text-muted-foreground">
              {completedVisits} of {totalVisits} complete
            </p>
          </div>
          <Button
            size="sm"
            onClick={onNewVisit}
            className="h-8 gap-1.5 rounded-full bg-primary px-3 text-xs font-medium shadow-sm hover:bg-primary/90"
          >
            <Plus className="h-3.5 w-3.5" />
            New Visit
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search patients..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="h-9 rounded-full border-border/60 bg-background pl-9 text-sm"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 px-2">
        <div className="pb-4">
          {Object.entries(groupedVisits).map(([date, dateVisits]) => (
            <div key={date} className="mb-4">
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {date}
              </p>
              <div className="space-y-1">
                {dateVisits.map((visit) => {
                  const status = statusConfig[visit.status];
                  const StatusIcon = status.icon;
                  const isSelected = selectedVisitId === visit.id;

                  return (
                    <button
                      key={visit.id}
                      type="button"
                      onClick={() => onSelectVisit(visit.id)}
                      className={cn(
                        "group w-full rounded-xl p-3 text-left transition-all duration-200",
                        isSelected
                          ? "bg-white shadow-sm ring-1 ring-primary/20 dark:bg-slate-800"
                          : "hover:bg-white/80 dark:hover:bg-slate-800/50",
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "mt-1 h-2.5 w-2.5 shrink-0 rounded-full",
                            status.dotColor,
                            visit.status === "recording" && "animate-pulse",
                          )}
                        />

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-sm font-medium text-foreground">
                              {visit.patientName}
                            </p>
                            <ChevronRight
                              className={cn(
                                "h-4 w-4 shrink-0 text-muted-foreground/50 transition-transform",
                                isSelected && "text-primary",
                              )}
                            />
                          </div>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {visit.time}
                          </p>
                          {visit.chiefComplaint && (
                            <p className="mt-1.5 truncate text-xs italic text-muted-foreground/80">
                              {visit.chiefComplaint}
                            </p>
                          )}
                        </div>
                      </div>

                      {visit.status !== "scheduled" && (
                        <div className="ml-5 mt-2">
                          <Badge
                            variant="outline"
                            className={cn(
                              "gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium",
                              status.className,
                            )}
                          >
                            <StatusIcon className={cn("h-3 w-3", status.iconClassName)} />
                            {status.label}
                          </Badge>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {filteredVisits.length === 0 && searchQuery && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Search className="h-8 w-8 text-muted-foreground/40" />
              <p className="mt-2 text-sm text-muted-foreground">No patients found</p>
              <p className="text-xs text-muted-foreground/70">
                Try a different search term
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
