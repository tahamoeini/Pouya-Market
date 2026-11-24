import { existsSync } from "node:fs";
import path from "node:path";
import { branches } from "@/data/branches";
import type { Branch } from "@/data/branches";
import { categories } from "@/data/categories";
import { destinations, type Destination } from "@/data/platforms";
import { site } from "@/data/site";
import { isMapDestination } from "./destinations";
import { isApprovedExternalUrl } from "./external-links";

export function validateContent(records: { branches?: readonly Branch[]; destinations?: readonly Destination[] } = {}) {
  const branchRecords = records.branches ?? branches;
  const destinationRecords = records.destinations ?? destinations;
  const errors: string[] = [];
  const categoryIds = new Set(categories.map(({ id }) => id));
  const ids = new Set<string>();
  const branchesById = new Map(branchRecords.map((branch) => [branch.id, branch]));

  if (categoryIds.size !== categories.length) errors.push("شناسهٔ دسته‌بندی تکراری است.");
  for (const category of categories) {
    if (!category.title.trim() || !category.description.trim()) {
      errors.push(`عنوان یا شرح دسته‌بندی خالی است: ${category.id}`);
    }
  }

  for (const branch of branchRecords) {
    if (ids.has(branch.id)) errors.push(`شناسهٔ تکراری شعبه: ${branch.id}`);
    ids.add(branch.id);
    if (branch.status === "published" && (!branch.name.trim() || !branch.city.trim() || !branch.address.trim() || !branch.categoryIds.length)) {
      errors.push(`اطلاعات لازم شعبه کامل نیست: ${branch.id}`);
    }
    if (new Set(branch.categoryIds).size !== branch.categoryIds.length) {
      errors.push(`دستهٔ تکراری در شعبه وجود دارد: ${branch.id}`);
    }
    for (const categoryId of branch.categoryIds) {
      if (!categoryIds.has(categoryId)) errors.push(`دستهٔ نامعتبر ${categoryId} در شعبهٔ ${branch.id}`);
    }
    if (branch.status === "published" && branch.image && !existsSync(path.join(process.cwd(), "public", branch.image.replace(/^\/+/, "")))) {
      errors.push(`تصویر شعبه پیدا نشد: ${branch.id}/${branch.image}`);
    }
  }

  for (const destination of destinationRecords) {
    if (ids.has(destination.id)) errors.push(`شناسهٔ تکراری مقصد: ${destination.id}`);
    ids.add(destination.id);
    if (!isApprovedExternalUrl(destination.url, destination.platform) || !hasSpecificDestinationPath(destination.url)) {
      errors.push(`نشانی HTTPS یا میزبان مورد تأیید نامعتبر است: ${destination.id}`);
    }
    if (destination.status === "published" && !isValidReviewDate(destination.reviewedAt)) {
      errors.push(`مقصد منتشرشده بازبینی نشده است: ${destination.id}`);
    }
    if (destination.status === "published" && (!destination.name.trim() || !destination.description.trim() || !destination.action.trim())) {
      errors.push(`نام، توضیح یا اقدام مقصد منتشرشده خالی است: ${destination.id}`);
    }
    if (destination.scope === "brand" && "scopeId" in destination) {
      errors.push(`مقصد برند نباید شناسهٔ شعبه یا دسته داشته باشد: ${destination.id}`);
    }
    if (destination.scope === "category" && !categoryIds.has(destination.scopeId)) {
      errors.push(`دستهٔ مقصد نامعتبر است: ${destination.id}/${destination.scopeId}`);
    }
    if (isMapDestination(destination) && destination.scope !== "branch") {
      errors.push(`مقصد مسیریابی باید به شعبه اختصاص داشته باشد: ${destination.id}`);
    }
    if (destination.scope === "branch") {
      const branch = branchesById.get(destination.scopeId);
      if (!branch) errors.push(`شعبهٔ مقصد پیدا نشد: ${destination.id}/${destination.scopeId}`);
      if (destination.status === "published" && branch?.status !== "published") {
        errors.push(`مقصد منتشرشده به شعبهٔ منتشرشده وابسته نیست: ${destination.id}/${destination.scopeId}`);
      }
    }
  }

  try {
    const domain = new URL(site.domain);
    if (domain.protocol !== "https:" || !domain.hostname || domain.username || domain.password) {
      errors.push("نشانی اصلی سایت باید دامنهٔ HTTPS معتبر باشد.");
    }
  } catch {
    errors.push("نشانی اصلی سایت باید دامنهٔ HTTPS معتبر باشد.");
  }
  return errors;
}

function hasSpecificDestinationPath(value: string) {
  try {
    return new URL(value).pathname.split("/").filter(Boolean).length > 0;
  } catch {
    return false;
  }
}

function isValidReviewDate(value?: string) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime())
    && date.toISOString().slice(0, 10) === value
    && date.getTime() <= Date.now();
}
