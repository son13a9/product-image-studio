"use client";

import { useEffect, useMemo, useState } from "react";
import { ExportPanel } from "@/components/ExportPanel";
import { PreviewGrid } from "@/components/PreviewGrid";
import { ProcessingOptions } from "@/components/ProcessingOptions";
import { ProductForm } from "@/components/ProductForm";
import { PromptBox } from "@/components/PromptBox";
import { UploadBox } from "@/components/UploadBox";
import { parseSeoKeywords } from "@/lib/alt-text";
import type { ProcessedImage, ProcessingOptions as ProcessingOptionsType, ProductInfo } from "@/lib/types";

const initialProduct: ProductInfo = {
  productName: "",
  brand: "",
  category: "",
  color: "",
  seoKeywords: "",
  prompt: "",
};

const initialOptions: ProcessingOptionsType = {
  format: "webp",
  quality: 85,
  sharpen: "low",
  size: 1200,
};

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});
  const [product, setProduct] = useState<ProductInfo>(initialProduct);
  const [options, setOptions] = useState<ProcessingOptionsType>(initialOptions);
  const [results, setResults] = useState<ProcessedImage[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const urls = Object.fromEntries(files.map((file) => [file.name, URL.createObjectURL(file)]));
    setPreviewUrls(urls);

    return () => {
      Object.values(urls).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  const metadata = useMemo(
    () => ({
      product_name: product.productName,
      brand: product.brand,
      category: product.category,
      color: product.color,
      seo_keywords: parseSeoKeywords(product.seoKeywords),
      prompt: product.prompt,
      mode: "optimize_only",
      images: results.map((result) => ({
        original_filename: result.originalFilename,
        output_filename: result.outputFilename,
        format: result.format,
        alt_text: result.altText,
        original_size_bytes: result.originalSizeBytes,
        processed_size_bytes: result.processedSizeBytes,
      })),
    }),
    [product, results],
  );

  function handleFilesChange(nextFiles: File[]) {
    setFiles(nextFiles);
    setResults([]);
    setErrors([]);
  }

  async function optimizeImages() {
    if (files.length === 0) {
      setErrors(["Upload at least one JPG, PNG, or WebP image first."]);
      return;
    }

    setIsProcessing(true);
    setErrors([]);

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));
      Object.entries(product).forEach(([key, value]) => formData.append(key, value));
      formData.append("format", options.format);
      formData.append("quality", String(options.quality));
      formData.append("sharpen", options.sharpen);
      formData.append("size", String(options.size));

      const response = await fetch("/api/process-image", { method: "POST", body: formData });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Image optimization failed.");
      }

      setResults(payload.results ?? []);
      setErrors((payload.errors ?? []).map((item: { filename: string; error: string }) => `${item.filename}: ${item.error}`));
    } catch (error) {
      setErrors([error instanceof Error ? error.message : "Image optimization failed."]);
    } finally {
      setIsProcessing(false);
    }
  }

  async function exportZip() {
    if (results.length === 0) return;
    setIsExporting(true);
    setErrors([]);

    try {
      const response = await fetch("/api/export-zip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: results.map((result) => ({ filename: result.outputFilename, dataUrl: result.dataUrl })),
          metadata,
        }),
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error || "ZIP export failed.");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "product-image-studio-export.zip";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      setErrors([error instanceof Error ? error.message : "ZIP export failed."]);
    } finally {
      setIsExporting(false);
    }
  }

  function updateResult(id: string, patch: Partial<Pick<ProcessedImage, "outputFilename" | "altText">>) {
    setResults((current) => current.map((result) => (result.id === id ? { ...result, ...patch } : result)));
  }

  function clearAll() {
    setFiles([]);
    setResults([]);
    setErrors([]);
    setProduct(initialProduct);
    setOptions(initialOptions);
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 rounded-3xl bg-slate-950 p-8 text-white shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">Phase 1 MVP</p>
          <h1 className="mt-3 text-3xl font-bold sm:text-5xl">Product Image Studio</h1>
          <p className="mt-4 max-w-3xl text-slate-200">
            Upload product photos, optimize them into square ecommerce-ready WebP or JPEG files, generate SEO filenames and alt text, then export everything in one ZIP.
          </p>
        </header>

        {errors.length > 0 && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <p className="font-semibold">Please review:</p>
            <ul className="mt-2 list-disc pl-5">
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <UploadBox files={files} onFilesChange={handleFilesChange} />
            <ProductForm product={product} onChange={setProduct} />
            <PromptBox value={product.prompt} onChange={(prompt) => setProduct({ ...product, prompt })} />
            <ProcessingOptions options={options} onChange={setOptions} />
            <PreviewGrid files={files} previewUrls={previewUrls} results={results} onUpdateResult={updateResult} />
          </div>
          <ExportPanel
            canExport={results.length > 0}
            isProcessing={isProcessing}
            isExporting={isExporting}
            onOptimize={optimizeImages}
            onExportZip={exportZip}
            onClear={clearAll}
          />
        </div>
      </div>
    </main>
  );
}
