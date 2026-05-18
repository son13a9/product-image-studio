"use client";

type ExportPanelProps = {
  canExport: boolean;
  isProcessing: boolean;
  isExporting: boolean;
  onOptimize: () => void;
  onExportZip: () => void;
  onClear: () => void;
};

export function ExportPanel({ canExport, isProcessing, isExporting, onOptimize, onExportZip, onClear }: ExportPanelProps) {
  return (
    <section className="sticky top-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">Actions</h2>
      <div className="mt-4 space-y-3">
        <button
          type="button"
          onClick={onOptimize}
          disabled={isProcessing}
          className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {isProcessing ? "Optimizing images..." : "Optimize images"}
        </button>
        <button
          type="button"
          onClick={onExportZip}
          disabled={!canExport || isExporting}
          className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
        >
          {isExporting ? "Creating ZIP..." : "Download ZIP + metadata"}
        </button>
        <button
          type="button"
          onClick={onClear}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Clear all
        </button>
      </div>
      <p className="mt-4 text-xs text-slate-500">Phase 1 supports optimize-only processing. Image generation mode is intentionally excluded.</p>
    </section>
  );
}
