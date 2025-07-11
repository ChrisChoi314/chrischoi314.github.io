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
