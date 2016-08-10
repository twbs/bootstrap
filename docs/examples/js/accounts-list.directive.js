(function(angular) {
	'use strict';
	angular
		.module('ExampleApp')
		.directive('accountsList', AccountsListDirective);

	function AccountsListDirective() {
		return {
			bindToController: true,
			controller: function() {
				var $ctrl = this;

				$ctrl.activate = function(id, $event) {
					if ($event.target.tagName === 'A' ||
						$event.target.tagName === 'I' ||
				 		$event.target.tagName === 'BUTTON' ||
						$($event.target).hasClass('pip') ||
						$($event.target).hasClass('pips')) {
						return;
					}

					if ($ctrl.active === id) {
						$ctrl.active = false;
					} else {
						$ctrl.active = id;
					}
				}
			},
			controllerAs: '$ctrl',
			replace: true,
			restrict: 'E',
			scope: {
				accounts: "=",
				currencies: "="
			},
			templateUrl: "partials/accounts-list.html"
		}
	}
})(window.angular);
