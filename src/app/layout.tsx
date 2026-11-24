import type { Metadata, Viewport } from "next";
import "@fontsource-variable/vazirmatn/wght.css";
import "./globals.css";
import { publishedBranches } from "@/data/branches";
import { site } from "@/data/site";

const hasPublishedBranches = publishedBranches.length > 0;
const pageTitle = hasPublishedBranches
  ? "فروشگاه‌های پویا | معرفی دسته‌ها و شعب"
  : "فروشگاه‌های پویا | معرفی برند و دسته‌بندی محصولات";
const pageDescription = hasPublishedBranches
  ? "با دسته‌های محصولات فروشگاه‌های پویا آشنا شوید و فهرست شعب منتشرشده را ببینید."
  : site.description;

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: "/",
    siteName: site.name,
    title: pageTitle,
    description: pageDescription,
    images: [{ url: "/images/pouya-editorial-still-life.webp", width: 1536, height: 1024, alt: "چیدمانی از دسته‌های محصولات فروشگاه‌های پویا" }],
  },
  twitter: { card: "summary_large_image", title: pageTitle, description: pageDescription, images: ["/images/pouya-editorial-still-life.webp"] },
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

const storeSchemas = publishedBranches
  .filter((branch) => branch.name.trim() && branch.city.trim() && branch.address.trim())
  .map((branch) => ({
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": `${site.domain}/#store-${branch.id}`,
    name: branch.name,
    url: `${site.domain}/#stores`,
    address: {
      "@type": "PostalAddress",
      streetAddress: branch.address,
      addressLocality: branch.city,
    },
    ...(branch.phone ? { telephone: branch.phone } : {}),
    ...(branch.image
      ? { image: new URL(branch.image.startsWith("/") ? branch.image : `/${branch.image}`, site.domain).toString() }
      : {}),
  }));

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body>
        <a className="skip-link" href="#main-content">رفتن به محتوای اصلی</a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c") }} />
        {storeSchemas.map((store) => (
          <script key={store["@id"]} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(store).replace(/</g, "\\u003c") }} />
        ))}
        {children}
      </body>
    </html>
  );
}
