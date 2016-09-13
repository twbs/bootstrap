(function(angular) {
	'use strict';
	angular
		.module('ExampleApp')
		.directive('helpModal', HelpModalDirective);

	function HelpModalDirective() {
		return {
			bindToController: true,
			controller: function() {},
			controllerAs: '$ctrl',
			restrict: 'E',
			scope: {},
			templateUrl: "partials/help-modal.html"
		}
	}
})(window.angular);
