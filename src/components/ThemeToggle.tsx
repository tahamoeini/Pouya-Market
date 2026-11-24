"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

function subscribeToTheme(onChange: () => void) {
  window.addEventListener("pouya-theme-change", onChange);
  return () => window.removeEventListener("pouya-theme-change", onChange);
}

function getThemeSnapshot() {
  return document.documentElement.dataset.theme === "dark";
}

function getServerThemeSnapshot() {
  return false;
}

export function ThemeToggle() {
  const isDark = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerThemeSnapshot);

  function toggleTheme() {
    const nextTheme = getThemeSnapshot() ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    window.dispatchEvent(new Event("pouya-theme-change"));
    try {
      localStorage.setItem("pouya-theme", nextTheme);
    } catch {
      // The chosen theme still applies for this visit if storage is unavailable.
    }
  }

  return (
    <button
      className="icon-button theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "فعال‌کردن تم روشن" : "فعال‌کردن تم تاریک"}
      title={isDark ? "تم روشن" : "تم تاریک"}
    >
      {isDark ? <Sun size={19} aria-hidden="true" /> : <Moon size={19} aria-hidden="true" />}
    </button>
  );
}
