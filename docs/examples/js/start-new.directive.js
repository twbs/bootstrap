(function(angular) {
	'use strict';
	angular
		.module('ExampleApp')
		.directive('startNew', StartNewDirective);

	function StartNewDirective() {
		return {
			bindToController: true,
			controller: function() {},
			controllerAs: '$ctrl',
			replace: false,
			restrict: 'E',
			scope: {
				tabs: "="
			},
			templateUrl: "partials/start-new.html"
		}
	}
})(window.angular);
