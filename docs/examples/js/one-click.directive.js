(function(angular) {
	'use strict';
	angular
		.module('ExampleApp')
		.directive('oneClick', OneClickDirective);

	function OneClickDirective() {
		return {
			bindToController: true,
			controller: function() {},
			controllerAs: '$ctrl',
			replace: false,
			restrict: 'E',
			scope: {},
			templateUrl: "partials/one-click.html"
		}
	}
})(window.angular);
