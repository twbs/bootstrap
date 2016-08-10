(function(angular) {
	angular.module('ExampleApp').service('CurrencyService', ['$q', CurrencyService]);

	function CurrencyService($q) {
		this.map = function(filters) {
			return $q.when(this.currencies);
		};

		this.currencies = {
			"USD": {
				symbol: "$",
				code: "USD",
				digits: 2
			},
			"GBP": {
				symbol: "£",
				code: "USD",
				digits: 2
			},
			"EUR": {
				symbol: "€",
				code: "EUR",
				digits: 2
			}
		};
	}
})(window.angular);
