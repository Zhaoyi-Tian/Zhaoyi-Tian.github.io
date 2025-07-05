---
title: "我的项目"
layout: archive
permalink: /projects/
---

{% comment %} 按年月分组项目（不使用插件） {% endcomment %}
{% assign sorted_projects = site.projects | sort: 'date' | reverse %}
{% assign current_month = nil %}

<div class="timeline-container">
  {% for project in sorted_projects %}
    {% assign project_month = project.date | date: '%Y-%m' %}
    
    {% comment %} 检查是否需要创建新的月份分组 {% endcomment %}
    {% if project_month != current_month %}
      {% comment %} 如果不是第一个分组，则关闭上一个分组的容器 {% endcomment %}
      {% if current_month != nil %}</div></div>{% endif %}
      
      {% comment %} 创建新的月份分组 {% endcomment %}
      <div class="timeline-group">
        <div class="timeline-marker">
          {{ project_month }}
        </div>
        <div class="timeline-items">
      
      {% comment %} 更新当前月份标记 {% endcomment %}
      {% assign current_month = project_month %}
    {% endif %}
    
    {% comment %} 渲染项目内容 {% endcomment %}
    {% include archive-single-project.html %}
    
  {% endfor %}
  
  {% comment %} 关闭最后一个分组的容器 {% endcomment %}
  </div></div>
</div>