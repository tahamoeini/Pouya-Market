import type { Branch } from "./branches";
import type { Destination } from "./platforms";

export const branchFixtures: Branch[] = [
  {
    id: "preview-north",
    name: "شعبهٔ نمونهٔ شمال",
    city: "تهران",
    neighborhood: "نمونهٔ توسعه",
    address: "نشانی نمایشی برای بررسی گردش یافتن شعبه",
    phone: "02100000000",
    hours: "ساعت کاری نمایشی",
    categoryIds: ["toys", "stationery", "haberdashery"],
    mapLinks: { googleMaps: "https://maps.google.com/?q=35.72,51.40" },
    channels: [{ platform: "instagram", label: "اینستاگرام نمونه", url: "https://instagram.com/" }],
    status: "published",
  },
  {
    id: "preview-south",
    name: "شعبهٔ نمونهٔ مرکز",
    city: "تهران",
    neighborhood: "نمونهٔ توسعه",
    address: "نشانی نمایشی دیگر برای بررسی فیلترها",
    categoryIds: ["womens-fashion", "beauty", "accessories", "home-kitchen"],
    status: "published",
  },
  {
    id: "preview-inactive",
    name: "شعبهٔ غیرفعال نمونه",
    city: "نمونه",
    address: "این رکورد نباید نمایش داده شود",
    categoryIds: ["toys"],
    status: "inactive",
  },
];

export const destinationFixtures: Destination[] = [
  {
    id: "preview-digikala",
    platform: "digikala",
    name: "دیجی‌کالا",
    description: "پیوند نمایشی برای آزمودن کارت‌های خرید آنلاین",
    action: "باز کردن لینک آزمایشی",
    scope: "brand",
    url: "https://www.digikala.com/",
    reviewedAt: "2026-11-23",
    status: "published",
  },
  {
    id: "preview-snapp",
    platform: "snapp",
    name: "اسنپ",
    description: "پیوند نمایشی برای بررسی نمایش کانال خرید",
    action: "باز کردن لینک آزمایشی",
    scope: "brand",
    url: "https://snapp.market/",
    reviewedAt: "2026-11-23",
    status: "published",
  },
];
