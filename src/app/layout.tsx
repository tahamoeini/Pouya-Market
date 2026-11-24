import type { Metadata, Viewport } from "next";
import "@fontsource-variable/vazirmatn/wght.css";
import "./globals.css";
import { site } from "@/data/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: "فروشگاه‌های پویا | معرفی برند و دسته‌بندی محصولات",
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: "/",
    siteName: site.name,
    title: "فروشگاه‌های پویا | معرفی برند و دسته‌بندی محصولات",
    description: site.description,
    images: [{ url: "/images/pouya-editorial-still-life.webp", width: 1536, height: 1024, alt: "چیدمانی از دسته‌های محصولات فروشگاه‌های پویا" }],
  },
  twitter: { card: "summary_large_image", title: "فروشگاه‌های پویا", description: site.description, images: ["/images/pouya-editorial-still-life.webp"] },
  icons: { icon: "/brand/pouya-logo.png", apple: "/brand/pouya-logo.png" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "#F5F8F7" }, { media: "(prefers-color-scheme: dark)", color: "#0D1B1C" }],
};

const themeScript = `try { const value = localStorage.getItem('pouya-theme'); if (value === 'dark') document.documentElement.dataset.theme = 'dark'; } catch {}`;

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  alternateName: site.latinName,
  url: site.domain,
  logo: `${site.domain}/brand/pouya-logo.png`,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body>
        <a className="skip-link" href="#main-content">رفتن به محتوای اصلی</a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c") }} />
        {children}
      </body>
    </html>
  );
}
