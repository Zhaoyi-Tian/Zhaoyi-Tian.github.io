---
title: "我的项目"
layout: archive
permalink: /projects/
---

{% comment %} 按年月分组项目（彻底修复嵌套） {% endcomment %}
{% assign sorted_projects = site.projects | sort: 'date' | reverse %}
{% assign current_month = nil %}

<div class="timeline-container">
  {% for project in sorted_projects %}
    {% assign project_month = project.date | date: '%Y-%m' %}
    
    {% comment %} 新建分组：关闭旧分组 → 开新分组 {% endcomment %}
    {% if project_month != current_month %}
      {% comment %} 关闭上一个分组（如果存在） {% endcomment %}
      {% if current_month %}
        </div> <!-- 关闭 .timeline-items -->
      </div> <!-- 关闭 .timeline-group -->
      {% endif %}
      
      {% comment %} 新建分组容器 {% endcomment %}
      <div class="timeline-group">
        <div class="timeline-marker">
          {{ project_month }}
        </div>
        <div class="timeline-items">
    {% endif %}
    
    {% comment %} 渲染项目卡片（关键：移除 markdownify 避免标题解析） {% endcomment %}
    {% include archive-single-project.html %}
    
    {% comment %} 更新当前月份 {% endcomment %}
    {% assign current_month = project_month %}
  {% endfor %}
  
  {% comment %} 关闭最后一个分组 {% endcomment %}
  </div> <!-- 关闭 .timeline-items -->
</div> <!-- 关闭 .timeline-group -->
</div> <!-- 关闭 .timeline-container -->