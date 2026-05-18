import type { ProductInfo } from "./types";

export function parseSeoKeywords(seoKeywords: string): string[] {
  return seoKeywords
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}

export function generateAltText(product: ProductInfo): string {
  const keywords = parseSeoKeywords(product.seoKeywords);
  const mainKeyword = keywords[0];
  const subject = [product.productName, product.color ? `màu ${product.color}` : ""]
    .filter(Boolean)
    .join(" ");
  const brandPhrase = product.brand ? ` của ${product.brand}` : "";
  const categoryPhrase = product.category ? ` trong danh mục ${product.category}` : "";
  const keywordPhrase = mainKeyword ? `, phù hợp khi tìm ${mainKeyword}` : "";
  const fallback = subject || product.category || product.brand || "Sản phẩm ecommerce";
  const altText = `${fallback}${brandPhrase}${categoryPhrase}${keywordPhrase}.`;

  if (altText.length <= 165) {
    return altText;
  }

  const shorter = `${fallback}${brandPhrase}${mainKeyword ? `, ${mainKeyword}` : ""}.`;
  return shorter.length <= 165 ? shorter : `${shorter.slice(0, 162).trim()}...`;
}
