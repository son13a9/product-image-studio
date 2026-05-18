import JSZip from "jszip";

export type ZipImageInput = {
  filename: string;
  base64: string;
};

export async function createExportZip(images: ZipImageInput[], metadata: unknown): Promise<Buffer> {
  const zip = new JSZip();
  const folder = zip.folder("product-image-studio-export");

  if (!folder) {
    throw new Error("Could not create ZIP folder.");
  }

  for (const image of images) {
    folder.file(image.filename, image.base64, { base64: true });
  }

  folder.file("metadata.json", JSON.stringify(metadata, null, 2));
  const arrayBuffer = await zip.generateAsync({ type: "arraybuffer", compression: "DEFLATE" });
  return Buffer.from(arrayBuffer);
}
