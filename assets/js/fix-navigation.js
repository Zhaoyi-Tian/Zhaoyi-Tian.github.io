/**
 * Fix Navigation Display
 * This script fixes the navigation after greedy nav has incorrectly moved items
 */

(function() {
  'use strict';

  function fixNavigation() {
    const visibleLinks = document.querySelector('.visible-links');
    const hiddenLinks = document.querySelector('.hidden-links');
    
    if (!visibleLinks || !hiddenLinks) {
      console.log('Navigation elements not found');
      return;
    }

    // Move all items from hidden back to visible
    const allHiddenItems = Array.from(hiddenLinks.children);
    
    allHiddenItems.forEach(item => {
      // Skip if it's the mobile menu title that should stay in hidden menu
      if (!item.classList.contains('masthead__menu-item')) {
        return;
      }
      
      // Move the item back to visible links
      visibleLinks.appendChild(item);
    });

    // Hide the mobile menu button on desktop
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileToggle && window.innerWidth > 768) {
      mobileToggle.style.display = 'none';
    }

    console.log('Navigation fixed - items restored to visible menu');
  }

  // Run immediately when DOM is ready
  if (document.readyState !== 'loading') {
    setTimeout(fixNavigation, 100);
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(fixNavigation, 100);
    });
  }

  // Also run after a short delay to catch any late initialization
  setTimeout(fixNavigation, 500);
  
  // Run on window load as well
  window.addEventListener('load', fixNavigation);

  // Disable the updateNav function
  window.updateNav = function() {
    // Do nothing
  };

})();