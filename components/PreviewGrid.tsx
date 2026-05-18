"use client";

import type { ProcessedImage } from "@/lib/types";
import { ResultCard } from "./ResultCard";

type PreviewGridProps = {
  files: File[];
  previewUrls: Record<string, string>;
  results: ProcessedImage[];
  onUpdateResult: (id: string, patch: Partial<Pick<ProcessedImage, "outputFilename" | "altText">>) => void;
};

export function PreviewGrid({ files, previewUrls, results, onUpdateResult }: PreviewGridProps) {
  if (results.length > 0) {
    return (
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-950">Processed images</h2>
          <p className="text-sm text-slate-600">Review previews, edit filenames and alt text, then download individually or as a ZIP.</p>
        </div>
        <div className="space-y-5">
          {results.map((result) => (
            <ResultCard
              key={result.id}
              result={result}
              originalPreviewUrl={previewUrls[result.originalFilename]}
              onUpdate={onUpdateResult}
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-bold text-slate-950">Original previews</h2>
      {files.length === 0 ? (
        <p className="mt-3 text-sm text-slate-600">Upload images to preview them here.</p>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {files.map((file) => (
            <div key={`${file.name}-${file.lastModified}`} className="rounded-xl border border-slate-200 p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrls[file.name]} alt={file.name} className="h-48 w-full rounded-lg bg-slate-100 object-contain" />
              <p className="mt-2 truncate text-sm font-medium text-slate-800">{file.name}</p>
              <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
