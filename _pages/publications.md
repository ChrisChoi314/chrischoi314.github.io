---
layout: page
permalink: /publications/
title: publications
description: publications by categories in reverse-chronological order.
years: [2025,2024]
nav: true
nav_order: 1
---
<!-- _pages/publications.md -->
<!-- Bibsearch Feature -->

{% include bib_search.html %}

<div class="publications">

{%- for y in page.years %}
  <h2 class="year">{{ y }}</h2>
  {% bibliography -f papers_chris -q @*[year={{ y }}] %}
{%- endfor %}

</div>

{% raw %}
<!-- ——— enable Abs / Bib toggle on this page ——— -->
<script>
document.addEventListener('DOMContentLoaded', () => {

  /* Abs button */
  document.querySelectorAll('.links .abstract').forEach(btn =>
    btn.addEventListener('click', () => {
      const blk = btn.closest('.entry-body').querySelector('div.abstract');  // <-- NB: div!
      blk.classList.toggle('open');
      blk.classList.toggle('hidden');
    })
  );

  /* Bib button */
  document.querySelectorAll('.links .bibtex').forEach(btn =>
    btn.addEventListener('click', () => {
      const blk = btn.closest('.entry-body').querySelector('div.bibtex');    // <-- NB: div!
      blk.classList.toggle('open');
      blk.classList.toggle('hidden');
    })
  );

});
</script>
{% endraw %}
