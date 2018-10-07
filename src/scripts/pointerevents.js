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
    this.$zoom = $('.js-zoom', this.selector);
    this.$brightness = $('.js-brightness', this.selector);

    this.height = this.$img.height();
    this.minHeight = 300;
    this.maxHeight = 1000;

    this.left = 0;
    this.top = 0;
    this.oldLeft = 0;
    this.oldTop = 0;
    this.leftLim = 0;
    this.topLim = 0;
    this.brightness = 50;

    this.events = [];
    this.distance = 0;
    this.oldDistance = undefined;
    this.newDistamce = 0;

    this.rotate = 0;
    this.oldRotate = undefined;
    this.newRotate = 0;


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
      this.zoom = !this.zoom;
    }
    this.getLim();
    this.moveScroll();
    this.setBrightness();
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

  handlePinch() {
    // this.distance = this.newDistamce - this.oldDistance;
    if (this.$img.height() + this.distance >= this.maxHeight) this.$img.height(this.maxHeight);
    else if (this.$img.height() + this.distance <= this.minHeight) this.$img.height(this.minHeight);
    else {this.$img.height(this.$img.height() + this.distance);}

    // this.oldDistance = this.newDistamce;
    this.getLim();
    this.moveScroll();
    // $('.js-debag').append('<div>' + this.$img.height() + '</div>');

  }

  handelRotate(change) {
    this.brightness += change;
    if (this.brightness >= 100) this.brightness = 100;
    if (this.brightness <= 0) this.brightness = 0;
    this.$brightness.html(this.brightness);
    this.changeBrightness(this.$img, this.brightness);

  }

  // Меняем яркость от 50 до 150
  changeBrightness(selector, val) {
    selector.css({
      "-webkit-filter": "brightness(" + (val + 50) + "%)",
      "filter": "brightness(" + (val + 50) + "%)"
    })
  }

  setBrightness() {
    let zoom = (this.$img.height() * 0.1).toFixed(0);
    $(this.$zoom).html(zoom);
  }

  pointerMove(e) {
    if (this.events.length === 1) {

      this.left += e.clientX - this.oldLeft;
      this.top += e.clientY - this.oldTop;

      this.checkLim();
      this.$img.css('transform', 'translate(' + this.left + 'px, ' + this.top + 'px)');
      this.moveScroll();

      this.oldLeft = e.clientX;
      this.oldTop = e.clientY;

    } else if (this.events.length === 2) {
      let curId = e.originalEvent.pointerId;
      let curObj = this.events.filter(item => item.id === curId)[0];
      curObj.clientX = e.clientX;
      curObj.clientY = e.clientY;

      let x1 = this.events[0].clientX;
      let y1 = this.events[0].clientY;
      let x2 = this.events[1].clientX;
      let y2 = this.events[1].clientY;

      if (!this.oldRotate) this.oldDistance = this.getAngle(x1, y1, x2, y2);
      if (!this.oldDistance) this.oldDistance = this.getDistance(x1, y1, x2, y2);

      this.newRotate = this.getAngle(x1, y1, x2, y2);
      this.rotate = this.newRotate - this.oldRotate;
      this.oldRotate = this.newRotate;
      // this.brightness

      this.newDistamce = this.getDistance(x1, y1, x2, y2);
      this.distance = this.newDistamce - this.oldDistamce;
      this.oldDistamce = this.newDistamce;

      // $('.js-debag').append('<div>Rotate: ' + th/is.rotate + '</div>');
      // $('.js-debag').append('<div>Distance: ' + this.distance + '</div>');

      //Отделяем поворот от зума
      Math.abs(this.distance) > 5 && this.handlePinch();
      Math.abs(this.rotate) > 3 && this.handelRotate(Math.sign(this.rotate));

    }
    this.setBrightness();
  }

  getDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
  }

  getAngle(x1, y1, x2, y2) {
    return Math.atan2(y1 - y2, x1 - x2) * 180 / Math.PI;
  }

  moveScroll() {
    let start = 15;
    let end = 85;
    let persent = (this.left + this.leftLim) * 100 / (this.leftLim * 2);
    persent = persent * 0.7 + start;
    persent > end ? persent = end : '';
    persent < start ? persent = start : '';
    this.$scroll.css('left', persent + '%');
  }

  pointerDown(e) {
    this.events.push({
      id: e.originalEvent.pointerId,
      clientX: e.clientX,
      clientY: e.clientY
    });
    let now = new Date().getTime();
    this.curPosX = e.clientX;
    this.curPosY = e.clientY;
    this.oldLeft = e.clientX;
    this.oldTop = e.clientY;
    this.oldDistance = undefined;
    this.oldRotate = undefined;

    this.getLim();
    if (this.events.length === 1) {
      let timesince = now - this.lastTap;
      if ((timesince < 300) && (timesince > 0)) this.zoomImg();
      this.lastTap = new Date().getTime();
    }
  }

  pointerUp(e) {
    this.events = this.events.filter((item) => item.id !== e.originalEvent.pointerId);
  }

  hendlPointerEvents(selector) {
    if (is_touch_device()) {
      selector.on('pointermove', e => this.pointerMove(e));
      selector.on('pointerdown', e => this.pointerDown(e));
      selector.on('pointerup pointercancel pointerleave pointerout', e => this.pointerUp(e));

    }
  }
}