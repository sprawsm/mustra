$(document).ready(function() {

  // Global variables

  var $window = $(window);
  var $body = $('body');
  var $anchors = $('a');
  var screenSm = 768;
  var debounceDelay = 250;
  var throttleDelay = 250;

  // ===========================================================================
  //
  // Sticky nav

  var $pageHeader = $('.page-header');
  var pageHeaderActiveClass = "page-header-active";
  var pageHeaderStaticClass = "page-header-static";
  var pageHeaderFixedClass = "page-header-fixed";
  var pageHeaderBreakpoint = $window.height() / 5;

  // Clone the header
  $pageHeader
    .clone()
    .appendTo('body')
    .addClass(pageHeaderFixedClass);

  // Apply a special class to the original
  $pageHeader.addClass(pageHeaderStaticClass);

  // Update page header position on init/scroll
  function updatePageHeaderPosition() {
    if ($window.scrollTop() > pageHeaderBreakpoint) {
      $body.addClass(pageHeaderActiveClass);
    } else {
      $body.removeClass(pageHeaderActiveClass);
    }
  }

  // ===========================================================================
  //
  // Smooth scroll-to links
  // Originally from http://stackoverflow.com/a/7717572/764886
  //
  // Example markup:
  //
  // <a href="#anchor" class="scroll-to">I will scroll</a>

  var $htmlAndBody = $('html, body');
  var $smoothScrollLinks = $('[data-scroll="smooth"]');
  var scrollDuration = 500;

  $smoothScrollLinks.on('click', function (e) {
    e.preventDefault();
    
    $htmlAndBody.animate({
        scrollTop: $($.attr(this, 'href')).offset().top
    }, scrollDuration);
  });

  // ===========================================================================
  //
  // Open external links in new window
  // Originally from https://css-tricks.com/snippets/jquery/open-external-links-in-new-window/

  $anchors.not('a[href*="mailto"]').each(function() {
     var a = new RegExp('/' + window.location.host + '/');

     if (!a.test(this.href)) {
       $(this).on('click', function(e) {
          e.preventDefault();
          e.stopPropagation();

          window.open(this.href, '_blank');
       });
     }
  });

  // ===========================================================================
  //
  // Hamburger menus
  // Activate the hamburger menu only on viewports narrower than 768px.
  // Note that you should handle all styles such as hiding, positioning,
  // and animations from CSS.
  //
  // Required styles:
  // .nav-hide { opacity: 0; height: 0; }
  //
  // Optional styles for animating the effect:
  // .nav-menu { transition: all 0.2s; }
  //
  // Example markup:
  //
  // <nav class="page-header-menu-wrap">
  //   <a href="#" class="hamburger">Show menu</a>
  //   <ul class="page-header-menu hamburgered">
  //     ...
  //   </ul>
  // </nav>

  var hamburgerSelector = '.hamburger';
  var hamburgeredClass = 'hamburgered';
  var pageHeaderMenuSelector = '.page-header-menu';

  function updateHamburgerVisibility() {
    var windowWidth = $window.width();

    if (windowWidth < screenSm) {

      $(pageHeaderMenuSelector).addClass(hamburgeredClass);

      $(hamburgerSelector)
        .off('click')
        .on('click', function (e) {
          e.preventDefault();
          
          $(pageHeaderMenuSelector).toggleClass(hamburgeredClass);
      });
    } else if (windowWidth > screenSm) {
      $(pageHeaderMenuSelector).show();
    }
  }

  // ===========================================================================
  // Equalizers

  // Equalize widths
  // Usage:
  // $('.equal-height').equalHeight();
  // $(window).resize(function() {
  //   $('.equal-height').css('height','auto');
  //   $('.equal-height').equalHeight();
  // });

  $.fn.equalWidth = function() {
      var maxWidth = 0;
      return this.each(function(index, box) {
          var boxWidth = $(box).width();
          maxWidth = Math.max(maxWidth, boxWidth);
      }).width(maxWidth);
  };

  // Equalize heights
  // Usage:
  // $('.equal-height').equalHeight();
  // $(window).resize(function() {
  //   $('.equal-height').css('height','auto');
  //   $('.equal-height').equalHeight();
  // });

  $.fn.equalHeight = function() {
      var maxHeight = 0;
      return this.each(function(index, box) {
          var boxHeight = $(box).height();
          maxHeight = Math.max(maxHeight, boxHeight);
      }).height(maxHeight);
  };

  // ===========================================================================
  // Messages

  var safMsg = $('.message.animated');

  safMsg.each(function() {
    var safMsgDismissStyle = $(this).attr('data-dismissable');
    $(this).click(function() {
      $(this).addClass(safMsgDismissStyle).delay(1000).queue(function(next) {
        $(this).hide();
        next();
      });
    });
  });


  // ===========================================================================
  // Bootstrap tabs update

  var tabHashPrefix = 'tab-';

  function afterTabShown(e) {
    e.preventDefault();

    // Update location hash
    var hash = e.target.hash.substr(1);

    if (hash === '') {
      hash = $(e.target).data('target').substr(1);
    }

    window.location.hash = tabHashPrefix +  hash;
  }

  // Select tabs from on location hash

  function selectTabFromLocationHash() {
    var hash = location.hash;

    if (hash === '') {
      return;
    }

    var $tab = $anchors.filter('[href="' + hash.replace(tabHashPrefix,'') + '"]');

    // If someone uses data-target instead of href for id
    if ($tab.length === 0) {
      $tab = $anchors.filter('[data-target="' + hash.replace('tab-','') + '"]');
    }

    $tab.tab('show');
  }

  // Detect Bootstrape tab shown event
  $('[data-toggle="tab"]').on('shown.bs.tab', afterTabShown);

  /**
   * Initialization
   */
  var init = function () {
    updatePageHeaderPosition();
    selectTabFromLocationHash();
    updateHamburgerVisibility();
  };

  var onResize = function () {
    updateHamburgerVisibility();
  };

  var onScroll = function () {
    updatePageHeaderPosition();
  };

  $window.on('resize', $.debounce(debounceDelay, onResize));

  $window.on('scroll', $.throttle(throttleDelay, onScroll));

  init();
});
