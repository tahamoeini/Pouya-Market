import type { DestinationPlatform } from "@/data/platforms";

const approvedHosts: Record<DestinationPlatform, readonly string[]> = {
  digikala: ["digikala.com"],
  snapp: ["snapp.market", "snappfood.ir"],
  instagram: ["instagram.com"],
  telegram: ["t.me", "telegram.me"],
  bale: ["bale.ai"],
  neshan: ["neshan.org"],
  balad: ["balad.ir"],
  "google-maps": ["google.com", "maps.app.goo.gl"],
};

export function isApprovedExternalUrl(value: string, platform: DestinationPlatform) {
  try {
    const url = new URL(value);
    const hosts = approvedHosts[platform];
    return url.protocol === "https:"
      && !url.username
      && !url.password
      && !url.port
      && Boolean(hosts?.some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`)));
  } catch {
    return false;
  }
}
