# Product Image Studio

Product Image Studio is a small internal Next.js app for ecommerce sellers who need to prepare product images before uploading them to a store. Phase 1 focuses on optimize-only image processing and SEO-ready exports.

## Features

- Multi-image upload for JPG, JPEG, PNG, and WebP files.
- Original image previews with original filenames and file sizes.
- Product information form for product name, brand, category, color / variant, and SEO keywords.
- Prompt textarea stored in export metadata for future image-generation phases.
- Optimize-only processing with Sharp:
  - Square resize canvas, default `1200 × 1200`.
  - Aspect-ratio preservation with padding to avoid distortion.
  - Sharpening levels: off, low, medium, high.
  - Compression quality options: 70, 80, 85, 90.
  - WebP, JPEG, or both-format export.
- SEO filename generation from brand, product name, color, category, image index, and export format.
- Vietnamese accent removal, lowercase slugs, special-character cleanup, and duplicate filename avoidance.
- Rule-based alt text generation from product details and SEO keywords.
- Editable filename and alt text for every processed image.
- Original and processed previews side by side.
- Original size, processed size, and reduction percentage display.
- Individual image download.
- ZIP export containing processed images and `metadata.json`.

## Requirements

- Node.js 20 or newer recommended.
- npm 10 or newer recommended.
- No database is required.
- No login system is required.
- `OPENAI_API_KEY` is not required for Phase 1 optimize-only mode.

## Setup instructions

Install dependencies:

```bash
npm install
```

Create a local environment file if you want to keep parity with later phases:

```bash
cp .env.example .env.local
```

## Environment variable setup

`.env.example` includes the future image-generation variable:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

Phase 1 does not connect to the OpenAI Image API, so the app runs and optimizes images without this key.

## How to run locally

Start the development server:

```bash
npm run dev
```

Open the local URL printed by Next.js, usually:

```text
http://localhost:3000
```

## How to test the MVP

1. Run `npm install`.
2. Run `npm run dev`.
3. Upload one or more JPG, PNG, or WebP product images. Upload at least 5 images to test batch behavior.
4. Fill in product name, brand, category, color / variant, and SEO keywords.
5. Enter a design prompt. In Phase 1 this is saved to metadata only.
6. Choose optimize-only settings:
   - Export format: WebP, JPEG, or both.
   - Sharpen level.
   - Quality.
   - Canvas size.
7. Click **Optimize images**.
8. Review original and processed previews.
9. Confirm original and processed file sizes are shown.
10. Edit generated filenames and alt text if needed.
11. Download an individual processed image.
12. Click **Download ZIP + metadata** and confirm the ZIP contains:
    - Processed image files.
    - `metadata.json` with product fields, SEO keywords, prompt, mode, and image metadata.

Recommended checks before committing changes:

```bash
npm run lint
npm run build
```

## Known limitations

- Image generation mode is intentionally not implemented in Phase 1.
- The OpenAI Image API is intentionally not connected yet.
- Processing is request-based and in memory; uploaded images are not permanently stored.
- There is no authentication, database, ecommerce integration, browser extension, image history, or cloud storage.
- Very large image batches may be limited by local machine memory and request size limits.

## Future improvements

- Add OpenAI image editing/generation mode using uploaded images as references.
- Add stronger per-image failure recovery and retry controls.
- Add drag-and-drop upload reordering.
- Add more export presets for marketplaces and store themes.
- Add optional transparent padding for formats that support alpha.
- Add richer metadata export options for ecommerce CMS imports.
