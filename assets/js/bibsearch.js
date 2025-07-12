
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
   *  The existing search / filter logic
   * ----------------------------------------------------------- */
  const filterItems = (searchTerm) => {
    /* reset */
    document
      .querySelectorAll(".bibliography, .unloaded")
      .forEach((el) => el.classList.remove("unloaded"));

    /* 1) highlight + mark non‑matches ------------------------- */
    if (CSS.highlights) {
      const nonMatches = highlightSearchTerm({
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

    /* 2) hide empty YEAR groups (your original H2 logic) ------ */
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

    /* 3) NEW: hide empty TOPIC blocks ------------------------ */
    hideEmptyTopics();
  };

  /* -----------------------------------------------------------
   *  Wire up the input / hash‑change events
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
