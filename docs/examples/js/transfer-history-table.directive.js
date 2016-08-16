(function(angular) {
	'use strict';

	angular
		.module('ExampleApp')
		.directive('transferHistoryTable', TransferHistoryTableDirective);

	function TransferHistoryTableDirective() {
		return {
			bindToController: true,
			controller: function() {},
			controllerAs: '$ctrl',
			replace: false,
			restrict: 'E',
			scope: {
				transfers: "=",
				currencies: "="
			},
			templateUrl: "partials/transfer-history-table.html"
		}
	}
})(window.angular);
