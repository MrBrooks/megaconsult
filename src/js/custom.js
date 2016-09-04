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
        if(event.data !== null){
          for(var i = 0; i < opts[event.data].actions.length; i++){
            opts[event.data].actions[i]();
          }
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
    var H = $(window).height(), if_mobile = $(window).width() < 768? true : false;

    
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

    if(if_mobile){
      select.addClass(opt.visible);
    }
  }

  function videoPlayOnDrag(){
    var s = Snap("#canvas");
    // var s = Snap("#parashut");
    var parashut = Snap.load("img/svg/action.svg", function ( loadedFragment ) {
      s.append( loadedFragment );
      callback();
    });
    var line, ring, drag;
    var video = document.getElementById("start-video");
    video.addEventListener("ended", scrollDown);
    var slogan1 = $("#slogan-1, #pulldown,#pulldown-arrow"),
        slogan2 = $("#slogan-2"),
        tonner = $("#tonner");

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
      if($(window).scrollTop() < 10){
        $("html, body").animate({
          scrollTop: $(window).height()
        },750, restart);
      }
      // $("body").removeClass("noscroll");
      tonner.css({
        opacity: 1
      });
    }

    function restart(){
      // console.log("Restart!");
      slogan1.addClass("visible").css({
        opacity: 1,
        top: 0
      });
      slogan2.removeClass("visible");
      if(drag){
        drag.showControl();
      }
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
      // if($(window).scrollTop() > $(window).height()){
      //   $(video).hide();
      //   video.pause();
      // } else{
      //   $(video).show();
      //   restart();
      // }
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

        // if(d < 20){
          slogan1.css({
            opacity: Math.max(1 - d/18, 0),
            top: 100*Math.max(d/18, 0)
          });
          tonner.css({
            opacity: Math.max(1 - d/18, 0)
          });
          // console.log("More!");
        // } else{
          // console.log("Enough!");
        // }
      };
      self.start = function() {
        this.data('origTransform', this.transform().local );
        startBBox = this.getBBox();
        yaCounter38125720.reachGoal('Кнопка №10');
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
          },1000);
        }
      };

      self.showControl = function(){
        s.animate({
          opacity: 1
        },500);
      };

    }
  }
  function initEcontentaEvent(){ //copy-paste from main site, sorry for this code

    $(".zakaz_pixel").click(function(){
      window.econtenta.track({
        source: '8953b17',
        action: 'service_booking'
      });
    });
    $(".email-submit").click(function(){
      window.econtenta.track({
        source: '8953b17',
        action: 'email_signup'
      });
    });

    $(".vk").click(function(){
      window.econtenta.track({
        source: '8953b17',
        action: 'go_vk'
      });
    });

    $(".zakaz_pixel_confirmed").click(function(){
      window.econtenta.track({
        source: '8953b17',
        action: 'service_booking_confirm'
      });
    });

    $(".fb").click(function(){
      window.econtenta.track({
        source: '8953b17',
        action: 'go_fb'
      });
    });

    $(".no-pc-tel").click(function(){
      window.econtenta.track({
        source: '8953b17',
        action: 'contact_phone'
      });
    });
    // var scroll_full = false;
    // $(window).on('scroll',function(event) {
    //   if($(window).scrollTop() + $(window).height() == $(document).height()) {
    //     // scroll_full = true;
    //     window.econtenta.track({
    //       source: '8953b17',
    //       action: 'page_scroll_full'
    //     });
    //     $( this ).off( event );
    //   }
    // });

    // $(window).on('scroll',function(event) {
    //   if($(window).scrollTop() >= parseInt($(document).height()/2)) {
    //     window.econtenta.track({
    //       source: '8953b17',
    //       action: 'page_scroll_middle'
    //     });
    //     $( this ).off( event );
    //   }
    // });

    setTimeout(function(){
        window.econtenta.track({
        source: '8953b17',
        action: 'page_stay_4_min'
    });
    }, 240000);

    $(window).on('beforeunload', function(){
      window.econtenta.track({
        source: '8953b17',
        action: 'page_close'
      });
    });
    window.onload = function() {
      window.econtenta.track({
        source: '8953b17',
        action: 'page_view'
      });
    }
    var full = false, half = false;
    this.checkScrollConditions = function(){
      var s = $(window).scrollTop(),
          d = $(document).height(), 
          h = $(window).height();
      if (!full){
        if(s + h > d-30) {
          full=true;
          window.econtenta.track({
            source: '8953b17',
            action: 'page_scroll_full'
          });
        }
      }
      if(!half){
        if(s >= d/2) {
          half=true;
          window.econtenta.track({
            source: '8953b17',
            action: 'page_scroll_middle'
          });
        }
      }
    };
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

  // var anim_on_scroll = new AnimOnScroll();
  var full_height = new FullHeight();
  var video_play = new videoPlayOnDrag();
  var econtenta_pixel = new initEcontentaEvent();
  /*
  =====================================
  INIT WINDOW UPDATER
  =====================================
  */

  var window_updater = new WindowUpdater([
    {
      event: "scroll",
      actions: [
        // anim_on_scroll.updateView,
        video_play.scrollControl,
        econtenta_pixel.checkScrollConditions
      ]
    },
    {
      event: "resize",
      actions: [
        // anim_on_scroll.updateItems,
        full_height.update
      ]
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

  $("input[name='phone']").mask('+0 (000) 000-00-00');
  var calc = new Calculator();
  $(window).trigger("scroll");
  if($(window).scrollTop() > 5){
    $('body').removeClass('noscroll');
  }

  $('.ajax-submit').submit(function(){
    var form = $(this), error = false;
    var btn = form.find('[type="submit"]');
    

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
              btn.val("Идет отправка...").text("Идет отправка...");
            },
           success: function(data){ 
            if (data['error']) { 
              btn.val("Ошибка").text("Ошибка");
              btn.prop('disabled', false);
            } else {
              btn.val("Отправлено").text("Отправлено");
              btn.prop('disabled', false);
            }
           },
           error: function (xhr, ajaxOptions, thrownError) {
            btn.val("Ошибка");
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
