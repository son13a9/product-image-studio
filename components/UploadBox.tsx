"use client";

type UploadBoxProps = {
  files: File[];
  onFilesChange: (files: File[]) => void;
};

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function UploadBox({ files, onFilesChange }: UploadBoxProps) {
  function handleFiles(selectedFiles: FileList | null) {
    const validFiles = Array.from(selectedFiles ?? []).filter((file) => ACCEPTED_IMAGE_TYPES.includes(file.type));
    onFilesChange(validFiles);
  }

  return (
    <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-5 shadow-sm">
      <div className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">1. Upload product images</h2>
          <p className="text-sm text-slate-600">Add JPG, PNG, or WebP images. Batches of 5+ images are supported.</p>
        </div>
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl bg-slate-50 px-4 py-8 text-center hover:bg-slate-100">
          <span className="text-sm font-semibold text-slate-900">Click to choose images</span>
          <span className="mt-1 text-xs text-slate-500">Original files stay in memory for this session only.</span>
          <input
            className="sr-only"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={(event) => handleFiles(event.target.files)}
          />
        </label>
        {files.length > 0 && (
          <p className="text-sm font-medium text-emerald-700">{files.length} image{files.length === 1 ? "" : "s"} ready to optimize.</p>
        )}
      </div>
    </section>
  );
}
