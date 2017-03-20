(function(angular) {
	'use strict';
	angular
		.module('ExampleApp')
		.directive('topNav', [TopNav]);

	function TopNav() {
		return {
			bindToController: true,
			controller: function() {
				var $ctrl = this;

				$ctrl.onMenuClick = function() {
					console.log("burger me");
					if ($ctrl.onBurgerClick) {
						$ctrl.onBurgerClick();
					}
				}
			},
			controllerAs: '$ctrl',
			replace: false,
			restrict: 'E',
			scope: {
				title: '@',
				subtitle: '@',
				onBurgerClick: '&',
				buttons: '=',
				buttonSummary: '@',
				searchable: '='
			},
			templateUrl: 'partials/top-nav.html'
		}
	}
})(window.angular);
