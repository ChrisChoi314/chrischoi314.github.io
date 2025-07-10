---
layout: page
title: Test Bibliography
category: academic
img: assets/img/projects/cosmology_publications/cover.png
importance: 1
---

<div class="publications">

<h2>Bibliography Test</h2>

<h2>Show all</h2>
{% bibliography %}

<h2>Show by Year</h2>
{% bibliography -f papers -q @*[keywords=Lorentz] %}


</div>
