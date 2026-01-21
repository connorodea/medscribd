"use client";

import { useMemo, useRef, useState, useEffect } from "react";

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

type TranscriptWord = {
  word: string;
  punctuated_word?: string;
  start: number;
  end: number;
};

type ProcessResult = {
  transcript: string;
  word_timestamps?: TranscriptWord[];
  audio_url?: string | null;
  soap: SoapNote | null;
  clinical_note?: string;
  verification_needed?: string[];
  icd10: CodeSuggestion[];
  cpt: CodeSuggestion[];
  warning?: string | null;
  error?: string | null;
};

type Substitution = {
  from: string;
  to: string;
};

const templates = [
  { id: "primary_care", label: "Primary Care" },
  { id: "cardiology", label: "Cardiology" },
  { id: "orthopedics", label: "Orthopedics" },
  { id: "psychiatry", label: "Psychiatry" },
  { id: "physical_therapy", label: "Physical Therapy" },
] as const;

const substitutionStorageKey = "medscribd_substitutions";

const formatBytes = (value: number) => {
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
};

const formatTimestamp = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeSubstitutions = (substitutions: Substitution[]) =>
  substitutions
    .map((entry) => ({
      from: entry.from.trim(),
      to: entry.to.trim(),
    }))
    .filter((entry) => entry.from && entry.to);

const applySubstitutionsToText = (text: string, substitutions: Substitution[]) => {
  let updated = text;
  substitutions.forEach((entry) => {
    const pattern = new RegExp(`\\b${escapeRegExp(entry.from)}\\b`, "gi");
    updated = updated.replace(pattern, entry.to);
  });
  return updated;
};

const applySubstitutionsToWords = (words: TranscriptWord[], substitutions: Substitution[]) => {
  if (!words.length || !substitutions.length) return words;
  return words.map((word) => {
    const match = substitutions.find(
      (entry) => entry.from.toLowerCase() === word.word.toLowerCase(),
    );
    if (!match) return word;
    return {
      ...word,
      word: match.to,
      punctuated_word: word.punctuated_word
        ? word.punctuated_word.replace(
            new RegExp(escapeRegExp(word.word), "i"),
            match.to,
          )
        : word.punctuated_word,
    };
  });
};

const buildTranscriptLines = (words: TranscriptWord[]) => {
  const lines: TranscriptWord[][] = [];
  let currentLine: TranscriptWord[] = [];

  words.forEach((word) => {
    currentLine.push(word);
    const punctuated = word.punctuated_word || word.word;
    if (/[.!?]$/.test(punctuated)) {
      lines.push(currentLine);
      currentLine = [];
    }
  });

  if (currentLine.length) {
    lines.push(currentLine);
  }

  return lines;
};

function TranscriptWithAudio({
  result,
  substitutions,
}: {
  result: ProcessResult;
  substitutions: Substitution[];
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeWordRef = useRef<HTMLButtonElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  const normalized = useMemo(
    () => normalizeSubstitutions(substitutions),
    [substitutions],
  );

  const substitutedWords = useMemo(
    () => applySubstitutionsToWords(result.word_timestamps || [], normalized),
    [result.word_timestamps, normalized],
  );

  const substitutedTranscript = useMemo(
    () => applySubstitutionsToText(result.transcript || "", normalized),
    [result.transcript, normalized],
  );

  const transcriptLines = useMemo(
    () => buildTranscriptLines(substitutedWords),
    [substitutedWords],
  );

  const activeWordIndex = useMemo(() => {
    if (!substitutedWords.length || !result.audio_url) return -1;
    for (let i = 0; i < substitutedWords.length; i += 1) {
      const word = substitutedWords[i];
      if (currentTime >= word.start && currentTime <= word.end) {
        return i;
      }
    }
    for (let i = substitutedWords.length - 1; i >= 0; i -= 1) {
      if (currentTime >= substitutedWords[i].start) {
        return i;
      }
    }
    return -1;
  }, [currentTime, substitutedWords, result.audio_url]);

  const activeWord =
    activeWordIndex >= 0 ? substitutedWords[activeWordIndex] : null;

  const handleSeek = (time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    audioRef.current.play().catch(() => undefined);
  };

  const handleTogglePlay = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play().catch(() => undefined);
    } else {
      audioRef.current.pause();
    }
  };

  const handleSkip = (delta: number) => {
    if (!audioRef.current) return;
    const nextTime = Math.min(
      Math.max(audioRef.current.currentTime + delta, 0),
      duration || audioRef.current.duration || 0,
    );
    audioRef.current.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const handleScrub = (value: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = value;
    setCurrentTime(value);
  };

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  useEffect(() => {
    if (!activeWordRef.current) return;
    activeWordRef.current.scrollIntoView({
      block: "nearest",
      inline: "start",
      behavior: "smooth",
    });
  }, [activeWordIndex]);

  const remaining = Math.max(duration - currentTime, 0);

  return (
    <div className="rounded-lg border border-border bg-muted/20 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-foreground font-semibold">Transcript</div>
        {result.audio_url && (
          <div className="text-xs text-muted-foreground">
            Click a word to jump to that time.
          </div>
        )}
      </div>
      {result.audio_url && (
        <div className="mt-3 space-y-3">
          <audio
            ref={audioRef}
            src={result.audio_url || undefined}
            onTimeUpdate={(event) =>
              setCurrentTime((event.target as HTMLAudioElement).currentTime)
            }
            onLoadedMetadata={(event) =>
              setDuration((event.target as HTMLAudioElement).duration || 0)
            }
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            preload="metadata"
          />
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleSkip(-10)}
              className="rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground transition-colors hover:border-primary/40"
            >
              -10s
            </button>
            <button
              type="button"
              onClick={handleTogglePlay}
              className="rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {isPlaying ? "Pause" : "Play"}
            </button>
            <button
              type="button"
              onClick={() => handleSkip(10)}
              className="rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground transition-colors hover:border-primary/40"
            >
              +10s
            </button>
            <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
              <span>{formatTimestamp(currentTime)}</span>
              <span>/</span>
              <span>{formatTimestamp(duration || 0)}</span>
              <span className="text-muted-foreground/70">
                (-{formatTimestamp(remaining)})
              </span>
            </div>
          </div>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.01}
            value={Math.min(currentTime, duration || 0)}
            onChange={(event) => handleScrub(Number(event.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <div>
              Now playing:{" "}
              <span className="text-foreground font-semibold">
                {activeWord ? activeWord.punctuated_word || activeWord.word : "—"}
              </span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              {[1, 2, 3].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => setPlaybackRate(rate)}
                  className={`rounded-full border px-3 py-1 transition-colors ${
                    playbackRate === rate
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-border bg-background text-foreground hover:border-primary/40"
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {substitutedWords.length > 0 ? (
        <div className="mt-3 max-h-64 space-y-3 overflow-auto text-xs text-muted-foreground scrollbar-thin">
          {transcriptLines.map((line, lineIndex) => (
            <div key={`line-${lineIndex}`} className="leading-relaxed">
              <span className="mr-2 text-[10px] uppercase tracking-wide text-muted-foreground/70">
                {formatTimestamp(line[0]?.start || 0)}
              </span>
              {line.map((word, index) => (
                <button
                  key={`${word.word}-${index}-${word.start}`}
                  type="button"
                  onClick={() => handleSeek(word.start)}
                  ref={
                    activeWord?.start === word.start && activeWord?.end === word.end
                      ? activeWordRef
                      : undefined
                  }
                  className={`inline-flex items-center rounded px-1 py-0.5 transition-colors ${
                    activeWord?.start === word.start && activeWord?.end === word.end
                      ? "bg-primary/15 text-foreground"
                      : "text-foreground/80 hover:text-foreground"
                  }`}
                  title={formatTimestamp(word.start)}
                >
                  {word.punctuated_word || word.word}
                  {" "}
                </button>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <pre className="mt-3 whitespace-pre-wrap text-xs text-muted-foreground">
          {substitutedTranscript || "Transcript will appear here."}
        </pre>
      )}
    </div>
  );
}

export default function UploadNotes() {
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState<UploadedFile[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>(templates[0].id);
  const [patientContext, setPatientContext] = useState("");
  const [noteType, setNoteType] = useState("SOAP Note");
  const [processing, setProcessing] = useState<Record<string, boolean>>({});
  const [results, setResults] = useState<Record<string, ProcessResult>>({});
  const [substitutions, setSubstitutions] = useState<Substitution[]>([]);
  const [newFrom, setNewFrom] = useState("");
  const [newTo, setNewTo] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(substitutionStorageKey);
    if (stored) {
      try {
        setSubstitutions(JSON.parse(stored) as Substitution[]);
      } catch (error) {
        console.error("Failed to parse substitutions:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(substitutionStorageKey, JSON.stringify(substitutions));
  }, [substitutions]);

  const handleAddSubstitution = () => {
    if (!newFrom.trim() || !newTo.trim()) return;
    setSubstitutions((prev) => [
      { from: newFrom.trim(), to: newTo.trim() },
      ...prev,
    ]);
    setNewFrom("");
    setNewTo("");
  };

  const handleRemoveSubstitution = (index: number) => {
    setSubstitutions((prev) => prev.filter((_, i) => i !== index));
  };

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
          substitutions: normalizeSubstitutions(substitutions),
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
    <div className="rounded-2xl border border-border bg-card p-5 text-left shadow-card">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Upload & Generate
          </div>
          <h2 className="text-lg font-semibold text-foreground">Files & context</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Upload audio or notes, add patient context, and generate structured outputs.
          </p>
        </div>
        <label className="inline-flex cursor-pointer items-center rounded-full gradient-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-soft transition-shadow hover:shadow-elevated">
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

      <div className="mt-5 rounded-2xl border border-border bg-muted/30 p-4">
        <div className="text-sm font-semibold text-foreground">Word substitutions</div>
        <p className="mt-1 text-xs text-muted-foreground">
          Save common replacements (e.g. MD → doctor). Substitutions are applied before note generation.
        </p>
        <div className="mt-3 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <input
            type="text"
            value={newFrom}
            onChange={(event) => setNewFrom(event.target.value)}
            placeholder="From (e.g., MD)"
            className="rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground"
          />
          <input
            type="text"
            value={newTo}
            onChange={(event) => setNewTo(event.target.value)}
            placeholder="To (e.g., doctor)"
            className="rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground"
          />
          <button
            type="button"
            onClick={handleAddSubstitution}
            className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Add
          </button>
        </div>
        {substitutions.length > 0 && (
          <div className="mt-3 space-y-2 text-xs text-muted-foreground">
            {substitutions.map((entry, index) => (
              <div
                key={`${entry.from}-${entry.to}-${index}`}
                className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2"
              >
                <div>
                  <span className="text-foreground font-semibold">{entry.from}</span> → {entry.to}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSubstitution(index)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_1fr]">
        <select
          value={selectedTemplate}
          onChange={(event) => setSelectedTemplate(event.target.value)}
          className="rounded-xl border border-border bg-background px-4 py-3 text-xs text-foreground"
        >
          {templates.map((template) => (
            <option key={template.id} value={template.id} className="text-foreground">
              {template.label}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={noteType}
          onChange={(event) => setNoteType(event.target.value)}
          placeholder="Note type (e.g., SOAP Note)"
          className="rounded-xl border border-border bg-background px-4 py-3 text-xs text-foreground placeholder:text-muted-foreground"
        />
      </div>

      <div className="mt-3">
        <label className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Patient context
        </label>
        <textarea
          value={patientContext}
          onChange={(event) => setPatientContext(event.target.value)}
          placeholder="Patient context or appointment info (optional)"
          rows={4}
          className="mt-2 w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground"
        />
      </div>
      {message && <div className="mt-3 text-xs text-muted-foreground">{message}</div>}
      {uploaded.length > 0 && (
        <div className="mt-5 space-y-4 text-xs text-muted-foreground">
          {uploaded.map((file) => {
            const result = results[file.storedAs];
            const isProcessing = processing[file.storedAs];
            return (
              <div
                key={file.storedAs}
                className="rounded-xl border border-border bg-muted/40 p-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-foreground">{file.name}</div>
                    <div className="text-muted-foreground">{formatBytes(file.size)}</div>
                  </div>
                  <button
                    onClick={() => onProcess(file)}
                    className="inline-flex items-center justify-center rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : "Generate note"}
                  </button>
                </div>
                {result && (
                  <div className="mt-4 space-y-3 text-[11px] text-muted-foreground">
                    {result.error && (
                      <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-red-600">
                        {result.error}
                      </div>
                    )}
                    <TranscriptWithAudio result={result} substitutions={substitutions} />
                    <div className="rounded-lg border border-border bg-background p-3">
                      <div className="text-foreground font-semibold">Clinical Note</div>
                      {result.clinical_note ? (
                        <pre className="mt-2 whitespace-pre-wrap text-[11px] text-muted-foreground font-fira">
                          {result.clinical_note}
                        </pre>
                      ) : result.soap ? (
                        <pre className="mt-2 whitespace-pre-wrap text-[11px] text-muted-foreground font-fira">{`S: ${result.soap.subjective}\nO: ${result.soap.objective}\nA: ${result.soap.assessment}\nP: ${result.soap.plan}`}</pre>
                      ) : (
                        <div className="mt-2">Transcript ready. Configure LLM keys to generate notes.</div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleExport(result, "pdf")}
                        className="rounded-full border border-border bg-background px-3 py-1 text-[11px] text-foreground hover:border-primary/40"
                      >
                        Export PDF
                      </button>
                      <button
                        onClick={() => handleExport(result, "docx")}
                        className="rounded-full border border-border bg-background px-3 py-1 text-[11px] text-foreground hover:border-primary/40"
                      >
                        Export DOCX
                      </button>
                      <button
                        onClick={() => handleExport(result, "md")}
                        className="rounded-full border border-border bg-background px-3 py-1 text-[11px] text-foreground hover:border-primary/40"
                      >
                        Export Markdown
                      </button>
                    </div>
                    {result.verification_needed && result.verification_needed.length > 0 && (
                      <div className="rounded-lg border border-border bg-muted/40 p-3">
                        <div className="text-foreground font-semibold">Verification Needed</div>
                        <ul className="mt-2 space-y-1">
                          {result.verification_needed.map((item, index) => (
                            <li key={`${item}-${index}`}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-lg border border-border bg-muted/40 p-3">
                        <div className="text-foreground font-semibold">ICD-10 Suggestions</div>
                        {result.icd10.length ? (
                          <ul className="mt-2 space-y-1">
                            {result.icd10.map((code) => (
                              <li key={`${code.code}-${code.description}`}>
                                <span className="text-foreground">{code.code}</span> {code.description}{" "}
                                <span className="text-muted-foreground">({code.confidence})</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="mt-2">No suggestions yet.</div>
                        )}
                      </div>
                      <div className="rounded-lg border border-border bg-muted/40 p-3">
                        <div className="text-foreground font-semibold">CPT Suggestions</div>
                        {result.cpt.length ? (
                          <ul className="mt-2 space-y-1">
                            {result.cpt.map((code) => (
                              <li key={`${code.code}-${code.description}`}>
                                <span className="text-foreground">{code.code}</span> {code.description}{" "}
                                <span className="text-muted-foreground">({code.confidence})</span>
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
