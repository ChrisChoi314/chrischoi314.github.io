/* bibsearch.js  –  live filter + hide empty topic & year blocks */
import { highlightSearchTerm } from "./highlight-search-term.js";

document.addEventListener("DOMContentLoaded", () => {
  /* ────────────────────────────────────────────────────────────
   *  1)  Hide a topic heading + its list (+ <hr>) when empty
   * ──────────────────────────────────────────────────────────── */
  function hideEmptyTopics() {
    document.querySelectorAll(".publications h3").forEach((h3) => {
      /* find the first sibling that is the bibliography list */
      let list = h3.nextElementSibling;
      while (list && !list.classList?.contains("bibliography")) {
        list = list.nextElementSibling;
      }
      if (!list) return;                // safety guard

      /* check for ANY direct child that is not .unloaded */
      const visibleChild = list.querySelector(":scope > *:not(.unloaded)");
      const empty = !visibleChild;

      h3.classList.toggle("unloaded", empty);
      list.classList.toggle("unloaded", empty);

      /* hide following <hr>, if present */
      const hr = list.nextElementSibling;
      if (hr && hr.tagName === "HR") {
        hr.classList.toggle("unloaded", empty);
      }
    });
  }

  /* ────────────────────────────────────────────────────────────
   *  2)  Main filtering routine
   * ──────────────────────────────────────────────────────────── */
  function filterItems(term) {
    /* reset any previous hiding */
    document
      .querySelectorAll(".unloaded, .bibliography")
      .forEach((el) => el.classList.remove("unloaded"));

    /* mark non‑matching bibliography entries (direct children) */
    const selector = ".bibliography > *";          // li, dt, whatever

    if (CSS.highlights) {
      const nonMatches = highlightSearchTerm({ search: term, selector });
      if (nonMatches === null) return;
      nonMatches.forEach((el) => el.classList.add("unloaded"));
    } else {
      document.querySelectorAll(selector).forEach((el) => {
        if (!el.innerText.toLowerCase().includes(term)) {
          el.classList.add("unloaded");
        }
      });
    }

    /* ── hide empty YEAR groups (if you still have year headings) ── */
    document.querySelectorAll("h2.bibliography").forEach((h2) => {
      let iter = h2.nextElementSibling;
      let hideFirstGroup = true;

      while (iter && iter.tagName !== "H2") {
        if (iter.classList?.contains("bibliography")) {
          const total  = iter.querySelectorAll(":scope > *").length;
          const hidden = iter.querySelectorAll(":scope > *.unloaded").length;

          if (total === hidden) {
            iter.previousElementSibling?.classList.add("unloaded"); // year sub‑heading
            iter.classList.add("unloaded");                         // the list itself
          } else {
            hideFirstGroup = false;
          }
        }
        iter = iter.nextElementSibling;
      }
      if (hideFirstGroup) h2.classList.add("unloaded");
    });

    /* ── NEW: hide empty topic blocks ── */
    hideEmptyTopics();
  }

  /* ────────────────────────────────────────────────────────────
   *  3)  Input box & hash <-> filter sync
   * ──────────────────────────────────────────────────────────── */
  const searchBox = document.getElementById("bibsearch");

  const applyFilterFromHash = () => {
    const hash = decodeURIComponent(location.hash.slice(1));
    searchBox.value = hash;
    filterItems(hash.toLowerCase());
  };

  /* debounce: 300 ms after last keystroke */
  let debounce;
  searchBox.addEventListener("input", () => {
    clearTimeout(debounce);
    debounce = setTimeout(
      () => filterItems(searchBox.value.toLowerCase()),
      300
    );
  });

  window.addEventListener("hashchange", applyFilterFromHash);

  applyFilterFromHash();   // run once at page load
});
