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
  /* --------- core DOM refs (unchanged) --------- */
  const perPageSelect = document.getElementById('per-page');
  const bibItems      = Array.from(document.querySelectorAll('#bib-list li'));

  /* two nav bars */
  const navBottom = document.getElementById('bib-nav');      // already in HTML
  const navTop    = document.createElement('div');           // we create this one
  navTop.id = 'bib-nav-top';
  navTop.className = navBottom.className || '';
  // put the top bar right above #bib-list
  const bibListDiv = document.getElementById('bib-list');
  bibListDiv.parentNode.insertBefore(navTop, bibListDiv);

  /* ordered list element (for global numbering) */
  const bibOL = document.querySelector('#bib-list ol');

  /* current settings */
  let perPage     = +perPageSelect.value;
  let currentPage = 1;

  /* --------- helper: items currently visible (i.e., not .unloaded) --------- */
  const getVisibleItems = () =>
    bibItems.filter(li => !li.classList.contains('unloaded'));

  /* --------- fill one nav bar (called twice) --------- */
  function fillBar(bar, totalPages) {
    bar.innerHTML = '';

    const addBtn = (label, page, disabled = false) => {
      const b = document.createElement('button');
      b.textContent = label;
      b.disabled    = disabled;
      if (!disabled) b.addEventListener('click', () => showPage(page));
      bar.appendChild(b);
    };
    const addDots = () => {
      const dots = document.createElement('span');
      dots.textContent = '…';
      bar.appendChild(dots);
    };

    /* which 10 pages? */
    let start = Math.max(1, currentPage - 4);
    let end   = start + 9;
    if (end > totalPages) { end = totalPages; start = Math.max(1, end - 9); }

    if (start > 1) { addBtn('«1', 1); if (start > 2) addDots(); }
    for (let p = start; p <= end; p++) addBtn(String(p), p, p === currentPage);
    if (end < totalPages) { if (end < totalPages - 1) addDots(); addBtn('»' + totalPages, totalPages); }
  }

  /* --------- main renderer --------- */
  function showPage(page) {
    const pool       = getVisibleItems();
    const totalPages = Math.max(1, Math.ceil(pool.length / perPage));

    /* clamp + store page */
    currentPage = Math.min(Math.max(1, page), totalPages);

    /* slice visible pool */
    const sliceStart = (currentPage - 1) * perPage;
    const sliceEnd   = sliceStart + perPage;

    /* hide all, then show the slice */
    bibItems.forEach(li => li.style.display = 'none');
    pool.slice(sliceStart, sliceEnd).forEach(li => (li.style.display = ''));

    /* global numbering relative to the *visible* pool */
    if (bibOL && pool.length) {
    bibOL.start = sliceStart + 1;   // e.g. 1, 21, 41, … after filtering
    }


    /* rebuild both nav bars */
    fillBar(navTop, totalPages);
    fillBar(navBottom, totalPages);
  }

  /* --------- events --------- */
  perPageSelect.addEventListener('change', () => {
    perPage = +perPageSelect.value;
    showPage(1);                       // reset to first page when size changes
  });

  /* watch for search filter toggling .unloaded */
  const observer = new MutationObserver(() => showPage(1));
  bibItems.forEach(li => observer.observe(li, { attributes: true, attributeFilter: ['class'] }));

  /* initial paint */
  showPage(1);

  /* --------- collapse logic for “Abs” / “Bib” buttons (unchanged) --------- */
  document.querySelectorAll('#bib-list div.abstract, #bib-list div.bibtex')
          .forEach(div => div.classList.add('hidden'));

  document.querySelectorAll('#bib-list a.abstract.btn').forEach(btn => {
    const block = btn.closest('li').querySelector('div.abstract');
    if (block) btn.addEventListener('click', e => { e.preventDefault(); block.classList.toggle('hidden'); });
  });
  document.querySelectorAll('#bib-list a.bibtex.btn').forEach(btn => {
    const block = btn.closest('li').querySelector('div.bibtex');
    if (block) btn.addEventListener('click', e => { e.preventDefault(); block.classList.toggle('hidden'); });
  });
});
</script>
