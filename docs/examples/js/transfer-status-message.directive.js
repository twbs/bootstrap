(function(angular) {
	'use strict';

	angular
		.module('ExampleApp')
		.directive('transferStatusMessage', TransferStatusMessage);

	function TransferStatusMessage() {
		return {
			bindToController: true,
			controller: function() {
				this.statusMessages = {
					"INCOMING": {
						"PENDING": "Waiting for you to pay in.",
						"INITIATED": "We're waiting for your money to arrive in our account.",
						"CONFIRMED": "",
						"RECEIVED": "We received your money. We're processing your transfer.",
						"BLOCKED": "There's a problem with your transfer."
					},
					"OUTGOING": {
						"PENDING": "We received your money. We're processing your transfer.",
						"INITIATED": "We've sent out your money, it may take some time to arrive in the account.",
						"CONFIRMED": "",
						"RECEIVED": "Complete",
						"BLOCKED": "There's a problem with your transfer."
					},
					"FINISHED": {
						"COMPLETE": "Complete",
						"CANCELLED": "There's a problem with your transfer"
					}
				};
			},
			controllerAs: '$ctrl',
			restrict: 'E',
			scope: {
				transfer: "=",
			},
			templateUrl: "partials/transfer-status-message.html"
		}
	}
})(window.angular);
