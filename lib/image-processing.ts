import sharp from "sharp";
import type { ProcessingOptions, SingleExportFormat } from "./types";

const SHARPEN_SETTINGS = {
  off: null,
  low: { sigma: 0.6, m1: 0.7, m2: 1.2, x1: 2, y2: 8, y3: 12 },
  medium: { sigma: 0.8, m1: 1, m2: 1.8, x1: 2, y2: 10, y3: 16 },
  high: { sigma: 1, m1: 1.2, m2: 2.2, x1: 2, y2: 12, y3: 20 },
} as const;

export async function optimizeImage(
  input: Buffer,
  options: ProcessingOptions,
  format: SingleExportFormat,
): Promise<{ buffer: Buffer; width: number; height: number }> {
  let pipeline = sharp(input, { failOn: "none" })
    .rotate()
    .resize(options.size, options.size, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 1 },
      withoutEnlargement: false,
    });

  const sharpen = SHARPEN_SETTINGS[options.sharpen];
  if (sharpen) {
    pipeline = pipeline.sharpen(sharpen);
  }

  if (format === "webp") {
    pipeline = pipeline.webp({ quality: options.quality, effort: 4 });
  } else {
    pipeline = pipeline.jpeg({ quality: options.quality, mozjpeg: true });
  }

  const { data, info } = await pipeline.toBuffer({ resolveWithObject: true });
  return { buffer: data, width: info.width, height: info.height };
}
