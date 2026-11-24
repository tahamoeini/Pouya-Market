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
  mapLinks?: { neshan?: string; balad?: string; googleMaps?: string };
  channels?: { platform: string; label: string; url: string }[];
  status: "draft" | "published" | "inactive";
};

export const branches: Branch[] = [];

export const previewBranches =
  process.env.NODE_ENV === "development" ? branchFixtures : [];
