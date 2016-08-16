(function(angular) {
	angular.module('ExampleApp').service('AccountService', ['$q', AccountService]);

	function AccountService($q) {
		this.list = function(filters) {
			var items = this.accounts;
			angular.forEach(filters, function(filterValue, filterKey) {
				items = items.filter(function(item) {
					if (angular.isArray(filterValue)) {
						return item[filterKey] &&
							filterValue.indexOf(item[filterKey]) >= 0
					} else {
						return item[filterKey] === filterValue;
					}
				});
			});
			return $q.when(items);
		};

		this.accounts = [{
			id: 1,
			name: "Mike Marter",
			type: "BANK",
			shortString: "Account ending 1234",
			currency: "GBP",
			number: "12345678",
			sort: "654321",
			iban: "1234 5678 1234 5678",
			bic: "ABC 123 56 DE",
			isOwned: false
		},{
			id: 2,
			name: "Steve Pole",
			type: "BANK",
			shortString: "Account ending 4321",
			currency: "GBP",
			number: "12345678",
			sort: "654321",
			iban: "1234 5678 1234 5678",
			bic: "ABC 123 56 DE",
			isOwned: true
		},{
			id: 3,
			name: "Steve Pole",
			type: "WALLET",
			shortString: "USD balance",
			currency: "USD",
			number: "12345678",
			sort: "654321",
			iban: "1234 5678 1234 5678",
			bic: "ABC 123 56 DE",
			isOwned: true
		},{
			id: 4,
			name: "Steve Pole",
			type: "WALLET",
			shortString: "GBP balance",
			currency: "GBP",
			number: "12345678",
			sort: "654321",
			iban: "1234 5678 1234 5678",
			bic: "ABC 123 56 DE",
			isOwned: true
		}];
	}
})(window.angular);
