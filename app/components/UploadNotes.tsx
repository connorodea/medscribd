"use client";

import { useState } from "react";

type UploadedFile = {
  name: string;
  storedAs: string;
  size: number;
  type: string;
};

const formatBytes = (value: number) => {
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
};

export default function UploadNotes() {
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState<UploadedFile[]>([]);

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

  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-left">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-brand-cloud">Upload notes or audio</div>
          <div className="text-xs text-brand-mist/70">
            Attach prior notes, PDFs, or audio files to reference during the visit.
          </div>
        </div>
        <label className="inline-flex cursor-pointer items-center rounded-full bg-brand-amber px-4 py-2 text-xs font-semibold text-brand-ink hover:bg-[#f2a94a] transition-colors">
          <input
            type="file"
            multiple
            accept=".txt,.md,.pdf,.doc,.docx,audio/*"
            className="hidden"
            onChange={onUpload}
            disabled={isUploading}
          />
          {isUploading ? "Uploading..." : "Upload files"}
        </label>
      </div>
      {message && <div className="mt-3 text-xs text-brand-mist/80">{message}</div>}
      {uploaded.length > 0 && (
        <div className="mt-3 space-y-2 text-xs text-brand-mist/70">
          {uploaded.slice(0, 4).map((file) => (
            <div key={file.storedAs} className="flex items-center justify-between">
              <span className="text-brand-cloud">{file.name}</span>
              <span>{formatBytes(file.size)}</span>
            </div>
          ))}
          {uploaded.length > 4 && (
            <div className="text-brand-mist/60">
              + {uploaded.length - 4} more files uploaded
            </div>
          )}
        </div>
      )}
    </div>
  );
}
