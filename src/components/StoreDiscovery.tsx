"use client";

import Image from "next/image";
import { ArrowLeft, MapPin, Phone, Store } from "lucide-react";
import { useMemo, useState } from "react";
import { categories } from "@/data/categories";
import type { Branch } from "@/data/branches";
import type { Destination } from "@/data/platforms";
import { isShoppingDestination, isSocialDestination } from "@/lib/destinations";
import { isApprovedExternalUrl } from "@/lib/external-links";
import { filterBranches } from "@/lib/store-discovery";

const categoryPalette = ["sea", "sand", "peach", "cloud", "rose"];
const persianNumberFormatter = new Intl.NumberFormat("fa-IR");
const persianIndexFormatter = new Intl.NumberFormat("fa-IR", { minimumIntegerDigits: 2, useGrouping: false });

export function StoreDiscovery({
  branches,
  destinations,
}: {
  branches: Branch[];
  destinations: Destination[];
}) {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const cities = Array.from(new Set(branches.map((branch) => branch.city)));
  const branchCategoryIds = new Set(branches.flatMap((branch) => branch.categoryIds));
  const filteredBranches = useMemo(
    () => filterBranches(branches, { city: selectedCity, categoryId: selectedCategory }),
    [branches, selectedCity, selectedCategory],
  );

  function showCategoryStores(categoryId: string) {
    setSelectedCity("");
    setSelectedCategory(categoryId);
    setStatusMessage("فهرست شعب بر اساس این دسته‌بندی به‌روز شد.");
  }

  function clearFilters() {
    setSelectedCity("");
    setSelectedCategory("");
    setStatusMessage("فیلترها پاک شدند.");
  }

  return (
    <>
      <section className="categories-section section-pad" id="categories" aria-labelledby="categories-title">
        <div className="page-wrap">
          <div className="section-heading">
            <div>
              <span className="section-kicker">دنیای انتخاب‌های پویا</span>
              <h2 id="categories-title">از هرچه نیاز دارید، <span>یک شروع</span></h2>
            </div>
            <p>دسته‌های متنوع فروشگاه‌های پویا را ببینید و با دنیای هرکدام آشنا شوید.</p>
          </div>
          <div className="category-grid">
            {categories.map((category, index) => {
              const Icon = category.icon;
              const categoryDestinations = destinations.filter(
                (destination) => destination.scope === "category" && destination.scopeId === category.id,
              );
              const hasBranch = branches.some((branch) => branch.categoryIds.includes(category.id));

              return (
                <article
                  className={`category-card ${categoryPalette[index % categoryPalette.length]}${index === 0 || index === 4 ? " category-featured" : ""}`}
                  key={category.id}
                >
                  <div className="category-card-top">
                    <span className="category-icon"><Icon size={23} strokeWidth={1.7} aria-hidden="true" /></span>
                    <span className="category-index" aria-hidden="true">
                      {persianIndexFormatter.format(index + 1)}
                    </span>
                  </div>
                  <div className="category-copy">
                    <h3>{category.title}</h3>
                    <p>{category.description}</p>
                  </div>
                  {(hasBranch || categoryDestinations.length > 0) && (
                    <div className="category-actions">
                      {hasBranch && (
                        <a
                          className="category-action"
                          href="#stores"
                          onClick={() => showCategoryStores(category.id)}
                        >
                          مشاهدهٔ شعب عرضه‌کننده <ArrowLeft size={16} aria-hidden="true" />
                        </a>
                      )}
                      {categoryDestinations.map((destination) => (
                        <a className="category-destination" href={destination.url} key={destination.id}>
                          <span>{destination.action}</span>
                          <bdi>{destination.name}</bdi>
                          <ArrowLeft size={15} aria-hidden="true" />
                        </a>
                      ))}
                    </div>
                  )}
                  <span className="category-orbit" aria-hidden="true" />
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {branches.length > 0 && (
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
                  <select value={selectedCity} onChange={(event) => setSelectedCity(event.target.value)}>
                    <option value="">همهٔ شهرها</option>
                    {cities.map((city) => <option value={city} key={city}>{city}</option>)}
                  </select>
                </label>
              )}
              {branchCategoryIds.size > 1 && (
                <label className="filter-field">
                  <span>دسته‌بندی</span>
                  <select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}>
                    <option value="">همهٔ دسته‌ها</option>
                    {categories
                      .filter(({ id }) => branchCategoryIds.has(id))
                      .map((category) => <option value={category.id} key={category.id}>{category.title}</option>)}
                  </select>
                </label>
              )}
              <span className="branch-count" aria-live="polite" aria-atomic="true">
                {persianNumberFormatter.format(filteredBranches.length)} شعبه
              </span>
            </div>

            {filteredBranches.length > 0 ? (
              <div className="branch-grid">
                {filteredBranches.map((branch) => {
                  const branchDestinations = destinations.filter(
                    (destination) => destination.scope === "branch" && destination.scopeId === branch.id,
                  );
                  const shoppingLinks = branchDestinations.filter(isShoppingDestination);
                  const socialLinks = branchDestinations.filter(isSocialDestination);

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
                      <div className="branch-links">
                        {Object.entries(branch.mapLinks ?? {}).map(([provider, url]) => {
                          const platform = provider === "googleMaps" ? "google-maps" : provider;
                          if (!url || !isApprovedExternalUrl(url, platform)) return null;

                          const providerName = provider === "neshan"
                            ? "نشان"
                            : provider === "balad"
                              ? "بلد"
                              : "Google Maps";

                          return (
                            <a href={url} key={provider}>
                              مسیریابی با {providerName}<ArrowLeft size={15} aria-hidden="true" />
                            </a>
                          );
                        })}
                        {branch.channels
                          ?.filter((channel) => isApprovedExternalUrl(channel.url, channel.platform))
                          .map((channel) => (
                            <a href={channel.url} key={channel.platform}>
                              {channel.label}<ArrowLeft size={15} aria-hidden="true" />
                            </a>
                          ))}
                        {[...shoppingLinks, ...socialLinks].map((destination) => (
                          <a href={destination.url} key={destination.id}>
                            {destination.action}<bdi>{destination.name}</bdi><ArrowLeft size={15} aria-hidden="true" />
                          </a>
                        ))}
                      </div>
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
            <p className="sr-only" aria-live="polite">{statusMessage}</p>
          </div>
        </section>
      )}
    </>
  );
}

function getPublicImagePath(image: string) {
  return image.startsWith("/") ? image : `/${image}`;
}
