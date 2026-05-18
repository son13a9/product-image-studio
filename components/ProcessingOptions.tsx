"use client";

import type { ProcessingOptions as ProcessingOptionsType } from "@/lib/types";

type ProcessingOptionsProps = {
  options: ProcessingOptionsType;
  onChange: (options: ProcessingOptionsType) => void;
};

export function ProcessingOptions({ options, onChange }: ProcessingOptionsProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">4. Optimize-only settings</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label>
          <span className="text-sm font-medium text-slate-700">Export format</span>
          <select
            value={options.format}
            onChange={(event) => onChange({ ...options, format: event.target.value as ProcessingOptionsType["format"] })}
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="webp">WebP</option>
            <option value="jpeg">JPEG</option>
            <option value="both">Both WebP and JPEG</option>
          </select>
        </label>
        <label>
          <span className="text-sm font-medium text-slate-700">Sharpen</span>
          <select
            value={options.sharpen}
            onChange={(event) => onChange({ ...options, sharpen: event.target.value as ProcessingOptionsType["sharpen"] })}
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="off">Off</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
        <label>
          <span className="text-sm font-medium text-slate-700">Quality</span>
          <select
            value={options.quality}
            onChange={(event) => onChange({ ...options, quality: Number(event.target.value) })}
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
          >
            <option value={70}>70</option>
            <option value={80}>80</option>
            <option value={85}>85</option>
            <option value={90}>90</option>
          </select>
        </label>
        <label>
          <span className="text-sm font-medium text-slate-700">Canvas size</span>
          <select
            value={options.size}
            onChange={(event) => onChange({ ...options, size: Number(event.target.value) })}
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
          >
            <option value={1200}>1200 × 1200</option>
            <option value={1600}>1600 × 1600</option>
            <option value={2000}>2000 × 2000</option>
          </select>
        </label>
      </div>
    </section>
  );
}
