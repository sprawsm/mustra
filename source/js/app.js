$(document).ready(function() {

  // Global variables

  var screenSm = 768;

  // ===========================================================================
  //
  // Dropdowns

  $('.dropdown-toggle').click(function() {
    $(this).parents('.dropdown').toggleClass('dropdown-active');
    return false;
  });

  // ===========================================================================
  //
  // Debouncing function, source: Underscore.js
  //
  // Use this function for stuff like scrolling effects, or window resizing.
  //
  // Example:
  //
  // var pageScroll = debounce(function() {
  // $(window).scroll(function() {
  // ... your taxing stuff goes here
  // }
  // }, 250);
  //
  // window.addEventListener('scroll', pageScroll);

  function debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };

  // ===========================================================================
  //
  // Sticky nav

  var ph = $('.page-header');
      activeClass = "page-header-active";
      breakpoint = $(window).height() / 5;
      clone = $('.page-header-fixed');

  // Clone the header
  ph.clone().appendTo('body').addClass('page-header-fixed');

  // Apply a special class to the original
  ph.addClass('page-header-static');

  var pageScroll = debounce(function() {
    $(window).scroll(function() {
      if( $(this).scrollTop() > breakpoint ) {
        $('body').addClass(activeClass);
      } else {
        $('body').removeClass(activeClass);
      }
    });
  }, 150);

  window.addEventListener('scroll', pageScroll);

  // ===========================================================================
  //
  // Controls for a tabbed interface
  // Originally from https://24ways.org/2015/how-tabs-should-work/
  //
  // Example markup:
  //
  // <ul role="tablist" class="tabs">
  //   <li><a role="tab" class="tab" aria-controls="tab-1" href="#tab-1">Tab 1</a></li>
  //   <li><a role="tab" class="tab" aria-controls="tab-2" href="#tab-2">Tab 2</a></li>
  //   <li><a role="tab" class="tab" aria-controls="tab-3" href="#tab-3">Tab 3</a></li>
  // </ul>
  // <div role="tabpanel" class="panel" id="tab-1">
  // ... tab 1 ...
  // </div>
  // <div role="tabpanel" class="panel" id="tab-2">
  // ... tab 2 ...
  // </div>
  // <div role="tabpanel" class="panel" id="tab-3">
  // ... tab 3 ...
  // </div>

  // a temp value to cache what we're about to show
  var target = null;

  // collect all the tabs
  var tabs = $('.tab').on('click', function () {
    // console.log('click');
    target = $(this.hash).removeAttr('id');
    if (location.hash === this.hash) {
      setTimeout(update);
    }
  }).attr('tabindex', '0');

  // get an array of the panel ids (from the anchor hash)
  var targets = tabs.map(function () {
    return this.hash;
  }).get();

  // use those ids to get a jQuery collection of panels
  var panels = $(targets.join(',')).each(function () {
    // keep a copy of what the original el.id was
    $(this).data('old-id', this.id);
  });

  function update() {
    // console.log('update');
    if (target) {
      target.attr('id', target.data('old-id'));
      target = null;
    }

    var hash = window.location.hash;
    if (targets.indexOf(hash) !== -1) {
      return show(hash);
    }

    if (!hash) {
      show();
    }
  }

  function show(id) {
    // if no value was given, let's take the first panel
    if (!id) {
      id = targets[0];
    }
    // remove the selected class from the tabs,
    // and add it back to the one the user selected
    tabs.removeClass('active').attr('aria-selected', 'false').filter(function () {
      return (this.hash === id);
    }).addClass('active').attr('aria-selected', 'true');

    // now hide all the panels, then filter to
    // the one we're interested in, and show it
    panels.removeClass('active').attr('aria-hidden', 'true').filter(id).addClass('active').attr('aria-hidden', 'false');
  }

  window.addEventListener('hashchange', update);

  // initialise
  if (targets.indexOf(window.location.hash) !== -1) {
    update();
  } else {
    show();
  }

  // ===========================================================================
  //
  // Smooth scroll-to links
  // Originally from http://stackoverflow.com/a/7717572/764886
  //
  // Example markup:
  //
  // <a href="#anchor" class="scroll-to">I will scroll</a>

  var smoothScrollLink = $('[data-scroll="smooth"]');

  smoothScrollLink.click(function(){
    $('html, body').animate({
        scrollTop: $( $.attr(this, 'href') ).offset().top
    }, 500);
    return false;
  });

  // ===========================================================================
  //
  // Open external links in new window
  // Originally from https://css-tricks.com/snippets/jquery/open-external-links-in-new-window/

  $('a').not('a[href*="mailto"]').each(function() {
     var a = new RegExp('/' + window.location.host + '/');
     if(!a.test(this.href)) {
         $(this).click(function(event) {
             event.preventDefault();
             event.stopPropagation();
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

  function hamburger() {

    var windowWidth = $(window).width();

    if (windowWidth < screenSm) {

      $('.page-header-menu').addClass('hamburgered');

      $('.hamburger').unbind('click').click(function() {
        $('.page-header-menu').toggleClass('hamburgered');
        return false;
      });
    }
    else if (windowWidth > screenSm) {
      $('.page-header-menu').show();
    }

  }

  hamburger();

  $(window).resize(hamburger);

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
});
