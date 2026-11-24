"use client";

import Image from "next/image";
import { ArrowLeft, MapPin, Phone, Store } from "lucide-react";
import { useMemo, useSyncExternalStore } from "react";
import { categories } from "@/data/categories";
import type { Branch } from "@/data/branches";
import type { Destination } from "@/data/platforms";
import { isMapDestination, isShoppingDestination, isSocialDestination } from "@/lib/destinations";
import {
  BRANCH_FILTERS_CHANGE_EVENT,
  clearBranchFilterSearch,
  filterBranches,
  readBranchFilters,
  updateBranchFilterSearch,
  type BranchFilterParameter,
} from "@/lib/store-discovery";

export function BranchFinder({
  branches,
  destinations,
  branchCategoryIds,
}: {
  branches: Branch[];
  destinations: Destination[];
  branchCategoryIds: string[];
}) {
  const cities = useMemo(() => Array.from(new Set(branches.map((branch) => branch.city))), [branches]);
  const availableCityNames = useMemo(() => new Set(cities), [cities]);
  const availableCategoryIds = useMemo(() => new Set(branchCategoryIds), [branchCategoryIds]);
  const currentSearch = useSyncExternalStore(subscribeToLocationChange, getSearch, getServerSearch);
  const { city: selectedCity, categoryId: selectedCategoryId } = readBranchFilters(
    currentSearch,
    availableCityNames,
    availableCategoryIds,
  );
  const filteredBranches = useMemo(
    () => filterBranches(branches, { city: selectedCity, categoryId: selectedCategoryId }),
    [branches, selectedCity, selectedCategoryId],
  );

  function clearFilters() {
    replaceSearch(clearBranchFilterSearch(window.location.search));
  }

  function updateFilter(parameter: BranchFilterParameter, value: string) {
    replaceSearch(updateBranchFilterSearch(window.location.search, parameter, value));
  }

  function replaceSearch(search: string) {
    const url = new URL(window.location.href);
    url.search = search;
    window.history.replaceState(null, "", url);
    window.dispatchEvent(new Event(BRANCH_FILTERS_CHANGE_EVENT));
  }

  return (
    <section className="stores-section section-pad" id="stores" aria-labelledby="stores-title">
      <div className="page-wrap">
        <div className="section-heading stores-heading">
          <div>
            <span className="section-kicker">نزدیک‌تر از آنچه فکر می‌کنید</span>
            <h2 id="stores-title">شعب <span>فروشگاه‌های پویا</span></h2>
          </div>
          <p>شعبهٔ موردنظر را پیدا کنید و برای جزئیات مراجعه، مسیر دسترسی را ببینید.</p>
        </div>

        <div className="store-filters">
          {cities.length > 1 && (
            <label className="filter-field">
              <span>شهر</span>
              <select value={selectedCity} onChange={(event) => updateFilter("storeCity", event.target.value)}>
                <option value="">همهٔ شهرها</option>
                {cities.map((city) => <option value={city} key={city}>{city}</option>)}
              </select>
            </label>
          )}
          {availableCategoryIds.size > 1 && (
            <label className="filter-field">
              <span>دسته‌بندی</span>
              <select value={selectedCategoryId} onChange={(event) => updateFilter("storeCategory", event.target.value)}>
                <option value="">همهٔ دسته‌ها</option>
                {categories
                  .filter(({ id }) => availableCategoryIds.has(id))
                  .map((category) => <option value={category.id} key={category.id}>{category.title}</option>)}
              </select>
            </label>
          )}
          <span className="branch-count" aria-live="polite" aria-atomic="true">
            {new Intl.NumberFormat("fa-IR").format(filteredBranches.length)} شعبه
          </span>
        </div>

        {filteredBranches.length > 0 ? (
          <div className="branch-grid">
            {filteredBranches.map((branch) => {
              const branchDestinations = destinations.filter(
                (destination) => destination.scope === "branch" && destination.scopeId === branch.id,
              );
              const mapLinks = branchDestinations.filter(isMapDestination);
              const shoppingLinks = branchDestinations.filter(isShoppingDestination);
              const socialLinks = branchDestinations.filter(isSocialDestination);
              const branchLinks = [...mapLinks, ...shoppingLinks, ...socialLinks];

              return (
                <article className="branch-card" key={branch.id}>
                  {branch.image && (
                    <Image
                      className="branch-image"
                      src={getPublicImagePath(branch.image)}
                      alt={`نمایی از ${branch.name}`}
                      width={800}
                      height={450}
                      sizes="(max-width: 760px) 100vw, 33vw"
                    />
                  )}
                  <div className="branch-card-head">
                    <span className="branch-icon"><Store size={20} aria-hidden="true" /></span>
                    <span className="branch-city">
                      <MapPin size={14} aria-hidden="true" />
                      {branch.neighborhood ? `${branch.city}، ${branch.neighborhood}` : branch.city}
                    </span>
                  </div>
                  <h3>{branch.name}</h3>
                  <p className="branch-address">{branch.address}</p>
                  <div className="branch-tags">
                    {branch.categoryIds.map((id) => {
                      const category = categories.find((item) => item.id === id);
                      return category ? <span key={id}>{category.title}</span> : null;
                    })}
                  </div>
                  {(branch.phone || branch.hours) && (
                    <div className="branch-meta">
                      {branch.phone && (
                        <a href={`tel:${branch.phone}`}>
                          <Phone size={15} aria-hidden="true" />
                          <span>تماس با شعبه</span>
                          <bdi>{branch.phone}</bdi>
                        </a>
                      )}
                      {branch.hours && <span>{branch.hours}</span>}
                    </div>
                  )}
                  {branchLinks.length > 0 && (
                    <div className="branch-links">
                      {branchLinks.map((destination) => (
                        <a href={destination.url} key={destination.id}>
                          {destination.action}{" "}<bdi>{destination.name}</bdi><ArrowLeft size={15} aria-hidden="true" />
                        </a>
                      ))}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-icon"><Store size={24} aria-hidden="true" /></span>
            <h3>شعبه‌ای با این انتخاب پیدا نشد</h3>
            <p>دسته یا شهر دیگری را امتحان کنید.</p>
            <button type="button" className="text-button" onClick={clearFilters}>پاک کردن فیلترها</button>
          </div>
        )}
      </div>
    </section>
  );
}

function getPublicImagePath(image: string) {
  return image.startsWith("/") ? image : `/${image}`;
}

function subscribeToLocationChange(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener(BRANCH_FILTERS_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener(BRANCH_FILTERS_CHANGE_EVENT, callback);
  };
}

function getSearch() {
  return window.location.search;
}

function getServerSearch() {
  return "";
}
