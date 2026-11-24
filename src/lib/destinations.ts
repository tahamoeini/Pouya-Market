import type { Destination, DestinationPlatform } from "@/data/platforms";

const shoppingPlatforms = new Set<DestinationPlatform>(["digikala", "snapp"]);
const mapPlatforms = new Set<DestinationPlatform>(["neshan", "balad", "google-maps"]);

export function isShoppingDestination(destination: Pick<Destination, "platform">) {
  return shoppingPlatforms.has(destination.platform);
}

export function isMapDestination(destination: Pick<Destination, "platform">) {
  return mapPlatforms.has(destination.platform);
}

export function isSocialDestination(destination: Pick<Destination, "platform">) {
  return !isShoppingDestination(destination) && !isMapDestination(destination);
}
