---
layout: page
title: Relevant papers for my research
description: enumerating the papers by subfield
img: assets/img/projects/cosmology_publications/cover.png
importance: 1
category: academic
topics: ['Axions', 'Beyond standard model (BSM)', 'Big-bang-nucleosynthesis (BBN)', 'Chiral plasma instability (CPI) and chiral magnetic effect (CME)', 'Cosmological parameters','Cosmic microwave background (CMB)', 'Ultra high energy cosmic rays (UHECR)', 'Dark energy (DE)', 'Dark matter. (DM)', 'General relativity (GR) and modified gravity (MG)', 'Gravitational waves (GWs) theory & observations', 'Inflation', 'Isotropy', 'Large-scale structure (LSS)', 'Lorentz symmetry', 'Neutrinos', 'Parity symmetry', 'Perturbations', 'Phase transitions (PTs)', 'Primordial magnetic fields (PMFs)', 'Turbulence', 'Miscellaneous']
---
The following topics are enumerated in this page. 
- Axions
- Beyond standard model (BSM)
- Big-bang-nucleosynthesis (BBN)
- Chiral plasma instability (CPI) and chiral magnetic effect (CME)
- Cosmological parameters
- Cosmic microwave background (CMB)
- Ultra high energy cosmic rays (UHECR)
- Dark energy (DE)
- Dark matter. (DM)
- General relativity (GR) and modified gravity (MG) - includes massive gravity as well
- Gravitational waves (GWs) theory and observations
- Inflation
- Isotropy 
- Large-scale structure (LSS)
- Lorentz symmetry 
- Neutrinos
- Parity symmetry 
- Perturbations 
- Phase transitions (PTs)
- Primordial magnetic fields (PMFs)
- Turbulence
- Miscellaneous - any paper that doesnt fit into any of the above topics

{% include bib_search.html %}

<div class="bibliography-controls">
  <label for="per-page">Papers per page:</label>
  <select id="per-page">
    <option value="10">10</option>
    <option value="20" selected>20</option>
    <option value="50">50</option>
  </select>
</div>

<ul id="bib-list">
  {% bibliography -f papers %}
</ul>
<div id="bib-nav"></div>

<style>
  /* Anything that has the extra .hidden class is invisible */
  .hidden { display: none; }
</style>

<script>
document.addEventListener('DOMContentLoaded', () => {
  /* ---------- original pagination --------- */
  const perPageSelect = document.getElementById('per-page');
  const bibItems      = Array.from(document.querySelectorAll('#bib-list li'));
  const nav           = document.getElementById('bib-nav');

  let perPage     = +perPageSelect.value;
  let currentPage = 1;

  function showPage(page) {
    const start = (page - 1) * perPage;
    const end   = page * perPage;
    bibItems.forEach((item, idx) => {
      item.style.display = (idx >= start && idx < end) ? '' : 'none';
    });
    currentPage = page;
    buildNav();
  }

  function buildNav() {
  nav.innerHTML = '';
  const totalPages = Math.ceil(bibItems.length / perPage);
  if (totalPages === 0) return;

  /* helpers */
  const addBtn = (label, page, disabled = false) => {
    const b = document.createElement('button');
    b.textContent = label;
    b.disabled    = disabled;
    if (!disabled) b.addEventListener('click', () => showPage(page));
    nav.appendChild(b);
  };
  const addDots = () => { const span = document.createElement('span'); span.textContent = '…'; nav.appendChild(span); };

  /* figure out which 10 pages to show */
  let start = Math.max(1, currentPage - 4);
  let end   = start + 9;
  if (end > totalPages) { end = totalPages; start = Math.max(1, end - 9); }

  /* jump‑to‑first / leading dots */
  if (start > 1) {
    addBtn('«1', 1);              // first page
    if (start > 2) addDots();     // ellipsis if we skipped more than one page
  }

  /* main numbered block */
  for (let p = start; p <= end; p++) addBtn(String(p), p, p === currentPage);

  /* trailing dots / jump‑to‑last */
  if (end < totalPages) {
    if (end < totalPages - 1) addDots();
    addBtn('»' + totalPages, totalPages);  // last page
  }
}


  perPageSelect.addEventListener('change', () => {
    perPage = +perPageSelect.value;
    showPage(1);          // reset to first page when the page‑size changes
  });

  /* ---------- NEW: make “Abs” / “Bib” buttons collapse blocks ---------- */

  /* 1.  Ensure every abstract / bibtex block starts hidden */
  document.querySelectorAll('#bib-list div.abstract, #bib-list div.bibtex')
          .forEach(div => div.classList.add('hidden'));

  /* 2.  Wire the buttons */
  document.querySelectorAll('#bib-list a.abstract.btn').forEach(btn => {
    const block = btn.closest('li').querySelector('div.abstract');
    if (block) {
      btn.addEventListener('click', e => {
        e.preventDefault();
        block.classList.toggle('hidden');
      });
    }
  });

  document.querySelectorAll('#bib-list a.bibtex.btn').forEach(btn => {
    const block = btn.closest('li').querySelector('div.bibtex');
    if (block) {
      btn.addEventListener('click', e => {
        e.preventDefault();
        block.classList.toggle('hidden');
      });
    }
  });

  /* ---------- initial render ---------- */
  showPage(1);
});
</script>
