!function($){
  "use strict";

  $.fn.combo = function(){
    var args = arguments,
        zero = args[0],
        isConfig = typeof(zero) !== 'string' ? true : false

    if(isConfig){
      var config = $.extend(true, {
        attr: {},
        css: {},
        cssCls: '',
        containerCSS: {},
        containerCls: '',
        items: [],
        keys: {
          href: 'href',
          target: 'target',
          text: 'text',
          value: 'value'
        },
        placeholder: '',
        select: function(){},
        template: {
          item: '<li><a href="{href}" target="{target}" data-value="{value}">{text}</a></li>',
          menu: '<ul class="combo dropdown-menu"></ul>',
          trigger: '<button class="btn" type="button"><i class="icon-chevron-down"></i></button>'
        }  
      }, zero || {});      
    };

    return this.each(function(){
      var $t = $(this),
          instance = $.data(this, 'combo');
      // if config
      if(isConfig){
        // check if instance exists
        if(instance)
          return;
        // create new combo
        new Combo($t.get(0), config);
      }else{
        // check if string is valid method
        if($.isFunction(instance[zero]) && typeof(zero) === 'string'){
          // fire in the hole!
          instance[zero].call(instance, [].pop.call(args));
        }
      }
      // return this;
      return $t;
    });      
  };

  var Combo = function(container, config){
    var $t = this;
    // store reference to config
    $t.config = config;
    // store reference to our container element
    $t.container = $t.config.container = $(container);

    // wrap container with inline-input class and apply any css + class names
    $t.container.wrap('<div class="input-append"></div>')
    .attr($t.config.attr || {})
    .addClass($t.config.cssCls || '')
    .css($t.config.css || {})
    .parent().css($t.config.containerCSS || {})
    .addClass($t.config.containerCls || '');

    // if placeholder attribute is not present then 
    if(!$t.container.attr('placeholder')){
      // set placeholder text
      $t.container.attr('placeholder', $t.container.attr('placeholder') || $t.config.placeholder);
    }
    // store reference to menu
    $t.menu = $($t.config.template.menu);
    // append menu to body
    $('body').append($t.menu);
    // set default query string to nada
    $t.query = '';
    // check if data has been defined through js or html
    if($t.config.items && $t.config.items.length <= 0){
      // fetch data from data-items attribute
      $t.config.items = JSON.parse($t.container.attr('data-items')).items || [];
    }
    // render menu
    $t.render($t.config.items);
    // set selected
    if($t.selected){
      $t.set($t.selected[$t.config.keys.text]);
    }
    // set drop-down width
    $t.menu.css('width', $t.container.outerWidth() - (parseInt($t.menu.css('borderLeftWidth'), 0) + parseInt($t.menu.css('borderRightWidth'), 0)) + 'px');
    // create trigger
    $t.trigger();
    // add listeners
    $t.listen();
    // store data
    $.data(container, 'combo', $t);
  };

  $.extend(Combo.prototype, {
    choose: function(e){
      var $t = this,
          active = $('li.active a', $t.menu),
          val = active.attr('data-value'),
          text = active.text();
      // update selected
      $t.selected = {};
      $t.selected[$t.config.keys.value] = val;
      $t.selected[$t.config.keys.text] = text;
      // set field value
      $t.container.attr('data-value', val).val(text);
      // check if select callback is valid
      if($.isFunction($t.config.select)){
        // fire select callback
        $t.config.select.call($t.container, e, $t, $t.selected);
      }
      // hide drop-down 
      return $t.hide();
    },

    contains: function(item){
      return ~item.toLowerCase().indexOf(this.query.toLowerCase());
    }, 

    disable: function(){
      var $t = this;
      // disable input and add class
      $t.container.attr('disabled', true).addClass('disabled');
      // disable trigger
      $t.trigger.addClass('disabled');
    },

    dispatch: function(e){
      var $t = this;

      switch(e.keyCode){
        // down arrow
        case 40:
          $t.move('down');
          break;
        // up arrow
        case 38:
          $t.move('up');
          break;
        // tab
        case 9:
        // enter
        case 13:
          // if hidden, do nothing
          if(!$t.shown){
            return;
          }
          // choose the highlighted item
          $t.choose(e);
          break
        // escape
        case 27:
          // if hidden, do nothing
          if(!$t.shown){
            return;
          }
          // hide menu
          $t.hide()
          break;
        default:
          // filter values
          $t.filter();
      }
    },

    enable: function(){
      var $t = this;
      // enable input and remove class
      $t.container.attr('disabled', false).removeClass('disabled');
      // enable trigger
      $t.trigger.removeClass('disabled');
    },

    filter: function(e){
      var $t = this;

      if($t.container.val().length == 0 && $t.menu.is(':visible'))
        return $t.hide();
      // set query to input value
      $t.query = $t.container.val();
      // if value is zilch do something
      if(!$t.query){
       return $t.shown ? $t.hide() : $t;
      }
      // check
      var items = $.grep($t.config.items, function(item){
        return $t.contains(item[$t.config.keys.text]);
      });
      
      if(!items.length){
        return $t.shown ? $t.hide() : $t;
      }
      // render list
      return $t.render(items).show();
    },

    format: function(tpl, object){
      var $t = this,
          object = object || {};

      if(!object[$t.config.keys.href]){
        object[$t.config.keys.href] = 'javascript:void(0);';
      }

      if(String(object.selected) === 'true'){
        $t.selected = object;
        object.selected = false;
      }

      return tpl.replace(/{(.+?)}/g, function(pattern, key){
        return !object[key] ? '' : key === $t.config.keys.text ? $t.highlight(object[key]) : object[key];
      });
    },

    hide: function(){
      var $t = this;
      // hide menu
      $t.menu.hide();
      // remove active class from trigger
      $t.trigger.removeClass('active');
      // set shown flag to false
      $t.shown = false;
    },
    
    highlight: function(item){
      var $t = this,
          query = $t.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');

      return item.replace(new RegExp('(' + query + ')', 'ig'), function($1, match){
        return '<strong>' + match + '</strong>'
      });
    },

    listen: function(){
      var $t = this;

      $t.container.on('keyup', function(e){
        $t.dispatch(e);
      })
      .on('blur', function(){
        // set value accordingly on blur
        return $t.selected ? this.value = $t.selected[$t.config.keys.text] : '';
      });

      $t.trigger.on('click', function(e){
        var btn = $(this),
            active = btn.hasClass('active');
        // is our combo disabled
        if(btn.hasClass('disabled'))
          return;
        // toggle state
        btn.toggleClass('active');
        // set focus
        $t.container.focus();
        // if active
        if(active){
          // hide drop-down
          $t.hide();
        }else{
          // render list
          return $t.render($t.config.items).show();        
        }
      });

      $t.menu.on('click', function(e){
        // check tag of target element
        if(e.target.tagName === 'A'){
          // remove selected active classes
          $t.menu.children().removeClass('selected active');
          // set selected
          $(e.target).parent().addClass('selected active');
          // trigger choose
          $t.choose(e);
        }
      })
      .on('mouseover mouseout', function(e){
        if(e.target.tagName === 'A' && e.type === 'mouseover'){
          $t.menu.children().removeClass('active');
          $(e.target).parent().addClass('active');
        }else{
          $t.menu.children().removeClass('active');
        }
      });
    },

    move: function(direction){
      var $t = this,
          up = direction === 'up' ? true : false,
          active = $t.menu.find('.active').removeClass('active'), 
          next = up ? active.prev() : active.next();
      // check if we've reached the end of the line
      if(!next.length){
        // check direction and highlight first or last item in list
        next = up ? $t.menu.find('li').last() : $($t.menu.find('li')[0]);
      }

      $('li', $t.menu).removeClass('active');
      // add highlight class
      next.addClass('active');
    },

    render: function(items){
      var $t = this;
      // empty menu
      $t.menu.empty();
      // set query
      $t.query = $t.container.val();
      // render menu items 
      $.each(items, function(i, item){
        $t.menu.append($t.format($t.config.template.item, item));
      });
      // if selected item exists then add class
      if($t.selected){
        $('li a[data-value="' + $t.selected[$t.config.keys.value] + '"]', $t.menu).parent().addClass('selected');
      }
      // return this
      return $t;
    },

    set: function(text){
      var $t = this;

      if(!text){
        return $t.container;
      }

      for(var i = 0, k = $t.config.items.length; i < k; i++){
        var item = $t.config.items[i];
        // value exists
        if(item[$t.config.keys.text] === text){
          // set selected
          $t.selected = item;
          break;
        }
      }
      // if there was a match
      if($t.selected){
        // update container properties
        $t.container.attr('data-value', $t.selected[$t.config.keys.value])
        .val($t.selected[$t.config.keys.text]);
        // set selected list item
        $('li a[data-value="' +  $t.selected[$t.config.keys.value] + '"]', $t.menu).parent().addClass('selected');
      }
    },

    show: function(){
      var $t = this,
           pos = $t.container.offset(),
           height = $t.container[0].offsetHeight;
      // position drop-down
      $t.menu.css({
        top: pos.top + height, 
        left: pos.left
      });
      // show menu
      $t.menu.show();
      // set shown flag
      $t.shown = true;
      // return this
      return $t;
    },

    trigger: function(){
      var $t = this;
      // insert trigger after field
      $t.container.after($t.config.template.trigger);
      // store reference
      $t.trigger = $t.container.next();
    }
  });

}(jQuery);