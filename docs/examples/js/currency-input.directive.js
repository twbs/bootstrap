(function(angular) {
	'use strict';
	angular
		.module('ExampleApp')
		.directive('currencyInput', CurrencyInputDirective);

	function CurrencyInputDirective() {
		return {
			bindToController: true,
			controller: function() {
				this.change = function() {
					console.log("change");
					this.onChange && this.onChange();
				}
			},
			controllerAs: '$ctrl',
			replace: false,
			restrict: 'E',
			scope: {
				currency: "=",
				amount: "=",
				onChange: "&"
			},
			templateUrl: "partials/currency-input.html"
		}
	}
})(window.angular);
