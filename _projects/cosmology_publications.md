---
layout: page
title: Relevant papers for my research
description: enumerating the papers by subfield
img: assets/img/projects/cosmology_publications/cover.png
importance: 1
category: academic
topics: ['Axions', 'Beyond standard model (BSM)', 'Big-bang-nucleosynthesis (BBN)', 'Chiral plasma instability (CPI) and chiral magnetic effect (CME)', 'Cosmological parameters', 'Cosmic microwave background (CMB)', 'Ultra high energy cosmic rays (UHECR)', 'Dark energy (DE)', 'Dark matter. (DM)', 'General relativity (GR) and modified gravity (MG)', 'Gravitational waves (GWs) theory & observations', 'Inflation', 'Isotropy', 'Large-scale structure (LSS)', 'Lorentz symmetry', 'Neutrinos', 'Parity symmetry', 'Perturbations', 'Phase transitions (PTs)', 'Primordial magnetic fields (PMFs)', 'Turbulence', 'Miscellaneous']
---

<!-- ──────────────────────────────────────────────────────────────
     TOPIC‑CHIP MENU
     ─────────────────────────────────────────────────────────── -->
<div id="tag‑chooser" class="mb-3">
  <div class="chip-box" id="available-tags"></div>
  <div class="chip-box chosen" id="selected-tags"></div>
  <button id="clear-tags" class="clear-chips btn btn-sm" title="Clear all">✕</button>
</div>

{% include bib_search.html %}
<script src="{{ '/assets/js/bibsearch_button_highlight.js' | relative_url }}"></script>

<!-- ───────────────────── Pagination selector ────────────────── -->
<div class="bibliography-controls">
  <label for="per-page">Papers per page:</label>
  <select id="per-page">
    <option value="10">10</option>
    <option value="20" selected>20</option>
    <option value="50">50</option>
  </select>
</div>

<div id="bib-nav-top" class="bib-nav"></div>
<ul id="bib-list">
  {% bibliography -f papers %}
</ul>

<div id="bib-nav"      class="bib-nav"></div>

<!-- ───────────────────────── CSS ─────────────────────────────── -->
<style>
/* chips */
.chip-box          { display:flex; flex-wrap:wrap; gap:.4rem; }
.chip-box.chosen   { margin-top:.6rem; }

.chip {
  display:inline-flex; align-items:center; gap:.25em;
  padding:.25em .6em; border-radius:1rem; font-size:.875rem;
  background:#e5e5e5; cursor:pointer; user-select:none;
  transition:background .15s ease;
}
.chip:hover        { background:#d0d0d0; }
.chip.chosen       { background:#6495ed; color:#fff; }
.chip .close       { font-size:.8em; margin-left:.3em; }

.clear-chips {
  margin-left:.75rem; padding:.15rem .45rem;
  border-radius:50%; line-height:1; cursor:pointer;
}

.hidden, .tag‑filtered { display:none !important; }

/* nav buttons */
.bib-nav { margin:1rem 0; display:flex; flex-wrap:wrap; gap:.4rem; }
.bib-nav button { padding:.2rem .55rem; }

/* — make the bib-plugin’s <a class="… btn"> links show their borders & padding */
#bib-list a.btn {
  display: inline-block;
  padding: 0.2rem 0.5rem;
  border: 1px solid currentColor !important;
  color: inherit !important;
  background-color: transparent !important;
  border-radius: 0.25rem;
  text-decoration: none;
}

/* ── highlight colour for Abs / Bib buttons ──────────────────── */
:root{
  --hit-light:#ff4d85;     /* light-mode pink  */
  --hit-dark :#4da8ff;     /* dark-mode blue   */
}
a.btn.search-hit{
  color:#fff !important;                  /* keep text white in dark-mode */
  background:var(--hit-light) !important;
}
@media (prefers-color-scheme:dark){
  a.btn.search-hit{ background:var(--hit-dark) !important; }
}


</style>

<!-- ───────────────────────── JS ──────────────────────────────── -->
<!-- htmlcompressor ignore:start -->

<script>
document.addEventListener('DOMContentLoaded', () => {
    const bibList = document.getElementById('bib-list');
/* ========== 0.  Grab stuff ========== */
const allTopics = {{ page.topics | jsonify }};          // from front‑matter
const boxAvail  = document.getElementById('available-tags');
const boxChosen = document.getElementById('selected-tags');
const clearBtn  = document.getElementById('clear-tags');
const selected  = new Set();

/* ========== 1.  Build chips ========== */
const makeChip = (label, chosen=false) => {
  const chip = document.createElement('span');
  chip.className = 'chip' + (chosen ? ' chosen' : '');
  chip.dataset.tag = label.toLowerCase();
  chip.textContent = label;
  const x = document.createElement('span');
  x.textContent = '✕'; x.className = 'close';
  x.style.display = chosen ? '' : 'none';
  chip.appendChild(x);
  return chip;
};
allTopics.forEach(t => boxAvail.appendChild(makeChip(t)));

/* click logic */
function choose(chip){
  selected.add(chip.dataset.tag);
  chip.classList.add('chosen');
  chip.querySelector('.close').style.display='';
  boxChosen.appendChild(chip);
  updateFilter();
}
function unchoose(chip){
  selected.delete(chip.dataset.tag);
  chip.classList.remove('chosen');
  chip.querySelector('.close').style.display='none';
  boxAvail.appendChild(chip);
  updateFilter();
}
[boxAvail, boxChosen].forEach(box=>{
  box.addEventListener('click',e=>{
    const chip=e.target.closest('.chip'); if(!chip) return;
    chip.classList.contains('chosen')?unchoose(chip):choose(chip);
  });
});
clearBtn.addEventListener('click',()=>[...boxChosen.children].forEach(unchoose));

/* ========== 2.  Tag filter + search filter ========== */
const bibItems = Array.from(document.querySelectorAll('#bib-list li'));


function tagMatch(li){
  if (selected.size === 0) return true;

  // NEW: grab data-topics either from the <li> itself or the inner .entry-body
  const topicAttr = li.dataset.topics
                 || li.querySelector('[data-topics]')?.dataset.topics
                 || '';

  const liTags = topicAttr.split(',').map(s => s.trim().toLowerCase());
  return [...selected].every(t => liTags.includes(t));
}

function updateFilter(){
  bibItems.forEach(li=>{
    li.classList.toggle('tag-filtered', !tagMatch(li));
  });
 showPage(1);
}
document.addEventListener('bibsearch:results-updated', updateFilter);

/* ========== 3.  Pagination (from original) ========== */
const perPageSelect = document.getElementById('per-page');
const navTop        = document.getElementById('bib-nav-top');
const navBottom     = document.getElementById('bib-nav');
let perPage = +perPageSelect.value, currentPage = 1;

// insert a .num span in each <li> (for numbering)
bibItems.forEach(li => {
  if (!li.querySelector('.num')) {
    const num = document.createElement('span');
    num.className = 'num';
    li.insertBefore(num, li.firstChild);
  }
});

// helper: items currently visible (not unloaded by search/tag)
function getVisible() {
  return bibItems.filter(li =>
    !li.classList.contains('unloaded') &&
    !li.classList.contains('tag-filtered')
  );
}

// builds one nav bar (top or bottom) given totalPages
function fillBar(bar, totalPages) {
  bar.innerHTML = '';
  const addBtn = (label, page, disabled = false) => {
    const b = document.createElement('button');
    b.textContent = label;
    b.disabled    = disabled;
    if (!disabled) b.addEventListener('click', () => showPage(page));
    bar.appendChild(b);
  };
  const addDots = () => bar.appendChild(document.createTextNode('…'));

  if (totalPages <= 1) return;

  let start = Math.max(1, currentPage - 4);
  let end   = start + 9;
  if (end > totalPages) {
    end = totalPages;
    start = Math.max(1, end - 9);
  }

  if (start > 1) {
    addBtn('«1', 1);
    if (start > 2) addDots();
  }
  for (let p = start; p <= end; p++) {
    addBtn(String(p), p, p === currentPage);
  }
  if (end < totalPages) {
    if (end < totalPages - 1) addDots();
    addBtn('»' + totalPages, totalPages);
  }
}

// core pagination routine
function showPage(page) {
  const pool = getVisible();
  const totalPages = Math.max(1, Math.ceil(pool.length / perPage));
  currentPage = Math.min(Math.max(1, page), totalPages);

  const sliceStart = (currentPage - 1) * perPage;
  bibList.style.counterReset = 'paper ' + sliceStart;

  // hide all + clear old numbers
  bibItems.forEach(li => {
    li.style.display = 'none';
    li.querySelector('.num').textContent = '';
  });

  // show current slice + write new numbers
  pool.slice(sliceStart, sliceStart + perPage).forEach((li, idx) => {
    li.style.display = '';
    li.querySelector('.num').textContent = sliceStart + idx + 1;
  });

  fillBar(navTop, totalPages);
  fillBar(navBottom, totalPages);
}

// wire up per-page selector & initial paint
perPageSelect.addEventListener('change', () => showPage(1));
showPage(1);


/* ========== 4.  Collapsible Abstract/BibTeX blocks ========== */
document.querySelectorAll('#bib-list div.abstract, #bib-list div.bibtex')
        .forEach(div=>div.classList.add('hidden'));
document.querySelectorAll('#bib-list a.abstract.btn').forEach(btn=>{
  const block=btn.closest('li').querySelector('div.abstract');
  if(block) btn.addEventListener('click',e=>{e.preventDefault();block.classList.toggle('hidden');});
});
document.querySelectorAll('#bib-list a.bibtex.btn').forEach(btn=>{
  const block=btn.closest('li').querySelector('div.bibtex');
  if(block) btn.addEventListener('click',e=>{e.preventDefault();block.classList.toggle('hidden');});
});

/* ========== 4½.  Highlight Abs / Bib buttons on search ========== */
function highlightButtons() {
  /* 1) clear old hits */
  document.querySelectorAll('.links a.search-hit')
          .forEach(b=>b.classList.remove('search-hit'));

  const term = (document.getElementById('bibsearch')?.value || '')
                .trim().toLowerCase();
  if(!term) return;

  bibItems.forEach(li=>{
    const absTxt = li.querySelector('.abstract')?.textContent.toLowerCase() || '';
    const bibTxt = li.querySelector('.bibtex')  ?.textContent.toLowerCase() || '';

    if(absTxt.includes(term)){
      li.querySelectorAll('.links a.abstract')
        .forEach(b=>b.classList.add('search-hit'));
    }
    if(bibTxt.includes(term)){
      li.querySelectorAll('.links a.bibtex')
        .forEach(b=>b.classList.add('search-hit'));
    }
  });
}

/* fire whenever the search box changes OR the page hash changes */
const bibSearchBox = document.getElementById('bibsearch');
if (bibSearchBox){
  bibSearchBox.addEventListener('input', ()=>{ clearTimeout(bibSearchBox._deb);
    bibSearchBox._deb = setTimeout(highlightButtons,250); });
  window.addEventListener('hashchange', highlightButtons);
}


/* kick things off */
updateFilter();
});
</script>
<!-- htmlcompressor ignore:end -->