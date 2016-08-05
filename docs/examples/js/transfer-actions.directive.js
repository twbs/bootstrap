(function(angular) {
	'use strict';

	angular
		.module('ExampleApp')
		.directive('transferActions', TransferActionsDirective);

	function TransferActionsDirective() {
		return {
			bindToController: true,
			controller: function() {},
			controllerAs: '$ctrl',
			replace: true,
			restrict: 'E',
			scope: {
				transfer: "=",
			},
			templateUrl: "partials/transfer-actions.html"
		}
	}
})(window.angular);
