$(document).ready(function() {

  // ===========================================================================
  //
  // Controls for a tabbed interface
  // Originally from http://d.pr/DaUE
  // Adapted by Superawesøme: https://github.com/sprawsm/sprawsm-tabs
  //
  // Example markup:
  //
  // <div class="js-tabset">

  //   <ul class="js-tabset-nav" role="tablist">
  //     <li><a href="#tab1">Tab 1</a></li>
  //     <li><a href="#tab2">Tab 2</a></li>
  //     <li><a href="#tab3">Tab 3</a></li>
  //   </ul>

  //   <div class="js-tabset-container">
  //       <div id="tab1"><p>This is tab 1.</p></div>
  //       <div id="tab2"><p>This is tab 2.</p></div>
  //       <div id="tab3"><p>This is tab 3.</p></div>
  //   </div>

  // </div>

  $(function () {
    var tabNavLink = $('.js-tabset-nav a');
    $('.js-tabset-container > div').hide();
    tabNavLink.each(function() {
      $this = $(this);
      if ($this.parents('li').is(':first-child')) {
        $this.parent().addClass('active');
      }
    });
    $('.js-tabset-container > div').each(function() {
       $this = $(this);
      if ($this.is(':first-child')) {
        $this.fadeIn(100);
      }
    });
    tabNavLink.click(function () {
      var tabs = $(this).parents('.js-tabset').find('.js-tabset-container > div');
      tabs.hide();
      tabs.filter(this.hash).fadeIn(100);
      $(this).parents('.js-tabset-nav').children('li').removeClass('active');
      $(this).parents('li').addClass('active');
      return false;
    });
  });

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
  // <nav class="nav">
  //   <a href="#" class="hamburger">menu</a>
  //   <ul class="nav-menu">
  //     ...
  //   </ul>
  // </nav>

  function hamburger() {

    var windowWidth = $(window).width();

    if (windowWidth < 768) {

      $('.nav-menu').addClass('nav-menu-hide');

      $('.hamburger').unbind('click').click(function() {
        $('.nav-menu').toggleClass('nav-menu-hide');
        return false;
      });
    }
    else if (windowWidth > 768) {
      $('.nav-menu').show();
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
