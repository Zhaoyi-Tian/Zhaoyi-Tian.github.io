/*
 * Smart Navigation - 智能导航栏折叠功能
 * 实现右对齐导航项和响应式折叠下拉菜单
 */

(function() {
    'use strict';

    var $nav = $('#site-nav');
    var $btn = $('#site-nav button');
    var $vlinks = $('#site-nav .visible-links');
    var $hlinks = $('#site-nav .hidden-links');
    var $leftItem = $vlinks.children('.persist.left');
    var $tailItem = $vlinks.find('.persist.tail');

    var breaks = [];
    var isInitialized = false;

    // 获取所有非固定的导航项（右侧导航项）
    function getRightNavItems() {
        return $vlinks.children('li.right-nav-item:not(.persist)');
    }

    // 计算可用空间
    function getAvailableSpace() {
        var navWidth = $nav.width();
        var leftItemWidth = $leftItem.outerWidth(true) || 0;
        var tailItemWidth = $tailItem.outerWidth(true) || 0;
        var buttonWidth = $btn.hasClass('hidden') ? 0 : $btn.outerWidth(true) + 10;
        
        return navWidth - leftItemWidth - tailItemWidth - buttonWidth - 40; // 40px 边距
    }

    // 计算右侧导航项的总宽度
    function getRightNavWidth() {
        var totalWidth = 0;
        getRightNavItems().each(function() {
            totalWidth += $(this).outerWidth(true);
        });
        return totalWidth;
    }

    // 更新导航栏
    function updateNav() {
        if (!isInitialized) {
            initializeNav();
            isInitialized = true;
        }

        var availableSpace = getAvailableSpace();
        var rightNavItems = getRightNavItems();

        // 如果右侧导航项溢出，需要折叠
        if (getRightNavWidth() > availableSpace && rightNavItems.length > 0) {
            
            while (getRightNavWidth() > availableSpace && getRightNavItems().length > 0) {
                // 记录当前宽度
                breaks.push(getRightNavWidth());
                
                // 将最后一个非固定项移动到隐藏列表
                var $lastItem = getRightNavItems().last();
                $lastItem.prependTo($hlinks);
                
                // 显示下拉按钮
                $btn.removeClass('hidden');
                
                // 重新计算可用空间
                availableSpace = getAvailableSpace();
            }

        } else {
            // 如果有空间，将隐藏的项目移回可见列表
            while (breaks.length > 0 && availableSpace > breaks[breaks.length - 1] && $hlinks.children().length > 0) {
                // 将第一个隐藏项移回到尾部项之前
                var $hiddenItem = $hlinks.children().first();
                $hiddenItem.addClass('right-nav-item');
                $hiddenItem.insertBefore($tailItem);
                breaks.pop();
                
                availableSpace = getAvailableSpace();
            }

            // 如果没有hidden items，则隐藏按钮
            if ($hlinks.children().length === 0) {
                $btn.addClass('hidden');
                $btn.removeClass('close');
                $hlinks.addClass('hidden');
            }
        }

        // 更新按钮计数器
        $btn.attr('count', $hlinks.children().length);

        // 更新masthead高度和body/sidebar的top padding
        updateMastheadPadding();
    }

    // 初始化导航栏
    function initializeNav() {
        // 确保按钮初始是隐藏的
        $btn.addClass('hidden');
        $hlinks.addClass('hidden');
        
        // 清空breaks数组
        breaks = [];
    }

    // 更新masthead高度和padding
    function updateMastheadPadding() {
        var mastheadHeight = $('.masthead').height();
        $('body').css('padding-top', mastheadHeight + 'px');
        
        if ($('.author__urls-wrapper button').is(':visible')) {
            $('.sidebar').css('padding-top', '');
        } else {
            $('.sidebar').css('padding-top', mastheadHeight + 'px');
        }
    }

    // 事件监听器
    $(window).on('resize', function() {
        updateNav();
    });

    // 处理屏幕方向变化
    if (screen.orientation) {
        screen.orientation.addEventListener('change', function() {
            setTimeout(updateNav, 100); // 延迟执行以确保布局完成
        });
    }

    // 下拉按钮点击事件
    $btn.on('click', function(e) {
        e.preventDefault();
        $hlinks.toggleClass('hidden');
        $(this).toggleClass('close');
    });

    // 点击其他地方关闭下拉菜单
    $(document).on('click', function(e) {
        if (!$(e.target).closest('#site-nav').length) {
            $hlinks.addClass('hidden');
            $btn.removeClass('close');
        }
    });

    // 初始化
    $(document).ready(function() {
        // 延迟执行以确保所有元素都已渲染
        setTimeout(function() {
            updateNav();
        }, 100);
    });

})();