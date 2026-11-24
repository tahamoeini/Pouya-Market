import { ArrowLeft } from "lucide-react";
import { categories } from "@/data/categories";
import type { Branch } from "@/data/branches";
import type { Destination } from "@/data/platforms";
import { BranchFinder } from "./BranchFinder";
import { CategoryStoreAction } from "./CategoryStoreAction";

const categoryPalette = ["sea", "sand", "peach", "cloud", "rose"];
const persianIndexFormatter = new Intl.NumberFormat("fa-IR", { minimumIntegerDigits: 2, useGrouping: false });

export function StoreDiscovery({
  branches,
  destinations,
}: {
  branches: Branch[];
  destinations: Destination[];
}) {
  const branchCategoryIds = new Set(branches.flatMap((branch) => branch.categoryIds));

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
                        <CategoryStoreAction categoryId={category.id} categoryTitle={category.title} />
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
        <BranchFinder branches={branches} destinations={destinations} branchCategoryIds={[...branchCategoryIds]} />
      )}
    </>
  );
}
