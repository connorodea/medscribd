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

const promptTemplate = `You are an AI medical scribe assistant for medscribd.com. Your role is to help healthcare providers (doctors and dentists) by converting clinical conversations into accurate, well-structured clinical documentation.

Here is the patient context and appointment information:
<patient_context>
{{PATIENT_CONTEXT}}
</patient_context>

Here is the type of clinical note requested:
<note_type>
{{NOTE_TYPE}}
</note_type>

Here is the transcript of the clinical encounter:
<audio_transcript>
{{AUDIO_TRANSCRIPT}}
</audio_transcript>

Your task is to create a professional clinical note based on the conversation transcript. Follow these guidelines:

DOCUMENTATION STANDARDS:
- Use clear, concise, professional medical language
- Include only clinically relevant information from the conversation
- Organize information logically according to the requested note type
- Use standard medical abbreviations appropriately
- Maintain objectivity; distinguish between patient-reported symptoms and clinical observations
- Include relevant positive and negative findings
- Document the provider's clinical reasoning, assessment, and plan

WHAT TO INCLUDE:
- Chief complaint and history of present illness
- Relevant medical history, medications, and allergies mentioned
- Physical examination findings discussed
- Assessment and differential diagnosis
- Treatment plan, prescriptions, and follow-up instructions
- Patient education provided
- Any procedures performed or ordered

WHAT TO EXCLUDE:
- Off-topic conversations or small talk
- Redundant information
- Protected health information that isn't clinically relevant
- Personal opinions or judgments
- Information the provider explicitly states is "off the record"

FORMATTING:
- Structure the note according to the requested note_type (e.g., SOAP format, dental charting format, progress note format)
- Use appropriate headings and sections
- Present information in a logical flow
- Use bullet points or numbered lists where appropriate for clarity

IMPORTANT LIMITATIONS:
- You are an assistant tool only; all notes must be reviewed and approved by the licensed healthcare provider
- Do not add clinical information, diagnoses, or recommendations that were not discussed in the encounter
- If critical information seems missing, note this in your output
- If you're uncertain about medical terminology or what was said, indicate this clearly

OUTPUT REQUIREMENTS:
- Return only a JSON object that matches the provided schema.
- clinical_note should be a clean, formatted note using Markdown headings (e.g., **SUBJECTIVE:**).
- verification_needed should be a list of missing or ambiguous items needing clinician review.
- icd10 and cpt should include code, description, and confidence when appropriate; return empty arrays if none.
- Do not include any analysis, scratchpad, or tags.

Begin your response now.`;

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

const renderPrompt = (values: {
  patientContext: string;
  noteType: string;
  transcript: string;
}) =>
  promptTemplate
    .replace("{{PATIENT_CONTEXT}}", values.patientContext || "Not provided.")
    .replace("{{NOTE_TYPE}}", values.noteType || "SOAP Note")
    .replace("{{AUDIO_TRANSCRIPT}}", values.transcript || "");

const jsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    clinical_note: { type: "string" },
    verification_needed: { type: "array", items: { type: "string" } },
    icd10: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          code: { type: "string" },
          description: { type: "string" },
          confidence: { type: "string", enum: ["low", "medium", "high"] },
        },
        required: ["code", "description", "confidence"],
      },
    },
    cpt: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          code: { type: "string" },
          description: { type: "string" },
          confidence: { type: "string", enum: ["low", "medium", "high"] },
        },
        required: ["code", "description", "confidence"],
      },
    },
  },
  required: ["clinical_note", "verification_needed", "icd10", "cpt"],
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

const tryParseJson = (input: string) => {
  try {
    return JSON.parse(input) as Record<string, unknown>;
  } catch (error) {
    const start = input.indexOf("{");
    const end = input.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      return JSON.parse(input.slice(start, end + 1)) as Record<string, unknown>;
    }
    throw error;
  }
};

const parseTaggedResponse = (input: string) => {
  const noteMatch = input.match(/<clinical_note>([\s\S]*?)<\/clinical_note>/i);
  if (!noteMatch?.[1]) return null;
  const verificationMatch = input.match(
    /<verification_needed>([\s\S]*?)<\/verification_needed>/i,
  );
  const note = noteMatch[1].trim();
  const verificationRaw = verificationMatch?.[1]?.trim() || "";
  const verification = verificationRaw
    ? verificationRaw
        .split("\n")
        .map((line) => line.replace(/^[-*•\s]+/, "").trim())
        .filter(Boolean)
    : [];
  return {
    clinical_note: note,
    verification_needed: verification,
    icd10: [],
    cpt: [],
  };
};

const parseJsonResponse = (content: string | Record<string, unknown>) => {
  const parsed =
    typeof content === "string"
      ? (tryParseJson(content) as Record<string, unknown>)
      : content;
  const typed = parsed as {
    clinical_note?: string;
    verification_needed?: string[];
    soap?: SoapNote;
    icd10: CodeSuggestion[];
    cpt: CodeSuggestion[];
  };
  return {
    clinical_note: typed.clinical_note || "",
    verification_needed: typed.verification_needed || [],
    soap: typed.soap,
    icd10: typed.icd10 || [],
    cpt: typed.cpt || [],
    warning: null,
  };
};

const runOpenAi = async (transcript: string, patientContext: string, noteType: string) => {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL;
  if (!apiKey || !model) {
    return {
      soap: null,
      clinical_note: "",
      verification_needed: [],
      icd10: [],
      cpt: [],
      warning: "OPENAI_API_KEY or OPENAI_MODEL is not configured. Returning transcript only.",
    };
  }

  const prompt = renderPrompt({ patientContext, noteType, transcript });

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "medscribd_structured_note",
          strict: true,
          schema: jsonSchema,
        },
      },
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenAI request failed: ${errorBody}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI response was empty.");
  }

  try {
    return parseJsonResponse(content);
  } catch (error) {
    throw new Error("OpenAI response was not valid JSON.");
  }
};

const extractAnthropicContent = (data: {
  content?: Array<{ type: string; text?: string; json?: Record<string, unknown> }>;
}) => {
  const contentItems = data?.content || [];
  const jsonItem = contentItems.find((item) => item.type === "json" && item.json);
  if (jsonItem?.json) return jsonItem.json;
  const textItem = contentItems.find((item) => item.type === "text" && item.text);
  return textItem?.text || "";
};

const sanitizePreview = (value: string, max = 800) =>
  value.length > max ? `${value.slice(0, max)}…` : value;

const runAnthropic = async (transcript: string, patientContext: string, noteType: string) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const model = process.env.ANTHROPIC_MODEL;
  if (!apiKey || !model) {
    return {
      soap: null,
      clinical_note: "",
      verification_needed: [],
      icd10: [],
      cpt: [],
      warning: "ANTHROPIC_API_KEY or ANTHROPIC_MODEL is not configured. Returning transcript only.",
    };
  }

  const prompt = renderPrompt({ patientContext, noteType, transcript });

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-beta": "structured-outputs-2025-11-13",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      max_tokens: 1400,
      temperature: 0.2,
      thinking: { type: "disabled" },
      messages: [{ role: "user", content: prompt }],
      output_format: {
        type: "json_schema",
        schema: jsonSchema,
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    const requestId = response.headers.get("x-request-id") || "unknown";
    console.error("Anthropic request failed:", response.status, requestId, errorBody);
    throw new Error(`Anthropic request failed: ${errorBody}`);
  }

  const data = await response.json();
  const content = extractAnthropicContent(data);
  if (data?.content) {
    console.info(
      "Anthropic content types:",
      data.content.map((item: { type: string }) => item.type),
    );
  }
  if (!content) {
    throw new Error("Anthropic response was empty.");
  }

  try {
    return parseJsonResponse(content);
  } catch (error) {
    if (typeof content === "string") {
      const tagged = parseTaggedResponse(content);
      if (tagged) {
        console.warn("Anthropic response fell back to tagged extraction.");
        return {
          clinical_note: tagged.clinical_note,
          verification_needed: tagged.verification_needed || [],
          soap: null,
          icd10: tagged.icd10 || [],
          cpt: tagged.cpt || [],
          warning: "Anthropic response was not JSON. Parsed tagged output instead.",
        };
      }
      console.error("Anthropic invalid JSON response preview:", sanitizePreview(content));
      return {
        clinical_note: content.trim(),
        verification_needed: [],
        soap: null,
        icd10: [],
        cpt: [],
        warning: "Anthropic response was not JSON. Returned raw text instead.",
      };
    }
    throw new Error("Anthropic response was not valid JSON.");
  }
};

const runNoteGeneration = async (
  transcript: string,
  provider: string,
  patientContext: string,
  noteType: string,
) => {
  if (provider === "anthropic") {
    return runAnthropic(transcript, patientContext, noteType);
  }
  return runOpenAi(transcript, patientContext, noteType);
};

export async function POST(request: NextRequest) {
  try {
    const { storedAs, templateId, provider, patientContext, noteType } =
      (await request.json()) as {
        storedAs?: string;
        templateId?: string;
        provider?: string;
        patientContext?: string;
        noteType?: string;
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

    const templateKey = (templateId && templateId in templates
      ? templateId
      : "primary_care") as keyof typeof templates;
    const selectedProvider = provider || process.env.LLM_PROVIDER || "anthropic";
    const resolvedNoteType = noteType || templates[templateKey]?.name || "SOAP Note";
    const generated = await runNoteGeneration(
      transcript,
      selectedProvider,
      patientContext || "",
      resolvedNoteType,
    );

    return NextResponse.json({
      transcript,
      soap: generated.soap,
      clinical_note: generated.clinical_note,
      verification_needed: generated.verification_needed,
      icd10: generated.icd10,
      cpt: generated.cpt,
      provider: selectedProvider,
      warning: generated.warning,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Processing failed.";
    console.error("process-upload failure:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
