(function(angular) {
	'use strict';
	angular
		.module('ExampleApp')
		.directive('topupForm', ['SelectOptionsService', TopupForm]);

	function TopupForm(SelectOptionsService) {
		return {
			bindToController: true,
			controller: ['$timeout', function($timeout) {
				var $ctrl = this;
				$ctrl.options = SelectOptionsService;
				$ctrl.currencies = [
					{header: 'Popular currencies'},
					{value: 'eur', label: 'EUR', note: 'Euro', currency: 'EUR'},
					{value: 'gbp', label: 'GBP', note: 'Great British Pound', currency: 'GBP'},
					{value: 'usd', label: 'USD', note: 'United States Dollar', currency: 'USD'},
					{header: 'All currencies'},
					{value: 'aud', label: 'AUD', note: 'Australian Dollar', currency: 'AUD'},
					{value: 'jpy', label: 'JPY', note: 'Japanses Yen', currency: 'JPY'}
				];

				$ctrl.payInMethods = [
					{header: 'Payment methods'},
					{value: '2.00 GBP', label: 'Debit card', note: ' - £2.00 fee'},
					{value: '3.00 GBP', label: 'Credit card', note: ' - £3.00 fee'},
					{value: 'No additional fee', label: 'Bank transfer', note: ' - no additional fee'},
				];

				$ctrl.submit = function() {
					$ctrl.processing = true;
					$timeout(function () {
						$ctrl.complete = true;
						if ($ctrl.onComplete) {
							$ctrl.onComplete();
						}
					}, 1500);
					if ($ctrl.onSubmit) {
						$ctrl.onSubmit();
					}
				}
			}],
			controllerAs: '$ctrl',
			replace: false,
			restrict: 'E',
			scope: {
				onSubmit: '&',
				onComplete: '&'
			},
			templateUrl: "partials/topup-form.html"
		}
	}
})(window.angular);
