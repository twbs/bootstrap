(function() {
  var ResponsiveLayout;

  if ($('#datatable').length) {
    $('#datatable').DataTable({
      paging: false,
      searching: false,
      info: false
    });
  }

  ResponsiveLayout = (function() {
    function ResponsiveLayout(_at_$dom) {
      this.$dom = _at_$dom;
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
        return $(document).on('click touchend', ".res-layout[data-active='navigation'] *:not(.res-navigation)", (function(_this) {
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
    };

    return ResponsiveLayout;

  })();

  if ($('.res-layout').length) {
    new ResponsiveLayout($('.res-layout'));
  }

  $('.section-datepicker').find('#datepicker').datepicker({
    orientation: "auto"
  });

  $('.section-sortable').find('.sortable').sortable();

  $('.select2-navigation').select2({
    containerCssClass: 'select2-navigation',
    minimumResultsForSearch: -1
  });

}).call(this);
