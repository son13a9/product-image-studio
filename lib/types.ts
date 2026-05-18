export type ExportFormat = "webp" | "jpeg" | "both";
export type SingleExportFormat = "webp" | "jpeg";
export type SharpenLevel = "off" | "low" | "medium" | "high";

export type ProductInfo = {
  productName: string;
  brand: string;
  category: string;
  color: string;
  seoKeywords: string;
  prompt: string;
};

export type ProcessingOptions = {
  format: ExportFormat;
  quality: number;
  sharpen: SharpenLevel;
  size: number;
};

export type ProcessedImage = {
  id: string;
  originalFilename: string;
  outputFilename: string;
  format: SingleExportFormat;
  altText: string;
  originalSizeBytes: number;
  processedSizeBytes: number;
  dataUrl: string;
  width: number;
  height: number;
};
