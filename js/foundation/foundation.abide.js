;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.abide = {
    name : 'abide',

    version : '{{VERSION}}',

    settings : {
      live_validate : true,
      validate_on_blur : true,
      // validate_on: 'tab', // tab (when user tabs between fields), change (input changes), manual (call custom events) 
      focus_on_invalid : true,
      error_labels : true, // labels with a for="inputId" will recieve an `error` class
      error_class : 'error',
      timeout : 1000,
      patterns : {
        alpha : /^[a-zA-Z]+$/,
        alpha_numeric : /^[a-zA-Z0-9]+$/,
        integer : /^[-+]?\d+$/,
        number : /^[-+]?\d*(?:[\.\,]\d+)?$/,

        // amex, visa, diners
        card : /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/,
        cvv : /^([0-9]){3,4}$/,

        // http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#valid-e-mail-address
        email : /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/,

        // http://blogs.lse.ac.uk/lti/2008/04/23/a-regular-expression-to-match-any-url/
        url: /^(https?|ftp|file|ssh):\/\/([-;:&=\+\$,\w]+@{1})?([-A-Za-z0-9\.]+)+:?(\d+)?((\/[-\+~%\/\.\w]+)?\??([-\+=&;%@\.\w]+)?#?([\w]+)?)?/,
        // abc.de
        domain : /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,8}$/,

        datetime : /^([0-2][0-9]{3})\-([0-1][0-9])\-([0-3][0-9])T([0-5][0-9])\:([0-5][0-9])\:([0-5][0-9])(Z|([\-\+]([0-1][0-9])\:00))$/,
        // YYYY-MM-DD
        date : /(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))$/,
        // HH:MM:SS
        time : /^(0[0-9]|1[0-9]|2[0-3])(:[0-5][0-9]){2}$/,
        dateISO : /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/,
        // MM/DD/YYYY
        month_day_year : /^(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.]\d{4}$/,
        // DD/MM/YYYY
        day_month_year : /^(0[1-9]|[12][0-9]|3[01])[- \/.](0[1-9]|1[012])[- \/.]\d{4}$/,

        // #FFF or #FFFFFF
        color : /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/
      },
      validators : {
        equalTo : function (el, required, parent) {
          var from  = document.getElementById(el.getAttribute(this.add_namespace('data-equalto'))).value,
              to    = el.value,
              valid = (from === to);

          return valid;
        }
      }
    },

    timer : null,

    init : function (scope, method, options) {
      this.bindings(method, options);
    },

    events : function (scope) {
      var self = this,
          form = self.S(scope).attr('novalidate', 'novalidate'),
          settings = form.data(this.attr_name(true) + '-init') || {};

      this.invalid_attr = this.add_namespace('data-invalid');

      function validate(originalSelf, e) {
        clearTimeout(self.timer);
        self.timer = setTimeout(function () {
          self.validate([originalSelf], e);
        }.bind(originalSelf), settings.timeout);
      }


      form
        .off('.abide')
        .on('submit.fndtn.abide', function (e) {
          var is_ajax = /ajax/i.test(self.S(this).attr(self.attr_name()));
          return self.validate(self.S(this).find('input, textarea, select').not(":hidden, [data-abide-ignore]").get(), e, is_ajax);
        })
        .on('validate.fndtn.abide', function (e) {
          if (settings.validate_on === 'manual') {
            self.validate([e.target], e);
          }
        })
        .on('reset', function (e) {
          return self.reset($(this), e);          
        })
        .find('input, textarea, select').not(":hidden, [data-abide-ignore]")
          .off('.abide')
          .on('blur.fndtn.abide change.fndtn.abide', function (e) {
            // old settings fallback
            // will be deprecated with F6 release
            if (settings.validate_on_blur && settings.validate_on_blur === true) {
              validate(this, e);
            }
            // new settings combining validate options into one setting
            if (settings.validate_on === 'change') {
              validate(this, e);
            }
          })
          .on('keydown.fndtn.abide', function (e) {
            // old settings fallback
            // will be deprecated with F6 release
            if (settings.live_validate && settings.live_validate === true && e.which != 9) {
              validate(this, e);
            }
            // new settings combining validate options into one setting
            if (settings.validate_on === 'tab' && e.which === 9) {
              validate(this, e);
            }
            else if (settings.validate_on === 'change') {
              validate(this, e);
            }
          })
          .on('focus', function (e) {
            if (navigator.userAgent.match(/iPad|iPhone|Android|BlackBerry|Windows Phone|webOS/i)) {
              $('html, body').animate({
                  scrollTop: $(e.target).offset().top
              }, 100);
            } 
          });
    },

    reset : function (form, e) {
      var self = this;
      form.removeAttr(self.invalid_attr);

      $('[' + self.invalid_attr + ']', form).removeAttr(self.invalid_attr);
      $('.' + self.settings.error_class, form).not('small').removeClass(self.settings.error_class);
      $(':input', form).not(':button, :submit, :reset, :hidden, [data-abide-ignore]').val('').removeAttr(self.invalid_attr);
    },

    validate : function (els, e, is_ajax) {
      var validations = this.parse_patterns(els),
          validation_count = validations.length,
          form = this.S(els[0]).closest('form'),
          submit_event = /submit/.test(e.type);

      // Has to count up to make sure the focus gets applied to the top error
      for (var i = 0; i < validation_count; i++) {
        if (!validations[i] && (submit_event || is_ajax)) {
          if (this.settings.focus_on_invalid) {
            els[i].focus();
          }
          form.trigger('invalid.fndtn.abide');
          this.S(els[i]).closest('form').attr(this.invalid_attr, '');
          return false;
        }
      }

      if (submit_event || is_ajax) {
        form.trigger('valid.fndtn.abide');
      }

      form.removeAttr(this.invalid_attr);

      if (is_ajax) {
        return false;
      }

      return true;
    },

    parse_patterns : function (els) {
      var i = els.length,
          el_patterns = [];

      while (i--) {
        el_patterns.push(this.pattern(els[i]));
      }

      return this.check_validation_and_apply_styles(el_patterns);
    },

    pattern : function (el) {
      var type = el.getAttribute('type'),
          required = typeof el.getAttribute('required') === 'string';

      var pattern = el.getAttribute('pattern') || '';

      if (this.settings.patterns.hasOwnProperty(pattern) && pattern.length > 0) {
        return [el, this.settings.patterns[pattern], required];
      } else if (pattern.length > 0) {
        return [el, new RegExp(pattern), required];
      }

      if (this.settings.patterns.hasOwnProperty(type)) {
        return [el, this.settings.patterns[type], required];
      }

      pattern = /.*/;

      return [el, pattern, required];
    },

    // TODO: Break this up into smaller methods, getting hard to read.
    check_validation_and_apply_styles : function (el_patterns) {
      var i = el_patterns.length,
          validations = [],
          form = this.S(el_patterns[0][0]).closest('[data-' + this.attr_name(true) + ']'),
          settings = form.data(this.attr_name(true) + '-init') || {};
      while (i--) {
        var el = el_patterns[i][0],
            required = el_patterns[i][2],
            value = el.value.trim(),
            direct_parent = this.S(el).parent(),
            validator = el.getAttribute(this.add_namespace('data-abide-validator')),
            is_radio = el.type === 'radio',
            is_checkbox = el.type === 'checkbox',
            label = this.S('label[for="' + el.getAttribute('id') + '"]'),
            valid_length = (required) ? (el.value.length > 0) : true,
            el_validations = [];

        var parent, valid;

        // support old way to do equalTo validations
        if (el.getAttribute(this.add_namespace('data-equalto'))) { validator = 'equalTo' }

        if (!direct_parent.is('label')) {
          parent = direct_parent;
        } else {
          parent = direct_parent.parent();
        }

        if (is_radio && required) {
          el_validations.push(this.valid_radio(el, required));
        } else if (is_checkbox && required) {
          el_validations.push(this.valid_checkbox(el, required));

        } else if (validator) {
          // Validate using each of the specified (space-delimited) validators.
          var validators = validator.split(' ');
          var last_valid = true, all_valid = true;
          for (var iv = 0; iv < validators.length; iv++) {
              valid = this.settings.validators[validators[iv]].apply(this, [el, required, parent])
              el_validations.push(valid);
              all_valid = valid && last_valid;
              last_valid = valid;
          }
          if (all_valid) {
              this.S(el).removeAttr(this.invalid_attr);
              parent.removeClass('error');
              $(el).triggerHandler('valid');
          } else {
              this.S(el).attr(this.invalid_attr, '');
              parent.addClass('error');
              $(el).triggerHandler('invalid');
          }
        } else {

          if (el_patterns[i][1].test(value) && valid_length ||
            !required && el.value.length < 1 || $(el).attr('disabled')) {
            el_validations.push(true);
          } else {
            el_validations.push(false);
          }

          el_validations = [el_validations.every(function (valid) {return valid;})];

          if (el_validations[0]) {
            this.S(el).removeAttr(this.invalid_attr);
            el.setAttribute('aria-invalid', 'false');
            el.removeAttribute('aria-describedby');
            parent.removeClass(this.settings.error_class);
            if (label.length > 0 && this.settings.error_labels) {
              label.removeClass(this.settings.error_class).removeAttr('role');
            }
            $(el).triggerHandler('valid');
          } else {
            this.S(el).attr(this.invalid_attr, '');
            el.setAttribute('aria-invalid', 'true');

            // Try to find the error associated with the input
            var errorElem = parent.find('small.' + this.settings.error_class, 'span.' + this.settings.error_class);
            var errorID = errorElem.length > 0 ? errorElem[0].id : '';
            if (errorID.length > 0) {
              el.setAttribute('aria-describedby', errorID);
            }

            // el.setAttribute('aria-describedby', $(el).find('.error')[0].id);
            parent.addClass(this.settings.error_class);
            if (label.length > 0 && this.settings.error_labels) {
              label.addClass(this.settings.error_class).attr('role', 'alert');
            }
            $(el).triggerHandler('invalid');
          }
        }
        validations = validations.concat(el_validations);
      }
      return validations;
    },

    valid_checkbox : function (el, required) {
      var el = this.S(el),
          valid = (el.is(':checked') || !required || el.get(0).getAttribute('disabled'));

      if (valid) {
        el.removeAttr(this.invalid_attr).parent().removeClass(this.settings.error_class);
        $(el).triggerHandler('valid');
      } else {
        el.attr(this.invalid_attr, '').parent().addClass(this.settings.error_class);
        $(el).triggerHandler('invalid');
      }

      return valid;
    },

    valid_radio : function (el, required) {
      var name = el.getAttribute('name'),
          group = this.S(el).closest('[data-' + this.attr_name(true) + ']').find("[name='" + name + "']"),
          count = group.length,
          valid = false,
          disabled = false;

      // Has to count up to make sure the focus gets applied to the top error
        for (var i=0; i < count; i++) {
            if( group[i].getAttribute('disabled') ){
                disabled=true;
                valid=true;
            } else {
                if (group[i].checked){
                    valid = true;
                } else {
                    if( disabled ){
                        valid = false;
                    }
                }
            }
        }

      // Has to count up to make sure the focus gets applied to the top error
      for (var i = 0; i < count; i++) {
        if (valid) {
          this.S(group[i]).removeAttr(this.invalid_attr).parent().removeClass(this.settings.error_class);
          $(group[i]).triggerHandler('valid');
        } else {
          this.S(group[i]).attr(this.invalid_attr, '').parent().addClass(this.settings.error_class);
          $(group[i]).triggerHandler('invalid');
        }
      }

      return valid;
    },

    valid_equal : function (el, required, parent) {
      var from  = document.getElementById(el.getAttribute(this.add_namespace('data-equalto'))).value,
          to    = el.value,
          valid = (from === to);

      if (valid) {
        this.S(el).removeAttr(this.invalid_attr);
        parent.removeClass(this.settings.error_class);
        if (label.length > 0 && settings.error_labels) {
          label.removeClass(this.settings.error_class);
        }
      } else {
        this.S(el).attr(this.invalid_attr, '');
        parent.addClass(this.settings.error_class);
        if (label.length > 0 && settings.error_labels) {
          label.addClass(this.settings.error_class);
        }
      }

      return valid;
    },

    valid_oneof : function (el, required, parent, doNotValidateOthers) {
      var el = this.S(el),
        others = this.S('[' + this.add_namespace('data-oneof') + ']'),
        valid = others.filter(':checked').length > 0;

      if (valid) {
        el.removeAttr(this.invalid_attr).parent().removeClass(this.settings.error_class);
      } else {
        el.attr(this.invalid_attr, '').parent().addClass(this.settings.error_class);
      }

      if (!doNotValidateOthers) {
        var _this = this;
        others.each(function () {
          _this.valid_oneof.call(_this, this, null, null, true);
        });
      }

      return valid;
    },

    reflow : function(scope, options) {
      var self = this,
          form = self.S('[' + this.attr_name() + ']').attr('novalidate', 'novalidate');
          self.S(form).each(function (idx, el) {
            self.events(el);
          });
    }
  };
}(jQuery, window, window.document));
