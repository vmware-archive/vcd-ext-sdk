---
layout: default
title: Use Cases
permalink: /use_cases/
---

  <h1 class="page-heading">Use cases</h1>
  <ul>
    {% for uc in site.use_cases %}
      <li><a href="{{ uc.url | prepend: site.baseurl }}">{{ uc.title }}</a></li>
    {% endfor %}
  </ul>
