# AGENTS.md

## Project

Product Image Studio is a mini internal web app for ecommerce product image creation and optimization.

The goal is to build a working MVP first.

---

## How to Work

Prioritize:

1. Working MVP
2. Clear code
3. Simple architecture
4. Easy local testing
5. Useful UX for a non-technical ecommerce seller

Do not over-engineer.

---

## Tech Stack

Use:

- Next.js App Router
- TypeScript
- Tailwind CSS
- Sharp
- JSZip or archiver
- OpenAI API only for image generation/editing

Do not use:

- Database
- Login system
- WooCommerce integration
- Sapo integration
- Browser extension
- Heavy state management libraries unless necessary

---

## Coding Rules

- Use TypeScript.
- Keep components small and focused.
- Put reusable logic in `lib/`.
- Keep API keys server-side only.
- Do not expose `OPENAI_API_KEY` to the browser.
- Add meaningful error handling.
- Add loading states in the UI.
- Do not hardcode user-specific product data.
- Do not permanently store uploaded images.
- Use simple and readable code over clever abstractions.

---

## MVP Scope

Implement:

- Multi-image upload
- Product information form
- Prompt textarea
- Optimize-only mode
- Generate-from-image-and-prompt mode
- Image sharpening
- Image compression
- WebP/JPEG export
- SEO filename generation
- Rule-based alt text generation
- Editable filename and alt text
- ZIP export with metadata.json

Do not implement:

- Authentication
- Database
- WooCommerce API
- WordPress Media Library
- Sapo
- Chrome extension
- Payment system
- Image history
- Cloud storage

---

## Image Processing Rules

Use Sharp.

Defaults:

- Resize: 1200x1200
- Preserve aspect ratio
- Do not stretch or distort product
- Add padding if needed
- Export format: WebP
- Quality: 82 or 85
- Sharpen: Low

Avoid:

- Over-sharpening
- Color distortion
- Excessive compression artifacts

---

## Image Generation Rules

Use OpenAI Image API for image generation/editing.

Rules:

- Use uploaded image as input/reference.
- Use user prompt as instruction.
- Keep image generation code isolated in `lib/image-generation.ts`.
- If `OPENAI_API_KEY` is missing, show a clear error only when the user tries image generation mode.
- Optimize-only mode must still work without API key.
- Do not log sensitive data or API keys.

---

## SEO Filename Rules

Generate filenames from:

- Brand
- Product name
- Color
- Category
- Image index
- Format

Rules:

- Remove Vietnamese accents.
- Lowercase all text.
- Replace spaces with hyphens.
- Remove special characters.
- Avoid duplicate filenames.
- Use image index: 01, 02, 03...
- File extension must match output format.

---

## Alt Text Rules

Generate rule-based alt text from:

- Product name
- Brand
- Category
- Color
- SEO keywords

Rules:

- Sound natural.
- Avoid keyword stuffing.
- Include main keyword if available.
- Keep around 160 characters if possible.
- Make alt text editable in UI.

---

## UI Rules

Use a clean dashboard layout.

Must include:

- Upload area
- Product form
- Prompt textarea
- Processing options
- Image preview
- Filename editor
- Alt text editor
- File size before/after
- Download buttons
- Error messages
- Loading states

The user should be able to understand the app without reading documentation.

---

## Testing Before Finishing

Before finishing the task, try to run:

- npm install
- npm run lint, if configured
- npm run build, if configured

If any command fails, fix the issue or clearly document why it fails.

---

## README Requirements

Update README.md with:

1. Project overview
2. Features
3. Requirements
4. Setup instructions
5. Environment variable setup
6. How to run locally
7. How to test the MVP
8. Known limitations
9. Future improvements
