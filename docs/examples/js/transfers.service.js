(function(angular) {
	angular.module('ExampleApp').service('TransferService', ['$q', TransferService]);

	function TransferService($q) {
		this.list = function(filters) {
			var transfers = this.transfers;
			angular.forEach(filters, function(filterValue, filterKey) {
				transfers = transfers.filter(function(transfer) {
					if (angular.isArray(filterValue)) {
						return transfer[filterKey] &&
							filterValue.indexOf(transfer[filterKey]) >= 0
					} else {
						return transfer[filterKey] === filterValue;
					}
				});
			});
			return $q.when(transfers);
		};

		this.transfers = [{
			id: 1,
			type: "REQUEST",
			source: "GBP",
			target: "USD",
			sourceAmount: 10.00,
			targetAmount: 12.34,
			sourceAccount: {
				name: "Mike Marter",
				shortString: "Account ending 1234"
			},
			targetAccount: {
				name: "Steve Pole",
				shortString: "Account ending 1234"
			},
			status: "PAUSED",
			reason: "Problem with your documents",
			reference: "Ref123",
			fee: 0.50,
			rate: 1.2345,
			created: "2016-06-30T12:34:56Z",
			updated: "2016-07-01T12:34:56Z",
		},{
			id: 2,
			type: "TOPUP",
			source: "GBP",
			target: "USD",
			sourceAmount: 10.00,
			targetAmount: 12.34,
			sourceAccount: {
				name: "Steve Pole",
				type: "CARD",
				shortString: "Debit card ending 4321"
			},
			targetAccount: {
				name: "Steve Pole",
				type: "WALLET",
				shortString: "USD balance"
			},
			status: "PROCESSING",
			reason: "Processing",
			reference: "Ref123",
			fee: 0.50,
			rate: 1.2345,
			created: "2016-06-30T12:34:56Z",
			updated: "2016-07-01T12:34:56Z",
		},{
			id: 3,
			type: "TOPUP",
			source: "GBP",
			target: "USD",
			sourceAmount: 10.00,
			targetAmount: 12.34,
			sourceAccount: {
				name: "Steve Pole",
				type: "CARD",
				shortString: "Debit card ending 4321"
			},
			targetAccount: {
				name: "Steve Pole",
				type: "WALLET",
				shortString: "USD balance"
			},
			status: "CONVERTING",
			reason: "Converting",
			reference: "Ref123",
			fee: 5.50,
			rate: 1.2345,
			created: "2016-06-30T12:34:56Z",
			updated: "2016-07-01T12:34:56Z",
		},{
			id: 4,
			type: "TRANSFER",
			source: "GBP",
			target: "USD",
			sourceAmount: 10.00,
			targetAmount: 12.34,
			sourceAccount: {
				name: "Steve Pole",
				type: "ACCOUNT",
				shortString: "Account ending 9876"
			},
			targetAccount: {
				name: "Mike Marter",
				shortString: "Account ending 1234"
			},
			status: "AWAITING_FUNDS",
			reason: "Awaiting your payment",
			reference: "Ref123",
			fee: 0.50,
			rate: 1.2345,
			created: "2016-06-30T12:34:56Z",
			updated: "2016-07-01T12:34:56Z",
			batch: 1
		},{
			id: 5,
			type: "TRANSFER",
			source: "GBP",
			target: "USD",
			sourceAmount: 10000000.00,
			targetAmount: 12345000.00,
			sourceAccount: {
				name: "Steve Pole",
				type: "ACCOUNT",
				shortString: "Account ending 9876"
			},
			targetAccount: {
				name: "Mike Marter",
				shortString: "Account ending 1234"
			},
			status: "PAUSED",
			reason: "Holy shit, someone wrote a really long error message about what was wrong with this transfer. Someone should have a word, but at least our layout didn't break.",
			reference: "Ref123",
			fee: 50.00,
			rate: 1.2345,
			created: "2016-06-30T12:34:56Z",
			updated: "2016-07-01T12:34:56Z",
			batch: 1
		},{
			id: 6,
			type: "TRANSFER",
			source: "GBP",
			target: "USD",
			sourceAmount: 100.00,
			targetAmount: 123.45,
			sourceAccount: {
				name: "Steve Pole",
				type: "CARD",
				shortString: "Debite card ending 4321"
			},
			targetAccount: {
				name: "Mike Marter",
				type: "ACCOUNT",
				shortString: "Account ending 1234"
			},
			status: "COMPLETED",
			reference: "Ref123",
			fee: 0.50,
			rate: 1.2345,
			created: "2016-06-30T12:34:56Z",
			updated: "2016-07-01T12:34:56Z",
			completed: "2016-07-01T12:34:56Z"
		},{
			id: 7,
			type: "CARD",
			source: "GBP",
			target: "GBP",
			sourceAmount: 2.50,
			targetAmount: 2.50,
			sourceAccount: {
				name: "Steve Pole",
				type: "CARD",
				shortString: "Debit card ending 4321"
			},
			targetAccount: {
				name: "Peet's coffee",
				type: "MERCHANT",
				shortString: "Merchant account"
			},
			status: "COMPLETED",
			reference: "Ref123",
			fee: 0.00,
			rate: 1.0000,
			created: "2016-06-30T12:34:56Z",
			updated: "2016-07-01T12:34:56Z",
			completed: "2016-07-01T12:34:56Z"
		},{
			id: 8,
			type: "REQUEST",
			source: "GBP",
			target: "GBP",
			sourceAmount: 2.50,
			targetAmount: 2.50,
			sourceAccount: {
				name: "Kish Patel",
				type: "ACCOUNT",
				shortString: "Account ending 1234"
			},
			targetAccount: {
				name: "Steve Pole",
				type: "WALLET",
				shortString: "GBP balance"
			},
			status: "COMPLETED",
			reference: "Ref123",
			fee: 0.00,
			rate: 1.0000,
			created: "2016-06-12T12:34:56Z",
			updated: "2016-06-12T12:34:56Z",
			completed: "2016-06-12T12:34:56Z"
		},{
			id: 9,
			type: "TRANSFER",
			source: "GBP",
			target: "EUR",
			sourceAmount: 10000000.00,
			targetAmount: 11987000.00,
			sourceAccount: {
				name: "Steve Pole",
				type: "ACCOUNT",
				shortString: "Account ending 9876"
			},
			targetAccount: {
				name: "Steve Pole",
				type: "ACCOUNT",
				shortString: "Account ending 1234"
			},
			status: "CANCELLED",
			reference: "NewHouse",
			fee: 500.00,
			rate: 1.1987,
			created: "2016-06-09T12:34:56Z",
			updated: "2016-06-10T12:34:56Z"
		},{
			id: 10,
			type: "TOPUP",
			source: "GBP",
			target: "GBP",
			sourceAmount: 100.00,
			targetAmount: 100.00,
			sourceAccount: {
				name: "Steve Pole",
				type: "CARD",
				shortString: "Debit card ending 4321"
			},
			targetAccount: {
				name: "Steve Pole",
				type: "WALLET",
				shortString: "GBP balance"
			},
			status: "COMPLETED",
			reference: "Ref123",
			fee: 0.00,
			rate: 1.0000,
			created: "2016-03-30T12:34:56Z",
			updated: "2016-04-01T12:34:56Z",
			completed: "2016-04-01T12:34:56Z"
		},{
			id: 11,
			type: "CONVERSION",
			source: "EUR",
			target: "GBP",
			sourceAmount: 100.00,
			targetAmount: 91.23,
			sourceAccount: {
				name: "Steve Pole",
				type: "WALLET",
				shortString: "EUR balance"
			},
			targetAccount: {
				name: "Steve Pole",
				type: "WALLET",
				shortString: "GBP balance"
			},
			status: "COMPLETED",
			reference: "Ref123",
			fee: 0.50,
			rate: 0.9123,
			created: "2016-03-30T12:34:56Z",
			updated: "2016-04-01T12:34:56Z",
			completed: "2016-04-01T12:34:56Z"
		},{
			id: 12,
			type: "REWARD",
			source: "GBP",
			target: "GBP",
			sourceAmount: 10.00,
			targetAmount: 10.00,
			sourceAccount: {
				name: "TransferWise",
				type: "WALLET",
				shortString: "Referral program"
			},
			targetAccount: {
				name: "Steve Pole",
				type: "WALLET",
				shortString: "GBP balance"
			},
			status: "COMPLETED",
			reference: "Referral Bonus",
			fee: 0.00,
			rate: 1.0000,
			created: "2016-03-30T12:34:56Z",
			updated: "2016-04-01T12:34:56Z",
			completed: "2016-04-01T12:34:56Z"
		}];
	}
})(window.angular);
