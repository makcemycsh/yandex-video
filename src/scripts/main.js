$(document).ready(handleEvents);

function handleEvents() {
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
}

$.getJSON("assets/json/events.json").done(function (data) {
  $.each(data.events, function (i, item) {
    template(item);
  });
  $('.js-pointer-event').each(function (i, e) {
    new Handler(e);
  })
});

function template(event) {
  let card = `<div class="b-card mod-${event.size}  ${event.type === 'critical' ? `mod-attention` : ''} ">
      <div class="b-card__head">
        <header>
          <i class="b-card__ico icon i-${event.icon}"></i>
          <h3 class="b-card__title">${event.title}</h3>
        </header>
        <div class="b-card__info">
          <span class="b-card__name">${event.source}</span>
          <span class="b-card__time">${event.time}</span>
        </div>
      </div>
      ${event.description || event.data ? dataMain(event) : ''}
      <button class="b-card__close"><i class="b-card__ico icon i-close"></i>
      </button>
      <a href="#" class="b-card__link">
        <i class="b-card__ico icon i-arrow-r"></i>
      </a>
    </div>`;
  insertHtml($('#js-card-list'), $(card));
}

function dataMain(data) {
  return `<div class="b-card__main">
      ${data.description ? `<p class='b-card__text'>${data.description}</p>` : ''}
      ${data.data ? dataTemplate(data.data) : ''}
      </div>`;
}

function dataTemplate(data) {
  return `${data.albumcover ? dataMusic(data) : ''}
  ${data.temperature ? dataWeather(data) : ''}
  ${data.buttons ? dataButtons(data) : ''}
  ${data.image ? dataImage(data) : ''}
  ${data.type === 'graph' ? dataGraph(data) : ''}`;
}

function dataGraph(data) {
  return `<div class="b-card__data">
           <picture>
            <source srcset="assets/img/Richdata.svg" type="image/svg+xml">
            <img src="assets/img/Richdata@2x.png" alt="yandex">
          </picture>
          </div>`
}

function dataImage(data) {
  return `<div class="b-card__data js-pointer-event">
          <div class="b-cam">
            <div class="b-cam__img">
            <div class="b-cam__wrapper js-img-wrapper">
            <img src="assets/img/card-1.png" alt="yandex"
               srcset="assets/img/card-1@x2.png 800w, assets/img/card-1@x3.png 1200w">
               </div>
                <div class="b-cam__scroll mod-only-touch js-scroll"></div>
               </div>
            <div class="b-cam__stat mod-only-touch">
              <span>Приближение: <span class="js-zoom">78</span>%</span>
              <span>Яркость: <span class="brightness">50</span>%</span>
            </div>
            </div>
           </div>`
}

function dataButtons(data) {
  return `<div class="b-card__data">
            <div class="b-card__btns">
                ${data.buttons.map(btn => ` <button class="b-btn ${btn === 'Да' ? `mod-yellow` : '' }">${btn}</button>`).join('')}
            </div>
          </div>`;
}

function dataWeather(data) {
  return `<div class="b-card__data">
            <div class="b-data-set">
              <div class="b-data-set__item">
                <p class="b-data-set__name">
                  Температура: <span class="b-data-set__val">${data.temperature} C</span>
                </p>
              </div>
              <div class="b-data-set__item">
                <p class="b-data-set__name">
                  Влажность: <span class="b-data-set__val">${data.humidity}%</span>
                </p>
              </div>
            </div>
          </div>`;
}

function dataMusic(data) {
  return `<div class="b-card__data"> 
           <div class="b-music">
            <div class="b-music__section">
              <div class="b-music__logo">
                <img src="${data.albumcover}" alt="${data.artist}">
              </div>
              <div class="b-music__info">
                <p class="b-music__name">
                 ${data.artist} - ${data.track.name}
                </p>
                <div class="b-music__duration">
                  <input id='range-1' type="range" name="volume"
                         min="0" max="100"/>
                  <label for="range-1">${data.track.length}</label>
                </div>
              </div>
            </div>
            <div class="b-music__section">
              <div class="b-music__controls">
                <button class="b-music__prev icon i-prev"></button>
                <button class="b-music__next icon i-next"></button>
                <div class="b-music__val">
                  <input id='range-2' type="range" name="volume"
                         min="0" max="100" value="${data.volume}"/>
                  <label for="range-2">${data.volume}%</label>
                </div>
              </div>
            </div>
          </div>
        </div>`;
}

function insertHtml($parent, $content) {
  $parent.append($content);
}
