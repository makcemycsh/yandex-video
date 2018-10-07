function is_touch_device() {
  return !!('ontouchstart' in window);
}

// Проверяем тип устройства
if (is_touch_device()) $(document.body).addClass('is-touch');
else $(document.body).addClass('no-touch');

class Handler {
  constructor(selector) {
    this.selector = $(selector);
    this.$imgWrap = $('.js-img-wrapper', this.selector);
    this.$img = $('img', this.$imgWrap);
    this.$scroll = $('.js-scroll', this.selector);

    this.height = this.$img.height();
    this.minHeight = this.$imgWrap.parent().height();

    this.left = 0;
    this.top = 0;
    this.oldLeft = 0;
    this.oldTop = 0;
    this.curPosX = 0;
    this.curPosY = 0;
    this.difX = 0;
    this.difY = 0;
    this.leftLim = 0;
    this.topLim = 0;

    this.events = [];
    this.distance = 0;

    this.zoom = false;
    this.lastTap = undefined;
    this.hendlPointerEvents(this.selector);
  }

  zoomImg() {
    if (this.zoom) {
      this.$img.height(this.height);
      this.zoom = !this.zoom;
    } else {
      this.height = this.$img.height();
      this.maxHeight = 2 * this.height;
      this.$img.height(this.maxHeight);
      this.getLim();
      this.zoom = !this.zoom;
    }
  }

  getLim() {
    this.topLim = (this.$imgWrap.height() - this.$imgWrap.parent().height()) / 2;
    this.leftLim = (this.$imgWrap.width() - this.$imgWrap.parent().width()) / 2;
  }

  checkLim() {
    this.top >= this.topLim ? this.top = this.topLim : '';
    this.top <= -this.topLim ? this.top = -this.topLim : '';

    this.left >= this.leftLim ? this.left = this.leftLim : '';
    this.left <= -this.leftLim ? this.left = -this.leftLim : '';
  }

  pointerMove(e) {
    if (this.events.length === 2) {
      console.log(e.identifier);
      $('.js-debag').append('<div>' + this.events + '</div>');

      let x1, y1, x2, y2;
      if (e.originalEvent.pointerId === this.events[0]) {
        x1 = e.clientX;
        y1 = e.clientY;
      } else if (e.originalEvent.pointerId === this.events[1]) {
        x2 = e.clientX;
        y2 = e.clientY;
      }
      $('.js-debag').append('<div>' + x1 + ' ' + y1 + ' ' + x2 + ' ' + y2 + '</div>');

      let curDistance = this.getDistance(x1, y1, x2, y2);
      $('.js-debag').append('<div>' + curDistance + '</div>');

      // if (curDistance !== this.distance) {
      //   let dif = curDistance - this.distance;
      //   let newHeight = this.$img.height + dif;
      //   this.$img.height(this.$img.height + dif);
      //   this.getLim();
      //   $('.js-debag').append('<div>' + dif + '</div>');
      //
      // }
    } else {

      this.left += e.clientX - this.oldLeft;
      this.top += e.clientY - this.oldTop;

      this.checkLim();
      this.$img.css('transform', 'translate(' + this.left + 'px, ' + this.top + 'px)');
      this.$scroll.css('left', this.moveScroll() + '%');
      this.oldLeft = e.clientX;
      this.oldTop = e.clientY;

    }
    // $('.js-debag').append('<div>' + e.pointerId + '</div>');
  }

  getDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
  }

  moveScroll() {
    let start = 15;
    let end = 85;
    let persent = (this.left + this.leftLim) * 100 / (this.leftLim * 2);
    persent = persent * 0.7 + start;
    persent > end ? persent = end : '';
    persent < start ? persent = start : '';
    return persent;
  }

  pointerDown(e) {
    console.log(e);
    console.log('pointerDown');
    let now = new Date().getTime();
    this.curPosX = e.clientX;
    this.curPosY = e.clientY;
    this.oldLeft = e.clientX;
    this.oldTop = e.clientY;
    this.getLim();

    let timesince = now - this.lastTap;
    if ((timesince < 300) && (timesince > 0)) this.zoomImg();
    this.lastTap = new Date().getTime();
    console.log(e.originalEvent);
    this.events.push(e.originalEvent.pointerId);
    console.log(this.events);
  }

  pointerUp(e) {
    this.events = this.events.filter((item) => item !== e.originalEvent.pointerId);
  }

  hendlPointerEvents(selector) {
    console.log('hendlPointerEvents');
    if (is_touch_device()) {
      selector.on('pointermove', e => this.pointerMove(e));
      selector.on('pointerdown', e => this.pointerDown(e));
      selector.on('pointerup', e => this.pointerUp(e));

    }
  }
}