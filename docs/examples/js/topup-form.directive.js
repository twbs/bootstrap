(function(angular) {
	'use strict';
	angular
		.module('ExampleApp')
		.directive('topupForm', ['SelectOptionsService', TopupForm]);

	function TopupForm(SelectOptionsService) {
		return {
			bindToController: true,
			controller: function() {
				this.options = SelectOptionsService;
				this.currencies = [
					{header: 'Popular currencies'},
					{value: 'eur', label: 'EUR', note: 'Euro', currency: 'EUR'},
					{value: 'gbp', label: 'GBP', note: 'Great British Pound', currency: 'GBP'},
					{value: 'usd', label: 'USD', note: 'United States Dollar', currency: 'USD'},
					{header: 'All currencies'},
					{value: 'aud', label: 'AUD', note: 'Australian Dollar', currency: 'AUD'},
					{value: 'jpy', label: 'JPY', note: 'Japanses Yen', currency: 'JPY'}
				];

				this.payInMethods = [
					{header: 'Payment methods'},
					{value: '2.00 GBP', label: 'Debit card', note: ' - £2.00 fee'},
					{value: '3.00 GBP', label: 'Credit card', note: ' - £3.00 fee'},
					{value: 'No additional fee', label: 'Bank transfer', note: ' - no additional fee'},
				]
			},
			controllerAs: '$ctrl',
			replace: false,
			restrict: 'E',
			scope: {},
			templateUrl: "partials/topup-form.html"
		}
	}
})(window.angular);
