/**
 * Theme Toggle Functionality
 * 主题切换功能
 */

(function() {
  'use strict';

  // 获取当前主题
  function getCurrentTheme() {
    return localStorage.getItem('theme') || 'light';
  }

  // 设置主题
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeIcon(theme);
  }

  // 更新主题图标
  function updateThemeIcon(theme) {
    const icon = document.getElementById('theme-icon');
    if (!icon) return;

    if (theme === 'dark') {
      icon.className = 'fa-solid fa-moon';
      icon.title = '切换到亮色主题';
    } else {
      icon.className = 'fa-solid fa-sun';
      icon.title = '切换到暗色主题';
    }
  }

  // 切换主题
  function toggleTheme() {
    const currentTheme = getCurrentTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  }

  // 初始化
  function init() {
    // 设置初始主题
    const savedTheme = getCurrentTheme();
    setTheme(savedTheme);

    // 绑定所有主题切换按钮的点击事件
    document.addEventListener('click', function(e) {
      // 查找最近的主题切换按钮
      const button = e.target.closest('#theme-toggle button, .theme-toggle button');
      if (button) {
        e.preventDefault();
        toggleTheme();
      }
    });

    // 监听系统主题变化
    if (window.matchMedia) {
      const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      darkModeQuery.addListener(function(e) {
        // 如果用户没有手动设置过主题，则跟随系统
        if (!localStorage.getItem('theme')) {
          setTheme(e.matches ? 'dark' : 'light');
        }
      });
    }

    console.log('Theme toggle initialized');
  }

  // DOM加载完成后初始化
  if (document.readyState !== 'loading') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }

  // 导出到全局（如果需要）
  window.ThemeToggle = {
    toggle: toggleTheme,
    setTheme: setTheme,
    getCurrentTheme: getCurrentTheme
  };

})();