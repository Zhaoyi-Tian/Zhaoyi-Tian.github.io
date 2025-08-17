/**
 * Disable Greedy Navigation
 * This script must run BEFORE main.min.js to prevent the greedy navigation from running
 */

// Define updateNav as an empty function to prevent the greedy navigation from working
window.updateNav = function() {
  // Disabled - responsive-navigation.js handles the navigation
};

// Also prevent jQuery from binding the resize events for greedy nav
if (window.jQuery) {
  jQuery(function($) {
    // Remove any existing greedy nav event handlers
    $(window).off('resize.greedynav orientationchange.greedynav');
  });
}