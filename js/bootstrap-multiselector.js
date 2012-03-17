/* =============================================================
 * bootstrap-multiselector.js v2.0.2
 * http://twitter.github.com/bootstrap/javascript.html#multiselector
 * =============================================================
 * Copyright 2012 Tomasz 'Doppler' Najdek
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */

(function ($) {
	"use strict";

	var MultiSelector = function (element, options) {
		var $element = this.$element = $(element);
		this.options = $.extend({}, $.fn.multiselector.defaults, options);
		this.$element.find('ul a').click(function (e) {
			var checkbox = $(this).find('input[type=checkbox]').first();
			if (checkbox.length) {
				e.stopPropagation();
				e.preventDefault();
				checkbox.prop('checked', !checkbox[0].checked);
			} else {
				$element.find('input[type=checkbox]').prop('checked', false);
			}
			$element.multiselector('update');
		});
	};

	MultiSelector.prototype = {
		constructor: MultiSelector,

		update: function () {
			var $el = this.$element,
				selected = $el.find('input[type=checkbox]:checked'),
				defaultValue = $el.find('ul>li:first-child>a').text(),
				$label = $($el.find('a > span:first-child')),
				multipleText = $el.data('filterMultiple') || this.options.multipleText;
			if (selected.length === 0) {
				$label.text(defaultValue);
			} else if (selected.length === 1) {
				$label.text($(selected[0]).parent().text());
			} else if (selected.length <= this.options.concatenateUpTo) {
				$label.text(selected.map(function () {
					return $(this).parent().text();
				}).get().join('&'));
			} else {
				$label.text(multipleText);
			}
		},


	};

  /* MULTISELECTOR PLUGIN DEFINITION
   * =========================== */

	$.fn.multiselector = function (option) {
		return this.each(function () {
			var $this = $(this),
				data = $this.data('multiselector'),
				options = typeof option === 'object' && option;
			if (!data) {
				$this.data('multiselector', (data = new MultiSelector(this, options)));
			}
			if (option === 'update') {
				data.update();
			}
		});
	};

	$.fn.multiselector.defaults = {
		multipleText: 'Multiple Filters',
		concatenateUpTo: 2
	};

	$.fn.multiselector.Constructor = MultiSelector;

	$(function () {
		$('body').on('focus.multiselector.data-api', '[data-provide="multiselector"]', function (e) {
			var $selector = $(e.target);
			if (!$selector.hasClass('multi-selector')) {
				$selector = $selector.closest('.multi-selector');
			}
			$selector.multiselector('update');
		});
		$('.multi-selector').multiselector('update');

	});

}(window.jQuery));