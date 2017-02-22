(function(angular) {
	'use strict';

	angular
		.module('ExampleApp')
		.directive('calculatorInline', CalculatorInlineDirective);

	function CalculatorInlineDirective() {
		return {
			bindToController: true,
			controller: function() {
				var $ctrl = this;
				$ctrl.currencies = [
					{'value':'eur','label':'EUR','note':'Euro','currency':'EUR'},
					{'value':'gbp','label':'GBP','note':'Great British Pound','currency':'GBP'}
				];
				$ctrl.send = 1000;
				$ctrl.sendCurrency = 'eur';
				$ctrl.recieve = 1400;
				$ctrl.recieveCurrency = 'gbp';
			},
			controllerAs: '$ctrl',
			replace: true,
			restrict: 'E',
			scope: {
				size: '@'
			},
			templateUrl: "partials/calculator-inline.html"
		}
	}
})(window.angular);
