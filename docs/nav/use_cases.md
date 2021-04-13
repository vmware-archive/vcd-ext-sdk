---
layout: default
title: Use Cases
permalink: /use_cases/
---

<div class="use-cases">
  <div class="title">
    <h1 class="page-heading">Use cases</h1>
    <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque eu odio nisi. Vestibulum dignissim eget massa sit amet feugiat. Quisque auctor mattis quam eu suscipit.</span>
  </div>
  {% assign use_cases = site.use_cases | sort: 'order' %}
  {% for uc in use_cases %}
    <div class="card use-case">
      <div class="card-header">
        {{ uc.title }}
      </div>
      <div class="card-block">
        <div class="card-media-block">
          <div class="card-media-description">
              {{uc.description}}
            <div>
              {% for ucLabel in uc.labels %}
                <span class="label label-light-blue">{{ ucLabel }}</span>
              {% endfor %}
            </div>
          </div>
          <img src="https://via.placeholder.com/60?text=Image" class="card-media-image" />
        </div>
      </div>
      <div class="card-footer">
        {% if uc.hasMore %}
          <a href="{{ uc.url | prepend: site.baseurl }}" class="btn btn-primary">Learn More</a>
        {% endif %}
      </div>
    </div>
  {% endfor %}
</div>