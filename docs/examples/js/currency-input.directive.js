(function(angular) {
	'use strict';
	angular
		.module('ExampleApp')
		.directive('currencyInput', CurrencyInputDirective);

	function CurrencyInputDirective() {
		return {
			bindToController: true,
			controller: function() {},
			controllerAs: '$ctrl',
			replace: false,
			restrict: 'E',
			scope: {
				currency: "=",
				amount: "="
			},
			templateUrl: "partials/currency-input.html"
		}
	}
})(window.angular);
