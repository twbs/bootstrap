(function(angular) {
	'use strict';
	angular
		.module('ExampleApp')
		.directive('footerExample', FooterDirective);

	function FooterDirective() {
		return {
			bindToController: true,
			controller: function() {},
			controllerAs: '$ctrl',
			replace: true,
			restrict: 'E',
			scope: {},
			templateUrl: "partials/footer-example.html"
		}
	}
})(window.angular);
