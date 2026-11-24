import Image from "next/image";
import { ArrowLeft, ArrowUpLeft, ChevronDown, MapPin, Phone, Store } from "lucide-react";
import { branches, previewBranches } from "@/data/branches";
import { destinations, type Destination } from "@/data/platforms";
import { destinationFixtures } from "@/data/preview-fixtures";
import { site } from "@/data/site";
import { isShoppingDestination, isSocialDestination } from "@/lib/destinations";
import { isApprovedExternalUrl } from "@/lib/external-links";
import { Header, type NavigationItem } from "./Header";
import { StoreDiscovery } from "./StoreDiscovery";

const activeBranches = [
  ...branches.filter((branch) => branch.status === "published"),
  ...previewBranches.filter((branch) => branch.status === "published"),
];

const activeDestinations = [
  ...destinations,
  ...(process.env.NODE_ENV === "development" ? destinationFixtures : []),
].filter(
  (destination) =>
    destination.status === "published" &&
    isApprovedExternalUrl(destination.url, destination.platform),
);

const brandDestinations = activeDestinations.filter(
  (destination) => destination.scope === "brand",
);
const shoppingDestinations = brandDestinations.filter(isShoppingDestination);
const socialDestinations = brandDestinations.filter(isSocialDestination);
const discoveryDestinations: Destination[] = activeDestinations.filter(
  (destination) => destination.scope !== "brand",
);

const navigation: NavigationItem[] = [
  { href: "#categories", label: "دسته‌بندی‌ها" },
  ...(activeBranches.length ? [{ href: "#stores", label: "شعب پویا" }] : []),
  ...(shoppingDestinations.length ? [{ href: "#shop", label: "خرید آنلاین" }] : []),
  ...(socialDestinations.length ? [{ href: "#channels", label: "راه‌های ارتباطی" }] : []),
  { href: "#about", label: "دربارهٔ پویا" },
  ...(site.contact.phone || site.contact.email || site.contact.address
    ? [{ href: "#contact", label: "تماس" }]
    : []),
];

export function HomePage() {
  return (
    <>
      <Header items={navigation} hasBranches={activeBranches.length > 0} />
      <main id="main-content">
        <section className="hero-section page-wrap" id="home" aria-labelledby="hero-title">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="eyebrow-dot" aria-hidden="true" /> دنیای پویا، نزدیک به شما
            </span>
            <h1 id="hero-title">
              فروشگاه‌های پویا؛<br />
              انتخاب‌های متنوع برای <span>زندگی روزمره</span>
            </h1>
            <p>{site.description}</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#categories">
                مشاهدهٔ دسته‌بندی‌ها <ArrowLeft size={18} aria-hidden="true" />
              </a>
              {activeBranches.length > 0 && (
                <a className="button button-secondary" href="#stores">
                  پیدا کردن شعبه <MapPin size={17} aria-hidden="true" />
                </a>
              )}
            </div>
            <div className="hero-note">
              <span className="mini-rule" aria-hidden="true" /> از هر گوشهٔ زندگی، یک انتخاب برای شما
            </div>
          </div>

          <div className="hero-art">
            <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
            <div className="hero-orbit hero-orbit-two" aria-hidden="true" />
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
            <div className="hero-stamp" aria-hidden="true">
              <span>POUYA</span>
              <span>MARKET</span>
              <ArrowUpLeft size={17} />
            </div>
            <div className="floating-label" aria-hidden="true">
              <span className="floating-label-icon"><Store size={18} /></span>
              <span>یک نام<br /><b>انتخاب‌های گوناگون</b></span>
            </div>
          </div>
          <a className="scroll-cue" href="#categories" aria-label="رفتن به دسته‌بندی‌ها">
            <ChevronDown size={20} aria-hidden="true" />
          </a>
        </section>

        <StoreDiscovery branches={activeBranches} destinations={discoveryDestinations} />

        {shoppingDestinations.length > 0 && (
          <section className="online-section section-pad" id="shop" aria-labelledby="shop-title">
            <div className="page-wrap">
              <div className="section-heading">
                <div>
                  <span className="section-kicker">خرید در مسیر خودتان</span>
                  <h2 id="shop-title">از کانال‌های <span>آنلاین پویا</span></h2>
                </div>
                <p>برای خرید، از لینک مستقیم فروشگاه رسمی پویا در پلتفرم موردنظر استفاده کنید.</p>
              </div>
              <div className="platform-grid">
                {shoppingDestinations.map((destination) => (
                  <a className="platform-card" href={destination.url} key={destination.id}>
                    <span className={`platform-mark ${destination.platform}`}>
                      <bdi>{destination.name}</bdi>
                    </span>
                    <span className="platform-description">{destination.description}</span>
                    <span className="platform-link">
                      {destination.action}<ArrowLeft size={17} aria-hidden="true" />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {socialDestinations.length > 0 && (
          <section className="channels-section section-pad" id="channels" aria-labelledby="channels-title">
            <div className="page-wrap">
              <div className="section-heading">
                <div>
                  <span className="section-kicker">همیشه در دسترس</span>
                  <h2 id="channels-title">پویا را <span>دنبال کنید</span></h2>
                </div>
                <p>کانال‌های رسمی پویا برای خبرها و راه‌های ارتباطی.</p>
              </div>
              <div className="social-list">
                {socialDestinations.map((destination) => (
                  <a className="social-card" href={destination.url} key={destination.id}>
                    <span>{destination.name}</span>
                    <ArrowUpLeft size={20} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="about-section section-pad" id="about" aria-labelledby="about-title">
          <div className="page-wrap about-layout">
            <div className="about-mark">
              <Image src="/brand/pouya-logo.png" alt="" width={210} height={210} sizes="210px" />
            </div>
            <div className="about-copy">
              <span className="section-kicker">داستان یک مجموعهٔ متنوع</span>
              <h2 id="about-title">یک نام،<br /><span>دنیایی از انتخاب‌ها</span></h2>
              <p>{site.about}</p>
              <span className="about-signature">{site.latinName}</span>
            </div>
            <span className="about-curve" aria-hidden="true" />
          </div>
        </section>

        {(site.contact.phone || site.contact.email || site.contact.address) && (
          <section className="contact-section section-pad" id="contact" aria-labelledby="contact-title">
            <div className="page-wrap contact-panel">
              <div>
                <span className="section-kicker">در تماس باشیم</span>
                <h2 id="contact-title">برای همراهی،<br /><span>همین‌جا هستیم</span></h2>
              </div>
              <div className="contact-details">
                {site.contact.phone && (
                  <a href={`tel:${site.contact.phone}`}>
                    <Phone size={19} aria-hidden="true" />
                    <bdi>{site.contact.phone}</bdi>
                  </a>
                )}
                {site.contact.email && <a href={`mailto:${site.contact.email}`}><bdi>{site.contact.email}</bdi></a>}
                {site.contact.address && <p>{site.contact.address}</p>}
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="site-footer">
        <div className="page-wrap footer-main">
          <a className="brand-lockup footer-brand" href="#home">
            <Image src="/brand/pouya-logo.png" alt="" width={48} height={48} />
            <span className="brand-name">فروشگاه‌های پویا</span>
          </a>
          <p>انتخاب‌های متنوع برای زندگی روزمره</p>
          <nav aria-label="ناوبری پایین صفحه">
            {navigation.map((item) => <a href={item.href} key={item.href}>{item.label}</a>)}
          </nav>
        </div>
        <div className="page-wrap footer-bottom">
          <span>© {new Date().getFullYear()} فروشگاه‌های پویا</span>
          <a href="#home">بازگشت به بالا <ArrowUpLeft size={15} aria-hidden="true" /></a>
        </div>
      </footer>
    </>
  );
}
