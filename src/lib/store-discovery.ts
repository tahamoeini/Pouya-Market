import type { Branch } from "@/data/branches";

export const BRANCH_FILTERS_CHANGE_EVENT = "pouya-branch-filters-change";

export type BranchFilter = {
  city?: string;
  categoryId?: string;
};

export type BranchFilterParameter = "storeCity" | "storeCategory";

export function readBranchFilters(
  search: string,
  availableCities: ReadonlySet<string>,
  availableCategoryIds: ReadonlySet<string>,
) {
  const params = new URLSearchParams(search);
  const city = params.get("storeCity") ?? "";
  const categoryId = params.get("storeCategory") ?? "";

  return {
    city: availableCities.has(city) ? city : "",
    categoryId: availableCategoryIds.has(categoryId) ? categoryId : "",
  };
}

export function selectBranchCategory(search: string, categoryId: string) {
  const params = new URLSearchParams(search);
  params.delete("storeCity");
  params.set("storeCategory", categoryId);
  return toSearchString(params);
}

export function updateBranchFilterSearch(search: string, parameter: BranchFilterParameter, value: string) {
  const params = new URLSearchParams(search);
  if (value) params.set(parameter, value);
  else params.delete(parameter);
  return toSearchString(params);
}

export function clearBranchFilterSearch(search: string) {
  const params = new URLSearchParams(search);
  params.delete("storeCity");
  params.delete("storeCategory");
  return toSearchString(params);
}

export function filterBranches(branches: readonly Branch[], filter: BranchFilter) {
  return branches.filter((branch) => {
    const matchesCity = !filter.city || branch.city === filter.city;
    const matchesCategory = !filter.categoryId || branch.categoryIds.includes(filter.categoryId);
    return matchesCity && matchesCategory;
  });
}

function toSearchString(params: URLSearchParams) {
  const search = params.toString();
  return search ? `?${search}` : "";
}
