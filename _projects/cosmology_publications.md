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

<!-- ───────────────────── Pagination selector ────────────────── -->
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

<div id="bib-nav-top" class="bib-nav"></div>
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
</style>

<!-- ───────────────────────── JS ──────────────────────────────── -->
<script>
document.addEventListener('DOMContentLoaded', () => {
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
  if(selected.size===0) return true;
  const liTags=(li.dataset.topics||'').split(',').map(s=>s.trim().toLowerCase());
  return [...selected].every(t=>liTags.includes(t));
}
function updateFilter(){
  bibItems.forEach(li=>{
    li.classList.toggle('tag‑filtered',!tagMatch(li));
  });
  rebuildPagination();
}
document.addEventListener('bibsearch:results-updated', updateFilter);

/* ========== 3.  Pagination ========== */
const perPageSelect=document.getElementById('per-page');
const navTop=document.getElementById('bib-nav-top');
const navBottom=document.getElementById('bib-nav');
let perPage=+perPageSelect.value, currentPage=1;

const getVisible=()=>bibItems.filter(li=>!li.classList.contains('search_hidden')&&!li.classList.contains('tag‑filtered'));

function showPage(page){
  const visible=getVisible();
  const totalPages=Math.max(1,Math.ceil(visible.length/perPage));
  page=Math.min(page,totalPages);

  const start=(page-1)*perPage, end=page*perPage;
  visible.forEach((li,i)=>li.style.display=(i>=start&&i<end)?'':'none');
  [...bibItems].filter(li=>!visible.includes(li)).forEach(li=>li.style.display='none');
  currentPage=page;
  buildNav(totalPages);
}
function buildNav(totalPages){
  const fill=bar=>{
    bar.innerHTML='';
    const add=(txt,p,dis=false)=>{
      const b=document.createElement('button'); b.textContent=txt; b.disabled=dis;
      if(!dis) b.onclick=()=>showPage(p);
      bar.appendChild(b);
    };
    if(totalPages===1) return;
    add('«',1,currentPage===1);
    for(let p=1;p<=totalPages;p++){
      if(Math.abs(p-currentPage)<=4||p===1||p===totalPages)
        add(p,p,p===currentPage);
      else if(Math.abs(p-currentPage)===5) bar.appendChild(document.createTextNode('…'));
    }
    add('»',totalPages,currentPage===totalPages);
  };
  [navTop,navBottom].forEach(fill);
}
function rebuildPagination(){ showPage(1); }
perPageSelect.addEventListener('change',()=>{ perPage=+perPageSelect.value; rebuildPagination(); });

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

/* kick things off */
updateFilter();
});
</script>
