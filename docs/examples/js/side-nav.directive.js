(function(angular) {
	'use strict';
	angular
		.module('ExampleApp')
		.directive('sideNav', [SideNav]);

	function SideNav() {
		return {
			bindToController: true,
			controller: function() {

			},
			controllerAs: '$ctrl',
			replace: false,
			restrict: 'E',
			scope: {
				active: '@',
				onBurgerClick: '&'
			},
			templateUrl: 'partials/side-nav.html'
		}
	}
})(window.angular);
