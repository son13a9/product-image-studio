import { NextResponse } from "next/server";
import { createExportZip } from "@/lib/zip";

export const runtime = "nodejs";

type ZipRequest = {
  images?: { filename?: string; dataUrl?: string }[];
  metadata?: unknown;
};

function dataUrlToBase64(dataUrl: string): string {
  const [, base64] = dataUrl.split(",");
  if (!base64) {
    throw new Error("Invalid image data for ZIP export.");
  }
  return base64;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ZipRequest;
    const images = body.images ?? [];

    if (images.length === 0) {
      return NextResponse.json({ error: "Process at least one image before exporting ZIP." }, { status: 400 });
    }

    const zipBuffer = await createExportZip(
      images.map((image) => ({
        filename: image.filename || "product-image.webp",
        base64: dataUrlToBase64(image.dataUrl || ""),
      })),
      body.metadata ?? {},
    );

    return new NextResponse(new Uint8Array(zipBuffer), {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="product-image-studio-export.zip"',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not create ZIP export." },
      { status: 500 },
    );
  }
}
