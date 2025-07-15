---
layout: page
title: news
permalink: /news/
nav: true
---

<!-- {% include news.html %} -->


<table class="table table-sm table-borderless">
              {%- assign news = site.news | reverse -%}
              {% for item in news limit: news_limit %}
                <tr>
                  <th scope="row" style="width: 20%">{{ item.date | date: "%b %-d, %Y" }}</th>
                  <td>
                    {% if item.inline -%}
                      {{ item.content | remove: '<p>' | remove: '</p>' | emojify }}
                    {%- else -%}
                      <a class="news-title" href="{{ item.url | relative_url }}">{{ item.title }}</a>
                    {%- endif %}
                  </td>
                </tr>
              {%- endfor %}
</table>