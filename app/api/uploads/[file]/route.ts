import { NextRequest } from "next/server";
import { stat } from "node:fs/promises";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

const getUploadDir = () =>
  process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");

const contentTypeForFile = (filePath: string) => {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".mp3":
      return "audio/mpeg";
    case ".wav":
      return "audio/wav";
    case ".m4a":
      return "audio/mp4";
    case ".ogg":
      return "audio/ogg";
    case ".webm":
      return "audio/webm";
    case ".flac":
      return "audio/flac";
    case ".aac":
      return "audio/aac";
    default:
      return "application/octet-stream";
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: { file: string } },
) {
  const uploadDir = getUploadDir();
  const filePath = path.join(uploadDir, params.file);

  try {
    const fileStat = await stat(filePath);
    const range = request.headers.get("range");
    const contentType = contentTypeForFile(filePath);

    if (!range) {
      const fileStream = fs.createReadStream(filePath);
      return new Response(fileStream as unknown as ReadableStream, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Content-Length": fileStat.size.toString(),
          "Accept-Ranges": "bytes",
        },
      });
    }

    const match = range.match(/bytes=(\d+)-(\d*)/);
    const start = match ? parseInt(match[1] || "0", 10) : 0;
    const end = match && match[2] ? parseInt(match[2], 10) : fileStat.size - 1;

    if (start >= fileStat.size || end >= fileStat.size) {
      return new Response(null, {
        status: 416,
        headers: {
          "Content-Range": `bytes */${fileStat.size}`,
        },
      });
    }

    const fileStream = fs.createReadStream(filePath, { start, end });
    const chunkSize = end - start + 1;

    return new Response(fileStream as unknown as ReadableStream, {
      status: 206,
      headers: {
        "Content-Type": contentType,
        "Content-Length": chunkSize.toString(),
        "Content-Range": `bytes ${start}-${end}/${fileStat.size}`,
        "Accept-Ranges": "bytes",
      },
    });
  } catch (error) {
    console.error("uploads route error:", error);
    return new Response("File not found", { status: 404 });
  }
}
