export type DestinationPlatform =
  | "digikala"
  | "snapp"
  | "instagram"
  | "telegram"
  | "bale"
  | "neshan"
  | "balad"
  | "google-maps";

type DestinationDetails = {
  id: string;
  platform: DestinationPlatform;
  name: string;
  description: string;
  action: string;
  url: string;
  reviewedAt?: string;
  status: "draft" | "published" | "inactive";
};

export type Destination = DestinationDetails & (
  | { scope: "brand"; scopeId?: never }
  | { scope: "branch" | "category"; scopeId: string }
);

export const destinations: Destination[] = [];
