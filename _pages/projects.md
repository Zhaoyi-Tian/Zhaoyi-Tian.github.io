---
title: "我的项目"
layout: archive
permalink: /projects/
---

{% comment %} 按年月分组项目 {% endcomment %}
{% assign sorted_projects = site.projects | sort: 'date' | reverse %}
{% assign grouped_projects = sorted_projects | group_by_exp: "p", "p.date | date: '%Y-%m'" %}

<div class="timeline-container">
  {% for group in grouped_projects %}
    {% comment %} 取分组的第一个项目的日期，用于显示月份 {% endcomment %}
    {% assign first_project = group.items | first %}
    <div class="timeline-group">
      <!-- 时间轴标记（每个月只显示一次） -->
      <div class="timeline-marker">
        {{ first_project.date | date: "%Y-%m" }}
      </div>
      <!-- 该月份的所有项目 -->
      <div class="timeline-items">
        {% for project in group.items %}
          {% include archive-single-project.html %}
        {% endfor %}
      </div>
    </div>
  {% endfor %}
</div>