// About页面TOC功能
document.addEventListener('DOMContentLoaded', function() {
  // 检查是否在about页面
  if (!document.querySelector('.about-page-container')) return;
  
  const tocList = document.getElementById('toc-list');
  const content = document.querySelector('.about-main-content .page__content');
  
  if (!tocList || !content) return;
  
  // 获取所有标题 - 只获取主要章节的 h2 标题，排除项目卡片中的标题
  const headings = content.querySelectorAll('h2:not(.project-title)');
  const tocItems = [];
  
  // 生成TOC结构
  headings.forEach((heading, index) => {
    // 为标题添加ID（如果没有的话）
    if (!heading.id) {
      const text = heading.textContent.trim();
      const id = text.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]/g, '')
        .substring(0, 50);
      heading.id = id + (index > 0 ? '-' + index : '');
    }
    
    // 创建TOC项
    const li = document.createElement('li');
    li.className = 'toc-item';
    
    const link = document.createElement('a');
    link.href = '#' + heading.id;
    link.className = 'toc-link';
    link.textContent = heading.textContent.trim();
    link.setAttribute('aria-label', 'Scroll to section: ' + heading.textContent.trim());
    
    li.appendChild(link);
    tocList.appendChild(li);
    
    tocItems.push({
      element: heading,
      link: link,
      id: heading.id,
      isVisible: false
    });
  });
  
  // 使用 Intersection Observer 进行更精确的追踪
  let currentActiveIndex = -1;
  
  const observerOptions = {
    root: null,
    rootMargin: '-100px 0px -60% 0px', // 顶部100px偏移，底部60%区域
    threshold: [0, 0.1, 0.5, 1.0]
  };
  
  const observer = new IntersectionObserver((entries) => {
    // 更新可见性状态
    entries.forEach(entry => {
      const index = tocItems.findIndex(item => item.element === entry.target);
      if (index >= 0) {
        tocItems[index].isVisible = entry.isIntersecting;
        tocItems[index].intersectionRatio = entry.intersectionRatio;
      }
    });
    
    updateTOCHighlight();
  }, observerOptions);
  
  // 观察所有标题元素
  headings.forEach(heading => {
    observer.observe(heading);
  });
  
  function updateTOCHighlight() {
    // 重置所有状态
    tocItems.forEach(item => {
      item.link.classList.remove('highlight', 'highlight-bg-translucent', 'readed');
    });
    
    // 找到当前可见的章节
    const visibleItems = tocItems.filter(item => item.isVisible);
    
    if (visibleItems.length > 0) {
      // 如果有多个可见章节，选择交集比例最高的
      const mostVisible = visibleItems.reduce((prev, current) => 
        (current.intersectionRatio > prev.intersectionRatio) ? current : prev
      );
      
      const activeIndex = tocItems.indexOf(mostVisible);
      mostVisible.link.classList.add('highlight', 'highlight-bg-translucent');
      currentActiveIndex = activeIndex;
    } else {
      // 如果没有章节在视窗内，根据滚动位置推断
      const scrollY = window.pageYOffset;
      const headerOffset = 120;
      
      let bestMatch = -1;
      let minDistance = Infinity;
      
      tocItems.forEach((item, index) => {
        const rect = item.element.getBoundingClientRect();
        const elementTop = rect.top + scrollY;
        const distance = Math.abs((scrollY + headerOffset) - elementTop);
        
        if (scrollY + headerOffset >= elementTop && distance < minDistance) {
          minDistance = distance;
          bestMatch = index;
        }
      });
      
      if (bestMatch >= 0) {
        tocItems[bestMatch].link.classList.add('highlight', 'highlight-bg-translucent');
        currentActiveIndex = bestMatch;
      }
    }
    
    // 标记已滚动过的章节
    const scrollY = window.pageYOffset;
    const headerOffset = 120;
    
    tocItems.forEach((item, index) => {
      if (index < currentActiveIndex) {
        item.link.classList.add('readed');
        item.link.classList.remove('highlight', 'highlight-bg-translucent');
      }
    });
  }
  
  // 点击TOC链接平滑滚动
  tocItems.forEach(item => {
    item.link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetElement = document.getElementById(item.id);
      if (targetElement) {
        const headerOffset = 120;
        const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        
        // 滚动到目标位置
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // 初始化
  setTimeout(updateTOCHighlight, 200);
});