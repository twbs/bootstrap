(function(angular) {
	'use strict';

	angular
		.module('ExampleApp')
		.directive('transferActivity', TransferActivityDirective);

	function TransferActivityDirective() {
		return {
			bindToController: true,
			controller: function() {},
			controllerAs: '$ctrl',
			restrict: 'E',
			scope: {
				transfer: "=activity",
				currencies: "=",
				isExpanded: "="
			},
			templateUrl: "partials/transfer-activity.html"
		}
	}
})(window.angular);
