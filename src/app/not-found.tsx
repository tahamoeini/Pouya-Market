import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <span className="section-kicker">صفحه پیدا نشد</span>
      <h1>این نشانی در دسترس نیست.</h1>
      <p>می‌توانید از صفحهٔ اصلی دوباره شروع کنید.</p>
      <Link className="button button-primary" href="/">رفتن به صفحهٔ اصلی</Link>
    </main>
  );
}
