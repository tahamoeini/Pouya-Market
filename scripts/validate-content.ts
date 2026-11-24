import { branches } from "../src/data/branches";
import { destinations } from "../src/data/platforms";
import { branchFixtures, destinationFixtures } from "../src/data/preview-fixtures";
import { validateContent } from "../src/lib/content";

const errors = [
  ...validateContent(),
  ...validateContent({
    branches: [...branches, ...branchFixtures],
    destinations: [...destinations, ...destinationFixtures],
  }),
];
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log("Content validation passed.");
}
