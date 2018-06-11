/**
 * Drawer
 */
const Drawer = (($) => {
  const drawer = '.js-drawer';
  const $drawer = $('.js-drawer');
  const $toggle = $('[data-toggle="drawer"]');
  const $close = $('[data-dismiss="drawer"]');
  const visibilityClass = 'show';

  /**
   * Init
   */
  const init = () => {
    $(document).on('click', $toggle, toggle);
    $(document).on('click', $close, close);
  }

  /**
   * Toggle
   * @param {object} e
   */
  const toggle = (e) => {
    e.preventDefault();

    $($(e.target).attr('href')).toggleClass(visibilityClass);
  }

  /**
   * Open/Show
   */

  /**
   * Close/Hide
   * @param {object} e
   */
  const close = (e) => {
    e.preventDefault();

    $(e.target).closest(drawer).removeClass(visibilityClass);
  }

  /**
   * Return
   * @return {function}
   */
  return {
    init
  }
})(jQuery)

/**
 * Initialize on load
 */
Drawer.init();
