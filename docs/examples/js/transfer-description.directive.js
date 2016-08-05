(function(angular) {
	'use strict';

	angular
		.module('ExampleApp')
		.directive('transferDescription', TransferDescriptionDirective);

	function TransferDescriptionDirective() {
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
			templateUrl: "partials/transfer-description.html"
		}
	}
})(window.angular);
