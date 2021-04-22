---
layout: default
title: Use Cases
permalink: /use_cases/
---

<div class="third-section">
    <div class="container-fluid">
        <div class="clr-row home-story-section">
            <div class="clr-col-12">
                <div>
                    <h1>Use Cases</h1>
                    <h3>Check out the following real world Use Cases that can be rapidly delivered through the Cloud Developer Platform.</h3>

{% assign use_cases = site.use_cases | sort: 'order' %}
{% for uc in use_cases %}
    <div class="card">
        <div class="card-block">
            <div class="card-title">{{ uc.title }}</div>
            <div class="card-text">
                <div class="clr-row">
                    <div class="clr-col-8">
                        {{uc.description}}
    
                        <div class="card-block-labels">
                            {% for ucLabel in uc.labels %}
                                <span class="label label-light-blue">{{ ucLabel }}</span>
                                
                            {% endfor %}
                        </div>
    
                        {% if uc.hasMore %}
                        <a href="{{ uc.url | prepend: site.baseurl }}" class="btn btn-outline btn-sm">Learn More</a>
                        {% endif %}
                    </div>
                    <div class="clr-col-4">
                        <img src="https://via.placeholder.com/60?text=Image" class="card-block-img" />
                    </div>
                </div>
            </div>
        </div>
    </div>
{% endfor %}

                    <div class="browse-cases-btn-wrapper">
                        <button class="btn btn-primary">browse use cases</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
