(function(angular) {
	'use strict';

	angular
		.module('ExampleApp')
		.directive('pagination', PaginationDirective);

	function PaginationDirective() {
		return {
			bindToController: true,
			controller: function() {},
			controllerAs: '$ctrl',
			replace: true,
			restrict: 'E',
			scope: {
				page: "=",
				total: "=",
				onClick: "&"
			},
			templateUrl: "partials/pagination.html"
		}
	}
})(window.angular);
