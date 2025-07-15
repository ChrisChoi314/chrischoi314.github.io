---
layout: page
title: News
permalink: /news/
nav: true
---

<!-- {% include news.html %} -->
<ul style="padding-left: 15px; margin-bottom: 0;">
  {% for item in site.data.news %}
    <li>
      <span style="display: inline-block; width: 72px;">[{{ item.date }}]</span>
      {{ item.content }}
    </li>
  {% endfor %}
</ul>