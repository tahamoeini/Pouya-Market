import assert from "node:assert/strict";
import test from "node:test";
import { branchFixtures } from "../src/data/preview-fixtures";
import {
  clearBranchFilterSearch,
  filterBranches,
  readBranchFilters,
  selectBranchCategory,
  updateBranchFilterSearch,
} from "../src/lib/store-discovery";

const publishedFixtures = branchFixtures.filter((branch) => branch.status === "published");

test("returns every published branch when no filters are selected", () => {
  const result = filterBranches(publishedFixtures, {});

  assert.deepEqual(result.map((branch) => branch.id), [
    "preview-north",
    "preview-south",
    "preview-west",
  ]);
});

test("combines city and category filters", () => {
  const result = filterBranches(publishedFixtures, {
    city: "تهران",
    categoryId: "womens-fashion",
  });

  assert.deepEqual(result.map((branch) => branch.id), ["preview-south"]);
});

test("returns no branches when the selected city and category do not intersect", () => {
  const result = filterBranches(publishedFixtures, {
    city: "کرج",
    categoryId: "womens-fashion",
  });

  assert.deepEqual(result, []);
});

test("filters by category without restricting the city", () => {
  const result = filterBranches(publishedFixtures, { categoryId: "toys" });

  assert.deepEqual(result.map((branch) => branch.id), ["preview-north", "preview-west"]);
});

test("selecting a category clears the city while preserving unrelated query values", () => {
  const search = selectBranchCategory("?storeCity=کرج&campaign=summer", "toys");
  const params = new URLSearchParams(search);

  assert.equal(params.get("storeCity"), null);
  assert.equal(params.get("storeCategory"), "toys");
  assert.equal(params.get("campaign"), "summer");
});

test("reads only city and category values present in published data", () => {
  const filters = readBranchFilters(
    "?storeCity=کرج&storeCategory=toys",
    new Set(["کرج", "تهران"]),
    new Set(["toys", "womens-fashion"]),
  );

  assert.deepEqual(filters, { city: "کرج", categoryId: "toys" });
});

test("ignores unknown city and category query values", () => {
  const filters = readBranchFilters(
    "?storeCity=ناشناخته&storeCategory=unknown",
    new Set(["کرج", "تهران"]),
    new Set(["toys", "womens-fashion"]),
  );

  assert.deepEqual(filters, { city: "", categoryId: "" });
});

test("clearing branch filters removes both filters and keeps unrelated query values", () => {
  const search = clearBranchFilterSearch("?storeCity=کرج&storeCategory=toys&campaign=summer");

  assert.equal(search, "?campaign=summer");
});

test("updating a filter removes it when cleared", () => {
  assert.equal(updateBranchFilterSearch("?storeCategory=toys", "storeCategory", ""), "");
});
