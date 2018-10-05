$(document).ready(function () {
// Фиксация хедера при скролле
  $(window).scroll(function () {
    if ($(this).scrollTop() > 150) {
      $('body').addClass('head-is-fixed');
      $('.head-is-fixed').css('margin-top', $('.js-head').outerHeight(true));
    } else {
      $('.head-is-fixed').css('margin-top', 0);
      $('body').removeClass('head-is-fixed');
    }
  });

//Выпадающее меню
  $('.js-menu-bar').on('click', function () {
    $(this).toggleClass('is-active');
  });
});