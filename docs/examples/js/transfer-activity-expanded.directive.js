(function(angular) {
	'use strict';

	angular
		.module('ExampleApp')
		.directive('transferActivityExpanded', TransferActivityExpandedDirective);

	function TransferActivityExpandedDirective() {
		return {
			bindToController: true,
			controller: function() {},
			controllerAs: '$ctrl',
			restrict: 'E',
			scope: {
				transfer: "=activity",
				currencies: "="
			},
			templateUrl: "partials/transfer-activity-expanded.html"
		}
	}
})(window.angular);
