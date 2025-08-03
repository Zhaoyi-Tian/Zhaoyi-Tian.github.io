// 强制显示所有导航项，禁用greedy navigation
document.addEventListener('DOMContentLoaded', function() {
  function forceShowAllNavItems() {
    const visibleLinks = document.querySelector('#site-nav .visible-links');
    const hiddenLinks = document.querySelector('#site-nav .hidden-links');
    const navButton = document.querySelector('#site-nav button');
    
    if (hiddenLinks && visibleLinks) {
      // 将所有隐藏的导航项移回到可见列表
      const hiddenItems = hiddenLinks.querySelectorAll('li');
      hiddenItems.forEach(item => {
        // 查找主题切换按钮
        const themeToggle = visibleLinks.querySelector('#theme-toggle');
        if (themeToggle) {
          // 在主题切换按钮之前插入
          visibleLinks.insertBefore(item, themeToggle);
        } else {
          // 如果没有主题切换按钮，就添加到末尾
          visibleLinks.appendChild(item);
        }
      });
    }
    
    // 强制隐藏下拉按钮
    if (navButton) {
      navButton.style.display = 'none';
      navButton.style.visibility = 'hidden';
    }
    
    // 强制隐藏下拉菜单
    if (hiddenLinks) {
      hiddenLinks.style.display = 'none';
      hiddenLinks.style.visibility = 'hidden';
    }
    
    // 确保可见链接容器使用flex布局
    if (visibleLinks) {
      visibleLinks.style.display = 'flex';
      visibleLinks.style.justifyContent = 'space-between';
      visibleLinks.style.alignItems = 'center';
      visibleLinks.style.width = '100%';
    }
  }
  
  // 立即执行
  forceShowAllNavItems();
  
  // 监听窗口大小变化，防止原始JavaScript重新隐藏导航项
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(forceShowAllNavItems, 100);
  });
  
  // 使用MutationObserver监听DOM变化
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        const hiddenLinks = document.querySelector('#site-nav .hidden-links');
        if (hiddenLinks && hiddenLinks.children.length > 0) {
          // 如果有项目被移到隐藏列表，立即移回
          forceShowAllNavItems();
        }
      }
    });
  });
  
  // 开始观察导航栏的变化
  const nav = document.querySelector('#site-nav');
  if (nav) {
    observer.observe(nav, {
      childList: true,
      subtree: true
    });
  }
  
  // 覆盖原始的updateNav函数
  if (typeof window.updateNav === 'function') {
    window.updateNav = forceShowAllNavItems;
  }
});