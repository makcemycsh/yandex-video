"use strict";var _createClass=function(){function s(t,i){for(var e=0;e<i.length;e++){var s=i[e];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(t,s.key,s)}}return function(t,i,e){return i&&s(t.prototype,i),e&&s(t,e),t}}();function _classCallCheck(t,i){if(!(t instanceof i))throw new TypeError("Cannot call a class as a function")}function is_touch_device(){return!!("ontouchstart"in window)}is_touch_device()?$(document.body).addClass("is-touch"):$(document.body).addClass("no-touch");var Handler=function(){function i(t){_classCallCheck(this,i),this.selector=$(t),this.$imgWrap=$(".js-img-wrapper",this.selector),this.$img=$("img",this.$imgWrap),this.$scroll=$(".js-scroll",this.selector),this.$zoom=$(".js-zoom",this.selector),this.$brightness=$(".js-brightness",this.selector),this.height=void 0,this.newHeight=void 0,this.minHeight=300,this.maxHeight=1e3,this.left=0,this.top=0,this.oldLeft=0,this.oldTop=0,this.leftLim=0,this.topLim=0,this.brightness=50,this.events=[],this.distance=0,this.oldDistance=void 0,this.newDistamce=0,this.rotate=0,this.oldRotate=void 0,this.newRotate=0,this.zoom=!1,this.fixed=!1,this.lastTap=void 0,this.hendlPointerEvents(this.selector),this.handelRotate(0)}return _createClass(i,[{key:"checkLim",value:function(){this.top>=this.topLim&&(this.top=this.topLim),this.top<=-this.topLim&&(this.top=-this.topLim),this.left>=this.leftLim&&(this.left=this.leftLim),this.left<=-this.leftLim&&(this.left=-this.leftLim)}},{key:"handlePinch",value:function(){this.newHeight||(this.newHeight=this.$img.height()),this.distance=10*Math.sign(this.distance),this.newHeight+=this.distance,this.newHeight>=this.maxHeight&&(this.newHeight=this.maxHeight),this.newHeight<=this.minHeight&&(this.newHeight=this.minHeight),this.$img.height(this.newHeight),this.getLim(),this.moveScroll()}},{key:"handelRotate",value:function(t){this.brightness+=t,100<=this.brightness&&(this.brightness=100),this.brightness<=0&&(this.brightness=0),this.$brightness.html(this.brightness),this.changeBrightness(this.$img,this.brightness)}},{key:"zoomImg",value:function(){this.zoom?this.$img.height(this.height):(this.height=this.$img.height(),this.maxHeight=2*this.height,this.$img.height(this.maxHeight)),this.zoom=!this.zoom,this.getLim(),this.moveScroll(),this.changeZoom(this.$img,this.brightness)}},{key:"changeBrightness",value:function(t,i){t.css({"-webkit-filter":"brightness("+(i+50)+"%)",filter:"brightness("+(i+50)+"%)"})}},{key:"changeZoom",value:function(){var t=(.1*this.$img.height()).toFixed(0);$(this.$zoom).html(t)}},{key:"getLim",value:function(){this.topLim=(this.$imgWrap.height()-this.$imgWrap.parent().height())/2,this.leftLim=(this.$imgWrap.width()-this.$imgWrap.parent().width())/2}},{key:"getDistance",value:function(t,i,e,s){return Math.sqrt(Math.pow(e-t,2)+Math.pow(s-i,2))}},{key:"getAngle",value:function(t,i,e,s){return 180*Math.atan2(i-s,t-e)/Math.PI}},{key:"moveScroll",value:function(){var t=100*(this.left+this.leftLim)/(2*this.leftLim);85<(t=.7*t+15)&&(t=85),t<15&&(t=15),this.$scroll.css("left",t+"%")}},{key:"pointerDown",value:function(t){this.events.push({id:t.originalEvent.pointerId,clientX:t.clientX,clientY:t.clientY});var i=(new Date).getTime();if(this.oldLeft=t.clientX,this.oldTop=t.clientY,this.oldDistance=void 0,this.oldRotate=void 0,this.getLim(),2===this.events.length&&(this.fixed=!0),1===this.events.length){var e=i-this.lastTap;e<300&&0<e&&this.zoomImg(),this.lastTap=(new Date).getTime()}}},{key:"pointerMove",value:function(t){if(1!==this.events.length||this.fixed){if(2===this.events.length){var i=t.originalEvent.pointerId,e=this.events.filter(function(t){return t.id===i})[0];e.clientX=t.clientX,e.clientY=t.clientY;var s=this.events[0].clientX,h=this.events[0].clientY,n=this.events[1].clientX,o=this.events[1].clientY;this.newDistamce=this.getDistance(s,h,n,o),this.newRotate=this.getAngle(s,h,n,o),this.oldRotate||(this.oldRotate=this.newRotate),this.oldDistance||(this.oldDistance=this.newDistamce),this.rotate=this.newRotate-this.oldRotate,this.oldRotate=this.newRotate,this.distance=this.newDistamce-this.oldDistamce,this.oldDistamce=this.newDistamce,5<Math.abs(this.distance)&&this.handlePinch(),2<Math.abs(this.rotate)&&this.handelRotate(Math.sign(this.rotate))}}else this.left+=t.clientX-this.oldLeft,this.top+=t.clientY-this.oldTop,this.checkLim(),this.$img.css("transform","translate("+this.left+"px, "+this.top+"px)"),this.moveScroll(),this.oldLeft=t.clientX,this.oldTop=t.clientY;this.changeZoom()}},{key:"pointerUp",value:function(i){this.events=this.events.filter(function(t){return t.id!==i.originalEvent.pointerId}),0===this.events.length&&(this.fixed=!1)}},{key:"hendlPointerEvents",value:function(t){var i=this;is_touch_device()&&(t.on("pointermove",function(t){return i.pointerMove(t)}),t.on("pointerdown",function(t){return i.pointerDown(t)}),t.on("pointerup pointercancel pointerleave pointerout",function(t){return i.pointerUp(t)}))}}]),i}();
//# sourceMappingURL=pointerevents.js.map
