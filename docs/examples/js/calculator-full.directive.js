(function(angular) {
	'use strict';
	angular
		.module('ExampleApp')
		.directive('calculatorFull', CalculatorFull);

	function CalculatorFull() {
		return {
			bindToController: true,
			controller: function() {
				var $ctrl = this;

				$ctrl.currencies = [
					{header: 'Popular currencies'},
					{value: 'eur', label: 'EUR', note: 'Euro', currency: 'EUR'},
					{value: 'gbp', label: 'GBP', note: 'Great British Pound', currency: 'GBP'},
					{value: 'usd', label: 'USD', note: 'United States Dollar', currency: 'USD'},
					{header: 'All currencies'},
					{value: 'aud', label: 'AUD', note: 'Australian Dollar', currency: 'AUD'},
					{value: 'jpy', label: 'JPY', note: 'Japanses Yen', currency: 'JPY'}
				];

				$ctrl.sourceAmount = "1,000";
				$ctrl.sourceCurrency = "gbp";
				
				$ctrl.targetAmount = "1,234";
				$ctrl.targetCurrency = "eur";
			},
			controllerAs: '$ctrl',
			replace: false,
			restrict: 'E',
			scope: {
			},
			templateUrl: "partials/calculator-full.html"
		}
	}
})(window.angular);
