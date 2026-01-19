import { NextRequest, NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { Document, Packer, Paragraph, TextRun } from "docx";
import {
  buildMarkdownNote,
  buildSocialWorkMarkdown,
  parsePatientContext,
  resolveTemplateType,
} from "../../lib/noteTemplates";

export const runtime = "nodejs";

type ExportPayload = {
  clinical_note: string;
  verification_needed?: string[];
  note_type: string;
  patient_context?: string;
  format: "pdf" | "docx" | "md";
};

const toBuffer = (doc: PDFKit.PDFDocument) =>
  new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });

const buildPdf = async (markdown: string, title: string) => {
  const doc = new PDFDocument({ margin: 48 });
  doc.fontSize(18).text(title);
  doc.moveDown();
  doc.fontSize(10).text(markdown);
  doc.end();
  return toBuffer(doc);
};

const buildDocx = async (markdown: string, title: string) => {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            children: [new TextRun({ text: title, bold: true, size: 32 })],
          }),
          new Paragraph({ text: "" }),
          ...markdown.split("\n").map(
            (line) =>
              new Paragraph({
                children: [new TextRun({ text: line, size: 22 })],
              }),
          ),
        ],
      },
    ],
  });
  return Packer.toBuffer(doc);
};

export async function POST(request: NextRequest) {
  const body = (await request.json()) as ExportPayload;
  const { clinical_note, verification_needed, note_type, patient_context, format } = body;

  if (!clinical_note || !note_type || !format) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const parsedContext = parsePatientContext(patient_context || "");
  const templateType = resolveTemplateType(note_type);
  const markdown =
    templateType === "social_work"
      ? buildSocialWorkMarkdown({
          patientContext: parsedContext,
          clinicalNote: clinical_note,
          verification: verification_needed,
        })
      : buildMarkdownNote({
          patientContext: parsedContext,
          clinicalNote: clinical_note,
          verification: verification_needed,
          noteType: note_type,
        });

  if (format === "md") {
    return new NextResponse(markdown, {
      headers: {
        "Content-Type": "text/markdown",
        "Content-Disposition": 'attachment; filename="medscribd-note.md"',
      },
    });
  }

  if (format === "pdf") {
    const pdfBuffer = await buildPdf(markdown, note_type);
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="medscribd-note.pdf"',
      },
    });
  }

  const docxBuffer = await buildDocx(markdown, note_type);
  return new NextResponse(docxBuffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": 'attachment; filename="medscribd-note.docx"',
    },
  });
}
