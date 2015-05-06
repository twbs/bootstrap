(function() {
  var ResponsiveLayout, SelectSwitcher;

  ResponsiveLayout = (function() {
    function ResponsiveLayout($dom1) {
      this.$dom = $dom1;
      this.eventBinding();
    }

    ResponsiveLayout.prototype.toggleActive = function($element) {
      var active_type, current_active;
      active_type = $element.data('layout-switch');
      current_active = this.$dom.attr('data-active');
      if (current_active === active_type) {
        active_type = '';
      }
      return this.$dom.attr('data-active', active_type);
    };

    ResponsiveLayout.prototype.eventBinding = function() {
      if (this.$dom.not('.res-single-column, .res-two-columns').length) {
        this.$dom.on('click touchend', '[data-layout-switch]', (function(_this) {
          return function(e) {
            var $el;
            $el = $(e.currentTarget);
            return _this.toggleActive($el);
          };
        })(this));
      }
      if (this.$dom.not('.res-single-column').length) {
        $(document).on('click touchend', ".res-layout[data-active='navigation'] *:not(.res-navigation)", (function(_this) {
          return function(e) {
            var $el, in_navigation;
            e.stopPropagation();
            $el = $(e.currentTarget);
            in_navigation = $el.closest('.res-navigation').length;
            if ($(e.currentTarget).is('[data-layout-switch]')) {
              return true;
            } else if (!in_navigation) {
              return _this.$dom.attr('data-active', '');
            }
          };
        })(this));
      }
      if (this.$dom.is('#settings-layout')) {
        return this.$dom.on('click touchend', '.header-menu', function(e) {
          var $el, $target, is_open;
          $el = $(e.currentTarget);
          $el.toggleClass('open');
          $target = $($el.data('target'));
          is_open = $el.hasClass('open');
          return $target.toggle(is_open);
        });
      }
    };

    return ResponsiveLayout;

  })();

  if ($('.res-layout').length) {
    new ResponsiveLayout($('.res-layout'));
  }

  if ($('#datatable').length) {
    $('#datatable').DataTable({
      paging: false,
      searching: false,
      info: false
    });
  }

  $('.section-datepicker').find('#datepicker').datepicker({
    orientation: "auto"
  });

  $('.section-sortable').find('.sortable').sortable();

  $('.select2-navigation').select2({
    containerCssClass: 'select2-navigation',
    dropdownCssClass: 'select2-navigation',
    minimumResultsForSearch: -1
  });

  $('.section-select').find('select.select2-fusion').select2({
    containerCssClass: 'select2-fusion',
    dropdownCssClass: 'select2-fusion',
    minimumResultsForSearch: -1
  });

  $('.section-select').find('select.select2-dropdown').select2({
    containerCssClass: 'select2-dropdown',
    dropdownCssClass: 'select2-dropdown',
    minimumResultsForSearch: -1
  });

  $('.section-select').find('select.select2-simple').select2({
    containerCssClass: 'select2-simple',
    dropdownCssClass: 'select2-simple',
    minimumResultsForSearch: -1
  });

  $('.section-lightbox').on('click', '.btn-lightbox', function(e) {
    return $('.section-lightbox').find('.carousel-generic').toggleClass('carousel-active', true);
  }).on('click touchstart', '.carousel-generic', function(e) {
    var $el;
    $el = $(e.target);
    if (!$el.parents('.carousel-generic').length) {
      return $('.section-lightbox').find('.carousel-generic').toggleClass('carousel-active', false);
    }
  });

  SelectSwitcher = (function() {
    function SelectSwitcher($dom) {
      this.$dom = $dom;
      this.$select = this.$dom.find('select');
      this.$prev = this.$dom.find('.prev');
      this.$next = this.$dom.find('.next');
      this.eventBinding();
      this.refreshState();
    }

    SelectSwitcher.prototype.refreshState = function() {
      var current_index, options_length;
      current_index = this.getCurrentIndex();
      options_length = this.getAllValues().length;
      this.$prev.removeClass('disabled');
      this.$next.removeClass('disabled');
      if (current_index === 0) {
        return this.$prev.addClass('disabled');
      } else if ((current_index + 1) === options_length) {
        return this.$next.addClass('disabled');
      }
    };

    SelectSwitcher.prototype.getAllValues = function() {
      return this.$select.find('option').map(function() {
        var $option;
        $option = $(this);
        return $option.val();
      });
    };

    SelectSwitcher.prototype.getCurrentIndex = function() {
      var allValues, current_value;
      allValues = this.getAllValues();
      current_value = this.$select.val();
      return $.inArray(current_value, allValues);
    };

    SelectSwitcher.prototype.eventBinding = function() {
      this.$select.on('change', (function(_this) {
        return function() {
          return _this.refreshState();
        };
      })(this));
      return this.$dom.on('click', '[data-switch]:not(".disabled")', (function(_this) {
        return function(e) {
          var $el, allValues, current_index, direction, new_index;
          $el = $(e.currentTarget);
          direction = $el.data('switch');
          new_index = 0;
          allValues = _this.getAllValues();
          current_index = _this.getCurrentIndex();
          if (direction === 'prev') {
            new_index = current_index - 1;
          } else if (direction === 'next') {
            new_index = current_index + 1;
          }
          if (new_index === -1) {
            new_index = 0;
          }
          _this.$select.val(allValues[new_index]).trigger('change');
          return _this.refreshState();
        };
      })(this));
    };

    return SelectSwitcher;

  })();

  new SelectSwitcher($('.section-select').find('.select-switcher'));

}).call(this);
