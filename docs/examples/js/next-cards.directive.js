(function(angular) {
	'use strict';
	angular
		.module('ExampleApp')
		.directive('nextCards', NextCardsDirective);

	function NextCardsDirective() {
		return {
			bindToController: true,
			controller: function() {
				
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
