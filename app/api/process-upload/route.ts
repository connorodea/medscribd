import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

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

const getUploadDir = () =>
  process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");

const templates = {
  primary_care: {
    name: "Primary Care",
    focus:
      "Include HPI, ROS highlights, vitals if mentioned, exam summary, and clear plan.",
  },
  cardiology: {
    name: "Cardiology",
    focus:
      "Emphasize cardiac symptoms, risk factors, meds, EKG/echo findings if present, and cardiac plan.",
  },
  orthopedics: {
    name: "Orthopedics",
    focus:
      "Include mechanism of injury, imaging, MSK exam, functional limitations, and ortho plan.",
  },
  psychiatry: {
    name: "Psychiatry",
    focus:
      "Include mental status exam, mood/affect, safety assessment, and therapy/med plan.",
  },
  physical_therapy: {
    name: "Physical Therapy",
    focus:
      "Include functional status, pain scale, mobility limitations, therapy goals, and home plan.",
  },
};

const buildPrompt = (transcript: string, templateId: keyof typeof templates) => {
  const template = templates[templateId] || templates.primary_care;
  return `You are a medical scribe. Generate a SOAP note and coding suggestions.
Template focus: ${template.name} - ${template.focus}

Return ONLY valid JSON in this shape:
{
  "soap": {
    "subjective": "...",
    "objective": "...",
    "assessment": "...",
    "plan": "..."
  },
  "icd10": [
    {"code":"", "description":"", "confidence":"low|medium|high"}
  ],
  "cpt": [
    {"code":"", "description":"", "confidence":"low|medium|high"}
  ]
}

Transcript:
${transcript}`;
};

const transcribeAudio = async (audioBuffer: Buffer) => {
  const apiKey = process.env.DEEPGRAM_API_KEY;
  if (!apiKey) {
    throw new Error("DEEPGRAM_API_KEY is not configured.");
  }

  const response = await fetch(
    "https://api.deepgram.com/v1/listen?model=nova-3-medical&punctuate=true&paragraphs=true",
    {
      method: "POST",
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": "application/octet-stream",
      },
      body: audioBuffer,
    },
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Deepgram transcription failed: ${errorBody}`);
  }

  const data = await response.json();
  return data?.results?.channels?.[0]?.alternatives?.[0]?.transcript || "";
};

const runNoteGeneration = async (transcript: string, templateId: keyof typeof templates) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {
      soap: null,
      icd10: [],
      cpt: [],
      warning: "OPENAI_API_KEY is not configured. Returning transcript only.",
    };
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You output valid JSON only." },
        { role: "user", content: buildPrompt(transcript, templateId) },
      ],
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`LLM request failed: ${errorBody}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("LLM response was empty.");
  }

  try {
    const parsed = JSON.parse(content) as {
      soap: SoapNote;
      icd10: CodeSuggestion[];
      cpt: CodeSuggestion[];
    };
    return {
      soap: parsed.soap,
      icd10: parsed.icd10 || [],
      cpt: parsed.cpt || [],
      warning: null,
    };
  } catch (error) {
    throw new Error("LLM response was not valid JSON.");
  }
};

export async function POST(request: NextRequest) {
  const { storedAs, templateId } = (await request.json()) as {
    storedAs?: string;
    templateId?: keyof typeof templates;
  };

  if (!storedAs) {
    return NextResponse.json({ error: "Missing storedAs value." }, { status: 400 });
  }

  const uploadDir = getUploadDir();
  const filePath = path.join(uploadDir, storedAs);
  const ext = path.extname(storedAs).toLowerCase();

  const fileBuffer = await readFile(filePath);
  let transcript = "";

  if ([".txt", ".md"].includes(ext)) {
    transcript = fileBuffer.toString("utf-8");
  } else if (
    [".wav", ".mp3", ".m4a", ".ogg", ".webm", ".flac", ".aac"].includes(ext)
  ) {
    transcript = await transcribeAudio(fileBuffer);
  } else {
    return NextResponse.json(
      { error: "Unsupported file type. Upload audio or text files." },
      { status: 400 },
    );
  }

  const templateKey = templateId && templateId in templates ? templateId : "primary_care";
  const generated = await runNoteGeneration(transcript, templateKey);

  return NextResponse.json({
    transcript,
    soap: generated.soap,
    icd10: generated.icd10,
    cpt: generated.cpt,
    warning: generated.warning,
  });
}
