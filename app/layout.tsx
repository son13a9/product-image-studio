import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Product Image Studio",
  description: "Optimize ecommerce product images for SEO-ready exports.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
