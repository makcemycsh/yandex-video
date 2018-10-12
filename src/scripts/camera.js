// toggleActiveState($('.js-camera'), 'mod-active');

$(document).keydown(function (e) {
  if (e.key === "Escape") clouseVideo();
});
$('.js-close').on('click', function () {clouseVideo()});
$('.js-camera').on('click', function () {
  if ($(this).attr('data-active') !== 'true') openVideo($(this));
});
$('.js-camera-brightness').on('input', function () {
  console.log($(this).val());
});

function openVideo($el) {
  $($el).attr('data-active', true);
  $('body').addClass('mod-video');
  moveCenter($($el));
}

function clouseVideo($el = $('.js-camera')) {
  $($el).attr('data-active', false);
  $('body').removeClass('mod-video');
  resetStyles($($el));
}

function toggleActiveState($el, mod, $parent) {
  if ($parent) {
    $($el).on('click', $($parent), function (e) {
      $(this).siblings().removeClass(mod);
      $(this).addClass(mod);
    });
  } else {
    $($el).on('click', function () {
      $($el).removeClass(mod);
      $(this).addClass(mod);
    });
  }
}

function removeActiveState($el, mod) {
  $($el).removeClass(mod);
}

function moveCenter($el) {
  let positionInfo = $($el)[0].getBoundingClientRect();
  let heightEl = positionInfo.height;
  let widthEl = positionInfo.width;
  let widthWindow = document.documentElement.clientWidth;
  let hightWindow = document.documentElement.clientHeight;

  let moveLeft = positionInfo.left - ((widthWindow - widthEl) / 2);
  let moveTop = positionInfo.top - ((hightWindow - heightEl) / 2);
  let scale = widthWindow / widthEl;
  console.log(scale);
  console.log(moveLeft);
  $($el).css({
    'transform': 'translate(' + -moveLeft + 'px, ' + -moveTop + 'px) scale(' + scale + ')',
    'z-index': '999'
  });
  console.log(positionInfo);
}

function resetStyles($el) {
  $($el).css({
    'transform': 'translate(0px, 0px) scale(1)',
    'z-index': '1'
  })
}