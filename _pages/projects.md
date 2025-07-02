---
title: "我的项目"
layout: archive
permalink: /projects/
---
{% comment %} 关键修改：手动按日期倒序排序 {% endcomment %}
{% assign sorted_projects = site.projects | sort: 'date' | reverse %}

{% for project in sorted_projects %}
  {% include archive-single-project.html %}
{% endfor %}
