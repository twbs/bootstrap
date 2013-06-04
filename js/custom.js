/*
* custom.js
*/

$(function() {
  function init_panel() {
    $('.panel-heading.dropdown').each(function() {
        var h = $(this);
        var b = h.nextUntil('.panel-heading');
        $(this).click(function() {
            if (h.hasClass('dropup')) {
                b.slideDown(function() {
                    h.removeClass('dropup');
                });
            }
            else {
                b.slideUp(function() {
                    h.addClass('dropup');
                });
            }
        });
    });
  }

  init_panel();

});

// ----------------------------------------------------------------------------
// datepicker.js
// ----------------------------------------------------------------------------

!function( $ ) {

    function UTCDate(){
        return new Date(Date.UTC.apply(Date, arguments));
    }
    function UTCToday(){
        var today = new Date();
        return UTCDate(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
    }

    // Picker object

    var Datepicker = function(element, options) {
        var that = this;

        this._process_options(options);

        this.element = $(element);
        this.format = DPGlobal.parseFormat(this.o.format);
        this.isInline = false;
        this.isInput = this.element.is('input');
        this.component = this.element.is('.date') ? this.element.find('.add-on, .btn') : false;
        this.hasInput = this.component && this.element.find('input').length;
        if(this.component && this.component.length === 0)
            this.component = false;

        this.picker = $(DPGlobal.template);
        this._buildEvents();
        this._attachEvents();

        if(this.isInline) {
            this.picker.addClass('datepicker-inline').appendTo(this.element);
        } else {
            this.picker.addClass('datepicker-dropdown dropdown-menu');
        }

        if (this.o.rtl){
            this.picker.addClass('datepicker-rtl');
            this.picker.find('.prev i, .next i')
                        .toggleClass('icon-arrow-left icon-arrow-right');
        }


        this.viewMode = this.o.startView;

        if (this.o.calendarWeeks)
            this.picker.find('tfoot th.today')
                        .attr('colspan', function(i, val){
                            return parseInt(val) + 1;
                        });

        this._allow_update = false;

        this.setStartDate(this.o.startDate);
        this.setEndDate(this.o.endDate);
        this.setDaysOfWeekDisabled(this.o.daysOfWeekDisabled);

        this.fillDow();
        this.fillMonths();

        this._allow_update = true;

        this.update();
        this.showMode();

        if(this.isInline) {
            this.show();
        }
    };

    Datepicker.prototype = {
        constructor: Datepicker,

        _process_options: function(opts){
            // Store raw options for reference
            this._o = $.extend({}, this._o, opts);
            // Processed options
            var o = this.o = $.extend({}, this._o);

            // Check if "de-DE" style date is available, if not language should
            // fallback to 2 letter code eg "de"
            var lang = o.language;
            if (!dates[lang]) {
                lang = lang.split('-')[0];
                if (!dates[lang])
                    lang = $.fn.datepicker.defaults.language;
            }
            o.language = lang;

            switch(o.startView){
                case 2:
                case 'decade':
                    o.startView = 2;
                    break;
                case 1:
                case 'year':
                    o.startView = 1;
                    break;
                default:
                    o.startView = 0;
            }

            switch (o.minViewMode) {
                case 1:
                case 'months':
                    o.minViewMode = 1;
                    break;
                case 2:
                case 'years':
                    o.minViewMode = 2;
                    break;
                default:
                    o.minViewMode = 0;
            }

            o.startView = Math.max(o.startView, o.minViewMode);

            o.weekStart %= 7;
            o.weekEnd = ((o.weekStart + 6) % 7);

            if (o.startDate !== -Infinity) {
                o.startDate = DPGlobal.parseDate(o.startDate, o.format, o.language);
            }
            if (o.endDate !== Infinity) {
                o.endDate = DPGlobal.parseDate(o.endDate, o.format, o.language);
            }

            o.daysOfWeekDisabled = o.daysOfWeekDisabled||[];
            if (!$.isArray(o.daysOfWeekDisabled))
                o.daysOfWeekDisabled = o.daysOfWeekDisabled.split(/[,\s]*/);
            o.daysOfWeekDisabled = $.map(o.daysOfWeekDisabled, function (d) {
                return parseInt(d, 10);
            });
        },
        _events: [],
        _secondaryEvents: [],
        _applyEvents: function(evs){
            for (var i=0, el, ev; i<evs.length; i++){
                el = evs[i][0];
                ev = evs[i][1];
                el.on(ev);
            }
        },
        _unapplyEvents: function(evs){
            for (var i=0, el, ev; i<evs.length; i++){
                el = evs[i][0];
                ev = evs[i][1];
                el.off(ev);
            }
        },
        _buildEvents: function(){
            if (this.isInput) { // single input
                this._events = [
                    [this.element, {
                        focus: $.proxy(this.show, this),
                        keyup: $.proxy(this.update, this),
                        keydown: $.proxy(this.keydown, this)
                    }]
                ];
            }
            else if (this.component && this.hasInput){ // component: input + button
                this._events = [
                    // For components that are not readonly, allow keyboard nav
                    [this.element.find('input'), {
                        focus: $.proxy(this.show, this),
                        keyup: $.proxy(this.update, this),
                        keydown: $.proxy(this.keydown, this)
                    }],
                    [this.component, {
                        click: $.proxy(this.show, this)
                    }]
                ];
            }
            else if (this.element.is('div')) {  // inline datepicker
                this.isInline = true;
            }
            else {
                this._events = [
                    [this.element, {
                        click: $.proxy(this.show, this)
                    }]
                ];
            }

            this._secondaryEvents = [
                [this.picker, {
                    click: $.proxy(this.click, this)
                }],
                [$(window), {
                    resize: $.proxy(this.place, this)
                }],
                [$(document), {
                    mousedown: $.proxy(function (e) {
                        // Clicked outside the datepicker, hide it
                        if (!(
                            this.element.is(e.target) ||
                            this.element.find(e.target).size() ||
                            this.picker.is(e.target) ||
                            this.picker.find(e.target).size()
                        )) {
                            this.hide();
                        }
                    }, this)
                }]
            ];
        },
        _attachEvents: function(){
            this._detachEvents();
            this._applyEvents(this._events);
        },
        _detachEvents: function(){
            this._unapplyEvents(this._events);
        },
        _attachSecondaryEvents: function(){
            this._detachSecondaryEvents();
            this._applyEvents(this._secondaryEvents);
        },
        _detachSecondaryEvents: function(){
            this._unapplyEvents(this._secondaryEvents);
        },
        _trigger: function(event, altdate){
            var date = altdate || this.date,
                local_date = new Date(date.getTime() + (date.getTimezoneOffset()*60000));

            this.element.trigger({
                type: event,
                date: local_date,
                format: $.proxy(function(altformat){
                    var format = this.format;
                    if (altformat)
                        format = DPGlobal.parseFormat(altformat);
                    return DPGlobal.formatDate(date, format, this.language);
                }, this)
            });
        },

        show: function(e) {
            if (!this.isInline)
                this.picker.appendTo('body');
            this.picker.show();
            this.height = this.component ? this.component.outerHeight() : this.element.outerHeight();
            this.place();
            this._attachSecondaryEvents();
            if (e) {
                e.preventDefault();
            }
            this._trigger('show');
        },

        hide: function(e){
            if(this.isInline) return;
            if (!this.picker.is(':visible')) return;
            this.picker.hide().detach();
            this._detachSecondaryEvents();
            this.viewMode = this.o.startView;
            this.showMode();

            if (
                this.o.forceParse &&
                (
                    this.isInput && this.element.val() ||
                    this.hasInput && this.element.find('input').val()
                )
            )
                this.setValue();
            this._trigger('hide');
        },

        remove: function() {
            this.hide();
            this._detachEvents();
            this._detachSecondaryEvents();
            this.picker.remove();
            delete this.element.data().datepicker;
            if (!this.isInput) {
                delete this.element.data().date;
            }
        },

        getDate: function() {
            var d = this.getUTCDate();
            return new Date(d.getTime() + (d.getTimezoneOffset()*60000));
        },

        getUTCDate: function() {
            return this.date;
        },

        setDate: function(d) {
            this.setUTCDate(new Date(d.getTime() - (d.getTimezoneOffset()*60000)));
        },

        setUTCDate: function(d) {
            this.date = d;
            this.setValue();
        },

        setValue: function() {
            var formatted = this.getFormattedDate();
            if (!this.isInput) {
                if (this.component){
                    this.element.find('input').val(formatted);
                }
            } else {
                this.element.val(formatted);
            }
        },

        getFormattedDate: function(format) {
            if (format === undefined)
                format = this.format;
            return DPGlobal.formatDate(this.date, format, this.o.language);
        },

        setStartDate: function(startDate){
            this._process_options({startDate: startDate});
            this.update();
            this.updateNavArrows();
        },

        setEndDate: function(endDate){
            this._process_options({endDate: endDate});
            this.update();
            this.updateNavArrows();
        },

        setDaysOfWeekDisabled: function(daysOfWeekDisabled){
            this._process_options({daysOfWeekDisabled: daysOfWeekDisabled});
            this.update();
            this.updateNavArrows();
        },

        place: function(){
                        if(this.isInline) return;
            var zIndex = parseInt(this.element.parents().filter(function() {
                            return $(this).css('z-index') != 'auto';
                        }).first().css('z-index'))+10;
            var offset = this.component ? this.component.parent().offset() : this.element.offset();
            var height = this.component ? this.component.outerHeight(true) : this.element.outerHeight(true);
            this.picker.css({
                top: offset.top + height,
                left: offset.left,
                zIndex: zIndex
            });
        },

        _allow_update: true,
        update: function(){
            if (!this._allow_update) return;

            var date, fromArgs = false;
            if(arguments && arguments.length && (typeof arguments[0] === 'string' || arguments[0] instanceof Date)) {
                date = arguments[0];
                fromArgs = true;
            } else {
                date = this.isInput ? this.element.val() : this.element.data('date') || this.element.find('input').val();
                delete this.element.data().date;
            }

            this.date = DPGlobal.parseDate(date, this.format, this.o.language);

            if(fromArgs) this.setValue();

            if (this.date < this.o.startDate) {
                this.viewDate = new Date(this.o.startDate);
            } else if (this.date > this.o.endDate) {
                this.viewDate = new Date(this.o.endDate);
            } else {
                this.viewDate = new Date(this.date);
            }
            this.fill();
        },

        fillDow: function(){
            var dowCnt = this.o.weekStart,
            html = '<tr>';
            if(this.o.calendarWeeks){
                var cell = '<th class="cw">&nbsp;</th>';
                html += cell;
                this.picker.find('.datepicker-days thead tr:first-child').prepend(cell);
            }
            while (dowCnt < this.o.weekStart + 7) {
                html += '<th class="dow">'+dates[this.o.language].daysMin[(dowCnt++)%7]+'</th>';
            }
            html += '</tr>';
            this.picker.find('.datepicker-days thead').append(html);
        },

        fillMonths: function(){
            var html = '',
            i = 0;
            while (i < 12) {
                html += '<span class="month">'+dates[this.o.language].monthsShort[i++]+'</span>';
            }
            this.picker.find('.datepicker-months td').html(html);
        },

        setRange: function(range){
            if (!range || !range.length)
                delete this.range;
            else
                this.range = $.map(range, function(d){ return d.valueOf(); });
            this.fill();
        },

        getClassNames: function(date){
            var cls = [],
                year = this.viewDate.getUTCFullYear(),
                month = this.viewDate.getUTCMonth(),
                currentDate = this.date.valueOf(),
                today = new Date();
            if (date.getUTCFullYear() < year || (date.getUTCFullYear() == year && date.getUTCMonth() < month)) {
                cls.push('old');
            } else if (date.getUTCFullYear() > year || (date.getUTCFullYear() == year && date.getUTCMonth() > month)) {
                cls.push('new');
            }
            // Compare internal UTC date with local today, not UTC today
            if (this.o.todayHighlight &&
                date.getUTCFullYear() == today.getFullYear() &&
                date.getUTCMonth() == today.getMonth() &&
                date.getUTCDate() == today.getDate()) {
                cls.push('today');
            }
            if (currentDate && date.valueOf() == currentDate) {
                cls.push('active');
            }
            if (date.valueOf() < this.o.startDate || date.valueOf() > this.o.endDate ||
                $.inArray(date.getUTCDay(), this.o.daysOfWeekDisabled) !== -1) {
                cls.push('disabled');
            }
            if (this.range){
                if (date > this.range[0] && date < this.range[this.range.length-1]){
                    cls.push('range');
                }
                if ($.inArray(date.valueOf(), this.range) != -1){
                    cls.push('selected');
                }
            }
            return cls;
        },

        fill: function() {
            var d = new Date(this.viewDate),
                year = d.getUTCFullYear(),
                month = d.getUTCMonth(),
                startYear = this.o.startDate !== -Infinity ? this.o.startDate.getUTCFullYear() : -Infinity,
                startMonth = this.o.startDate !== -Infinity ? this.o.startDate.getUTCMonth() : -Infinity,
                endYear = this.o.endDate !== Infinity ? this.o.endDate.getUTCFullYear() : Infinity,
                endMonth = this.o.endDate !== Infinity ? this.o.endDate.getUTCMonth() : Infinity,
                currentDate = this.date && this.date.valueOf(),
                tooltip;
            this.picker.find('.datepicker-days thead th.datepicker-switch')
                        .text(dates[this.o.language].months[month]+' '+year);
            this.picker.find('tfoot th.today')
                        .text(dates[this.o.language].today)
                        .toggle(this.o.todayBtn !== false);
            this.picker.find('tfoot th.clear')
                        .text(dates[this.o.language].clear)
                        .toggle(this.o.clearBtn !== false);
            this.updateNavArrows();
            this.fillMonths();
            var prevMonth = UTCDate(year, month-1, 28,0,0,0,0),
                day = DPGlobal.getDaysInMonth(prevMonth.getUTCFullYear(), prevMonth.getUTCMonth());
            prevMonth.setUTCDate(day);
            prevMonth.setUTCDate(day - (prevMonth.getUTCDay() - this.o.weekStart + 7)%7);
            var nextMonth = new Date(prevMonth);
            nextMonth.setUTCDate(nextMonth.getUTCDate() + 42);
            nextMonth = nextMonth.valueOf();
            var html = [];
            var clsName;
            while(prevMonth.valueOf() < nextMonth) {
                if (prevMonth.getUTCDay() == this.o.weekStart) {
                    html.push('<tr>');
                    if(this.o.calendarWeeks){
                        // ISO 8601: First week contains first thursday.
                        // ISO also states week starts on Monday, but we can be more abstract here.
                        var
                            // Start of current week: based on weekstart/current date
                            ws = new Date(+prevMonth + (this.o.weekStart - prevMonth.getUTCDay() - 7) % 7 * 864e5),
                            // Thursday of this week
                            th = new Date(+ws + (7 + 4 - ws.getUTCDay()) % 7 * 864e5),
                            // First Thursday of year, year from thursday
                            yth = new Date(+(yth = UTCDate(th.getUTCFullYear(), 0, 1)) + (7 + 4 - yth.getUTCDay())%7*864e5),
                            // Calendar week: ms between thursdays, div ms per day, div 7 days
                            calWeek =  (th - yth) / 864e5 / 7 + 1;
                        html.push('<td class="cw">'+ calWeek +'</td>');

                    }
                }
                clsName = this.getClassNames(prevMonth);
                clsName.push('day');

                var before = this.o.beforeShowDay(prevMonth);
                if (before === undefined)
                    before = {};
                else if (typeof(before) === 'boolean')
                    before = {enabled: before};
                else if (typeof(before) === 'string')
                    before = {classes: before};
                if (before.enabled === false)
                    clsName.push('disabled');
                if (before.classes)
                    clsName = clsName.concat(before.classes.split(/\s+/));
                if (before.tooltip)
                    tooltip = before.tooltip;

                clsName = $.unique(clsName);
                html.push('<td class="'+clsName.join(' ')+'"' + (tooltip ? ' title="'+tooltip+'"' : '') + '>'+prevMonth.getUTCDate() + '</td>');
                if (prevMonth.getUTCDay() == this.o.weekEnd) {
                    html.push('</tr>');
                }
                prevMonth.setUTCDate(prevMonth.getUTCDate()+1);
            }
            this.picker.find('.datepicker-days tbody').empty().append(html.join(''));
            var currentYear = this.date && this.date.getUTCFullYear();

            var months = this.picker.find('.datepicker-months')
                        .find('th:eq(1)')
                            .text(year)
                            .end()
                        .find('span').removeClass('active');
            if (currentYear && currentYear == year) {
                months.eq(this.date.getUTCMonth()).addClass('active');
            }
            if (year < startYear || year > endYear) {
                months.addClass('disabled');
            }
            if (year == startYear) {
                months.slice(0, startMonth).addClass('disabled');
            }
            if (year == endYear) {
                months.slice(endMonth+1).addClass('disabled');
            }

            html = '';
            year = parseInt(year/10, 10) * 10;
            var yearCont = this.picker.find('.datepicker-years')
                                .find('th:eq(1)')
                                    .text(year + '-' + (year + 9))
                                    .end()
                                .find('td');
            year -= 1;
            for (var i = -1; i < 11; i++) {
                html += '<span class="year'+(i == -1 ? ' old' : i == 10 ? ' new' : '')+(currentYear == year ? ' active' : '')+(year < startYear || year > endYear ? ' disabled' : '')+'">'+year+'</span>';
                year += 1;
            }
            yearCont.html(html);
        },

        updateNavArrows: function() {
            if (!this._allow_update) return;

            var d = new Date(this.viewDate),
                year = d.getUTCFullYear(),
                month = d.getUTCMonth();
            switch (this.viewMode) {
                case 0:
                    if (this.o.startDate !== -Infinity && year <= this.o.startDate.getUTCFullYear() && month <= this.o.startDate.getUTCMonth()) {
                        this.picker.find('.prev').css({visibility: 'hidden'});
                    } else {
                        this.picker.find('.prev').css({visibility: 'visible'});
                    }
                    if (this.o.endDate !== Infinity && year >= this.o.endDate.getUTCFullYear() && month >= this.o.endDate.getUTCMonth()) {
                        this.picker.find('.next').css({visibility: 'hidden'});
                    } else {
                        this.picker.find('.next').css({visibility: 'visible'});
                    }
                    break;
                case 1:
                case 2:
                    if (this.o.startDate !== -Infinity && year <= this.o.startDate.getUTCFullYear()) {
                        this.picker.find('.prev').css({visibility: 'hidden'});
                    } else {
                        this.picker.find('.prev').css({visibility: 'visible'});
                    }
                    if (this.o.endDate !== Infinity && year >= this.o.endDate.getUTCFullYear()) {
                        this.picker.find('.next').css({visibility: 'hidden'});
                    } else {
                        this.picker.find('.next').css({visibility: 'visible'});
                    }
                    break;
            }
        },

        click: function(e) {
            e.preventDefault();
            var target = $(e.target).closest('span, td, th');
            if (target.length == 1) {
                switch(target[0].nodeName.toLowerCase()) {
                    case 'th':
                        switch(target[0].className) {
                            case 'datepicker-switch':
                                this.showMode(1);
                                break;
                            case 'prev':
                            case 'next':
                                var dir = DPGlobal.modes[this.viewMode].navStep * (target[0].className == 'prev' ? -1 : 1);
                                switch(this.viewMode){
                                    case 0:
                                        this.viewDate = this.moveMonth(this.viewDate, dir);
                                        break;
                                    case 1:
                                    case 2:
                                        this.viewDate = this.moveYear(this.viewDate, dir);
                                        break;
                                }
                                this.fill();
                                break;
                            case 'today':
                                var date = new Date();
                                date = UTCDate(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);

                                this.showMode(-2);
                                var which = this.o.todayBtn == 'linked' ? null : 'view';
                                this._setDate(date, which);
                                break;
                            case 'clear':
                                if (this.isInput)
                                    this.element.val("");
                                else
                                    this.element.find('input').val("");
                                this.update();
                                if (this.o.autoclose)
                                    this.hide();
                                break;
                        }
                        break;
                    case 'span':
                        if (!target.is('.disabled')) {
                            this.viewDate.setUTCDate(1);
                            if (target.is('.month')) {
                                var day = 1;
                                var month = target.parent().find('span').index(target);
                                var year = this.viewDate.getUTCFullYear();
                                this.viewDate.setUTCMonth(month);
                                this._trigger('changeMonth', this.viewDate);
                                if (this.o.minViewMode === 1) {
                                    this._setDate(UTCDate(year, month, day,0,0,0,0));
                                }
                            } else {
                                var year = parseInt(target.text(), 10)||0;
                                var day = 1;
                                var month = 0;
                                this.viewDate.setUTCFullYear(year);
                                this._trigger('changeYear', this.viewDate);
                                if (this.o.minViewMode === 2) {
                                    this._setDate(UTCDate(year, month, day,0,0,0,0));
                                }
                            }
                            this.showMode(-1);
                            this.fill();
                        }
                        break;
                    case 'td':
                        if (target.is('.day') && !target.is('.disabled')){
                            var day = parseInt(target.text(), 10)||1;
                            var year = this.viewDate.getUTCFullYear(),
                                month = this.viewDate.getUTCMonth();
                            if (target.is('.old')) {
                                if (month === 0) {
                                    month = 11;
                                    year -= 1;
                                } else {
                                    month -= 1;
                                }
                            } else if (target.is('.new')) {
                                if (month == 11) {
                                    month = 0;
                                    year += 1;
                                } else {
                                    month += 1;
                                }
                            }
                            this._setDate(UTCDate(year, month, day,0,0,0,0));
                        }
                        break;
                }
            }
        },

        _setDate: function(date, which){
            if (!which || which == 'date')
                this.date = new Date(date);
            if (!which || which  == 'view')
                this.viewDate = new Date(date);
            this.fill();
            this.setValue();
            this._trigger('changeDate');
            var element;
            if (this.isInput) {
                element = this.element;
            } else if (this.component){
                element = this.element.find('input');
            }
            if (element) {
                element.change();
                if (this.o.autoclose && (!which || which == 'date')) {
                    this.hide();
                }
            }
        },

        moveMonth: function(date, dir){
            if (!dir) return date;
            var new_date = new Date(date.valueOf()),
                day = new_date.getUTCDate(),
                month = new_date.getUTCMonth(),
                mag = Math.abs(dir),
                new_month, test;
            dir = dir > 0 ? 1 : -1;
            if (mag == 1){
                test = dir == -1
                    // If going back one month, make sure month is not current month
                    // (eg, Mar 31 -> Feb 31 == Feb 28, not Mar 02)
                    ? function(){ return new_date.getUTCMonth() == month; }
                    // If going forward one month, make sure month is as expected
                    // (eg, Jan 31 -> Feb 31 == Feb 28, not Mar 02)
                    : function(){ return new_date.getUTCMonth() != new_month; };
                new_month = month + dir;
                new_date.setUTCMonth(new_month);
                // Dec -> Jan (12) or Jan -> Dec (-1) -- limit expected date to 0-11
                if (new_month < 0 || new_month > 11)
                    new_month = (new_month + 12) % 12;
            } else {
                // For magnitudes >1, move one month at a time...
                for (var i=0; i<mag; i++)
                    // ...which might decrease the day (eg, Jan 31 to Feb 28, etc)...
                    new_date = this.moveMonth(new_date, dir);
                // ...then reset the day, keeping it in the new month
                new_month = new_date.getUTCMonth();
                new_date.setUTCDate(day);
                test = function(){ return new_month != new_date.getUTCMonth(); };
            }
            // Common date-resetting loop -- if date is beyond end of month, make it
            // end of month
            while (test()){
                new_date.setUTCDate(--day);
                new_date.setUTCMonth(new_month);
            }
            return new_date;
        },

        moveYear: function(date, dir){
            return this.moveMonth(date, dir*12);
        },

        dateWithinRange: function(date){
            return date >= this.o.startDate && date <= this.o.endDate;
        },

        keydown: function(e){
            if (this.picker.is(':not(:visible)')){
                if (e.keyCode == 27) // allow escape to hide and re-show picker
                    this.show();
                return;
            }
            var dateChanged = false,
                dir, day, month,
                newDate, newViewDate;
            switch(e.keyCode){
                case 27: // escape
                    this.hide();
                    e.preventDefault();
                    break;
                case 37: // left
                case 39: // right
                    if (!this.o.keyboardNavigation) break;
                    dir = e.keyCode == 37 ? -1 : 1;
                    if (e.ctrlKey){
                        newDate = this.moveYear(this.date, dir);
                        newViewDate = this.moveYear(this.viewDate, dir);
                    } else if (e.shiftKey){
                        newDate = this.moveMonth(this.date, dir);
                        newViewDate = this.moveMonth(this.viewDate, dir);
                    } else {
                        newDate = new Date(this.date);
                        newDate.setUTCDate(this.date.getUTCDate() + dir);
                        newViewDate = new Date(this.viewDate);
                        newViewDate.setUTCDate(this.viewDate.getUTCDate() + dir);
                    }
                    if (this.dateWithinRange(newDate)){
                        this.date = newDate;
                        this.viewDate = newViewDate;
                        this.setValue();
                        this.update();
                        e.preventDefault();
                        dateChanged = true;
                    }
                    break;
                case 38: // up
                case 40: // down
                    if (!this.o.keyboardNavigation) break;
                    dir = e.keyCode == 38 ? -1 : 1;
                    if (e.ctrlKey){
                        newDate = this.moveYear(this.date, dir);
                        newViewDate = this.moveYear(this.viewDate, dir);
                    } else if (e.shiftKey){
                        newDate = this.moveMonth(this.date, dir);
                        newViewDate = this.moveMonth(this.viewDate, dir);
                    } else {
                        newDate = new Date(this.date);
                        newDate.setUTCDate(this.date.getUTCDate() + dir * 7);
                        newViewDate = new Date(this.viewDate);
                        newViewDate.setUTCDate(this.viewDate.getUTCDate() + dir * 7);
                    }
                    if (this.dateWithinRange(newDate)){
                        this.date = newDate;
                        this.viewDate = newViewDate;
                        this.setValue();
                        this.update();
                        e.preventDefault();
                        dateChanged = true;
                    }
                    break;
                case 13: // enter
                    this.hide();
                    e.preventDefault();
                    break;
                case 9: // tab
                    this.hide();
                    break;
            }
            if (dateChanged){
                this._trigger('changeDate');
                var element;
                if (this.isInput) {
                    element = this.element;
                } else if (this.component){
                    element = this.element.find('input');
                }
                if (element) {
                    element.change();
                }
            }
        },

        showMode: function(dir) {
            if (dir) {
                this.viewMode = Math.max(this.o.minViewMode, Math.min(2, this.viewMode + dir));
            }
            /*
                vitalets: fixing bug of very special conditions:
                jquery 1.7.1 + webkit + show inline datepicker in bootstrap popover.
                Method show() does not set display css correctly and datepicker is not shown.
                Changed to .css('display', 'block') solve the problem.
                See https://github.com/vitalets/x-editable/issues/37

                In jquery 1.7.2+ everything works fine.
            */
            //this.picker.find('>div').hide().filter('.datepicker-'+DPGlobal.modes[this.viewMode].clsName).show();
            this.picker.find('>div').hide().filter('.datepicker-'+DPGlobal.modes[this.viewMode].clsName).css('display', 'block');
            this.updateNavArrows();
        }
    };

    var DateRangePicker = function(element, options){
        this.element = $(element);
        this.inputs = $.map(options.inputs, function(i){ return i.jquery ? i[0] : i; });
        delete options.inputs;

        $(this.inputs)
            .datepicker(options)
            .bind('changeDate', $.proxy(this.dateUpdated, this));

        this.pickers = $.map(this.inputs, function(i){ return $(i).data('datepicker'); });
        this.updateDates();
    };
    DateRangePicker.prototype = {
        updateDates: function(){
            this.dates = $.map(this.pickers, function(i){ return i.date; });
            this.updateRanges();
        },
        updateRanges: function(){
            var range = $.map(this.dates, function(d){ return d.valueOf(); });
            $.each(this.pickers, function(i, p){
                p.setRange(range);
            });
        },
        dateUpdated: function(e){
            var dp = $(e.target).data('datepicker'),
                new_date = dp.getUTCDate(),
                i = $.inArray(e.target, this.inputs),
                l = this.inputs.length;
            if (i == -1) return;

            if (new_date < this.dates[i]){
                // Date being moved earlier/left
                while (i>=0 && new_date < this.dates[i]){
                    this.pickers[i--].setUTCDate(new_date);
                }
            }
            else if (new_date > this.dates[i]){
                // Date being moved later/right
                while (i<l && new_date > this.dates[i]){
                    this.pickers[i++].setUTCDate(new_date);
                }
            }
            this.updateDates();
        },
        remove: function(){
            $.map(this.pickers, function(p){ p.remove(); });
            delete this.element.data().datepicker;
        }
    };

    function opts_from_el(el, prefix){
        // Derive options from element data-attrs
        var data = $(el).data(),
            out = {}, inkey,
            replace = new RegExp('^' + prefix.toLowerCase() + '([A-Z])'),
            prefix = new RegExp('^' + prefix.toLowerCase());
        for (var key in data)
            if (prefix.test(key)){
                inkey = key.replace(replace, function(_,a){ return a.toLowerCase(); });
                out[inkey] = data[key];
            }
        return out;
    }

    function opts_from_locale(lang){
        // Derive options from locale plugins
        var out = {};
        // Check if "de-DE" style date is available, if not language should
        // fallback to 2 letter code eg "de"
        if (!dates[lang]) {
            lang = lang.split('-')[0]
            if (!dates[lang])
                return;
        }
        var d = dates[lang];
        $.each($.fn.datepicker.locale_opts, function(i,k){
            if (k in d)
                out[k] = d[k];
        });
        return out;
    }

    var old = $.fn.datepicker;
    $.fn.datepicker = function ( option ) {
        var args = Array.apply(null, arguments);
        args.shift();
        var internal_return,
            this_return;
        this.each(function () {
            var $this = $(this),
                data = $this.data('datepicker'),
                options = typeof option == 'object' && option;
            if (!data) {
                var elopts = opts_from_el(this, 'date'),
                    // Preliminary otions
                    xopts = $.extend({}, $.fn.datepicker.defaults, elopts, options),
                    locopts = opts_from_locale(xopts.language),
                    // Options priority: js args, data-attrs, locales, defaults
                    opts = $.extend({}, $.fn.datepicker.defaults, locopts, elopts, options);
                if ($this.is('.input-daterange') || opts.inputs){
                    var ropts = {
                        inputs: opts.inputs || $this.find('input').toArray()
                    };
                    $this.data('datepicker', (data = new DateRangePicker(this, $.extend(opts, ropts))));
                }
                else{
                    $this.data('datepicker', (data = new Datepicker(this, opts)));
                }
            }
            if (typeof option == 'string' && typeof data[option] == 'function') {
                internal_return = data[option].apply(data, args);
                if (internal_return !== undefined)
                    return false;
            }
        });
        if (internal_return !== undefined)
            return internal_return;
        else
            return this;
    };

    $.fn.datepicker.defaults = {
        autoclose: false,
        beforeShowDay: $.noop,
        calendarWeeks: false,
        clearBtn: false,
        daysOfWeekDisabled: [],
        endDate: Infinity,
        forceParse: true,
        format: 'mm/dd/yyyy',
        keyboardNavigation: true,
        language: 'en',
        minViewMode: 0,
        rtl: false,
        startDate: -Infinity,
        startView: 0,
        todayBtn: false,
        todayHighlight: false,
        weekStart: 0
    };
    $.fn.datepicker.locale_opts = [
        'format',
        'rtl',
        'weekStart'
    ];
    $.fn.datepicker.Constructor = Datepicker;
    var dates = $.fn.datepicker.dates = {
        en: {
            days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
            months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            today: "Today",
            clear: "Clear"
        }
    };

    var DPGlobal = {
        modes: [
            {
                clsName: 'days',
                navFnc: 'Month',
                navStep: 1
            },
            {
                clsName: 'months',
                navFnc: 'FullYear',
                navStep: 1
            },
            {
                clsName: 'years',
                navFnc: 'FullYear',
                navStep: 10
        }],
        isLeapYear: function (year) {
            return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
        },
        getDaysInMonth: function (year, month) {
            return [31, (DPGlobal.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
        },
        validParts: /dd?|DD?|mm?|MM?|yy(?:yy)?/g,
        nonpunctuation: /[^ -\/:-@\[\u3400-\u9fff-`{-~\t\n\r]+/g,
        parseFormat: function(format){
            // IE treats \0 as a string end in inputs (truncating the value),
            // so it's a bad format delimiter, anyway
            var separators = format.replace(this.validParts, '\0').split('\0'),
                parts = format.match(this.validParts);
            if (!separators || !separators.length || !parts || parts.length === 0){
                throw new Error("Invalid date format.");
            }
            return {separators: separators, parts: parts};
        },
        parseDate: function(date, format, language) {
            if (date instanceof Date) return date;
            if (/^[\-+]\d+[dmwy]([\s,]+[\-+]\d+[dmwy])*$/.test(date)) {
                var part_re = /([\-+]\d+)([dmwy])/,
                    parts = date.match(/([\-+]\d+)([dmwy])/g),
                    part, dir;
                date = new Date();
                for (var i=0; i<parts.length; i++) {
                    part = part_re.exec(parts[i]);
                    dir = parseInt(part[1]);
                    switch(part[2]){
                        case 'd':
                            date.setUTCDate(date.getUTCDate() + dir);
                            break;
                        case 'm':
                            date = Datepicker.prototype.moveMonth.call(Datepicker.prototype, date, dir);
                            break;
                        case 'w':
                            date.setUTCDate(date.getUTCDate() + dir * 7);
                            break;
                        case 'y':
                            date = Datepicker.prototype.moveYear.call(Datepicker.prototype, date, dir);
                            break;
                    }
                }
                return UTCDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0);
            }
            var parts = date && date.match(this.nonpunctuation) || [],
                date = new Date(),
                parsed = {},
                setters_order = ['yyyy', 'yy', 'M', 'MM', 'm', 'mm', 'd', 'dd'],
                setters_map = {
                    yyyy: function(d,v){ return d.setUTCFullYear(v); },
                    yy: function(d,v){ return d.setUTCFullYear(2000+v); },
                    m: function(d,v){
                        v -= 1;
                        while (v<0) v += 12;
                        v %= 12;
                        d.setUTCMonth(v);
                        while (d.getUTCMonth() != v)
                            d.setUTCDate(d.getUTCDate()-1);
                        return d;
                    },
                    d: function(d,v){ return d.setUTCDate(v); }
                },
                val, filtered, part;
            setters_map['M'] = setters_map['MM'] = setters_map['mm'] = setters_map['m'];
            setters_map['dd'] = setters_map['d'];
            date = UTCDate(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
            var fparts = format.parts.slice();
            // Remove noop parts
            if (parts.length != fparts.length) {
                fparts = $(fparts).filter(function(i,p){
                    return $.inArray(p, setters_order) !== -1;
                }).toArray();
            }
            // Process remainder
            if (parts.length == fparts.length) {
                for (var i=0, cnt = fparts.length; i < cnt; i++) {
                    val = parseInt(parts[i], 10);
                    part = fparts[i];
                    if (isNaN(val)) {
                        switch(part) {
                            case 'MM':
                                filtered = $(dates[language].months).filter(function(){
                                    var m = this.slice(0, parts[i].length),
                                        p = parts[i].slice(0, m.length);
                                    return m == p;
                                });
                                val = $.inArray(filtered[0], dates[language].months) + 1;
                                break;
                            case 'M':
                                filtered = $(dates[language].monthsShort).filter(function(){
                                    var m = this.slice(0, parts[i].length),
                                        p = parts[i].slice(0, m.length);
                                    return m == p;
                                });
                                val = $.inArray(filtered[0], dates[language].monthsShort) + 1;
                                break;
                        }
                    }
                    parsed[part] = val;
                }
                for (var i=0, s; i<setters_order.length; i++){
                    s = setters_order[i];
                    if (s in parsed && !isNaN(parsed[s]))
                        setters_map[s](date, parsed[s]);
                }
            }
            return date;
        },
        formatDate: function(date, format, language){
            var val = {
                d: date.getUTCDate(),
                D: dates[language].daysShort[date.getUTCDay()],
                DD: dates[language].days[date.getUTCDay()],
                m: date.getUTCMonth() + 1,
                M: dates[language].monthsShort[date.getUTCMonth()],
                MM: dates[language].months[date.getUTCMonth()],
                yy: date.getUTCFullYear().toString().substring(2),
                yyyy: date.getUTCFullYear()
            };
            val.dd = (val.d < 10 ? '0' : '') + val.d;
            val.mm = (val.m < 10 ? '0' : '') + val.m;
            var date = [],
                seps = $.extend([], format.separators);
            for (var i=0, cnt = format.parts.length; i <= cnt; i++) {
                if (seps.length)
                    date.push(seps.shift());
                date.push(val[format.parts[i]]);
            }
            return date.join('');
        },
        headTemplate: '<thead>'+
                            '<tr>'+
                                '<th class="prev"><i class="icon-arrow-left"/></th>'+
                                '<th colspan="5" class="datepicker-switch"></th>'+
                                '<th class="next"><i class="icon-arrow-right"/></th>'+
                            '</tr>'+
                        '</thead>',
        contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>',
        footTemplate: '<tfoot><tr><th colspan="7" class="today"></th></tr><tr><th colspan="7" class="clear"></th></tr></tfoot>'
    };
    DPGlobal.template = '<div class="datepicker">'+
                            '<div class="datepicker-days">'+
                                '<table class=" table-condensed">'+
                                    DPGlobal.headTemplate+
                                    '<tbody></tbody>'+
                                    DPGlobal.footTemplate+
                                '</table>'+
                            '</div>'+
                            '<div class="datepicker-months">'+
                                '<table class="table-condensed">'+
                                    DPGlobal.headTemplate+
                                    DPGlobal.contTemplate+
                                    DPGlobal.footTemplate+
                                '</table>'+
                            '</div>'+
                            '<div class="datepicker-years">'+
                                '<table class="table-condensed">'+
                                    DPGlobal.headTemplate+
                                    DPGlobal.contTemplate+
                                    DPGlobal.footTemplate+
                                '</table>'+
                            '</div>'+
                        '</div>';

    $.fn.datepicker.DPGlobal = DPGlobal;


    /* DATEPICKER NO CONFLICT
    * =================== */

    $.fn.datepicker.noConflict = function(){
        $.fn.datepicker = old;
        return this;
    };


    /* DATEPICKER DATA-API
    * ================== */

    $(document).on(
        'focus.datepicker.data-api click.datepicker.data-api',
        '[data-provide="datepicker"]',
        function(e){
            var $this = $(this);
            if ($this.data('datepicker')) return;
            e.preventDefault();
            // component click requires us to explicitly show it
            $this.datepicker('show');
        }
    );
    $(function(){
        $('[data-provide="datepicker-inline"]').datepicker();
    });

}( window.jQuery );

// ----------------------------------------------------------------------------
// jqTree.js
// ----------------------------------------------------------------------------

// Generated by CoffeeScript 1.6.2
/*
Copyright 2013 Marco Braak

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

(function() {
  var $, BorderDropHint, DragAndDropHandler, DragElement, FolderElement, GhostDropHint, JqTreeWidget, MouseWidget, Node, NodeElement, Position, SaveStateHandler, ScrollHandler, SelectNodeHandler, SimpleWidget, html_escape, indexOf, json_escapable, json_meta, json_quote, json_str, _indexOf, _ref, _ref1, _ref2,
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  $ = this.jQuery;

  SimpleWidget = (function() {
    SimpleWidget.prototype.defaults = {};

    function SimpleWidget(el, options) {
      this.$el = $(el);
      this.options = $.extend({}, this.defaults, options);
    }

    SimpleWidget.prototype.destroy = function() {
      return this._deinit();
    };

    SimpleWidget.prototype._init = function() {
      return null;
    };

    SimpleWidget.prototype._deinit = function() {
      return null;
    };

    SimpleWidget.register = function(widget_class, widget_name) {
      var callFunction, createWidget, destroyWidget, getDataKey;

      getDataKey = function() {
        return "simple_widget_" + widget_name;
      };
      createWidget = function($el, options) {
        var data_key, el, widget, _i, _len;

        data_key = getDataKey();
        for (_i = 0, _len = $el.length; _i < _len; _i++) {
          el = $el[_i];
          widget = new widget_class(el, options);
          if (!$.data(el, data_key)) {
            $.data(el, data_key, widget);
          }
          widget._init();
        }
        return $el;
      };
      destroyWidget = function($el) {
        var data_key, el, widget, _i, _len, _results;

        data_key = getDataKey();
        _results = [];
        for (_i = 0, _len = $el.length; _i < _len; _i++) {
          el = $el[_i];
          widget = $.data(el, data_key);
          if (widget && (widget instanceof SimpleWidget)) {
            widget.destroy();
          }
          _results.push($.removeData(el, data_key));
        }
        return _results;
      };
      callFunction = function($el, function_name, args) {
        var el, result, widget, widget_function, _i, _len;

        result = null;
        for (_i = 0, _len = $el.length; _i < _len; _i++) {
          el = $el[_i];
          widget = $.data(el, getDataKey());
          if (widget && (widget instanceof SimpleWidget)) {
            widget_function = widget[function_name];
            if (widget_function && (typeof widget_function === 'function')) {
              result = widget_function.apply(widget, args);
            }
          }
        }
        return result;
      };
      return $.fn[widget_name] = function() {
        var $el, args, argument1, function_name, options;

        argument1 = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        $el = this;
        if (argument1 === void 0 || typeof argument1 === 'object') {
          options = argument1;
          return createWidget($el, options);
        } else if (typeof argument1 === 'string' && argument1[0] !== '_') {
          function_name = argument1;
          if (function_name === 'destroy') {
            return destroyWidget($el);
          } else {
            return callFunction($el, function_name, args);
          }
        }
      };
    };

    return SimpleWidget;

  })();

  this.SimpleWidget = SimpleWidget;

  /*
  This widget does the same a the mouse widget in jqueryui.
  */


  MouseWidget = (function(_super) {
    __extends(MouseWidget, _super);

    function MouseWidget() {
      _ref = MouseWidget.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    MouseWidget.is_mouse_handled = false;

    MouseWidget.prototype._init = function() {
      this.$el.bind('mousedown.mousewidget', $.proxy(this._mouseDown, this));
      this.is_mouse_started = false;
      this.mouse_delay = 0;
      this._mouse_delay_timer = null;
      return this._is_mouse_delay_met = true;
    };

    MouseWidget.prototype._deinit = function() {
      var $document;

      this.$el.unbind('mousedown.mousewidget');
      $document = $(document);
      $document.unbind('mousemove.mousewidget');
      return $document.unbind('mouseup.mousewidget');
    };

    MouseWidget.prototype._mouseDown = function(e) {
      var $document;

      if (MouseWidget.is_mouse_handled) {
        return;
      }
      if (!this.is_mouse_started) {
        this._mouseUp(e);
      }
      if (e.which !== 1) {
        return;
      }
      if (!this._mouseCapture(e)) {
        return;
      }
      this.mouse_down_event = e;
      $document = $(document);
      $document.bind('mousemove.mousewidget', $.proxy(this._mouseMove, this));
      $document.bind('mouseup.mousewidget', $.proxy(this._mouseUp, this));
      if (this.mouse_delay) {
        this._startMouseDelayTimer();
      }
      e.preventDefault();
      this.is_mouse_handled = true;
      return true;
    };

    MouseWidget.prototype._startMouseDelayTimer = function() {
      var _this = this;

      if (this._mouse_delay_timer) {
        clearTimeout(this._mouse_delay_timer);
      }
      this._mouse_delay_timer = setTimeout(function() {
        return _this._is_mouse_delay_met = true;
      }, this.mouse_delay);
      return this._is_mouse_delay_met = false;
    };

    MouseWidget.prototype._mouseMove = function(e) {
      if (this.is_mouse_started) {
        this._mouseDrag(e);
        return e.preventDefault();
      }
      if (this.mouse_delay && !this._is_mouse_delay_met) {
        return true;
      }
      this.is_mouse_started = this._mouseStart(this.mouse_down_event) !== false;
      if (this.is_mouse_started) {
        this._mouseDrag(e);
      } else {
        this._mouseUp(e);
      }
      return !this.is_mouse_started;
    };

    MouseWidget.prototype._mouseUp = function(e) {
      var $document;

      $document = $(document);
      $document.unbind('mousemove.mousewidget');
      $document.unbind('mouseup.mousewidget');
      if (this.is_mouse_started) {
        this.is_mouse_started = false;
        this._mouseStop(e);
      }
      return false;
    };

    MouseWidget.prototype._mouseCapture = function(e) {
      return true;
    };

    MouseWidget.prototype._mouseStart = function(e) {
      return null;
    };

    MouseWidget.prototype._mouseDrag = function(e) {
      return null;
    };

    MouseWidget.prototype._mouseStop = function(e) {
      return null;
    };

    MouseWidget.prototype.setMouseDelay = function(mouse_delay) {
      return this.mouse_delay = mouse_delay;
    };

    return MouseWidget;

  })(SimpleWidget);

  /*
  Copyright 2013 Marco Braak
  
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
  
     http://www.apache.org/licenses/LICENSE-2.0
  
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
  */


  this.Tree = {};

  $ = this.jQuery;

  _indexOf = function(array, item) {
    var i, value, _i, _len;

    for (i = _i = 0, _len = array.length; _i < _len; i = ++_i) {
      value = array[i];
      if (value === item) {
        return i;
      }
    }
    return -1;
  };

  indexOf = function(array, item) {
    if (array.indexOf) {
      return array.indexOf(item);
    } else {
      return _indexOf(array, item);
    }
  };

  this.Tree.indexOf = indexOf;

  this.Tree._indexOf = _indexOf;

  if (!((this.JSON != null) && (this.JSON.stringify != null) && typeof this.JSON.stringify === 'function')) {
    json_escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    json_meta = {
      '\b': '\\b',
      '\t': '\\t',
      '\n': '\\n',
      '\f': '\\f',
      '\r': '\\r',
      '"': '\\"',
      '\\': '\\\\'
    };
    json_quote = function(string) {
      json_escapable.lastIndex = 0;
      if (json_escapable.test(string)) {
        return '"' + string.replace(json_escapable, function(a) {
          var c;

          c = json_meta[a];
          return (typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4));
        }) + '"';
      } else {
        return '"' + string + '"';
      }
    };
    json_str = function(key, holder) {
      var i, k, partial, v, value, _i, _len;

      value = holder[key];
      switch (typeof value) {
        case 'string':
          return json_quote(value);
        case 'number':
          if (isFinite(value)) {
            return String(value);
          } else {
            return 'null';
          }
        case 'boolean':
        case 'null':
          return String(value);
        case 'object':
          if (!value) {
            return 'null';
          }
          partial = [];
          if (Object.prototype.toString.apply(value) === '[object Array]') {
            for (i = _i = 0, _len = value.length; _i < _len; i = ++_i) {
              v = value[i];
              partial[i] = json_str(i, value) || 'null';
            }
            return (partial.length === 0 ? '[]' : '[' + partial.join(',') + ']');
          }
          for (k in value) {
            if (Object.prototype.hasOwnProperty.call(value, k)) {
              v = json_str(k, value);
              if (v) {
                partial.push(json_quote(k) + ':' + v);
              }
            }
          }
          return (partial.length === 0 ? '{}' : '{' + partial.join(',') + '}');
      }
    };
    if (this.JSON == null) {
      this.JSON = {};
    }
    this.JSON.stringify = function(value) {
      return json_str('', {
        '': value
      });
    };
  }

  html_escape = function(string) {
    return ('' + string).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g, '&#x2F;');
  };

  Position = {
    getName: function(position) {
      return Position.strings[position - 1];
    },
    nameToIndex: function(name) {
      var i, _i, _ref1;

      for (i = _i = 1, _ref1 = Position.strings.length; 1 <= _ref1 ? _i <= _ref1 : _i >= _ref1; i = 1 <= _ref1 ? ++_i : --_i) {
        if (Position.strings[i - 1] === name) {
          return i;
        }
      }
      return 0;
    }
  };

  Position.BEFORE = 1;

  Position.AFTER = 2;

  Position.INSIDE = 3;

  Position.NONE = 4;

  Position.strings = ['before', 'after', 'inside', 'none'];

  this.Tree.Position = Position;

  Node = (function() {
    function Node(o, is_root, node_class) {
      if (is_root == null) {
        is_root = false;
      }
      if (node_class == null) {
        node_class = Node;
      }
      this.setData(o);
      this.children = [];
      this.parent = null;
      if (is_root) {
        this.id_mapping = {};
        this.tree = this;
        this.node_class = node_class;
      }
    }

    Node.prototype.setData = function(o) {
      var key, value, _results;

      if (typeof o !== 'object') {
        return this.name = o;
      } else {
        _results = [];
        for (key in o) {
          value = o[key];
          if (key === 'label') {
            _results.push(this.name = value);
          } else {
            _results.push(this[key] = value);
          }
        }
        return _results;
      }
    };

    Node.prototype.initFromData = function(data) {
      var addChildren, addNode,
        _this = this;

      addNode = function(node_data) {
        _this.setData(node_data);
        if (node_data.children) {
          return addChildren(node_data.children);
        }
      };
      addChildren = function(children_data) {
        var child, node, _i, _len;

        for (_i = 0, _len = children_data.length; _i < _len; _i++) {
          child = children_data[_i];
          node = new _this.tree.node_class('');
          node.initFromData(child);
          _this.addChild(node);
        }
        return null;
      };
      addNode(data);
      return null;
    };

    /*
    Create tree from data.
    
    Structure of data is:
    [
        {
            label: 'node1',
            children: [
                { label: 'child1' },
                { label: 'child2' }
            ]
        },
        {
            label: 'node2'
        }
    ]
    */


    Node.prototype.loadFromData = function(data) {
      var node, o, _i, _len;

      this.removeChildren();
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        o = data[_i];
        node = new this.tree.node_class(o);
        this.addChild(node);
        if (typeof o === 'object' && o.children) {
          node.loadFromData(o.children);
        }
      }
      return null;
    };

    /*
    Add child.
    
    tree.addChild(
        new Node('child1')
    );
    */


    Node.prototype.addChild = function(node) {
      this.children.push(node);
      return node._setParent(this);
    };

    /*
    Add child at position. Index starts at 0.
    
    tree.addChildAtPosition(
        new Node('abc'),
        1
    );
    */


    Node.prototype.addChildAtPosition = function(node, index) {
      this.children.splice(index, 0, node);
      return node._setParent(this);
    };

    Node.prototype._setParent = function(parent) {
      this.parent = parent;
      this.tree = parent.tree;
      return this.tree.addNodeToIndex(this);
    };

    /*
    Remove child. This also removes the children of the node.
    
    tree.removeChild(tree.children[0]);
    */


    Node.prototype.removeChild = function(node) {
      node.removeChildren();
      return this._removeChild(node);
    };

    Node.prototype._removeChild = function(node) {
      this.children.splice(this.getChildIndex(node), 1);
      return this.tree.removeNodeFromIndex(node);
    };

    /*
    Get child index.
    
    var index = getChildIndex(node);
    */


    Node.prototype.getChildIndex = function(node) {
      return $.inArray(node, this.children);
    };

    /*
    Does the tree have children?
    
    if (tree.hasChildren()) {
        //
    }
    */


    Node.prototype.hasChildren = function() {
      return this.children.length !== 0;
    };

    Node.prototype.isFolder = function() {
      return this.hasChildren() || this.load_on_demand;
    };

    /*
    Iterate over all the nodes in the tree.
    
    Calls callback with (node, level).
    
    The callback must return true to continue the iteration on current node.
    
    tree.iterate(
        function(node, level) {
           console.log(node.name);
    
           // stop iteration after level 2
           return (level <= 2);
        }
    );
    */


    Node.prototype.iterate = function(callback) {
      var _iterate,
        _this = this;

      _iterate = function(node, level) {
        var child, result, _i, _len, _ref1;

        if (node.children) {
          _ref1 = node.children;
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            child = _ref1[_i];
            result = callback(child, level);
            if (_this.hasChildren() && result) {
              _iterate(child, level + 1);
            }
          }
          return null;
        }
      };
      _iterate(this, 0);
      return null;
    };

    /*
    Move node relative to another node.
    
    Argument position: Position.BEFORE, Position.AFTER or Position.Inside
    
    // move node1 after node2
    tree.moveNode(node1, node2, Position.AFTER);
    */


    Node.prototype.moveNode = function(moved_node, target_node, position) {
      if (moved_node.isParentOf(target_node)) {
        return;
      }
      moved_node.parent._removeChild(moved_node);
      if (position === Position.AFTER) {
        return target_node.parent.addChildAtPosition(moved_node, target_node.parent.getChildIndex(target_node) + 1);
      } else if (position === Position.BEFORE) {
        return target_node.parent.addChildAtPosition(moved_node, target_node.parent.getChildIndex(target_node));
      } else if (position === Position.INSIDE) {
        return target_node.addChildAtPosition(moved_node, 0);
      }
    };

    /*
    Get the tree as data.
    */


    Node.prototype.getData = function() {
      var getDataFromNodes,
        _this = this;

      getDataFromNodes = function(nodes) {
        var data, k, node, tmp_node, v, _i, _len;

        data = [];
        for (_i = 0, _len = nodes.length; _i < _len; _i++) {
          node = nodes[_i];
          tmp_node = {};
          for (k in node) {
            v = node[k];
            if ((k !== 'parent' && k !== 'children' && k !== 'element' && k !== 'tree') && Object.prototype.hasOwnProperty.call(node, k)) {
              tmp_node[k] = v;
            }
          }
          if (node.hasChildren()) {
            tmp_node.children = getDataFromNodes(node.children);
          }
          data.push(tmp_node);
        }
        return data;
      };
      return getDataFromNodes(this.children);
    };

    Node.prototype.getNodeByName = function(name) {
      var result;

      result = null;
      this.iterate(function(node) {
        if (node.name === name) {
          result = node;
          return false;
        } else {
          return true;
        }
      });
      return result;
    };

    Node.prototype.addAfter = function(node_info) {
      var child_index, node;

      if (!this.parent) {
        return null;
      } else {
        node = new this.tree.node_class(node_info);
        child_index = this.parent.getChildIndex(this);
        this.parent.addChildAtPosition(node, child_index + 1);
        return node;
      }
    };

    Node.prototype.addBefore = function(node_info) {
      var child_index, node;

      if (!this.parent) {
        return null;
      } else {
        node = new this.tree.node_class(node_info);
        child_index = this.parent.getChildIndex(this);
        this.parent.addChildAtPosition(node, child_index);
        return node;
      }
    };

    Node.prototype.addParent = function(node_info) {
      var child, new_parent, original_parent, _i, _len, _ref1;

      if (!this.parent) {
        return null;
      } else {
        new_parent = new this.tree.node_class(node_info);
        new_parent._setParent(this.tree);
        original_parent = this.parent;
        _ref1 = original_parent.children;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          child = _ref1[_i];
          new_parent.addChild(child);
        }
        original_parent.children = [];
        original_parent.addChild(new_parent);
        return new_parent;
      }
    };

    Node.prototype.remove = function() {
      if (this.parent) {
        this.parent.removeChild(this);
        return this.parent = null;
      }
    };

    Node.prototype.append = function(node_info) {
      var node;

      node = new this.tree.node_class(node_info);
      this.addChild(node);
      return node;
    };

    Node.prototype.prepend = function(node_info) {
      var node;

      node = new this.tree.node_class(node_info);
      this.addChildAtPosition(node, 0);
      return node;
    };

    Node.prototype.isParentOf = function(node) {
      var parent;

      parent = node.parent;
      while (parent) {
        if (parent === this) {
          return true;
        }
        parent = parent.parent;
      }
      return false;
    };

    Node.prototype.getLevel = function() {
      var level, node;

      level = 0;
      node = this;
      while (node.parent) {
        level += 1;
        node = node.parent;
      }
      return level;
    };

    Node.prototype.getNodeById = function(node_id) {
      return this.id_mapping[node_id];
    };

    Node.prototype.addNodeToIndex = function(node) {
      if (node.id) {
        return this.id_mapping[node.id] = node;
      }
    };

    Node.prototype.removeNodeFromIndex = function(node) {
      if (node.id) {
        return delete this.id_mapping[node.id];
      }
    };

    Node.prototype.removeChildren = function() {
      var _this = this;

      this.iterate(function(child) {
        _this.tree.removeNodeFromIndex(child);
        return true;
      });
      return this.children = [];
    };

    return Node;

  })();

  this.Tree.Node = Node;

  JqTreeWidget = (function(_super) {
    __extends(JqTreeWidget, _super);

    function JqTreeWidget() {
      _ref1 = JqTreeWidget.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    JqTreeWidget.prototype.defaults = {
      autoOpen: false,
      saveState: false,
      dragAndDrop: false,
      selectable: true,
      useContextMenu: true,
      onCanSelectNode: null,
      onSetStateFromStorage: null,
      onGetStateFromStorage: null,
      onCreateLi: null,
      onIsMoveHandle: null,
      onCanMove: null,
      onCanMoveTo: null,
      onLoadFailed: null,
      autoEscape: true,
      dataUrl: null,
      closedIcon: '<b class="caret"></b>',
      openedIcon: '<b class="caret"></b>',
      slide: true,
      nodeClass: Node
    };

    JqTreeWidget.prototype.toggle = function(node, slide) {
      if (slide == null) {
        slide = true;
      }
      if (node.is_open) {
        return this.closeNode(node, slide);
      } else {
        return this.openNode(node, slide);
      }
    };

    JqTreeWidget.prototype.getTree = function() {
      return this.tree;
    };

    JqTreeWidget.prototype.selectNode = function(node) {
      return this._selectNode(node, true);
    };

    JqTreeWidget.prototype._selectNode = function(node, must_toggle) {
      var canSelect, openParents, saveState,
        _this = this;

      if (must_toggle == null) {
        must_toggle = false;
      }
      canSelect = function() {
        if (!_this.options.onCanSelectNode) {
          return _this.options.selectable;
        }
        return _this.options.selectable && _this.options.onCanSelectNode(node);
      };
      openParents = function() {
        var parent;

        parent = node.parent;
        if (!parent.is_open && parent.parent) {
          return _this.openNode(parent, false);
        }
      };
      saveState = function() {
        if (_this.options.saveState) {
          return _this.save_state_handler.saveState();
        }
      };
      if (!node) {
        this._deselectCurrentNode();
        saveState;
        return;
      }
      if (!canSelect()) {
        return;
      }
      if (this.select_node_handler.isNodeSelected(node)) {
        if (must_toggle) {
          this._deselectCurrentNode();
          this._triggerEvent('tree.select', {
            node: null
          });
        }
      } else {
        this._deselectCurrentNode();
        this.addToSelection(node);
        this._triggerEvent('tree.select', {
          node: node
        });
        openParents();
      }
      return saveState();
    };

    JqTreeWidget.prototype.getSelectedNode = function() {
      return this.select_node_handler.getSelectedNode();
    };

    JqTreeWidget.prototype.toJson = function() {
      return JSON.stringify(this.tree.getData());
    };

    JqTreeWidget.prototype.loadData = function(data, parent_node) {
      return this._loadData(data, parent_node);
    };

    JqTreeWidget.prototype.loadDataFromUrl = function(url, parent_node, on_finished) {
      if ($.type(url) !== 'string') {
        on_finished = parent_node;
        parent_node = url;
        url = null;
      }
      return this._loadDataFromUrl(url, parent_node, on_finished);
    };

    JqTreeWidget.prototype._loadDataFromUrl = function(url_info, parent_node, on_finished) {
      var $el, addLoadingClass, parseUrlInfo, removeLoadingClass,
        _this = this;

      $el = null;
      addLoadingClass = function() {
        var folder_element;

        if (!parent_node) {
          $el = _this.element;
        } else {
          folder_element = new FolderElement(parent_node, _this);
          $el = folder_element.getLi();
        }
        return $el.addClass('jqtree-loading');
      };
      removeLoadingClass = function() {
        if ($el) {
          return $el.removeClass('jqtree-loading');
        }
      };
      parseUrlInfo = function() {
        if ($.type(url_info) === 'string') {
          url_info = {
            url: url_info
          };
        }
        if (!url_info.method) {
          return url_info.method = 'get';
        }
      };
      addLoadingClass();
      if (!url_info) {
        url_info = this._getDataUrlInfo(parent_node);
      }
      parseUrlInfo();
      return $.ajax({
        url: url_info.url,
        data: url_info.data,
        type: url_info.method.toUpperCase(),
        cache: false,
        dataType: 'json',
        success: function(response) {
          var data;

          if ($.isArray(response) || typeof response === 'object') {
            data = response;
          } else {
            data = $.parseJSON(response);
          }
          removeLoadingClass();
          _this._loadData(data, parent_node);
          if (on_finished && $.isFunction(on_finished)) {
            return on_finished();
          }
        },
        error: function(response) {
          removeLoadingClass();
          if (_this.options.onLoadFailed) {
            return _this.options.onLoadFailed(response);
          }
        }
      });
    };

    JqTreeWidget.prototype._loadData = function(data, parent_node) {
      var n, selected_nodes_under_parent, _i, _len;

      this._triggerEvent('tree.load_data', {
        tree_data: data
      });
      if (!parent_node) {
        this._initTree(data, false, this.options.nodeClass);
      } else {
        selected_nodes_under_parent = this.select_node_handler.getSelectedNodes(parent_node);
        for (_i = 0, _len = selected_nodes_under_parent.length; _i < _len; _i++) {
          n = selected_nodes_under_parent[_i];
          this.select_node_handler.removeFromSelection(n);
        }
        parent_node.loadFromData(data);
        parent_node.load_on_demand = false;
        this._refreshElements(parent_node.parent);
      }
      if (this.is_dragging) {
        return this.dnd_handler.refreshHitAreas();
      }
    };

    JqTreeWidget.prototype.getNodeById = function(node_id) {
      return this.tree.getNodeById(node_id);
    };

    JqTreeWidget.prototype.getNodeByName = function(name) {
      return this.tree.getNodeByName(name);
    };

    JqTreeWidget.prototype.openNode = function(node, slide) {
      if (slide == null) {
        slide = true;
      }
      return this._openNode(node, slide);
    };

    JqTreeWidget.prototype._openNode = function(node, slide, on_finished) {
      var doOpenNode, parent,
        _this = this;

      if (slide == null) {
        slide = true;
      }
      doOpenNode = function(_node, _slide, _on_finished) {
        var folder_element;

        folder_element = new FolderElement(_node, _this);
        return folder_element.open(_on_finished, _slide);
      };
      if (node.isFolder()) {
        if (node.load_on_demand) {
          return this._loadFolderOnDemand(node, slide, on_finished);
        } else {
          parent = node.parent;
          while (parent && !parent.is_open) {
            if (parent.parent) {
              doOpenNode(parent, false, null);
            }
            parent = parent.parent;
          }
          doOpenNode(node, slide, on_finished);
          return this._saveState();
        }
      }
    };

    JqTreeWidget.prototype._loadFolderOnDemand = function(node, slide, on_finished) {
      var _this = this;

      if (slide == null) {
        slide = true;
      }
      return this._loadDataFromUrl(null, node, function() {
        return _this._openNode(node, slide, on_finished);
      });
    };

    JqTreeWidget.prototype.closeNode = function(node, slide) {
      if (slide == null) {
        slide = true;
      }
      if (node.isFolder()) {
        new FolderElement(node, this).close(slide);
        return this._saveState();
      }
    };

    JqTreeWidget.prototype.isDragging = function() {
      return this.is_dragging;
    };

    JqTreeWidget.prototype.refreshHitAreas = function() {
      return this.dnd_handler.refreshHitAreas();
    };

    JqTreeWidget.prototype.addNodeAfter = function(new_node_info, existing_node) {
      var new_node;

      new_node = existing_node.addAfter(new_node_info);
      this._refreshElements(existing_node.parent);
      return new_node;
    };

    JqTreeWidget.prototype.addNodeBefore = function(new_node_info, existing_node) {
      var new_node;

      new_node = existing_node.addBefore(new_node_info);
      this._refreshElements(existing_node.parent);
      return new_node;
    };

    JqTreeWidget.prototype.addParentNode = function(new_node_info, existing_node) {
      var new_node;

      new_node = existing_node.addParent(new_node_info);
      this._refreshElements(new_node.parent);
      return new_node;
    };

    JqTreeWidget.prototype.removeNode = function(node) {
      var parent;

      parent = node.parent;
      if (parent) {
        this.select_node_handler.removeFromSelection(node, true);
        node.remove();
        return this._refreshElements(parent.parent);
      }
    };

    JqTreeWidget.prototype.appendNode = function(new_node_info, parent_node) {
      var is_already_root_node, node;

      if (!parent_node) {
        parent_node = this.tree;
      }
      is_already_root_node = parent_node.isFolder();
      node = parent_node.append(new_node_info);
      if (is_already_root_node) {
        this._refreshElements(parent_node);
      } else {
        this._refreshElements(parent_node.parent);
      }
      return node;
    };

    JqTreeWidget.prototype.prependNode = function(new_node_info, parent_node) {
      var node;

      if (!parent_node) {
        parent_node = this.tree;
      }
      node = parent_node.prepend(new_node_info);
      this._refreshElements(parent_node);
      return node;
    };

    JqTreeWidget.prototype.updateNode = function(node, data) {
      node.setData(data);
      this._refreshElements(node.parent);
      return this._selectCurrentNode();
    };

    JqTreeWidget.prototype.moveNode = function(node, target_node, position) {
      var position_index;

      position_index = Position.nameToIndex(position);
      this.tree.moveNode(node, target_node, position_index);
      return this._refreshElements();
    };

    JqTreeWidget.prototype.getStateFromStorage = function() {
      return this.save_state_handler.getStateFromStorage();
    };

    JqTreeWidget.prototype.addToSelection = function(node) {
      this.select_node_handler.addToSelection(node);
      return this._getNodeElementForNode(node).select();
    };

    JqTreeWidget.prototype.getSelectedNodes = function() {
      return this.select_node_handler.getSelectedNodes();
    };

    JqTreeWidget.prototype.isNodeSelected = function(node) {
      return this.select_node_handler.isNodeSelected(node);
    };

    JqTreeWidget.prototype.removeFromSelection = function(node) {
      this.select_node_handler.removeFromSelection(node);
      return this._getNodeElementForNode(node).deselect();
    };

    JqTreeWidget.prototype.scrollToNode = function(node) {
      var $element, top;

      $element = $(node.element);
      top = $element.offset().top - this.$el.offset().top;
      return this.scroll_handler.scrollTo(top);
    };

    JqTreeWidget.prototype._init = function() {
      JqTreeWidget.__super__._init.call(this);
      this.element = this.$el;
      this.mouse_delay = 300;
      this.save_state_handler = new SaveStateHandler(this);
      this.select_node_handler = new SelectNodeHandler(this);
      this.dnd_handler = new DragAndDropHandler(this);
      this.scroll_handler = new ScrollHandler(this);
      this._initData();
      this.element.click($.proxy(this._click, this));
      if (this.options.useContextMenu) {
        return this.element.bind('contextmenu', $.proxy(this._contextmenu, this));
      }
    };

    JqTreeWidget.prototype._deinit = function() {
      this.element.empty();
      this.element.unbind();
      this.tree = null;
      return JqTreeWidget.__super__._deinit.call(this);
    };

    JqTreeWidget.prototype._initData = function() {
      if (this.options.data) {
        return this._loadData(this.options.data);
      } else {
        return this._loadDataFromUrl(this._getDataUrlInfo());
      }
    };

    JqTreeWidget.prototype._getDataUrlInfo = function(node) {
      var data, data_url, url_info;

      data_url = this.options.dataUrl || this.element.data('url');
      if ($.isFunction(data_url)) {
        return data_url(node);
      } else if ($.type(data_url) === 'string') {
        url_info = {
          url: data_url
        };
        if (node && node.id) {
          data = {
            node: node.id
          };
          url_info['data'] = data;
        }
        return url_info;
      } else {
        return data_url;
      }
    };

    JqTreeWidget.prototype._initTree = function(data) {
      this.tree = new this.options.nodeClass(null, true, this.options.nodeClass);
      this.select_node_handler.clear();
      this.tree.loadFromData(data);
      this._openNodes();
      this._refreshElements();
      return this._triggerEvent('tree.init');
    };

    JqTreeWidget.prototype._openNodes = function() {
      var max_level;

      if (this.options.saveState) {
        if (this.save_state_handler.restoreState()) {
          return;
        }
      }
      if (this.options.autoOpen === false) {
        return;
      } else if (this.options.autoOpen === true) {
        max_level = -1;
      } else {
        max_level = parseInt(this.options.autoOpen);
      }
      return this.tree.iterate(function(node, level) {
        if (node.hasChildren()) {
          node.is_open = true;
        }
        return level !== max_level;
      });
    };

    JqTreeWidget.prototype._refreshElements = function(from_node) {
      var $element, createFolderLi, createLi, createNodeLi, createUl, doCreateDomElements, escapeIfNecessary, is_root_node, node_element,
        _this = this;

      if (from_node == null) {
        from_node = null;
      }
      escapeIfNecessary = function(value) {
        if (_this.options.autoEscape) {
          return html_escape(value);
        } else {
          return value;
        }
      };
      createUl = function(is_root_node) {
        var class_string;

        if (is_root_node) {
          class_string = 'jqtree-tree';
        } else {
          class_string = '';
        }
        return $("<ul class=\"jqtree_common " + class_string + "\"></ul>");
      };
      createLi = function(node) {
        var $li;

        if (node.isFolder()) {
          $li = createFolderLi(node);
        } else {
          $li = createNodeLi(node);
        }
        if (_this.options.onCreateLi) {
          _this.options.onCreateLi(node, $li);
        }
        return $li;
      };
      createNodeLi = function(node) {
        var class_string, escaped_name, li_classes;

        li_classes = ['jqtree_common'];
        if (_this.select_node_handler.isNodeSelected(node)) {
          li_classes.push('jqtree-selected');
        }
        class_string = li_classes.join(' ');
        escaped_name = escapeIfNecessary(node.name);
        return $("<li class=\"" + class_string + "\"><div class=\"jqtree-element jqtree_common\"><span class=\"jqtree-title jqtree_common\">" + escaped_name + "</span></div></li>");
      };
      createFolderLi = function(node) {
        var button_char, button_classes, escaped_name, folder_classes, getButtonClasses, getFolderClasses;

        getButtonClasses = function() {
          var classes;

          classes = ['jqtree-toggler'];
          if (!node.is_open) {
            classes.push('jqtree-closed');
          }
          return classes.join(' ');
        };
        getFolderClasses = function() {
          var classes;

          classes = ['jqtree-folder'];
          if (!node.is_open) {
            classes.push('jqtree-closed');
          }
          if (_this.select_node_handler.isNodeSelected(node)) {
            classes.push('jqtree-selected');
          }
          return classes.join(' ');
        };
        button_classes = getButtonClasses();
        folder_classes = getFolderClasses();
        escaped_name = escapeIfNecessary(node.name);
        if (node.is_open) {
          button_char = _this.options.openedIcon;
        } else {
          button_char = _this.options.closedIcon;
        }
        return $("<li class=\"jqtree_common " + folder_classes + "\"><div class=\"jqtree-element jqtree_common\"><a class=\"jqtree_common " + button_classes + "\">" + button_char + "</a><span class=\"jqtree_common jqtree-title\">" + escaped_name + "</span></div></li>");
      };
      doCreateDomElements = function($element, children, is_root_node, is_open) {
        var $li, $ul, child, _i, _len;

        $ul = createUl(is_root_node);
        $element.append($ul);
        for (_i = 0, _len = children.length; _i < _len; _i++) {
          child = children[_i];
          $li = createLi(child);
          $ul.append($li);
          child.element = $li[0];
          $li.data('node', child);
          if (child.hasChildren()) {
            doCreateDomElements($li, child.children, false, child.is_open);
          }
        }
        return null;
      };
      if (from_node && from_node.parent) {
        is_root_node = false;
        node_element = this._getNodeElementForNode(from_node);
        node_element.getUl().remove();
        $element = node_element.$element;
      } else {
        from_node = this.tree;
        $element = this.element;
        $element.empty();
        is_root_node = true;
      }
      doCreateDomElements($element, from_node.children, is_root_node, is_root_node);
      return this._triggerEvent('tree.refresh');
    };

    JqTreeWidget.prototype._click = function(e) {
      var $button, $el, $target, event, node;

      if (e.ctrlKey) {
        return;
      }
      $target = $(e.target);
      $button = $target.closest('.jqtree-toggler');
      if ($button.length) {
        node = this._getNode($button);
        if (node) {
          this.toggle(node, this.options.slide);
          e.preventDefault();
          return e.stopPropagation();
        }
      } else {
        $el = $target.closest('.jqtree-element');
        if ($el.length) {
          node = this._getNode($el);
          if (node) {
            event = this._triggerEvent('tree.click', {
              node: node
            });
            if (!event.isDefaultPrevented()) {
              return this._selectNode(node, true);
            }
          }
        }
      }
    };

    JqTreeWidget.prototype._getNode = function($element) {
      var $li;

      $li = $element.closest('li');
      if ($li.length === 0) {
        return null;
      } else {
        return $li.data('node');
      }
    };

    JqTreeWidget.prototype._getNodeElementForNode = function(node) {
      if (node.isFolder()) {
        return new FolderElement(node, this);
      } else {
        return new NodeElement(node, this);
      }
    };

    JqTreeWidget.prototype._getNodeElement = function($element) {
      var node;

      node = this._getNode($element);
      if (node) {
        return this._getNodeElementForNode(node);
      } else {
        return null;
      }
    };

    JqTreeWidget.prototype._contextmenu = function(e) {
      var $div, node;

      $div = $(e.target).closest('ul.jqtree-tree .jqtree-element');
      if ($div.length) {
        node = this._getNode($div);
        if (node) {
          e.preventDefault();
          e.stopPropagation();
          this._triggerEvent('tree.contextmenu', {
            node: node,
            click_event: e
          });
          return false;
        }
      }
    };

    JqTreeWidget.prototype._saveState = function() {
      if (this.options.saveState) {
        return this.save_state_handler.saveState();
      }
    };

    JqTreeWidget.prototype._mouseCapture = function(event) {
      if (this.options.dragAndDrop) {
        return this.dnd_handler.mouseCapture(event);
      } else {
        return false;
      }
    };

    JqTreeWidget.prototype._mouseStart = function(event) {
      if (this.options.dragAndDrop) {
        return this.dnd_handler.mouseStart(event);
      } else {
        return false;
      }
    };

    JqTreeWidget.prototype._mouseDrag = function(event) {
      var result;

      if (this.options.dragAndDrop) {
        result = this.dnd_handler.mouseDrag(event);
        this.scroll_handler.checkScrolling();
        return result;
      } else {
        return false;
      }
    };

    JqTreeWidget.prototype._mouseStop = function(e) {
      if (this.options.dragAndDrop) {
        return this.dnd_handler.mouseStop(e);
      } else {
        return false;
      }
    };

    JqTreeWidget.prototype._triggerEvent = function(event_name, values) {
      var event;

      event = $.Event(event_name);
      $.extend(event, values);
      this.element.trigger(event);
      return event;
    };

    JqTreeWidget.prototype.testGenerateHitAreas = function(moving_node) {
      this.dnd_handler.current_item = this._getNodeElementForNode(moving_node);
      this.dnd_handler.generateHitAreas();
      return this.dnd_handler.hit_areas;
    };

    JqTreeWidget.prototype._selectCurrentNode = function() {
      var node, node_element;

      node = this.getSelectedNode();
      if (node) {
        node_element = this._getNodeElementForNode(node);
        if (node_element) {
          return node_element.select();
        }
      }
    };

    JqTreeWidget.prototype._deselectCurrentNode = function() {
      var node;

      node = this.getSelectedNode();
      if (node) {
        return this.removeFromSelection(node);
      }
    };

    return JqTreeWidget;

  })(MouseWidget);

  SimpleWidget.register(JqTreeWidget, 'tree');

  GhostDropHint = (function() {
    function GhostDropHint(node, $element, position) {
      this.$element = $element;
      this.node = node;
      this.$ghost = $('<li class="jqtree_common jqtree-ghost"><span class="jqtree_common jqtree-circle"></span><span class="jqtree_common jqtree-line"></span></li>');
      if (position === Position.AFTER) {
        this.moveAfter();
      } else if (position === Position.BEFORE) {
        this.moveBefore();
      } else if (position === Position.INSIDE) {
        if (node.isFolder() && node.is_open) {
          this.moveInsideOpenFolder();
        } else {
          this.moveInside();
        }
      }
    }

    GhostDropHint.prototype.remove = function() {
      return this.$ghost.remove();
    };

    GhostDropHint.prototype.moveAfter = function() {
      return this.$element.after(this.$ghost);
    };

    GhostDropHint.prototype.moveBefore = function() {
      return this.$element.before(this.$ghost);
    };

    GhostDropHint.prototype.moveInsideOpenFolder = function() {
      return $(this.node.children[0].element).before(this.$ghost);
    };

    GhostDropHint.prototype.moveInside = function() {
      this.$element.after(this.$ghost);
      return this.$ghost.addClass('jqtree-inside');
    };

    return GhostDropHint;

  })();

  BorderDropHint = (function() {
    function BorderDropHint($element) {
      var $div, width;

      $div = $element.children('.jqtree-element');
      width = $element.width() - 4;
      this.$hint = $('<span class="jqtree-border"></span>');
      $div.append(this.$hint);
      this.$hint.css({
        width: width,
        height: $div.height() - 4
      });
    }

    BorderDropHint.prototype.remove = function() {
      return this.$hint.remove();
    };

    return BorderDropHint;

  })();

  NodeElement = (function() {
    function NodeElement(node, tree_widget) {
      this.init(node, tree_widget);
    }

    NodeElement.prototype.init = function(node, tree_widget) {
      this.node = node;
      this.tree_widget = tree_widget;
      return this.$element = $(node.element);
    };

    NodeElement.prototype.getUl = function() {
      return this.$element.children('ul:first');
    };

    NodeElement.prototype.getSpan = function() {
      return this.$element.children('.jqtree-element').find('span.jqtree-title');
    };

    NodeElement.prototype.getLi = function() {
      return this.$element;
    };

    NodeElement.prototype.addDropHint = function(position) {
      if (position === Position.INSIDE) {
        return new BorderDropHint(this.$element);
      } else {
        return new GhostDropHint(this.node, this.$element, position);
      }
    };

    NodeElement.prototype.select = function() {
      return this.getLi().addClass('jqtree-selected');
    };

    NodeElement.prototype.deselect = function() {
      return this.getLi().removeClass('jqtree-selected');
    };

    return NodeElement;

  })();

  FolderElement = (function(_super) {
    __extends(FolderElement, _super);

    function FolderElement() {
      _ref2 = FolderElement.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    FolderElement.prototype.open = function(on_finished, slide) {
      var $button, doOpen,
        _this = this;

      if (slide == null) {
        slide = true;
      }
      if (!this.node.is_open) {
        this.node.is_open = true;
        $button = this.getButton();
        $button.removeClass('jqtree-closed');
        $button.html(this.tree_widget.options.openedIcon);
        doOpen = function() {
          _this.getLi().removeClass('jqtree-closed');
          if (on_finished) {
            on_finished();
          }
          return _this.tree_widget._triggerEvent('tree.open', {
            node: _this.node
          });
        };
        if (slide) {
          return this.getUl().slideDown('fast', doOpen);
        } else {
          this.getUl().show();
          return doOpen();
        }
      }
    };

    FolderElement.prototype.close = function(slide) {
      var $button, doClose,
        _this = this;

      if (slide == null) {
        slide = true;
      }
      if (this.node.is_open) {
        this.node.is_open = false;
        $button = this.getButton();
        $button.addClass('jqtree-closed');
        $button.html(this.tree_widget.options.closedIcon);
        doClose = function() {
          _this.getLi().addClass('jqtree-closed');
          return _this.tree_widget._triggerEvent('tree.close', {
            node: _this.node
          });
        };
        if (slide) {
          return this.getUl().slideUp('fast', doClose);
        } else {
          this.getUl().hide();
          return doClose();
        }
      }
    };

    FolderElement.prototype.getButton = function() {
      return this.$element.children('.jqtree-element').find('a.jqtree-toggler');
    };

    FolderElement.prototype.addDropHint = function(position) {
      if (!this.node.is_open && position === Position.INSIDE) {
        return new BorderDropHint(this.$element);
      } else {
        return new GhostDropHint(this.node, this.$element, position);
      }
    };

    return FolderElement;

  })(NodeElement);

  DragElement = (function() {
    function DragElement(node, offset_x, offset_y, $tree) {
      this.offset_x = offset_x;
      this.offset_y = offset_y;
      this.$element = $("<span class=\"jqtree-title jqtree-dragging\">" + node.name + "</span>");
      this.$element.css("position", "absolute");
      $tree.append(this.$element);
    }

    DragElement.prototype.move = function(page_x, page_y) {
      return this.$element.offset({
        left: page_x - this.offset_x,
        top: page_y - this.offset_y
      });
    };

    DragElement.prototype.remove = function() {
      return this.$element.remove();
    };

    return DragElement;

  })();

  SaveStateHandler = (function() {
    function SaveStateHandler(tree_widget) {
      this.tree_widget = tree_widget;
    }

    SaveStateHandler.prototype.saveState = function() {
      if (this.tree_widget.options.onSetStateFromStorage) {
        return this.tree_widget.options.onSetStateFromStorage(this.getState());
      } else if (typeof localStorage !== "undefined" && localStorage !== null) {
        return localStorage.setItem(this.getCookieName(), this.getState());
      } else if ($.cookie) {
        $.cookie.raw = true;
        return $.cookie(this.getCookieName(), this.getState(), {
          path: '/'
        });
      }
    };

    SaveStateHandler.prototype.restoreState = function() {
      var state;

      state = this.getStateFromStorage();
      if (state) {
        this.setState(state);
        return true;
      } else {
        return false;
      }
    };

    SaveStateHandler.prototype.getStateFromStorage = function() {
      if (this.tree_widget.options.onGetStateFromStorage) {
        return this.tree_widget.options.onGetStateFromStorage();
      } else if (typeof localStorage !== "undefined" && localStorage !== null) {
        return localStorage.getItem(this.getCookieName());
      } else if ($.cookie) {
        $.cookie.raw = true;
        return $.cookie(this.getCookieName());
      } else {
        return null;
      }
    };

    SaveStateHandler.prototype.getState = function() {
      var open_nodes, selected_node, selected_node_id,
        _this = this;

      open_nodes = [];
      this.tree_widget.tree.iterate(function(node) {
        if (node.is_open && node.id && node.hasChildren()) {
          open_nodes.push(node.id);
        }
        return true;
      });
      selected_node = this.tree_widget.getSelectedNode();
      if (selected_node) {
        selected_node_id = selected_node.id;
      } else {
        selected_node_id = '';
      }
      return JSON.stringify({
        open_nodes: open_nodes,
        selected_node: selected_node_id
      });
    };

    SaveStateHandler.prototype.setState = function(state) {
      var data, open_nodes, selected_node, selected_node_id,
        _this = this;

      data = $.parseJSON(state);
      if (data) {
        open_nodes = data.open_nodes;
        selected_node_id = data.selected_node;
        this.tree_widget.tree.iterate(function(node) {
          if (node.id && node.hasChildren() && (indexOf(open_nodes, node.id) >= 0)) {
            node.is_open = true;
          }
          return true;
        });
        if (selected_node_id) {
          selected_node = this.tree_widget.getNodeById(selected_node_id);
          if (selected_node) {
            return this.tree_widget.select_node_handler.addToSelection(selected_node);
          }
        }
      }
    };

    SaveStateHandler.prototype.getCookieName = function() {
      if (typeof this.tree_widget.options.saveState === 'string') {
        return this.tree_widget.options.saveState;
      } else {
        return 'tree';
      }
    };

    return SaveStateHandler;

  })();

  SelectNodeHandler = (function() {
    function SelectNodeHandler(tree_widget) {
      this.tree_widget = tree_widget;
      this.clear();
    }

    SelectNodeHandler.prototype.getSelectedNode = function() {
      var selected_nodes;

      selected_nodes = this.getSelectedNodes();
      if (selected_nodes.length) {
        return selected_nodes[0];
      } else {
        return false;
      }
    };

    SelectNodeHandler.prototype.getSelectedNodes = function() {
      var id, node, selected_nodes;

      if (this.selected_single_node) {
        return [this.selected_single_node];
      } else {
        selected_nodes = [];
        for (id in this.selected_nodes) {
          node = this.tree_widget.getNodeById(id);
          if (node) {
            selected_nodes.push(node);
          }
        }
        return selected_nodes;
      }
    };

    SelectNodeHandler.prototype.isNodeSelected = function(node) {
      if (node.id) {
        return this.selected_nodes[node.id];
      } else if (this.selected_single_node) {
        return this.selected_single_node.element === node.element;
      } else {
        return false;
      }
    };

    SelectNodeHandler.prototype.clear = function() {
      this.selected_nodes = {};
      return this.selected_single_node = null;
    };

    SelectNodeHandler.prototype.removeFromSelection = function(node, include_children) {
      var _this = this;

      if (include_children == null) {
        include_children = false;
      }
      if (!node.id) {
        if (node.element === this.selected_single_node) {
          return this.selected_single_node = null;
        }
      } else {
        delete this.selected_nodes[node.id];
        if (include_children) {
          return node.iterate(function(n) {
            delete _this.selected_nodes[node.id];
            return true;
          });
        }
      }
    };

    SelectNodeHandler.prototype.addToSelection = function(node) {
      if (node.id) {
        return this.selected_nodes[node.id] = true;
      } else {
        return this.selected_single_node = node;
      }
    };

    return SelectNodeHandler;

  })();

  DragAndDropHandler = (function() {
    function DragAndDropHandler(tree_widget) {
      this.tree_widget = tree_widget;
      this.hovered_area = null;
      this.$ghost = null;
      this.hit_areas = [];
      this.is_dragging = false;
    }

    DragAndDropHandler.prototype.mouseCapture = function(event) {
      var $element, node_element;

      $element = $(event.target);
      if (this.tree_widget.options.onIsMoveHandle && !this.tree_widget.options.onIsMoveHandle($element)) {
        return null;
      }
      node_element = this.tree_widget._getNodeElement($element);
      if (node_element && this.tree_widget.options.onCanMove) {
        if (!this.tree_widget.options.onCanMove(node_element.node)) {
          node_element = null;
        }
      }
      this.current_item = node_element;
      return this.current_item !== null;
    };

    DragAndDropHandler.prototype.mouseStart = function(event) {
      var offsetX, offsetY, _ref3;

      this.refreshHitAreas();
      _ref3 = this.getOffsetFromEvent(event), offsetX = _ref3[0], offsetY = _ref3[1];
      this.drag_element = new DragElement(this.current_item.node, offsetX, offsetY, this.tree_widget.element);
      this.is_dragging = true;
      this.current_item.$element.addClass('jqtree-moving');
      return true;
    };

    DragAndDropHandler.prototype.mouseDrag = function(event) {
      var area, can_move_to;

      this.drag_element.move(event.pageX, event.pageY);
      area = this.findHoveredArea(event.pageX, event.pageY);
      can_move_to = this.canMoveToArea(area);
      if (area) {
        if (this.hovered_area !== area) {
          this.hovered_area = area;
          if (this.mustOpenFolderTimer(area)) {
            this.startOpenFolderTimer(area.node);
          }
          if (can_move_to) {
            this.updateDropHint();
          }
        }
      } else {
        this.removeHover();
        this.removeDropHint();
        this.stopOpenFolderTimer();
      }
      return true;
    };

    DragAndDropHandler.prototype.canMoveToArea = function(area) {
      var position_name;

      if (!area) {
        return false;
      } else if (this.tree_widget.options.onCanMoveTo) {
        position_name = Position.getName(area.position);
        return this.tree_widget.options.onCanMoveTo(this.current_item.node, area.node, position_name);
      } else {
        return true;
      }
    };

    DragAndDropHandler.prototype.mouseStop = function(e) {
      this.moveItem(e);
      this.clear();
      this.removeHover();
      this.removeDropHint();
      this.removeHitAreas();
      this.current_item.$element.removeClass('jqtree-moving');
      this.is_dragging = false;
      return false;
    };

    DragAndDropHandler.prototype.getOffsetFromEvent = function(event) {
      var element_offset;

      element_offset = $(event.target).offset();
      return [event.pageX - element_offset.left, event.pageY - element_offset.top];
    };

    DragAndDropHandler.prototype.refreshHitAreas = function() {
      this.removeHitAreas();
      return this.generateHitAreas();
    };

    DragAndDropHandler.prototype.removeHitAreas = function() {
      return this.hit_areas = [];
    };

    DragAndDropHandler.prototype.clear = function() {
      this.drag_element.remove();
      return this.drag_element = null;
    };

    DragAndDropHandler.prototype.removeDropHint = function() {
      if (this.previous_ghost) {
        return this.previous_ghost.remove();
      }
    };

    DragAndDropHandler.prototype.removeHover = function() {
      return this.hovered_area = null;
    };

    DragAndDropHandler.prototype.generateHitAreas = function() {
      var addPosition, getTop, groupPositions, handleAfterOpenFolder, handleClosedFolder, handleFirstNode, handleNode, handleOpenFolder, hit_areas, last_top, positions,
        _this = this;

      positions = [];
      last_top = 0;
      getTop = function($element) {
        return $element.offset().top;
      };
      addPosition = function(node, position, top) {
        positions.push({
          top: top,
          node: node,
          position: position
        });
        return last_top = top;
      };
      groupPositions = function(handle_group) {
        var group, position, previous_top, _i, _len;

        previous_top = -1;
        group = [];
        for (_i = 0, _len = positions.length; _i < _len; _i++) {
          position = positions[_i];
          if (position.top !== previous_top) {
            if (group.length) {
              handle_group(group, previous_top, position.top);
            }
            previous_top = position.top;
            group = [];
          }
          group.push(position);
        }
        return handle_group(group, previous_top, _this.tree_widget.element.offset().top + _this.tree_widget.element.height());
      };
      handleNode = function(node, next_node, $element) {
        var top;

        top = getTop($element);
        if (node === _this.current_item.node) {
          addPosition(node, Position.NONE, top);
        } else {
          addPosition(node, Position.INSIDE, top);
        }
        if (next_node === _this.current_item.node || node === _this.current_item.node) {
          return addPosition(node, Position.NONE, top);
        } else {
          return addPosition(node, Position.AFTER, top);
        }
      };
      handleOpenFolder = function(node, $element) {
        if (node === _this.current_item.node) {
          return false;
        }
        if (node.children[0] !== _this.current_item.node) {
          addPosition(node, Position.INSIDE, getTop($element));
        }
        return true;
      };
      handleAfterOpenFolder = function(node, next_node, $element) {
        if (node === _this.current_item.node || next_node === _this.current_item.node) {
          return addPosition(node, Position.NONE, last_top);
        } else {
          return addPosition(node, Position.AFTER, last_top);
        }
      };
      handleClosedFolder = function(node, next_node, $element) {
        var top;

        top = getTop($element);
        if (node === _this.current_item.node) {
          return addPosition(node, Position.NONE, top);
        } else {
          addPosition(node, Position.INSIDE, top);
          if (next_node !== _this.current_item.node) {
            return addPosition(node, Position.AFTER, top);
          }
        }
      };
      handleFirstNode = function(node, $element) {
        if (node !== _this.current_item.node) {
          return addPosition(node, Position.BEFORE, getTop($(node.element)));
        }
      };
      this.iterateVisibleNodes(handleNode, handleOpenFolder, handleClosedFolder, handleAfterOpenFolder, handleFirstNode);
      hit_areas = [];
      groupPositions(function(positions_in_group, top, bottom) {
        var area_height, area_top, position, _i, _len;

        area_height = (bottom - top) / positions_in_group.length;
        area_top = top;
        for (_i = 0, _len = positions_in_group.length; _i < _len; _i++) {
          position = positions_in_group[_i];
          hit_areas.push({
            top: area_top,
            bottom: area_top + area_height,
            node: position.node,
            position: position.position
          });
          area_top += area_height;
        }
        return null;
      });
      return this.hit_areas = hit_areas;
    };

    DragAndDropHandler.prototype.iterateVisibleNodes = function(handle_node, handle_open_folder, handle_closed_folder, handle_after_open_folder, handle_first_node) {
      var is_first_node, iterate,
        _this = this;

      is_first_node = true;
      iterate = function(node, next_node) {
        var $element, child, children_length, i, must_iterate_inside, _i, _len, _ref3;

        must_iterate_inside = (node.is_open || !node.element) && node.hasChildren();
        if (node.element) {
          $element = $(node.element);
          if (!$element.is(':visible')) {
            return;
          }
          if (is_first_node) {
            handle_first_node(node, $element);
            is_first_node = false;
          }
          if (!node.hasChildren()) {
            handle_node(node, next_node, $element);
          } else if (node.is_open) {
            if (!handle_open_folder(node, $element)) {
              must_iterate_inside = false;
            }
          } else {
            handle_closed_folder(node, next_node, $element);
          }
        }
        if (must_iterate_inside) {
          children_length = node.children.length;
          _ref3 = node.children;
          for (i = _i = 0, _len = _ref3.length; _i < _len; i = ++_i) {
            child = _ref3[i];
            if (i === (children_length - 1)) {
              iterate(node.children[i], null);
            } else {
              iterate(node.children[i], node.children[i + 1]);
            }
          }
          if (node.is_open) {
            return handle_after_open_folder(node, next_node, $element);
          }
        }
      };
      return iterate(this.tree_widget.tree);
    };

    DragAndDropHandler.prototype.findHoveredArea = function(x, y) {
      var area, high, low, mid, tree_offset;

      tree_offset = this.tree_widget.element.offset();
      if (x < tree_offset.left || y < tree_offset.top || x > (tree_offset.left + this.tree_widget.element.width()) || y > (tree_offset.top + this.tree_widget.element.height())) {
        return null;
      }
      low = 0;
      high = this.hit_areas.length;
      while (low < high) {
        mid = (low + high) >> 1;
        area = this.hit_areas[mid];
        if (y < area.top) {
          high = mid;
        } else if (y > area.bottom) {
          low = mid + 1;
        } else {
          return area;
        }
      }
      return null;
    };

    DragAndDropHandler.prototype.mustOpenFolderTimer = function(area) {
      var node;

      node = area.node;
      return node.isFolder() && !node.is_open && area.position === Position.INSIDE;
    };

    DragAndDropHandler.prototype.updateDropHint = function() {
      var node_element;

      if (!this.hovered_area) {
        return;
      }
      this.removeDropHint();
      node_element = this.tree_widget._getNodeElementForNode(this.hovered_area.node);
      return this.previous_ghost = node_element.addDropHint(this.hovered_area.position);
    };

    DragAndDropHandler.prototype.startOpenFolderTimer = function(folder) {
      var openFolder,
        _this = this;

      openFolder = function() {
        return _this.tree_widget._openNode(folder, _this.tree_widget.options.slide, function() {
          _this.refreshHitAreas();
          return _this.updateDropHint();
        });
      };
      return this.open_folder_timer = setTimeout(openFolder, 500);
    };

    DragAndDropHandler.prototype.stopOpenFolderTimer = function() {
      if (this.open_folder_timer) {
        clearTimeout(this.open_folder_timer);
        return this.open_folder_timer = null;
      }
    };

    DragAndDropHandler.prototype.moveItem = function(original_event) {
      var doMove, event, moved_node, position, previous_parent, target_node,
        _this = this;

      if (this.hovered_area && this.hovered_area.position !== Position.NONE && this.canMoveToArea(this.hovered_area)) {
        moved_node = this.current_item.node;
        target_node = this.hovered_area.node;
        position = this.hovered_area.position;
        previous_parent = moved_node.parent;
        if (position === Position.INSIDE) {
          this.hovered_area.node.is_open = true;
        }
        doMove = function() {
          _this.tree_widget.tree.moveNode(moved_node, target_node, position);
          _this.tree_widget.element.empty();
          return _this.tree_widget._refreshElements();
        };
        event = this.tree_widget._triggerEvent('tree.move', {
          move_info: {
            moved_node: moved_node,
            target_node: target_node,
            position: Position.getName(position),
            previous_parent: previous_parent,
            do_move: doMove,
            original_event: original_event
          }
        });
        if (!event.isDefaultPrevented()) {
          return doMove();
        }
      }
    };

    return DragAndDropHandler;

  })();

  ScrollHandler = (function() {
    function ScrollHandler(tree_widget) {
      this.tree_widget = tree_widget;
      this.previous_top = -1;
      this._initScrollParent();
    }

    ScrollHandler.prototype._initScrollParent = function() {
      var $scroll_parent, getParentWithOverflow, setDocumentAsScrollParent,
        _this = this;

      getParentWithOverflow = function() {
        var css_value, css_values, parent, scroll_parent, _i, _j, _len, _len1, _ref3, _ref4;

        css_values = ['overflow', 'overflow-y'];
        scroll_parent = null;
        _ref3 = _this.tree_widget.$el.parents();
        for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
          parent = _ref3[_i];
          for (_j = 0, _len1 = css_values.length; _j < _len1; _j++) {
            css_value = css_values[_j];
            if ((_ref4 = $.css(parent, css_value)) === 'auto' || _ref4 === 'scroll') {
              return $(parent);
            }
          }
        }
        return null;
      };
      setDocumentAsScrollParent = function() {
        _this.scroll_parent_top = 0;
        return _this.$scroll_parent = null;
      };
      if (this.tree_widget.$el.css('position') === 'fixed') {
        setDocumentAsScrollParent();
      }
      $scroll_parent = getParentWithOverflow();
      if ($scroll_parent && $scroll_parent.length && $scroll_parent[0].tagName !== 'HTML') {
        this.$scroll_parent = $scroll_parent;
        return this.scroll_parent_top = this.$scroll_parent.offset().top;
      } else {
        return setDocumentAsScrollParent();
      }
    };

    ScrollHandler.prototype.checkScrolling = function() {
      var hovered_area;

      hovered_area = this.tree_widget.dnd_handler.hovered_area;
      if (hovered_area && hovered_area.top !== this.previous_top) {
        this.previous_top = hovered_area.top;
        if (this.$scroll_parent) {
          return this._handleScrollingWithScrollParent(hovered_area);
        } else {
          return this._handleScrollingWithDocument(hovered_area);
        }
      }
    };

    ScrollHandler.prototype._handleScrollingWithScrollParent = function(area) {
      var distance_bottom;

      distance_bottom = this.scroll_parent_top + this.$scroll_parent[0].offsetHeight - area.bottom;
      if (distance_bottom < 20) {
        this.$scroll_parent[0].scrollTop += 20;
        this.tree_widget.refreshHitAreas();
        return this.previous_top = -1;
      } else if ((area.top - this.scroll_parent_top) < 20) {
        this.$scroll_parent[0].scrollTop -= 20;
        this.tree_widget.refreshHitAreas();
        return this.previous_top = -1;
      }
    };

    ScrollHandler.prototype._handleScrollingWithDocument = function(area) {
      var distance_top;

      distance_top = area.top - $(document).scrollTop();
      if (distance_top < 20) {
        return $(document).scrollTop($(document).scrollTop() - 20);
      } else if ($(window).height() - (area.bottom - $(document).scrollTop()) < 20) {
        return $(document).scrollTop($(document).scrollTop() + 20);
      }
    };

    ScrollHandler.prototype.scrollTo = function(top) {
      var tree_top;

      if (this.$scroll_parent) {
        return this.$scroll_parent[0].scrollTop = top;
      } else {
        tree_top = this.tree_widget.$el.offset().top;
        return $(document).scrollTop(top + tree_top);
      }
    };

    return ScrollHandler;

  })();

}).call(this);


