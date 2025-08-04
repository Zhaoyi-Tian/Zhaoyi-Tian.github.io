/*
 * Mobile Navigation Enhancement
 * 针对移动端优化的导航菜单功能
 * 在移动端自动将导航项移动到汉堡菜单中
 */

(function() {
  'use strict';

  var $nav = $('#site-nav');
  var $btn = $('#site-nav button');
  var $vlinks = $('#site-nav .visible-links');
  var $hlinks = $('#site-nav .hidden-links');
  var isMobile = window.innerWidth <= 768;

  function initMobileNavigation() {
    // 检查是否为移动端
    if (window.innerWidth <= 768) {
      // 移动端：将除首页和主题切换外的所有链接移到隐藏菜单
      moveLinksToHidden();
      // 确保按钮可见
      $btn.removeClass('hidden');
    } else {
      // 桌面端：将所有链接移回可见菜单
      moveLinksToVisible();
      // 隐藏按钮
      $btn.addClass('hidden');
    }
  }

  function moveLinksToHidden() {
    // 将所有非首页、非主题切换的链接移到隐藏菜单
    $vlinks.children('li:not(:first-child):not(.persist)').each(function() {
      $(this).appendTo($hlinks);
    });
    
    // 同时移动主题切换按钮到隐藏菜单
    $vlinks.children('li.persist.tail').appendTo($hlinks);
  }

  function moveLinksToVisible() {
    // 桌面端：将所有链接移回可见菜单，除了主题切换保持在最后
    var $themeToggle = $hlinks.children('li.persist.tail');
    
    // 先移动普通链接
    $hlinks.children('li:not(.persist)').each(function() {
      $(this).insertBefore($vlinks.children('li:first-child').next().length ? 
        $vlinks.children('li.persist.tail') : null);
    });
    
    // 最后移动主题切换按钮
    if ($themeToggle.length) {
      $themeToggle.appendTo($vlinks);
    }
  }

  // 处理窗口大小变化
  function handleResize() {
    var nowMobile = window.innerWidth <= 768;
    
    if (nowMobile !== isMobile) {
      isMobile = nowMobile;
      initMobileNavigation();
      
      // 如果切换到桌面端，确保隐藏菜单是关闭的
      if (!isMobile) {
        $hlinks.addClass('hidden');
        $btn.removeClass('close');
      }
    }
  }

  // 增强按钮点击处理
  function handleButtonClick() {
    $hlinks.toggleClass('hidden');
    $btn.toggleClass('close');
  }

  // 点击菜单外部关闭菜单
  function handleOutsideClick(event) {
    if (isMobile && !$hlinks.hasClass('hidden')) {
      if (!$(event.target).closest('.greedy-nav').length) {
        $hlinks.addClass('hidden');
        $btn.removeClass('close');
      }
    }
  }

  // 处理ESC键关闭菜单
  function handleEscKey(event) {
    if (event.keyCode === 27 && isMobile && !$hlinks.hasClass('hidden')) {
      $hlinks.addClass('hidden');
      $btn.removeClass('close');
    }
  }

  // 初始化
  $(document).ready(function() {
    initMobileNavigation();
    
    // 绑定事件
    $(window).on('resize orientationchange', handleResize);
    $btn.on('click', handleButtonClick);
    $(document).on('click', handleOutsideClick);
    $(document).on('keydown', handleEscKey);
    
    // 处理屏幕方向改变
    if (screen.orientation) {
      screen.orientation.addEventListener('change', handleResize);
    }
  });

})();