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
                                        <div class="clr-col-7">
                                            {{uc.description}}
                        
                                            <div class="card-block-labels">
                                                {% for ucLabel in uc.labels %}
                                                  {% if ucLabel.link %} <a href="{{ ucLabel.link | prepend: site.baseurl }}"> {% endif %}
                                                    <span class="label label-light-blue"><clr-icon shape="{{ ucLabel.iconShape }}"></clr-icon> {{ ucLabel.name }}</span>
                                                  {% if ucLabel.link %} </a> {% endif %}
                                                {% endfor %}
                                            </div>
                        
                                            {% if uc.hasMore %}
                                            <a href="{{ uc.url | prepend: site.baseurl }}" class="btn btn-primary">Learn More</a>
                                            {% endif %}
                                        </div>
                                        <div class="clr-col-5">
                                            <img src="{{ site.baseurl }}/assets/images/{{uc.img}}" class="card-block-img" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    {% endfor %}
                </div>
            </div>
        </div>
    </div>
</div>
