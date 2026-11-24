import { existsSync } from "node:fs";
import path from "node:path";
import { branches } from "@/data/branches";
import { categories } from "@/data/categories";
import { destinations } from "@/data/platforms";
import { site } from "@/data/site";
import { isApprovedExternalUrl } from "./external-links";

export function validateContent() {
  const errors: string[] = [];
  const categoryIds = new Set(categories.map(({ id }) => id));
  const ids = new Set<string>();

  if (categoryIds.size !== categories.length) errors.push("شناسهٔ دسته‌بندی تکراری است.");

  for (const branch of branches) {
    if (ids.has(branch.id)) errors.push(`شناسهٔ تکراری شعبه: ${branch.id}`);
    ids.add(branch.id);
    if (branch.status === "published" && (!branch.name || !branch.city || !branch.address || !branch.categoryIds.length)) {
      errors.push(`اطلاعات لازم شعبه کامل نیست: ${branch.id}`);
    }
    for (const categoryId of branch.categoryIds) {
      if (!categoryIds.has(categoryId)) errors.push(`دستهٔ نامعتبر ${categoryId} در شعبهٔ ${branch.id}`);
    }
    if (branch.status === "published" && branch.image && !existsSync(path.join(process.cwd(), "public", branch.image.replace(/^\/+/, "")))) {
      errors.push(`تصویر شعبه پیدا نشد: ${branch.id}/${branch.image}`);
    }
  }

  for (const destination of destinations) {
    if (ids.has(destination.id)) errors.push(`شناسهٔ تکراری مقصد: ${destination.id}`);
    ids.add(destination.id);
    if (!isApprovedExternalUrl(destination.url, destination.platform)) {
      errors.push(`نشانی HTTPS یا میزبان مورد تأیید نامعتبر است: ${destination.id}`);
    }
    if (destination.status === "published" && !destination.reviewedAt) {
      errors.push(`مقصد منتشرشده بازبینی نشده است: ${destination.id}`);
    }
  }

  for (const branch of branches.filter(({ status }) => status === "published")) {
    for (const channel of branch.channels ?? []) {
      if (!isApprovedExternalUrl(channel.url, channel.platform)) {
        errors.push(`نشانی کانال شعبه مورد تأیید نیست: ${branch.id}/${channel.platform}`);
      }
    }
    for (const [provider, url] of Object.entries(branch.mapLinks ?? {})) {
      if (url && !isApprovedExternalUrl(url, provider === "googleMaps" ? "google-maps" : provider)) {
        errors.push(`نشانی مسیریابی مورد تأیید نیست: ${branch.id}/${provider}`);
      }
    }
  }

  if (!site.domain.startsWith("https://")) errors.push("نشانی اصلی سایت باید HTTPS باشد.");
  return errors;
}
