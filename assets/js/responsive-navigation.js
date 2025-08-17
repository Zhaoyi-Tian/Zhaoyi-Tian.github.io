/**
 * Responsive Navigation Enhancement
 * 响应式导航菜单增强功能
 * 
 * 功能特性：
 * - 自适应桌面和移动端布局
 * - 平滑的动画过渡
 * - 支持键盘导航和无障碍访问
 * - 触摸友好的交互体验
 * - 自动关闭菜单功能
 * - 禁用原始greedy navigation行为
 */

(function() {
  'use strict';

  // DOM 元素选择器
  const selectors = {
    nav: '#site-nav',
    menuToggle: '.mobile-menu-toggle',
    visibleLinks: '.visible-links',
    hiddenLinks: '.hidden-links',
    siteTitle: '.site-title',
    navItems: '.nav-item',
    themeToggle: '.theme-toggle',
    externalLink: '.external-link'
  };

  // 配置选项
  const config = {
    mobileBreakpoint: 768,
    animationDuration: 300,
    keyCode: {
      ESCAPE: 27,
      ENTER: 13,
      SPACE: 32
    }
  };

  // 状态管理
  const state = {
    isMobile: false,
    isMenuOpen: false,
    elements: {}
  };

  /**
   * 初始化导航功能
   */
  function init() {
    // 禁用原始的greedy navigation
    disableOriginalGreedyNav();
    
    // 获取DOM元素
    cacheElements();
    
    // 检查必要元素是否存在
    if (!state.elements.nav) {
      console.warn('Navigation element not found');
      return;
    }

    // 设置初始状态
    updateLayout();
    
    // 绑定事件监听器
    bindEvents();

    // 设置无障碍访问属性
    setupAccessibility();

    console.log('Responsive navigation initialized');
  }

  /**
   * 禁用原始的greedy navigation行为
   */
  function disableOriginalGreedyNav() {
    // 覆盖全局的updateNav函数
    if (typeof window.updateNav === 'function') {
      window.updateNav = function() {
        // 空函数，禁用原始行为
        console.log('Original updateNav disabled');
      };
    }
    
    // 如果updateNav函数还未定义，预防性地定义它
    window.updateNav = function() {
      console.log('Original updateNav disabled');
    };
    
    // 移除原始的resize事件监听器（如果有的话）
    $(window).off('resize.greedynav orientationchange.greedynav');
  }

  /**
   * 缓存DOM元素引用
   */
  function cacheElements() {
    state.elements = {
      nav: document.querySelector(selectors.nav),
      menuToggle: document.querySelector(selectors.menuToggle),
      visibleLinks: document.querySelector(selectors.visibleLinks),
      hiddenLinks: document.querySelector(selectors.hiddenLinks),
      siteTitle: document.querySelector(selectors.siteTitle),
      navItems: document.querySelectorAll(selectors.navItems),
      themeToggle: document.querySelector(selectors.themeToggle),
      externalLink: document.querySelector(selectors.externalLink)
    };
  }

  /**
   * 绑定所有事件监听器
   */
  function bindEvents() {
    const { menuToggle } = state.elements;

    // 窗口大小改变事件
    window.addEventListener('resize', debounce(handleResize, 250));
    window.addEventListener('orientationchange', handleOrientationChange);

    // 菜单切换按钮事件
    if (menuToggle) {
      menuToggle.addEventListener('click', handleMenuToggle);
      menuToggle.addEventListener('keydown', handleMenuKeydown);
    }

    // 文档点击事件（用于关闭菜单）
    document.addEventListener('click', handleDocumentClick);
    
    // 键盘事件
    document.addEventListener('keydown', handleDocumentKeydown);

    // 阻止菜单内部点击事件冒泡
    if (state.elements.hiddenLinks) {
      state.elements.hiddenLinks.addEventListener('click', handleMenuClick);
    }
  }

  /**
   * 设置无障碍访问属性
   */
  function setupAccessibility() {
    const { menuToggle, hiddenLinks } = state.elements;
    
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-controls', 'hidden-navigation-menu');
    }

    if (hiddenLinks) {
      hiddenLinks.setAttribute('id', 'hidden-navigation-menu');
      hiddenLinks.setAttribute('role', 'menu');
    }
  }

  /**
   * 更新布局和显示状态
   */
  function updateLayout() {
    const wasMobile = state.isMobile;
    state.isMobile = window.innerWidth <= config.mobileBreakpoint;

    // 如果设备类型发生变化
    if (wasMobile !== state.isMobile) {
      if (state.isMobile) {
        setupMobileLayout();
      } else {
        setupDesktopLayout();
      }
    }
  }

  /**
   * 设置移动端布局
   */
  function setupMobileLayout() {
    moveLinksToMobile();
    
    // 确保菜单初始状态为关闭
    if (state.isMenuOpen) {
      closeMenu(false); // 不使用动画
    }
  }

  /**
   * 设置桌面端布局
   */
  function setupDesktopLayout() {
    moveLinksToDesktop();
    
    // 确保菜单关闭
    if (state.isMenuOpen) {
      closeMenu(false); // 不使用动画
    }
  }

  /**
   * 将导航项移动到移动端布局
   */
  function moveLinksToMobile() {
    const { visibleLinks, hiddenLinks, navItems, themeToggle, externalLink } = state.elements;
    
    if (!visibleLinks || !hiddenLinks) return;

    // 将导航项移到隐藏菜单，并添加适当的ARIA角色用于移动端菜单
    navItems.forEach(item => {
      if (item && visibleLinks.contains(item)) {
        // 为移动端菜单中的链接添加menuitem角色
        const link = item.querySelector('a');
        if (link) {
          link.setAttribute('role', 'menuitem');
        }
        
        hiddenLinks.appendChild(item);
      }
    });

    // 移动主题切换和外部链接
    if (themeToggle && visibleLinks.contains(themeToggle)) {
      const button = themeToggle.querySelector('button');
      if (button) {
        button.setAttribute('role', 'menuitem');
      }
      hiddenLinks.appendChild(themeToggle);
    }
    
    if (externalLink && visibleLinks.contains(externalLink)) {
      const link = externalLink.querySelector('a');
      if (link) {
        link.setAttribute('role', 'menuitem');
      }
      hiddenLinks.appendChild(externalLink);
    }
  }

  /**
   * 将导航项移动到桌面端布局
   */
  function moveLinksToDesktop() {
    const { visibleLinks, hiddenLinks, siteTitle } = state.elements;
    
    if (!visibleLinks || !hiddenLinks) return;

    // 获取所有隐藏菜单中的项目
    const hiddenItems = Array.from(hiddenLinks.children);
    
    // 按正确顺序移回可见菜单，并清除移动端ARIA角色
    hiddenItems.forEach(item => {
      if (item && hiddenLinks.contains(item)) {
        // 清除移动端菜单的ARIA角色
        const link = item.querySelector('a');
        const button = item.querySelector('button');
        
        if (link) {
          link.removeAttribute('role');
        }
        
        if (button) {
          button.removeAttribute('role');
        }
        
        visibleLinks.appendChild(item);
      }
    });
  }

  /**
   * 处理菜单切换
   */
  function handleMenuToggle(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!state.isMobile) return;

    if (state.isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  /**
   * 处理菜单按钮键盘事件
   */
  function handleMenuKeydown(event) {
    const { keyCode } = config;
    
    if (event.keyCode === keyCode.ENTER || event.keyCode === keyCode.SPACE) {
      event.preventDefault();
      handleMenuToggle(event);
    }
  }

  /**
   * 打开菜单
   */
  function openMenu() {
    const { menuToggle, hiddenLinks } = state.elements;
    
    state.isMenuOpen = true;
    
    if (hiddenLinks) {
      hiddenLinks.classList.remove('hidden');
    }
    
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'true');
    }

    // 焦点管理
    setTimeout(() => {
      const firstMenuItem = hiddenLinks?.querySelector('a');
      if (firstMenuItem) {
        firstMenuItem.focus();
      }
    }, 100);
  }

  /**
   * 关闭菜单
   */
  function closeMenu(animate = true) {
    const { menuToggle, hiddenLinks } = state.elements;
    
    state.isMenuOpen = false;
    
    if (hiddenLinks) {
      hiddenLinks.classList.add('hidden');
    }
    
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  }

  /**
   * 处理文档点击事件
   */
  function handleDocumentClick(event) {
    if (!state.isMobile || !state.isMenuOpen) return;

    const { nav } = state.elements;
    
    // 如果点击在导航栏外部，关闭菜单
    if (nav && !nav.contains(event.target)) {
      closeMenu();
    }
  }

  /**
   * 处理菜单内部点击
   */
  function handleMenuClick(event) {
    // 如果点击的是菜单链接，关闭菜单
    if (event.target.tagName === 'A') {
      closeMenu();
    }
  }

  /**
   * 处理文档键盘事件
   */
  function handleDocumentKeydown(event) {
    if (event.keyCode === config.keyCode.ESCAPE && state.isMenuOpen) {
      closeMenu();
      
      // 将焦点返回到菜单按钮
      const { menuToggle } = state.elements;
      if (menuToggle) {
        menuToggle.focus();
      }
    }
  }

  /**
   * 处理窗口大小改变
   */
  function handleResize() {
    updateLayout();
  }

  /**
   * 处理屏幕方向改变
   */
  function handleOrientationChange() {
    // 延迟执行以确保屏幕尺寸更新完成
    setTimeout(() => {
      updateLayout();
    }, 100);
  }

  /**
   * 防抖函数
   */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func.apply(this, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * DOM内容加载完成后初始化
   */
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  // 立即禁用greedy navigation，防止它运行
  disableOriginalGreedyNav();

  // 等待DOM和jQuery都准备好
  ready(function() {
    // 如果jQuery存在，等待它也准备好
    if (window.jQuery) {
      $(document).ready(init);
    } else {
      init();
    }
  });

  // 导出公共API（如果需要）
  window.ResponsiveNavigation = {
    init: init,
    openMenu: openMenu,
    closeMenu: closeMenu,
    updateLayout: updateLayout,
    disableOriginalGreedyNav: disableOriginalGreedyNav
  };

})();