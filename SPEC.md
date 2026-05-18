# Product Image Studio - MVP Spec

## 1. Product Goal

Build a mini internal web app for ecommerce product image creation and optimization.

The app is for sellers who want to prepare product images before uploading them to a website.

The app should allow the user to:

1. Upload product photos.
2. Enter a design prompt.
3. Generate new product images based on the uploaded photo and prompt.
4. Improve image sharpness and visual clarity.
5. Compress images.
6. Export images as WebP and/or JPEG.
7. Generate SEO-friendly filenames.
8. Generate editable alt text based on user-provided SEO keywords.
9. Download processed results as a ZIP file.

This MVP does not need login, database, WooCommerce integration, Sapo integration, or direct website upload.

---

## 2. Target User

The target user is an ecommerce seller preparing product images for website upload.

The user is not technical, so the interface must be simple, clear, and easy to use.

---

## 3. Tech Stack

Use:

- Next.js App Router
- TypeScript
- Tailwind CSS
- Sharp for image processing
- JSZip or archiver for ZIP export
- OpenAI Image API for image generation/editing
- Rule-based alt text generation for MVP
- No database
- No login
- No WooCommerce integration

---

## 4. Main Workflow

### Step 1: Upload images

The user can upload one or multiple product images.

Requirements:

- Support JPG, JPEG, PNG, WebP.
- Show preview of each uploaded image.
- Show original filename.
- Show original file size.
- Support at least 5 images in one batch.

---

### Step 2: Enter product information

The app should provide a form with these fields:

- Product name
- Brand
- Category
- Color / variant
- SEO keywords
- Image design prompt

Example:

Product name: Nautilus Clone V2  
Brand: Armed Shark  
Category: Balisong Trainer  
Color: Blue Silver  
SEO keywords: balisong trainer, dao tập balisong, luyện tập lật dao  
Prompt: Create a square ecommerce product image with brushed steel background, industrial gaming border, product centered, realistic shadow, premium lighting.

---

### Step 3: Choose operation mode

The app should support two modes:

#### Mode A: Optimize only

This mode does not generate a new AI image.

It should:

- Resize image
- Sharpen image
- Compress image
- Convert to WebP/JPEG
- Generate filename
- Generate alt text
- Export ZIP

#### Mode B: Generate from image + prompt

This mode uses the uploaded image as a reference and the user's prompt as design instruction.

It should:

- Send the uploaded image and prompt to the image generation API.
- Generate a new image result.
- Then process the generated image:
  - sharpen
  - compress
  - convert to WebP/JPEG
  - generate filename
  - generate alt text
  - export ZIP

If image generation API is not configured, show a clear message telling the user to add the API key.

---

## 5. Image Generation Requirements

Use OpenAI Image API.

Requirements:

- Use the uploaded product image as input/reference.
- Use the prompt entered by the user as the instruction.
- Generate one image result per uploaded image in MVP.
- Provide clear error messages if API call fails.
- Do not hardcode API keys.
- Use environment variable:

OPENAI_API_KEY

The image generation function should be isolated in:

lib/image-generation.ts

The implementation should be easy to replace later if another image provider is used.

---

## 6. Image Processing Requirements

Use Sharp.

The app should provide these options:

### Resize

Available sizes:

- 1200x1200
- 1600x1600
- Original size

Default:

- 1200x1200

Rules:

- Preserve aspect ratio.
- Do not distort or stretch the product.
- Add padding if needed.
- Default padding background: white or transparent when possible.

### Sharpen

Available sharpening options:

- Off
- Low
- Medium
- High

Default:

- Low

Avoid over-sharpening or creating unnatural halos.

### Export format

Available formats:

- WebP
- JPEG
- Both WebP and JPEG

Default:

- WebP

### Quality

Available options:

- 70
- 80
- 85
- 90

Default:

- 82 or 85

### File size display

Show:

- Original file size
- Processed file size
- Percentage reduction

---

## 7. Filename Generation Requirements

Generate SEO-friendly filenames from:

- Product name
- Brand
- Category
- Color / variant
- Image index
- Export format

Rules:

- Lowercase
- Remove Vietnamese accents
- Replace spaces with hyphens
- Remove special characters
- Avoid duplicate filenames
- Append image index: 01, 02, 03...
- Append correct extension: .webp or .jpg

Example:

Input:

Product name: Nautilus Clone V2  
Brand: Armed Shark  
Category: Balisong Trainer  
Color: Xanh bạc  

Output:

armed-shark-nautilus-clone-v2-xanh-bac-balisong-trainer-01.webp

The filename should be editable before export.

Filename generation function should be isolated in:

lib/filename.ts

---

## 8. Alt Text Generation Requirements

For MVP, generate alt text using rule-based logic based on:

- Product name
- Brand
- Category
- Color / variant
- SEO keywords

Example input:

Product name: Nautilus Clone V2  
Brand: Armed Shark  
Category: Balisong Trainer  
Color: Xanh bạc  
SEO keywords: dao tập balisong, balisong trainer, luyện tập lật dao  

Example alt text:

Nautilus Clone V2 màu xanh bạc của Armed Shark, balisong trainer dùng để luyện tập lật dao, phù hợp cho người mới.

Requirements:

- Alt text must be editable.
- Alt text should sound natural.
- Avoid keyword stuffing.
- Do not exceed around 160 characters if possible.
- Include the main SEO keyword naturally.

Alt text function should be isolated in:

lib/alt-text.ts

---

## 9. Export Requirements

The user can download:

1. Individual processed image.
2. All processed images as ZIP.

ZIP should contain:

- Processed image files
- metadata.json

ZIP folder structure example:

product-image-studio-export/
├── armed-shark-nautilus-clone-v2-xanh-bac-balisong-trainer-01.webp
├── armed-shark-nautilus-clone-v2-xanh-bac-balisong-trainer-02.webp
└── metadata.json

metadata.json format:

{
  "product_name": "",
  "brand": "",
  "category": "",
  "color": "",
  "seo_keywords": [],
  "prompt": "",
  "mode": "optimize_only | generate_from_prompt",
  "images": [
    {
      "original_filename": "",
      "output_filename": "",
      "format": "",
      "alt_text": "",
      "original_size_bytes": 0,
      "processed_size_bytes": 0
    }
  ]
}

---

## 10. UI Requirements

Create a clean dashboard-style interface.

Layout suggestion:

### Left panel

- Upload area
- Product information form
- Prompt textarea
- Processing options

### Right panel

- Original image preview
- Generated/processed image preview
- Filename field
- Alt text field
- File size information
- Download buttons

### Buttons

- Generate image
- Optimize images
- Download ZIP
- Clear all

### UX requirements

- Show loading state during processing.
- Show errors clearly.
- Do not crash if one image fails.
- Allow user to continue processing other images.
- Keep interface simple and readable.

---

## 11. Environment Variables

Create `.env.example` with:

OPENAI_API_KEY=your_openai_api_key_here

The app should not fail on startup if the key is missing.

Only image generation mode should require the key.

Optimize-only mode should work without OpenAI API key.

---

## 12. Security and Privacy

- Do not store uploaded images permanently.
- Do not add a database in MVP.
- Keep all temporary processing in memory or temporary server files.
- Do not log API keys.
- Do not expose API keys to frontend code.

---

## 13. Project Structure

Use a clear structure similar to:

product-image-studio/
├── app/
│   ├── page.tsx
│   └── api/
│       ├── generate-image/route.ts
│       ├── process-image/route.ts
│       └── export-zip/route.ts
├── components/
│   ├── UploadBox.tsx
│   ├── ProductForm.tsx
│   ├── PromptBox.tsx
│   ├── ProcessingOptions.tsx
│   ├── PreviewGrid.tsx
│   ├── ResultCard.tsx
│   └── ExportPanel.tsx
├── lib/
│   ├── image-generation.ts
│   ├── image-processing.ts
│   ├── filename.ts
│   ├── alt-text.ts
│   └── zip.ts
├── public/
├── .env.example
├── README.md
├── SPEC.md
└── AGENTS.md

---

## 14. Exclusions for MVP

Do not implement:

- Login
- User accounts
- Database
- WooCommerce upload
- Sapo upload
- WordPress Media Library integration
- Chrome extension
- Browser automation
- Background template library
- Payment system
- Team workspace
- Cloud storage
- History page

---

## 15. Acceptance Criteria

The MVP is complete when:

1. I can run the app locally with npm install and npm run dev.
2. I can upload at least 5 product images.
3. I can preview uploaded images.
4. I can enter product information and SEO keywords.
5. I can enter an image design prompt.
6. Optimize-only mode works without OpenAI API key.
7. Image generation mode uses OpenAI API when OPENAI_API_KEY is configured.
8. The app can sharpen and compress images.
9. The app can export WebP and JPEG.
10. The app generates SEO-friendly filenames.
11. The app generates editable alt text based on SEO keywords.
12. The app exports a ZIP with processed images and metadata.json.
13. README.md includes setup, environment variable, and testing instructions.
14. The code is clean, typed, and easy to maintain.
