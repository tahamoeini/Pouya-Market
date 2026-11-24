import type { Branch } from "@/data/branches";

export type BranchFilter = {
  city?: string;
  categoryId?: string;
};

export function filterBranches(branches: readonly Branch[], filter: BranchFilter) {
  return branches.filter((branch) => {
    const matchesCity = !filter.city || branch.city === filter.city;
    const matchesCategory = !filter.categoryId || branch.categoryIds.includes(filter.categoryId);
    return matchesCity && matchesCategory;
  });
}
