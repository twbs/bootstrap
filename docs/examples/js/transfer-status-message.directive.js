(function(angular) {
	'use strict';

	angular
		.module('ExampleApp')
		.directive('transferStatusMessage', TransferStatusMessage);

	function TransferStatusMessage() {
		return {
			bindToController: true,
			controller: function() {},
			controllerAs: '$ctrl',
			restrict: 'E',
			scope: {
				transfer: "=",
			},
			templateUrl: "partials/transfer-status-message.html"
		}
	}
})(window.angular);
