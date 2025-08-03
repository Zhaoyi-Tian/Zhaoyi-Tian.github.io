// 导航栏自动隐藏功能
document.addEventListener('DOMContentLoaded', function() {
  const masthead = document.querySelector('.masthead');
  if (!masthead) return;
  
  let lastScrollTop = 0;
  let scrollThreshold = 100; // 滚动阈值，避免微小滚动触发
  let hideTimeout;
  
  // 节流函数
  function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  function handleScroll() {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // 在页面顶部时始终显示导航栏
    if (currentScrollTop <= 0) {
      masthead.classList.remove('masthead-hidden');
      masthead.classList.add('masthead-visible');
      return;
    }
    
    // 计算滚动方向
    const scrollDirection = currentScrollTop > lastScrollTop ? 'down' : 'up';
    const scrollDistance = Math.abs(currentScrollTop - lastScrollTop);
    
    // 只有在滚动距离超过阈值时才处理
    if (scrollDistance > scrollThreshold) {
      if (scrollDirection === 'down') {
        // 向下滚动，隐藏导航栏
        masthead.classList.add('masthead-hidden');
        masthead.classList.remove('masthead-visible');
      } else {
        // 向上滚动，显示导航栏
        masthead.classList.remove('masthead-hidden');
        masthead.classList.add('masthead-visible');
      }
      
      lastScrollTop = currentScrollTop;
    }
  }
  
  // 使用节流函数绑定滚动事件
  const throttledScroll = throttle(handleScroll, 16); // 约60fps
  window.addEventListener('scroll', throttledScroll);
  
  // 鼠标移到页面顶部时显示导航栏
  document.addEventListener('mousemove', function(e) {
    if (e.clientY <= 100) { // 鼠标在顶部100px内
      masthead.classList.remove('masthead-hidden');
      masthead.classList.add('masthead-visible');
    }
  });
  
  // 初始化状态
  masthead.classList.add('masthead-visible');
});