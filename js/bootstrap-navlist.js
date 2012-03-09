/* ========================================================
* bootstrap-navlist.js v1.0.0
* ========================================================
* Copyright 2012 Jakub Gutkowski,
* ======================================================== */

!function ($) {

    "use strict";

    /* NAV LIST CLASS DEFINITION
    * ==================== */

    var NavList = function (element) {
        this.element = $(element);
    };

    NavList.prototype = {
        constructor: NavList,
        show: function () {
            var $this = this.element,
                $ul = $this.closest('ul:not(.dropdown-menu)'),
                selector = $this.attr('data-target'),
                previous,
                $target;

            if (!selector) {
                selector = $this.attr('href');
                selector = selector && selector.replace(/.*(?=#[^\s]*$)/, ''); //strip for ie7
                selector = selector && selector.replace(/\//gi, '-'); // replace / character i.e. #/test/something
                selector = selector && selector.replace('#-', '#');  // replace #- with #
            }

            if ($this.parent('li').hasClass('active')) {
                return;
            }

            previous = $ul.find('.active a').last()[0];

            $this.trigger({
                type: 'show',
                relatedTarget: previous
            });

            $target = $(selector);

            this.activate($this.parent('li'), $ul);
            this.activate($target, $target.parent(), function () {
                $this.trigger({
                    type: 'shown',
                    relatedTarget: previous
                });
            });
        },
        activate: function (element, container, callback) {
            var $active = container.find('> .active'), transition = callback
                && $.support.transition
                    && $active.hasClass('fade');

            function next() {
                $active
                    .removeClass('active')
                    .find('> .dropdown-menu > .active')
                    .removeClass('active');

                element.addClass('active');

                if (transition) {
                    element[0].offsetWidth; // reflow for transition
                    element.addClass('in');
                } else {
                    element.removeClass('fade');
                }

                if (element.parent('.dropdown-menu')) {
                    element.closest('li.dropdown').addClass('active');
                }

                callback && callback();
            }

            transition ?
                $active.one($.support.transition.end, next) :
                next();

            $active.removeClass('in');
        }
    };


    /* NAV LIST PLUGIN DEFINITION
    * ===================== */

    $.fn.navList = function (option) {
        return this.each(function () {
            var $this = $(this), data = $this.data('navList');
            if (!data) $this.data('navList', (data = new NavList(this)));
            if (typeof option == 'string') data[option]();
        });
    };

    $.fn.navList.Constructor = NavList;


    /* NAV-LIST DATA-API
    * ============ */

    $(function () {
        $('body').on('click.nav-list.data-api', '[data-toggle="nav-list"]', function (e) {
            e.preventDefault();
            $(this).navList('show') ;
        });
    });

} (window.jQuery)