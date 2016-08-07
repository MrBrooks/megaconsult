/**************************************/
/* Custom JavaScript files supervisor */
/**************************************/

function d2(x1,y1,x2,y2){
  return Math.sqrt( Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2));
}

$(document).ready(function() {

  /*MY PLUGINS*/

  function WindowUpdater(opts){ 
    var self = this, timer;
    // var opt = [
    //   {
    //     event: 'scroll',
    //     actions: [] 
    //   },
    //   {
    //     event: 'resize',
    //     actions: []
    //   }s
    // ];
    self.add = function(event, func){
      for(var i = 0; i < opts.length; i++){
        if(opts[i].event === event){
          opts[i].actions.push(func);
          break;
        }
      }
    };

    self.update = function(event){
      clearTimeout(timer);
      timer = setTimeout(function(){
        // console.log(event);
        for(var i = 0; i < opts[event.data].actions.length; i++){
          opts[event.data].actions[i]();
        }
        //do smthng
      },50);
    };

    self.onEvents = function(){
      for(var i = 0; i < opts.length; i++){
        $(window).on(opts[i].event, i, self.update);
      }
    };

    // self.initScroll = function(){
    // };

    // self.initResize = function(){
    // };

    // self.initAll = function(){
    // };
    self.onEvents();
  }

  function FullHeight(){
    var items = $(".fullheight");

    this.update = function(){
      items.css('height', $(window).height());
    };

    this.update();
  }

  function AnimOnScroll(options){
    var def = {
      selector: ".scroll-anim",
      visible: "visible"
    };

    var self = this;
    var opt = $.extend(def, options);

    var select = $(opt.selector);
    var items = [];
    var H = $(window).height();

    
    function isHidden(elem){
      var ws = $(window).scrollTop();
      if( (elem.top >= ws + H) || (elem.top + elem.height <= ws)){
        return true;
      }
      return false;
    }

    function isVisible(elem){
      var ws = $(window).scrollTop();
      if( ((elem.top > ws) && (elem.top < ws+H)) || (elem.top + elem.height > ws && elem.top < ws)){
        return true;
      }
      return false;
    }

    function isFullyVisible(elem){
      var ws = $(window).scrollTop();
      if(elem.top > ws && elem.top + elem.height < ws + H){
        return true;
      }
      return false;
    }

    self.updateItems = function (){
      items = [];
      H = $(window).height();
      select.each(function(){
        items.push({
          item: $(this),
          top: $(this).offset().top,
          height: $(this).height()
        });
      });
    };

    self.updateView = function(){
      for(var i = 0; i < items.length; i++){
        if(!items[i].item.hasClass(opt.visible)){
          if(isVisible(items[i])){
            items[i].item.addClass(opt.visible);
          }
        }
      }
    };

    self.updateItems();
  }

  function videoPlayOnDrag(){
    var s = Snap("#canvas");
    // var s = Snap("#parashut");
    var parashut = Snap.load("../img/svg/action.svg", function ( loadedFragment ) {
      s.append( loadedFragment );
      callback();
    });
    var line, ring, drag;
    var video = document.getElementById("start-video");
    video.addEventListener("ended", scrollDown);
    var slogan1 = $("#slogan-1, #pulldown,#pulldown-arrow"),
        slogan2 = $("#slogan-2");

    function callback(){
      ring = s.select("#ring");
      line = s.select("#line");
      drag = new Drag();
      ring.drag(drag.move, drag.start, drag.stop);
    }

    function scrollDown(){
      // console.log("scrollDown");
      video.currentTime = 0;
      $(video).hide();
      $("html, body").animate({
        scrollTop: $(window).height()
      },500, restart);
    }

    function restart(){
      // console.log("Restart!");
      slogan1.addClass("visible").css({
        opacity: 1,
        top: 0
      });
      slogan2.removeClass("visible");
      drag.showControl();
    }

    function returnToStart(){
      var dur = 300;
      line.animate({
        x2: -255,
        y2: 423
      },dur,mina.elastic);
      ring.animate({
        transform: new Snap.Matrix()
      },dur,mina.elastic);
    }

    this.scrollControl = function (){
      if($(window).scrollTop() > $(window).height()){
        $(video).hide();
        video.pause();
      } else{
        $(video).show();
        restart();
      }
    };

    function playVideo(){
      video.play();
    }

    function Drag(){
      var self = this;
      var startBBox, endBBox;

      self.move = function(dx,dy) {
        var box = this.attr({
          transform: this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [dx, dy]
        }).getBBox();
        line.attr({
          x2: box.cx,
          y2: box.y
        });
        var d = d2(dx,dy,0,0);
        // video.currentTime = d2(dx,dy,0,0)/100;

        if(d < 20){
          slogan1.css({
            opacity: Math.max(1 - d/18, 0),
            top: 100*Math.max(d/18, 0)
          });
          // console.log("More!");
        } else{
          // console.log("Enough!");
        }
      };
      self.start = function() {
        this.data('origTransform', this.transform().local );
        startBBox = this.getBBox();
      };

      self.stop = function() {
        // console.log(this.getBBox());
        endBBox = this.getBBox();
        returnToStart(startBBox);
        if( d2(startBBox.x, startBBox.y, endBBox.x, endBBox.y) < 20 ){
          // console.log("Мало!");
          
        } else{
          playVideo();
          slogan1.removeClass("visible").css("opacity",0);

          s.animate({
            opacity: 0
          }, 500);
          setTimeout(function(){
            slogan2.addClass("visible");
          },2000);
        }
      };

      self.showControl = function(){
        s.animate({
          opacity: 1
        },500);
      };

    }
  }

  function Calculator(){
    var form = $("#calculator");
    var radios = form.find("input[type='radio']"),
        result = form.find("#result");
    
    var relations = ["<span>7 500 Р.</span> в месяц","<span>15 000 Р.</span> в месяц","<span>25 000 Р.</span> в месяц","<span>35 000 Р.</span> в месяц","<span>50 000 Р.</span> в месяц","<span>ОБСУДИМ!</span> &nbsp;","<span>45 000 Р.</span> в месяц"];

    function calculate(){
      result.html(relations[parseInt($(this).val())]);
    }
    radios.on("change", calculate);
  }

  /*
  =====================================
  INIT SCROLL & RESIZE PLUGINS
  =====================================
  */

  var anim_on_scroll = new AnimOnScroll();
  var full_height = new FullHeight();
  var video_play = new videoPlayOnDrag();
  /*
  =====================================
  INIT WINDOW UPDATER
  =====================================
  */

  var window_updater = new WindowUpdater([
    {
      event: "scroll",
      actions: [anim_on_scroll.updateView, video_play.scrollControl]
    },
    {
      event: "resize",
      actions: [anim_on_scroll.updateItems, full_height.update]
    }
  ]);

  /*
  =====================================
  FUNCTIONS EXECUTE
  =====================================
  */

  

  /*
  =====================================
  OTHER CODE
  =====================================
  */

  $("#phone").mask('+0 (000) 000-00-00');
  var calc = new Calculator();
  $(window).trigger("scroll");

  $('#call-back').submit(function(){
    var form = $(this), error = false;
    var btn = form.find('input[type="submit"]');
    

    form.find('.field-group>input').each( function(){
      if ($(this).val() === '') {
        $(this).addClass("invalid");
        error = true;
      }
      else{
        $(this).removeClass("invalid");
      }
    });
    if (!error){
      btn.attr('disabled', 'disabled');
      var data = form.serialize();
      $.ajax({
         type: 'POST',
         url: 'send.php',
         dataType: 'json',
         data: data, 
           beforeSend: function(data) { 
              btn.text("Идет отправка...");
            },
           success: function(data){ 
            if (data['error']) { 
              btn.text("Ошибка");
              btn.prop('disabled', false);
            } else {
              btn.text("Отправлено");
              btn.prop('disabled', false);
            }
           },
           error: function (xhr, ajaxOptions, thrownError) {
            btn.text("Ошибка");
            btn.prop('disabled', false);
            alert(xhr.status); 
            alert(xhr.responseText);
            alert(thrownError);
           },
           complete: function(data) {
            btn.prop('disabled', false);
           }
           });
    }
    return false;
  });
});

function initMap() {
  var map;
  var image = 'img/images/icon-2.png';
  map = new google.maps.Map(document.getElementById('google-map'), {
    center: new google.maps.LatLng(59.941720, 30.365481),
    zoom: 15,
    scrollwheel: false
  });
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(59.941720, 30.365481),
    map: map,
    icon: image
  });
}
