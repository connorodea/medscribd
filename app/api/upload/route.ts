import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

export const runtime = "nodejs";

const getUploadDir = () =>
  process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const files = formData.getAll("files").filter((file) => file instanceof File) as File[];

  if (!files.length) {
    return NextResponse.json({ error: "No files uploaded." }, { status: 400 });
  }

  const uploadDir = getUploadDir();
  await mkdir(uploadDir, { recursive: true });

  const saved = await Promise.all(
    files.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer());
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const fileName = `${crypto.randomUUID()}-${safeName}`;
      const destination = path.join(uploadDir, fileName);
      await writeFile(destination, buffer);
      return {
        name: file.name,
        storedAs: fileName,
        size: file.size,
        type: file.type,
      };
    }),
  );

  return NextResponse.json({ saved });
}
