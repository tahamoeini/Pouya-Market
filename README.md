# فروشگاه‌های پویا

صفحهٔ معرفی فارسی فروشگاه‌های پویا، با خروجی استاتیک Next.js مناسب استقرار روی Cloudflare Pages.

## اجرا و ساخت

- `npm ci` وابستگی‌ها را از lockfile نصب می‌کند.
- نسخهٔ پیشنهادی build در `.nvmrc` برابر Node.js `22.23.4` است؛ Next.js 16 به Node.js `20.9.0` یا بالاتر نیاز دارد.
- `npm run dev` پیش‌نمایش محلی را اجرا می‌کند. دادهٔ شعب نمونه فقط در همین حالت برای بررسی فیلترها دیده می‌شود.
- `npm run lint` و `npm run typecheck` کیفیت کد و نوع‌ها را بررسی می‌کنند.
- `npm run validate:content` داده‌های واقعی و fixtureهای گردش شعب و مقصدها را اعتبارسنجی می‌کند.
- `npm run build` ابتدا همین اعتبارسنجی را اجرا می‌کند و سپس خروجی تولیدی استاتیک را در `out/` می‌سازد. شعب و مقصدهای نمونه در خروجی تولیدی حضور ندارند.

## مدیریت محتوا

متن‌های برند در `src/data/site.ts`، ده دسته در `src/data/categories.ts`، شعب در `src/data/branches.ts` و مقصدهای بیرونی در `src/data/platforms.ts` نگهداری می‌شوند. برای انتشار شعبه، رکورد کامل و تأییدشده با وضعیت `published` اضافه کنید. مقصد بیرونی باید HTTPS، از میزبان‌های تأییدشده در `src/lib/external-links.ts` و دارای تاریخ بازبینی باشد. مقصد با محدودهٔ `brand` شناسهٔ هدف ندارد؛ محدوده‌های `branch` و `category` باید `scopeId` دقیق داشته باشند. مقصد شعبه فقط کنار همان شعبه و مقصد دسته فقط کنار همان دسته دیده می‌شود. لینک‌های آزمایشی `src/data/preview-fixtures.ts` فقط برای توسعه هستند.

## رسانه‌ها

لوگوی دریافتی در `public/brand/pouya-logo.png` نگهداری می‌شود. فایل منبع تصویر اصلی در `assets/source/pouya-editorial-still-life.png` و نسخهٔ بهینهٔ وب آن در `public/images/pouya-editorial-still-life.webp` است. منشأ، متن جایگزین و وضعیت تأیید رسانه‌ها در [`docs/asset-register.md`](docs/asset-register.md) ثبت شده است. فونت Vazirmatn از بستهٔ محلی پروژه ارائه می‌شود.

## استقرار Cloudflare Pages

مخزن را به Pages متصل کنید و preset خروجی استاتیک Next.js را انتخاب کنید. شاخهٔ تولید فعلی `master` است، فرمان ساخت `npm run build` و پوشهٔ خروجی `out`. این مخزن هم‌اکنون به `origin/master` متصل است؛ اگر مالک می‌خواهد از `main` استفاده کند، ابتدا شاخهٔ اصلی مخزن و تنظیم Pages باید با هم هماهنگ شوند. `.nvmrc` نسخهٔ build را برای Cloudflare Pages مشخص می‌کند. فایل `public/_headers` روی `*.pages.dev` هدر `X-Robots-Tag: noindex` می‌گذارد و دامنهٔ اصلی را قابل نمایه‌سازی نگه می‌دارد. در داشبورد Pages، سیاست Cloudflare Access را برای پیش‌نمایش‌ها روشن کنید؛ این URLها به‌طور پیش‌فرض عمومی هستند. پیش از تغییر DNS دامنهٔ اصلی، تمام رکوردهای سرویس‌های موجود را ثبت کنید. دامنهٔ apex به zone و nameserverهای Cloudflare نیاز دارد. دسترسی از شبکه‌های ایران را پیش از انتشار عمومی بررسی کنید.

نتایج بررسی build، اندازه‌های مرورگر و موارد باقی‌مانده در [`docs/validation.md`](docs/validation.md) آمده‌اند.
مراحل داشبورد، دامنه، ریدایرکت و بازگشت نسخه در [`docs/cloudflare-release.md`](docs/cloudflare-release.md) ثبت شده‌اند.
