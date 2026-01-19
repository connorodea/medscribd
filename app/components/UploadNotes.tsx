"use client";

import { useState } from "react";

type UploadedFile = {
  name: string;
  storedAs: string;
  size: number;
  type: string;
};

type SoapNote = {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
};

type CodeSuggestion = {
  code: string;
  description: string;
  confidence: "low" | "medium" | "high";
};

type ProcessResult = {
  transcript: string;
  soap: SoapNote | null;
  clinical_note?: string;
  verification_needed?: string[];
  icd10: CodeSuggestion[];
  cpt: CodeSuggestion[];
  warning?: string | null;
  error?: string | null;
};

const templates = [
  { id: "primary_care", label: "Primary Care" },
  { id: "cardiology", label: "Cardiology" },
  { id: "orthopedics", label: "Orthopedics" },
  { id: "psychiatry", label: "Psychiatry" },
  { id: "physical_therapy", label: "Physical Therapy" },
] as const;

const formatBytes = (value: number) => {
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
};

export default function UploadNotes() {
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState<UploadedFile[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>(templates[0].id);
  const [patientContext, setPatientContext] = useState("");
  const [noteType, setNoteType] = useState("SOAP Note");
  const [processing, setProcessing] = useState<Record<string, boolean>>({});
  const [results, setResults] = useState<Record<string, ProcessResult>>({});

  const handleExport = async (result: ProcessResult, format: "pdf" | "docx" | "md") => {
    if (!result.clinical_note) {
      setMessage("Generate a clinical note before exporting.");
      return;
    }

    const response = await fetch("/api/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clinical_note: result.clinical_note,
        verification_needed: result.verification_needed || [],
        note_type: noteType,
        patient_context: patientContext,
        format,
      }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setMessage(body.error || "Export failed.");
      return;
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `medscribd-note.${format}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const onUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setMessage(null);

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Upload failed.");
      }
      const data = (await response.json()) as { saved: UploadedFile[] };
      setUploaded((prev) => [...data.saved, ...prev]);
      setMessage(`Uploaded ${data.saved.length} file${data.saved.length === 1 ? "" : "s"}.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed.";
      setMessage(message);
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const onProcess = async (file: UploadedFile) => {
    setProcessing((prev) => ({ ...prev, [file.storedAs]: true }));
    setMessage(null);
    try {
      const response = await fetch("/api/process-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storedAs: file.storedAs,
          templateId: selectedTemplate,
          patientContext,
          noteType,
        }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Processing failed.");
      }
      const data = (await response.json()) as ProcessResult;
      setResults((prev) => ({ ...prev, [file.storedAs]: { ...data, error: null } }));
      if (data.warning) {
        setMessage(data.warning);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Processing failed.";
      setMessage(message);
      setResults((prev) => ({
        ...prev,
        [file.storedAs]: {
          transcript: "",
          soap: null,
          clinical_note: "",
          verification_needed: [],
          icd10: [],
          cpt: [],
          warning: null,
          error: message,
        },
      }));
    } finally {
      setProcessing((prev) => ({ ...prev, [file.storedAs]: false }));
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-brand-mist/70">
            Upload & Generate
          </div>
          <h2 className="text-lg font-semibold text-brand-cloud">Files & context</h2>
          <p className="mt-1 text-xs text-brand-mist/70">
            Upload audio or notes, add patient context, and generate structured outputs.
          </p>
        </div>
        <label className="inline-flex cursor-pointer items-center rounded-full bg-brand-amber px-4 py-2 text-xs font-semibold text-brand-ink hover:bg-[#f2a94a] transition-colors">
          <input
            type="file"
            multiple
            accept=".txt,.md,audio/*"
            className="hidden"
            onChange={onUpload}
            disabled={isUploading}
          />
          {isUploading ? "Uploading..." : "Upload files"}
        </label>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_1fr]">
        <select
          value={selectedTemplate}
          onChange={(event) => setSelectedTemplate(event.target.value)}
          className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-xs text-brand-cloud"
        >
          {templates.map((template) => (
            <option key={template.id} value={template.id} className="text-brand-ink">
              {template.label}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={noteType}
          onChange={(event) => setNoteType(event.target.value)}
          placeholder="Note type (e.g., SOAP Note)"
          className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-xs text-brand-cloud placeholder:text-brand-mist/50"
        />
      </div>

      <div className="mt-3">
        <label className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-mist/70">
          Patient context
        </label>
        <textarea
          value={patientContext}
          onChange={(event) => setPatientContext(event.target.value)}
          placeholder="Patient context or appointment info (optional)"
          rows={4}
          className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-brand-cloud placeholder:text-brand-mist/50"
        />
      </div>
      {message && <div className="mt-3 text-xs text-brand-mist/80">{message}</div>}
      {uploaded.length > 0 && (
        <div className="mt-5 space-y-4 text-xs text-brand-mist/70">
          {uploaded.map((file) => {
            const result = results[file.storedAs];
            const isProcessing = processing[file.storedAs];
            return (
              <div
                key={file.storedAs}
                className="rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-brand-cloud">{file.name}</div>
                    <div className="text-brand-mist/60">{formatBytes(file.size)}</div>
                  </div>
                  <button
                    onClick={() => onProcess(file)}
                    className="inline-flex items-center justify-center rounded-full border border-brand-mist/30 px-4 py-2 text-xs font-semibold text-brand-cloud hover:border-brand-mist/70 transition-colors"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : "Generate note"}
                  </button>
                </div>
                {result && (
                  <div className="mt-4 space-y-3 text-[11px] text-brand-mist/70">
                    {result.error && (
                      <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-red-200">
                        {result.error}
                      </div>
                    )}
                    <div className="rounded-lg border border-white/10 bg-[#0b1220] p-3">
                      <div className="text-brand-cloud font-semibold">Clinical Note</div>
                      {result.clinical_note ? (
                        <pre className="mt-2 whitespace-pre-wrap text-[11px] text-brand-mist/80 font-fira">
                          {result.clinical_note}
                        </pre>
                      ) : result.soap ? (
                        <pre className="mt-2 whitespace-pre-wrap text-[11px] text-brand-mist/80 font-fira">{`S: ${result.soap.subjective}\nO: ${result.soap.objective}\nA: ${result.soap.assessment}\nP: ${result.soap.plan}`}</pre>
                      ) : (
                        <div className="mt-2">Transcript ready. Configure LLM keys to generate notes.</div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleExport(result, "pdf")}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-brand-cloud hover:border-brand-mist/70"
                      >
                        Export PDF
                      </button>
                      <button
                        onClick={() => handleExport(result, "docx")}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-brand-cloud hover:border-brand-mist/70"
                      >
                        Export DOCX
                      </button>
                      <button
                        onClick={() => handleExport(result, "md")}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-brand-cloud hover:border-brand-mist/70"
                      >
                        Export Markdown
                      </button>
                    </div>
                    {result.verification_needed && result.verification_needed.length > 0 && (
                      <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                        <div className="text-brand-cloud font-semibold">Verification Needed</div>
                        <ul className="mt-2 space-y-1">
                          {result.verification_needed.map((item, index) => (
                            <li key={`${item}-${index}`}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                        <div className="text-brand-cloud font-semibold">ICD-10 Suggestions</div>
                        {result.icd10.length ? (
                          <ul className="mt-2 space-y-1">
                            {result.icd10.map((code) => (
                              <li key={`${code.code}-${code.description}`}>
                                <span className="text-brand-cloud">{code.code}</span> {code.description}{" "}
                                <span className="text-brand-mist/50">({code.confidence})</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="mt-2">No suggestions yet.</div>
                        )}
                      </div>
                      <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                        <div className="text-brand-cloud font-semibold">CPT Suggestions</div>
                        {result.cpt.length ? (
                          <ul className="mt-2 space-y-1">
                            {result.cpt.map((code) => (
                              <li key={`${code.code}-${code.description}`}>
                                <span className="text-brand-cloud">{code.code}</span> {code.description}{" "}
                                <span className="text-brand-mist/50">({code.confidence})</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="mt-2">No suggestions yet.</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
