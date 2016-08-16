(function(angular) {
	'use strict';

	angular
		.module('ExampleApp')
		.directive('transferDetails', TransferDetailsDirective);

	function TransferDetailsDirective() {
		return {
			bindToController: true,
			controller: function() {},
			controllerAs: '$ctrl',
			replace: true,
			restrict: 'E',
			scope: {
				transfer: "=",
				sourceAccount: "=",
				targetAccount: "=",
				currencies: "="
			},
			templateUrl: "partials/transfer-details.html"
		}
	}
})(window.angular);
