(function(angular) {
	'use strict';
	angular
		.module('ExampleApp')
		.directive('nextCards', NextCardsDirective);

	function NextCardsDirective() {
		return {
			bindToController: true,
			controller: function() {
				if (!this.show) {
					this.show = 3;
				}
			},
			controllerAs: '$ctrl',
			replace: false,
			restrict: 'E',
			scope: {
				show: '='
			},
			templateUrl: 'partials/next-card.html'
		}
	}
})(window.angular);
