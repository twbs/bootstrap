(function(angular) {
	'use strict';
	angular
		.module('ExampleApp')
		.directive('simpleNav', [SimpleNav]);

	function SimpleNav() {
		return {
			bindToController: true,
			controller: function() {

			},
			controllerAs: '$ctrl',
			replace: false,
			restrict: 'E',
			scope: {
				onBurgerClick: '&'
			},
			templateUrl: 'partials/simple-nav.html'
		}
	}
})(window.angular);
