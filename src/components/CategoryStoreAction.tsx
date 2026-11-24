"use client";

import type { MouseEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { BRANCH_FILTERS_CHANGE_EVENT, selectBranchCategory } from "@/lib/store-discovery";

export function CategoryStoreAction({ categoryId, categoryTitle }: { categoryId: string; categoryTitle: string }) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    event.preventDefault();
    const url = new URL(window.location.href);
    url.search = selectBranchCategory(url.search, categoryId);
    url.hash = "stores";
    window.history.pushState(null, "", url);
    window.dispatchEvent(new Event(BRANCH_FILTERS_CHANGE_EVENT));
    document.getElementById("stores")?.scrollIntoView({ block: "start" });
  }

  return (
    <a
      className="category-action"
      href="#stores"
      onClick={handleClick}
      aria-label={`مشاهدهٔ شعب عرضه‌کنندهٔ ${categoryTitle}`}
    >
      مشاهدهٔ شعب عرضه‌کننده <ArrowLeft size={16} aria-hidden="true" />
    </a>
  );
}
