---
title: "我的项目"
layout: archive
permalink: /projects/
---

{% comment %} 按年月分组项目 {% endcomment %}
{% assign sorted_projects = site.projects | sort: 'date' | reverse %}
{% assign grouped_projects = sorted_projects | group_by_exp: 'project', 'project.date | date: "%Y-%m"' %}

<div class="modern-timeline-container">
  <ul class="modern-timeline-list">
    {% for group in grouped_projects %}
      <li class="timeline-item">
        <span class="timeline-dot"></span>
        <span class="timeline-connector"></span>
        <div class="timeline-content-wrapper">
          <div class="timeline-date-simple">
            {% assign date_parts = group.name | split: '-' %}
            <span class="date-year-small">{{ date_parts[0] }}</span>
            <span class="date-month-large">
              {% assign month_num = date_parts[1] | plus: 0 %}
              {% case month_num %}
                {% when 1 %}一月
                {% when 2 %}二月
                {% when 3 %}三月
                {% when 4 %}四月
                {% when 5 %}五月
                {% when 6 %}六月
                {% when 7 %}七月
                {% when 8 %}八月
                {% when 9 %}九月
                {% when 10 %}十月
                {% when 11 %}十一月
                {% when 12 %}十二月
              {% endcase %}
            </span>
          </div>
          <div class="timeline-projects">
            {% for project in group.items %}
              {% include archive-single-project.html %}
            {% endfor %}
          </div>
        </div>
      </li>
    {% endfor %}
  </ul>
</div>