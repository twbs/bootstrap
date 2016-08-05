(function(angular) {
	'use strict';

	angular
		.module('ExampleApp')
		.directive('transferTypeIcon', TransferTypeIconDirective);

	function TransferTypeIconDirective() {
		return {
			bindToController: true,
			controller: function() {},
			controllerAs: '$ctrl',
			replace: false,
			restrict: 'E',
			scope: {
				type: "=",
				size: "@"
			},
			templateUrl: "partials/transfer-type-icon.html"
		}
	}
})(window.angular);
