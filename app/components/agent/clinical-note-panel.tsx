"use client";

import type { ReactNode } from "react";
import { FileText } from "lucide-react";
import type { Visit } from "./visits-panel";

interface ClinicalNotePanelProps {
  visit: Visit | null;
  children: ReactNode;
}

export function ClinicalNotePanel({ visit, children }: ClinicalNotePanelProps) {
  if (!visit) {
    return (
      <div className="flex h-full w-[420px] flex-col border-l border-border bg-card">
        <div className="flex h-full items-center justify-center p-8">
          <div className="text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium text-foreground">
              No note available
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Select or record a visit to generate clinical documentation.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-[420px] flex-col border-l border-border bg-card">
      <div className="border-b border-border p-4">
        <h3 className="text-sm font-semibold text-foreground">Clinical Note</h3>
        <p className="text-xs text-muted-foreground">
          Generate structured output, codes, and export assets.
        </p>
      </div>
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
}
