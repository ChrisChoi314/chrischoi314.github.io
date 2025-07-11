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

<!-- ────────────  keyword filter UI  ──────────── -->
<div class="keyword-filter">
  <select id="topic-select">
    <option value="" disabled selected>Select a topic …</option>
    {% for t in page.topics %}
      <option value="{{ t }}">{{ t }}</option>
    {% endfor %}
  </select>

  <!-- pills for active filters will appear here -->
  <div id="selected-topics"></div>

  <!-- clear‑all button (hidden when nothing selected) -->
  <button id="clear-topics" style="display:none;">✖ Clear all</button>
</div>


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

<style>
.keyword-filter { margin-bottom: 1rem; }
#selected-topics .pill {
  display:inline-block; margin:.2em .35em; padding:.15em .55em;
  background:#e0e0e0; border-radius:1em; font-size:.85em; position:relative;
}
#selected-topics .pill .close {
  margin-left:.45em; cursor:pointer; font-weight:bold;
}
</style>


<script>
document.addEventListener('DOMContentLoaded', () => {
  /* --------- core DOM refs (unchanged) --------- */
  const perPageSelect = document.getElementById('per-page');
  const bibItems = Array.from(document.querySelectorAll('#bib-list li'));

/* --- add a <span class="num"> to each row (only once) --- */
bibItems.forEach(li => {
  if (!li.querySelector('.num')) {
    const num = document.createElement('span');
    num.className = 'num';
    li.insertBefore(num, li.firstChild);
  }
});



  /* two nav bars */
  const navBottom = document.getElementById('bib-nav');      // already in HTML
  const navTop    = document.createElement('div');           // we create this one

 /* ──── NEW: elements for topic filtering ──── */
  const topicSelect   = document.getElementById('topic-select');
  const selectedBox   = document.getElementById('selected-topics');
  const clearBtn      = document.getElementById('clear-topics');
  const selectedTopics = new Set();

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
  let inTopicFilter = false;    // prevent infinite observer loops

  /* --------- helper: items currently visible (i.e., not .unloaded) --------- */
  const getVisibleItems = () =>
    bibItems.filter(li => !li.classList.contains('unloaded'));

/* ──── helper: update pills UI ──── */
  function refreshPills() {
    selectedBox.innerHTML = '';
    selectedTopics.forEach(t => {
      const pill = document.createElement('span');
      pill.className = 'pill';
      pill.textContent = t;
      const x = document.createElement('span');
      x.className = 'close';
      x.textContent = '×';
      x.addEventListener('click', () => { selectedTopics.delete(t); applyTopicFilter(); });
      pill.appendChild(x);
      selectedBox.appendChild(pill);
    });
    clearBtn.style.display = selectedTopics.size ? '' : 'none';
  }

  /* ──── helper: (re)apply topic filter ──── */
  function applyTopicFilter() {
  inTopicFilter = true;       // ⟵ NEW

  const active = Array.from(selectedTopics).map(t => t.toLowerCase());
  bibItems.forEach(li => {
    const kw = (li.dataset.keywords || '')
                 .toLowerCase()
                 .split(',')
                 .map(s => s.trim());    // keep your .trim() fix
    const matches = active.every(a => kw.includes(a));
    li.classList.toggle('unloaded', !matches);
  });
  refreshPills();

  inTopicFilter = false;      // ⟵ NEW
}



  /* ──── select‑menu event ──── */
  topicSelect.addEventListener('change', () => {
    const val = topicSelect.value;
    if (val && !selectedTopics.has(val)) {
      selectedTopics.add(val);
      applyTopicFilter();              // sets .unloaded and triggers observer
    }
    topicSelect.selectedIndex = 0;     // reset dropdown label
  });

  /* ──── clear‑all event ──── */
  clearBtn.addEventListener('click', () => {
    selectedTopics.clear();
    applyTopicFilter();                // show everything again
  });


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

  currentPage = Math.min(Math.max(1, page), totalPages);

  const sliceStart = (currentPage - 1) * perPage;
  const sliceEnd   = sliceStart + perPage;

  //* —— hide everything & clear old numbers —— */
bibItems.forEach(li => {
  li.style.display = 'none';
  li.querySelector('.num').textContent = '';
});

/* —— show just the slice, write correct global index —— */
pool.slice(sliceStart, sliceEnd).forEach((li, idx) => {
  li.style.display = '';
  li.querySelector('.num').textContent = sliceStart + idx + 1;
});


  /* ---- set the <ol> start attribute (for accessibility) ---- */
  if (bibOL && pool.length) bibOL.start = sliceStart + 1;

  /* ---- rebuild nav bars ---- */
  fillBar(navTop, totalPages);
  fillBar(navBottom, totalPages);
}


  /* ----------------------------------------------- */
    /*  keep topic filter in force after each search   */
    /* ----------------------------------------------- */
    const searchInput =
        document.querySelector('#search') ||          // common id in bib_search.html
        document.querySelector('input[type="search"]');

    if (searchInput) {
    searchInput.addEventListener('input', () => {
        /* wait till bib_search has finished toggling .unloaded,
        then re‑apply the topic logic                      */
        setTimeout(() => {
        applyTopicFilter();   // restore pill filter
        showPage(1);          // rebuild pagination from the *intersection*
        }, 0);                  // 0 ms = run right after current event loop tick
    });
    }


  /* --------- events --------- */
  perPageSelect.addEventListener('change', () => {
    perPage = +perPageSelect.value;
    showPage(1);                       // reset to first page when size changes
  });

  /* watch for search filter toggling .unloaded */
  const observer = new MutationObserver(() => {
  if (!inTopicFilter) {       // ignore mutations we ourselves just triggered
    applyTopicFilter();       // restore topic constraints
    showPage(1);              // rebuild page list from the intersection
  }
});

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
