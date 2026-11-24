export type Destination = {
  id: string;
  platform: "digikala" | "snapp" | "instagram" | "telegram" | "bale" | string;
  name: string;
  description: string;
  action: string;
  scope: "brand" | "branch" | "category";
  url: string;
  reviewedAt: string;
  status: "draft" | "published" | "inactive";
};

export const destinations: Destination[] = [];
