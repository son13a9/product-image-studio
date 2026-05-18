import { NextResponse } from "next/server";
import { generateAltText } from "@/lib/alt-text";
import { generateSeoFilename } from "@/lib/filename";
import { optimizeImage } from "@/lib/image-processing";
import type { ProcessingOptions, ProductInfo, SingleExportFormat } from "@/lib/types";

export const runtime = "nodejs";

const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function getProductInfo(formData: FormData): ProductInfo {
  return {
    productName: String(formData.get("productName") ?? ""),
    brand: String(formData.get("brand") ?? ""),
    category: String(formData.get("category") ?? ""),
    color: String(formData.get("color") ?? ""),
    seoKeywords: String(formData.get("seoKeywords") ?? ""),
    prompt: String(formData.get("prompt") ?? ""),
  };
}

function getOptions(formData: FormData): ProcessingOptions {
  const quality = Number(formData.get("quality") ?? 85);
  const size = Number(formData.get("size") ?? 1200);

  return {
    format: formData.get("format") === "jpeg" || formData.get("format") === "both" ? formData.get("format") : "webp",
    quality: [70, 80, 85, 90].includes(quality) ? quality : 85,
    sharpen: formData.get("sharpen") === "off" || formData.get("sharpen") === "medium" || formData.get("sharpen") === "high" ? formData.get("sharpen") : "low",
    size: Number.isFinite(size) && size >= 400 && size <= 2400 ? size : 1200,
  };
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("images").filter((value): value is File => value instanceof File);

    if (files.length === 0) {
      return NextResponse.json({ error: "Upload at least one image." }, { status: 400 });
    }

    const productInfo = getProductInfo(formData);
    const options = getOptions(formData);
    const formats: SingleExportFormat[] = options.format === "both" ? ["webp", "jpeg"] : [options.format];
    const existingFilenames = new Set<string>();
    const results = [];
    const errors = [];

    for (const [fileIndex, file] of files.entries()) {
      if (!ACCEPTED_TYPES.has(file.type)) {
        errors.push({ filename: file.name, error: "Unsupported file type. Use JPG, PNG, or WebP." });
        continue;
      }

      const inputBuffer = Buffer.from(await file.arrayBuffer());

      for (const format of formats) {
        try {
          const output = await optimizeImage(inputBuffer, options, format);
          const outputFilename = generateSeoFilename(productInfo, fileIndex + 1, format, existingFilenames);

          results.push({
            id: `${fileIndex}-${format}-${Date.now()}`,
            originalFilename: file.name,
            outputFilename,
            format,
            altText: generateAltText(productInfo),
            originalSizeBytes: file.size,
            processedSizeBytes: output.buffer.byteLength,
            dataUrl: `data:image/${format};base64,${output.buffer.toString("base64")}`,
            width: output.width,
            height: output.height,
          });
        } catch (error) {
          errors.push({
            filename: file.name,
            error: error instanceof Error ? error.message : "Image processing failed.",
          });
        }
      }
    }

    if (results.length === 0) {
      return NextResponse.json({ error: "No images could be processed.", errors }, { status: 400 });
    }

    return NextResponse.json({ results, errors });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected processing error." },
      { status: 500 },
    );
  }
}
