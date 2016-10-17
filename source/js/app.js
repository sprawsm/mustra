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
  // Sticky nav

  var ph = $('.page-header');
      activeClass = "page-header-active";
      breakpoint = $(window).height() / 5;
      clone = $('.page-header-fixed');

  // Clone the header
  ph.clone().appendTo('body').addClass('page-header-fixed');

  // Apply a special class to the original
  ph.addClass('page-header-static');

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
    console.log('click');
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
    console.log('update');
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
    panels.hide().attr('aria-hidden', 'true').filter(id).show().attr('aria-hidden', 'false');
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

  $('a').each(function() {
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

  // ========================================================================
  // Fluid video embeds
  // ========================================================================

  // Find all videos contained within iframes
  var $allVideos = $('iframe, object, embed'),

      // The element that is fluid width
      $fluidEl = $('.figure');

  // Figure out and save aspect ratio for each video
  $allVideos.each(function() {

    $(this)
      .attr('data-aspectRatio', this.height / this.width)

      // and remove the hard coded width/height
      .removeAttr('height')
      .removeAttr('width');

  });

  // When the window is resized
  $(window).resize(function() {

    var newWidth = $fluidEl.width();

    // Resize all videos according to their own aspect ratio
    $allVideos.each(function() {

      var $el = $(this);
      $el
        .width(newWidth)
        .height(newWidth * $el.attr('data-aspectRatio'));

    });

  // Kick off one resize to fix all videos on page load
  }).resize();

  // ========================================================================
  // Overlay Effect
  // ========================================================================

  // Usage Example:
  //
  //   <a href="#overlay-id" class="js-overlay-toggle">Toggle Overlay.</a>
  //
  //   <section id="overlay-id" class="overlay">
  //
  //      <a href="#overlay-id" class="js-overlay-close overlay-close">
  //        <svg class="icon overlay-close-icon">
  //          <use xlink:href="#icon-close" xmlns:xlink="http://www.w3.org/1999/xlink"/>
  //        </svg>
  //      </a>
  //
  //      <div class="overlay-content">
  //        Overlay content.
  //      </div>
  //
  //   </section>
  //
  // ========================================================================

  var overlayToggle = $('.js-overlay-toggle');
  var overlayClose = $('.js-overlay-close');
  var overlays = $('.overlay');
  var html = $('html');
  var overlayContent = $('.overlay-content');

  // Handle showing and hiding the modal

  overlayToggle.click(function(e) {

    // Disable scrolling on html
    html.addClass('js-overlay-active');

    // Show targeted overlay
    overlays.filter(this.hash).addClass('js-overlay-in');

    // Handle opening animations
    overlays.filter(this.hash).find(overlayContent).addClass('overlay-content--animated');
    overlays.filter(this.hash).find(overlayClose).addClass('overlay-close--animated');

    e.preventDefault();

  });

  // Close the overlay
  overlayClose.click(function(e) {

    // Re-enable scrolling on html
    html.removeClass('js-overlay-active');

    // Hide targeted overlay
    overlays.filter(this.hash).removeClass('js-overlay-in');

    // Clean up
    overlays.filter(this.hash).find(overlayContent).removeClass('overlay-content--animated');
    overlays.filter(this.hash).find(overlayClose).removeClass('overlay-close--animated');

    e.preventDefault();

  });

});
