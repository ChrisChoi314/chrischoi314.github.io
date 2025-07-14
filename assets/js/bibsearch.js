/* bibsearch.js  ── with built-in “highlight Abs / Bib buttons” support */
import { highlightSearchTerm } from "./highlight-search-term.js";

document.addEventListener("DOMContentLoaded", () => {
  /* -----------------------------------------------------------
   *  Collapse a topic block (<section class="topic">) if there are
   *  NO visible bibliography entries inside it.
   * ----------------------------------------------------------- */
  const hideEmptyTopics = () => {
    document.querySelectorAll("section.topic").forEach((section) => {
      /* Any <li> or <dt> inside this topic that is NOT .unloaded ? */
      const visible = section.querySelector(
        ".bibliography li:not(.unloaded), .bibliography dt:not(.unloaded)"
      );
      section.classList.toggle("unloaded", !visible);
    });
  };

  /* -----------------------------------------------------------
   *  NEW ► helper to flash the Abs / Bib buttons
   * ----------------------------------------------------------- */
  const highlightButtons = (li, re, className) => {
    const absBtn = li.querySelector("a.abstract");
    const bibBtn = li.querySelector("a.bibtex");

    /* strip prior state */
    absBtn?.classList.remove(className);
    bibBtn?.classList.remove(className);

    const absTxt = li.querySelector("div.abstract")?.textContent || "";
    const bibTxt = li.querySelector("div.bibtex")?.textContent || "";

    if (absBtn && re.test(absTxt)) absBtn.classList.add(className);
    if (bibBtn && re.test(bibTxt)) bibBtn.classList.add(className);
  };

  /* -----------------------------------------------------------
   *  The search / filter logic  (modified)
   * ----------------------------------------------------------- */
  const filterItems = (searchTerm) => {
    /* reset */
    document.querySelectorAll('.bibsearch-hit')
            .forEach(btn => btn.classList.remove('bibsearch-hit'));
    document
      .querySelectorAll(".bibliography, .unloaded")
      .forEach((el) => el.classList.remove("unloaded"));

    /* regex we’ll re-use for the button-flash step -------------- */
    const re = searchTerm ? new RegExp(searchTerm, "i") : null;

    /* 1) highlight + mark non-matches --------------------------- */
    let nonMatches;
    if (CSS.highlights) {
      nonMatches = highlightSearchTerm({
        search: searchTerm,
        selector: ".bibliography > li",
      });
      if (nonMatches == null) return;
      nonMatches.forEach((el) => el.classList.add("unloaded"));
    } else {
      document.querySelectorAll(".bibliography > li").forEach((el) => {
        if (!el.innerText.toLowerCase().includes(searchTerm)) {
          el.classList.add("unloaded");
        }
      });
    }

    /* 1-b) ► flash the Abs / Bib buttons if query hits hidden text */
    if (re) {
      document.querySelectorAll(".bibliography > li").forEach((li) =>
        highlightButtons(li, re, "bibsearch-hit")
      );
    }

    /* 2) hide empty YEAR groups (your original H2 logic) -------- */
    document.querySelectorAll("h2.bibliography").forEach((h2) => {
      let iter = h2.nextElementSibling;
      let hideFirstGroup = true;

      while (iter && iter.tagName !== "H2") {
        if (iter.tagName === "OL") {
          const total = iter.querySelectorAll(":scope > li").length;
          const hidden = iter.querySelectorAll(":scope > li.unloaded").length;

          if (hidden === total) {
            iter.previousElementSibling.classList.add("unloaded");
            iter.classList.add("unloaded");
          } else {
            hideFirstGroup = false;
          }
        }
        iter = iter.nextElementSibling;
      }
      if (hideFirstGroup) h2.classList.add("unloaded");
    });

    /* 3) NEW: hide empty TOPIC blocks -------------------------- */
    hideEmptyTopics();
  };

  /* -----------------------------------------------------------
   *  Wire up the input / hash-change events
   * ----------------------------------------------------------- */
  const searchBox = document.getElementById("bibsearch");

  const updateInputField = () => {
    const hash = decodeURIComponent(window.location.hash.slice(1));
    searchBox.value = hash;
    filterItems(hash.toLowerCase());
  };

  let debounce;
  searchBox.addEventListener("input", () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => filterItems(searchBox.value.toLowerCase()), 300);
  });

  window.addEventListener("hashchange", updateInputField);

  updateInputField(); // run on page load
});
