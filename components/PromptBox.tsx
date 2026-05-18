"use client";

type PromptBoxProps = {
  value: string;
  onChange: (value: string) => void;
};

export function PromptBox({ value, onChange }: PromptBoxProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">3. Design prompt</h2>
      <p className="mt-1 text-sm text-slate-600">Saved into metadata for Phase 1. Image generation is intentionally not connected yet.</p>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        placeholder="Describe the desired product image style for a future generation phase."
        className="mt-4 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </section>
  );
}
