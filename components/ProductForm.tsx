"use client";

import type { ProductInfo } from "@/lib/types";

type ProductFormProps = {
  product: ProductInfo;
  onChange: (product: ProductInfo) => void;
};

const fields: { key: keyof Omit<ProductInfo, "prompt">; label: string; placeholder: string }[] = [
  { key: "productName", label: "Product name", placeholder: "Nautilus Clone V2" },
  { key: "brand", label: "Brand", placeholder: "Armed Shark" },
  { key: "category", label: "Category", placeholder: "Balisong Trainer" },
  { key: "color", label: "Color / variant", placeholder: "Blue Silver" },
  { key: "seoKeywords", label: "SEO keywords", placeholder: "balisong trainer, dao tập balisong" },
];

export function ProductForm({ product, onChange }: ProductFormProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">2. Product information</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <label key={field.key} className={field.key === "seoKeywords" ? "sm:col-span-2" : ""}>
            <span className="text-sm font-medium text-slate-700">{field.label}</span>
            <input
              value={product[field.key]}
              onChange={(event) => onChange({ ...product, [field.key]: event.target.value })}
              placeholder={field.placeholder}
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
        ))}
      </div>
    </section>
  );
}
