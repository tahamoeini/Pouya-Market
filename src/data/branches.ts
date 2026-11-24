import { branchFixtures } from "./preview-fixtures";

export type Branch = {
  id: string;
  name: string;
  city: string;
  neighborhood?: string;
  address: string;
  phone?: string;
  hours?: string;
  image?: string;
  categoryIds: string[];
  status: "draft" | "published" | "inactive";
};

export const branches: Branch[] = [];

export const previewBranches =
  process.env.NODE_ENV === "development" ? branchFixtures : [];

export const publishedBranches = [
  ...branches.filter((branch) => branch.status === "published"),
  ...previewBranches.filter((branch) => branch.status === "published"),
];
