import type { ProductInfo, SingleExportFormat } from "./types";

const VIETNAMESE_D_MAP: Record<string, string> = { đ: "d", Đ: "D" };

export function removeVietnameseAccents(value: string): string {
  return value
    .replace(/[đĐ]/g, (match) => VIETNAMESE_D_MAP[match] ?? match)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function slugify(value: string): string {
  return removeVietnameseAccents(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function filenameExtension(format: SingleExportFormat): "webp" | "jpg" {
  return format === "jpeg" ? "jpg" : "webp";
}

export function generateSeoFilename(
  product: ProductInfo,
  imageIndex: number,
  format: SingleExportFormat,
  existingFilenames: Set<string> = new Set(),
): string {
  const parts = [product.brand, product.productName, product.color, product.category]
    .map(slugify)
    .filter(Boolean);
  const base = parts.length > 0 ? parts.join("-") : "product-image";
  const paddedIndex = String(imageIndex).padStart(2, "0");
  const extension = filenameExtension(format);
  let filename = `${base}-${paddedIndex}.${extension}`;
  let duplicate = 2;

  while (existingFilenames.has(filename)) {
    filename = `${base}-${paddedIndex}-${duplicate}.${extension}`;
    duplicate += 1;
  }

  existingFilenames.add(filename);
  return filename;
}
