(function(angular) {
	'use strict';

	angular
		.module('ExampleApp')
		.directive('repeatTransfer', RepeatTransferDirective);

	function RepeatTransferDirective() {
		return {
			bindToController: true,
			controller: function() {},
			controllerAs: '$ctrl',
			replace: true,
			restrict: 'E',
			scope: {
				transfer: "=",
				currencies: "="
			},
			templateUrl: "partials/repeat-transfer.html"
		}
	}
})(window.angular);
