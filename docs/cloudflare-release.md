# راهنمای انتشار روی Cloudflare Pages

## تنظیم پروژه

1. مخزن Git را در Cloudflare Pages متصل کنید. شاخهٔ موجود و متصل به `origin` در این checkout برابر `master` است؛ آن را به‌عنوان شاخهٔ تولید تنظیم کنید. اگر مالک می‌خواهد `main` را به کار ببرد، ابتدا شاخهٔ اصلی Git و تنظیم Pages را هماهنگ کند.
2. فرمان ساخت `npm run build` و پوشهٔ انتشار `out` باشد.
3. فایل ریشهٔ `.nvmrc` نسخهٔ Node.js `22.23.4` را تعیین می‌کند. نسخهٔ Next.js در lockfile تثبیت است و حداقل Node.js موردنیاز آن `20.9.0` است. Pages نسخه را از فایل نسخه یا `NODE_VERSION` می‌خواند. [الزامات نسخهٔ ۱۶ Next.js](https://nextjs.org/docs/app/guides/upgrading/version-16) · [نسخه‌های build در Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/build-image/)
4. پیش از هر تغییر DNS، رکوردهای فعلی و وضعیت DNSSEC را ثبت کنید و رکوردهای وب‌سایت، ایمیل و سرویس‌های دیگر را حفظ کنید.

## پیش‌نمایش‌ها و نمایه‌سازی

- فایل `public/_headers` در خروجی ایستا به `X-Robots-Tag: noindex` برای میزبان‌های `pages.dev` تبدیل می‌شود. دامنهٔ `https://pouya.market` با این قاعده تطبیق ندارد.
- انتشارهای پیش‌نمایش Cloudflare به‌طور پیش‌فرض `noindex` دارند، اما به‌طور پیش‌فرض عمومی هستند. در Pages از مسیر **Settings → General → Enable access policy** سیاست Access را برای پیش‌نمایش‌ها فعال کنید. [راهنمای پیش‌نمایش‌های Pages](https://developers.cloudflare.com/pages/configuration/preview-deployments/) · [قواعد فایل `_headers`](https://developers.cloudflare.com/pages/configuration/headers/)

## دامنه و انتقال

1. در پروژهٔ Pages از بخش **Custom domains** دامنهٔ `pouya.market` را اضافه کنید.
2. برای دامنهٔ apex، zone و nameserverهای دامنه باید روی Cloudflare تنظیم شوند. برای `www.pouya.market` نیز مقصد سفارشی را به پروژه اضافه کنید.
3. پس از فعال شدن TLS، در zone rule دامنهٔ `www.pouya.market` را به `https://pouya.market` هدایت کنید. برای نشانی تولیدی `pages.dev` از account-level Bulk Redirect به دامنهٔ اصلی استفاده کنید. سپس canonical، sitemap، TLS، صفحهٔ اصلی، CSS، فونت و تصاویر را از هر دو نشانی بررسی کنید. [راهنمای دامنه‌های سفارشی Pages](https://developers.cloudflare.com/pages/configuration/custom-domains/)
4. پیش از هدایت دامنهٔ اصلی، نسخهٔ آزمایشی را روی یک اینترنت ثابت و یک اینترنت موبایل در ایران، بدون VPN، بررسی کنید. همین بررسی را پس از انتشار از یک شبکهٔ خارج از ایران نیز انجام دهید. نتیجهٔ DNS، TLS و بارگیری کامل دارایی‌ها را ثبت کنید.

## بازگشت نسخه

برای خرابی برنامه، از بخش **Deployments** آخرین انتشار تولیدی سالم را انتخاب و **Rollback to this deployment** را اجرا کنید. پیش‌نمایش‌ها مقصد rollback تولید نیستند. [راهنمای بازگشت Pages](https://developers.cloudflare.com/pages/configuration/rollbacks/)

اتصال Git، حساب Cloudflare، تغییر DNS، سیاست Access و انتقال دامنه در این پیاده‌سازی اجرا نشده‌اند؛ این مراحل به دسترسی مالک حساب و دامنه نیاز دارند.
