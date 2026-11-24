"use client";

import Image from "next/image";
import { ArrowLeft, ArrowUpLeft, ChevronDown, MapPin, Phone, Store } from "lucide-react";
import { useMemo, useState } from "react";
import { branches, previewBranches } from "@/data/branches";
import { categories } from "@/data/categories";
import { destinations } from "@/data/platforms";
import { destinationFixtures } from "@/data/preview-fixtures";
import { site } from "@/data/site";
import { isApprovedExternalUrl } from "@/lib/external-links";
import { Header, type NavigationItem } from "./Header";

const categoryPalette = ["sea", "sand", "peach", "cloud", "rose"];
const activeBranches = [
  ...branches.filter((branch) => branch.status === "published"),
  ...previewBranches.filter((branch) => branch.status === "published"),
];
const activeDestinations = [
  ...destinations.filter((destination) => destination.status === "published" && isApprovedExternalUrl(destination.url, destination.platform)),
  ...(process.env.NODE_ENV === "development"
    ? destinationFixtures.filter((destination) => destination.status === "published" && isApprovedExternalUrl(destination.url, destination.platform))
    : []),
];

export function HomePage() {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const cities = Array.from(new Set(activeBranches.map((branch) => branch.city)));
  const branchCategoryIds = new Set(activeBranches.flatMap((branch) => branch.categoryIds));
  const shoppingDestinations = activeDestinations.filter((destination) => destination.platform === "digikala" || destination.platform === "snapp");
  const socialDestinations = activeDestinations.filter((destination) => !["digikala", "snapp", "neshan", "balad", "google-maps"].includes(destination.platform));

  const navigation: NavigationItem[] = [
    { href: "#categories", label: "دسته‌بندی‌ها" },
    ...(activeBranches.length ? [{ href: "#stores", label: "شعب پویا" }] : []),
    ...(shoppingDestinations.length ? [{ href: "#shop", label: "خرید آنلاین" }] : []),
    ...(socialDestinations.length ? [{ href: "#channels", label: "راه‌های ارتباطی" }] : []),
    { href: "#about", label: "دربارهٔ پویا" },
    ...(site.contact.phone || site.contact.email || site.contact.address ? [{ href: "#contact", label: "تماس" }] : []),
  ];

  const filteredBranches = useMemo(
    () => activeBranches.filter((branch) => {
      const matchesCity = !selectedCity || branch.city === selectedCity;
      const matchesCategory = !selectedCategory || branch.categoryIds.includes(selectedCategory);
      return matchesCity && matchesCategory;
    }),
    [selectedCity, selectedCategory],
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
      <Header items={navigation} hasBranches={activeBranches.length > 0} />
      <main id="main-content">
        <section className="hero-section page-wrap" id="home" aria-labelledby="hero-title">
          <div className="hero-copy">
            <span className="eyebrow"><span className="eyebrow-dot" /> دنیای پویا، نزدیک به شما</span>
            <h1 id="hero-title">فروشگاه‌های پویا؛<br />انتخاب‌های متنوع برای <span>زندگی روزمره</span></h1>
            <p>{site.description}</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#categories">مشاهدهٔ دسته‌بندی‌ها <ArrowLeft size={18} aria-hidden="true" /></a>
              {activeBranches.length > 0 && <a className="button button-secondary" href="#stores">پیدا کردن شعبه <MapPin size={17} aria-hidden="true" /></a>}
            </div>
            <div className="hero-note"><span className="mini-rule" /> از هر گوشهٔ زندگی، یک انتخاب برای شما</div>
          </div>
          <div className="hero-art">
            <div className="hero-orbit hero-orbit-one" />
            <div className="hero-orbit hero-orbit-two" />
            <div className="hero-image-frame">
              <Image
                src="/images/pouya-editorial-still-life.webp"
                alt="چیدمانی از کالاهای رنگارنگ در حوزه‌های مختلف فروشگاه‌های پویا"
                width={1536}
                height={1024}
                preload
                sizes="(max-width: 760px) 100vw, 50vw"
              />
            </div>
            <div className="hero-stamp"><span>POUYA</span><span>MARKET</span><ArrowUpLeft size={17} aria-hidden="true" /></div>
            <div className="floating-label"><span className="floating-label-icon"><Store size={18} aria-hidden="true" /></span><span>یک نام<br /><b>انتخاب‌های گوناگون</b></span></div>
          </div>
          <a className="scroll-cue" href="#categories" aria-label="رفتن به دسته‌بندی‌ها"><ChevronDown size={20} aria-hidden="true" /></a>
        </section>

        <section className="categories-section section-pad" id="categories" aria-labelledby="categories-title">
          <div className="page-wrap">
            <div className="section-heading">
              <div><span className="section-kicker">دنیای انتخاب‌های پویا</span><h2 id="categories-title">از هرچه نیاز دارید، <span>یک شروع</span></h2></div>
              <p>دسته‌های متنوع فروشگاه‌های پویا را ببینید و با دنیای هرکدام آشنا شوید.</p>
            </div>
            <div className="category-grid">
              {categories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <article className={`category-card ${categoryPalette[index % categoryPalette.length]}${index === 0 || index === 4 ? " category-featured" : ""}`} key={category.id}>
                    <div className="category-card-top"><span className="category-icon"><Icon size={23} strokeWidth={1.7} aria-hidden="true" /></span><span className="category-index">{String(index + 1).padStart(2, "0")}</span></div>
                    <div className="category-copy"><h3>{category.title}</h3><p>{category.description}</p></div>
                    <span className="category-orbit" aria-hidden="true" />
                    {activeBranches.some((branch) => branch.categoryIds.includes(category.id)) && (
                      <a className="category-action" href="#stores" onClick={() => showCategoryStores(category.id)} aria-label={`مشاهدهٔ شعب عرضه‌کنندهٔ ${category.title}`}>
                        <ArrowLeft size={16} aria-hidden="true" />
                      </a>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {activeBranches.length > 0 && (
          <section className="stores-section section-pad" id="stores" aria-labelledby="stores-title">
            <div className="page-wrap">
              <div className="section-heading stores-heading"><div><span className="section-kicker">نزدیک‌تر از آنچه فکر می‌کنید</span><h2 id="stores-title">شعب <span>فروشگاه‌های پویا</span></h2></div><p>شعبهٔ موردنظر را پیدا کنید و برای جزئیات مراجعه، مسیر دسترسی را ببینید.</p></div>
              <div className="store-filters">
                {cities.length > 1 && <label className="filter-field"><span>شهر</span><select value={selectedCity} onChange={(event) => setSelectedCity(event.target.value)}><option value="">همهٔ شهرها</option>{cities.map((city) => <option value={city} key={city}>{city}</option>)}</select></label>}
                {branchCategoryIds.size > 1 && <label className="filter-field"><span>دسته‌بندی</span><select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}><option value="">همهٔ دسته‌ها</option>{categories.filter(({ id }) => branchCategoryIds.has(id)).map((category) => <option value={category.id} key={category.id}>{category.title}</option>)}</select></label>}
                <span className="branch-count" aria-live="polite" aria-atomic="true">{filteredBranches.length} شعبه</span>
              </div>
              {filteredBranches.length ? <div className="branch-grid">{filteredBranches.map((branch) => (
                <article className="branch-card" key={branch.id}>
                  <div className="branch-card-head"><span className="branch-icon"><Store size={20} aria-hidden="true" /></span><span className="branch-city"><MapPin size={14} aria-hidden="true" />{branch.neighborhood ? `${branch.city}، ${branch.neighborhood}` : branch.city}</span></div>
                  <h3>{branch.name}</h3><p className="branch-address">{branch.address}</p>
                  <div className="branch-tags">{branch.categoryIds.map((id) => { const category = categories.find((item) => item.id === id); return category && <span key={id}>{category.title}</span>; })}</div>
                  {(branch.phone || branch.hours) && <div className="branch-meta">{branch.phone && <a href={`tel:${branch.phone}`}><Phone size={15} aria-hidden="true" /><bdi>{branch.phone}</bdi></a>}{branch.hours && <span>{branch.hours}</span>}</div>}
                  <div className="branch-links">{Object.entries(branch.mapLinks ?? {}).map(([provider, url]) => url && isApprovedExternalUrl(url, provider === "googleMaps" ? "google-maps" : provider) && <a href={url} key={provider}>مسیریابی با {provider === "neshan" ? "نشان" : provider === "balad" ? "بلد" : "Google Maps"}<ArrowLeft size={15} aria-hidden="true" /></a>)}{branch.channels?.filter((channel) => isApprovedExternalUrl(channel.url, channel.platform)).map((channel) => <a href={channel.url} key={channel.platform}>{channel.label}<ArrowLeft size={15} aria-hidden="true" /></a>)}</div>
                </article>
              ))}</div> : <div className="empty-state"><span className="empty-icon"><Store size={24} aria-hidden="true" /></span><h3>شعبه‌ای با این انتخاب پیدا نشد</h3><p>دسته یا شهر دیگری را امتحان کنید.</p><button type="button" className="text-button" onClick={clearFilters}>پاک کردن فیلترها</button></div>}
              <p className="sr-only" aria-live="polite">{statusMessage}</p>
            </div>
          </section>
        )}

        {shoppingDestinations.length > 0 && <section className="online-section section-pad" id="shop" aria-labelledby="shop-title"><div className="page-wrap"><div className="section-heading"><div><span className="section-kicker">خرید در مسیر خودتان</span><h2 id="shop-title">از کانال‌های <span>آنلاین پویا</span></h2></div><p>برای خرید، از لینک مستقیم فروشگاه رسمی پویا در پلتفرم موردنظر استفاده کنید.</p></div><div className="platform-grid">{shoppingDestinations.map((destination) => <a className="platform-card" href={destination.url} key={destination.id}><span className={`platform-mark ${destination.platform}`}><bdi>{destination.name}</bdi></span><span className="platform-description">{destination.description}</span><span className="platform-link">{destination.action}<ArrowLeft size={17} aria-hidden="true" /></span></a>)}</div></div></section>}

        {socialDestinations.length > 0 && <section className="channels-section section-pad" id="channels" aria-labelledby="channels-title"><div className="page-wrap"><div className="section-heading"><div><span className="section-kicker">همیشه در دسترس</span><h2 id="channels-title">پویا را <span>دنبال کنید</span></h2></div><p>کانال‌های رسمی پویا برای خبرها و راه‌های ارتباطی.</p></div><div className="social-list">{socialDestinations.map((destination) => <a className="social-card" href={destination.url} key={destination.id}><span>{destination.name}</span><ArrowUpLeft size={20} aria-hidden="true" /></a>)}</div></div></section>}

        <section className="about-section section-pad" id="about" aria-labelledby="about-title">
          <div className="page-wrap about-layout"><div className="about-mark"><Image src="/brand/pouya-logo.png" alt="" width={210} height={210} sizes="210px" /></div><div className="about-copy"><span className="section-kicker">داستان یک مجموعهٔ متنوع</span><h2 id="about-title">یک نام،<br /><span>دنیایی از انتخاب‌ها</span></h2><p>{site.about}</p><span className="about-signature">{site.latinName}</span></div><span className="about-curve" aria-hidden="true" /></div>
        </section>

        {(site.contact.phone || site.contact.email || site.contact.address) && <section className="contact-section section-pad" id="contact" aria-labelledby="contact-title"><div className="page-wrap contact-panel"><div><span className="section-kicker">در تماس باشیم</span><h2 id="contact-title">برای همراهی،<br /><span>همین‌جا هستیم</span></h2></div><div className="contact-details">{site.contact.phone && <a href={`tel:${site.contact.phone}`}><Phone size={19} aria-hidden="true" /><bdi>{site.contact.phone}</bdi></a>}{site.contact.email && <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>}{site.contact.address && <p>{site.contact.address}</p>}</div></div></section>}
      </main>

      <footer className="site-footer"><div className="page-wrap footer-main"><a className="brand-lockup footer-brand" href="#home"><Image src="/brand/pouya-logo.png" alt="" width={48} height={48} /><span className="brand-name">فروشگاه‌های پویا</span></a><p>انتخاب‌های متنوع برای زندگی روزمره</p><nav aria-label="ناوبری پایین صفحه">{navigation.map((item) => <a href={item.href} key={item.href}>{item.label}</a>)}</nav></div><div className="page-wrap footer-bottom"><span>© {new Date().getFullYear()} فروشگاه‌های پویا</span><a href="#home">بازگشت به بالا <ArrowUpLeft size={15} aria-hidden="true" /></a></div></footer>
    </>
  );
}
