"use client";

import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

export type NavigationItem = { href: string; label: string };

export function Header({ items, hasBranches }: { items: NavigationItem[]; hasBranches: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
        menuButton.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <header className="site-header">
      <div className="header-inner page-wrap">
        <a className="brand-lockup" href="#home" aria-label="فروشگاه‌های پویا، صفحهٔ اصلی">
          <Image src="/brand/pouya-logo.png" alt="" width={56} height={56} priority />
          <span className="brand-name">فروشگاه‌های پویا</span>
        </a>

        <nav id="mobile-menu" className={`main-nav${isOpen ? " is-open" : ""}`} aria-label="ناوبری اصلی">
          {items.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
              {item.label}
            </a>
          ))}
          {hasBranches && <a className="nav-mobile-cta" href="#stores" onClick={() => setIsOpen(false)}>یافتن شعبه</a>}
        </nav>

        <div className="header-actions">
          {hasBranches && <a className="button button-small button-quiet header-store-cta" href="#stores">یافتن شعبه</a>}
          <ThemeToggle />
          <button
            ref={menuButton}
            className="icon-button menu-toggle"
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "بستن منو" : "باز کردن منو"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>
  );
}
