"use client";

import type { ProcessedImage } from "@/lib/types";

type ResultCardProps = {
  result: ProcessedImage;
  originalPreviewUrl?: string;
  onUpdate: (id: string, patch: Partial<Pick<ProcessedImage, "outputFilename" | "altText">>) => void;
};

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

function reduction(original: number, processed: number): string {
  if (!original) return "0%";
  return `${Math.round(((original - processed) / original) * 100)}%`;
}

export function ResultCard({ result, originalPreviewUrl, onUpdate }: ResultCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <p className="mb-2 text-sm font-semibold text-slate-800">Original</p>
          {originalPreviewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={originalPreviewUrl} alt={result.originalFilename} className="h-56 w-full rounded-xl bg-slate-100 object-contain" />
          ) : (
            <div className="flex h-56 items-center justify-center rounded-xl bg-slate-100 text-sm text-slate-500">Preview unavailable</div>
          )}
          <p className="mt-2 truncate text-xs text-slate-500">{result.originalFilename}</p>
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold text-slate-800">Processed</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={result.dataUrl} alt={result.altText} className="h-56 w-full rounded-xl bg-slate-100 object-contain" />
          <p className="mt-2 text-xs text-slate-500">{result.width} × {result.height} {result.format.toUpperCase()}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Original size</p>
          <p className="font-semibold text-slate-900">{formatBytes(result.originalSizeBytes)}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Processed size</p>
          <p className="font-semibold text-slate-900">{formatBytes(result.processedSizeBytes)}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Reduction</p>
          <p className="font-semibold text-slate-900">{reduction(result.originalSizeBytes, result.processedSizeBytes)}</p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">SEO filename</span>
          <input
            value={result.outputFilename}
            onChange={(event) => onUpdate(result.id, { outputFilename: event.target.value })}
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Alt text</span>
          <textarea
            value={result.altText}
            onChange={(event) => onUpdate(result.id, { altText: event.target.value })}
            rows={3}
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </label>
        <a
          href={result.dataUrl}
          download={result.outputFilename}
          className="inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          Download image
        </a>
      </div>
    </article>
  );
}
