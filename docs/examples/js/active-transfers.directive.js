(function(angular) {
	'use strict';
	angular
		.module('ExampleApp')
		.directive('activeTransfers', ActiveTransfersDirective);

	function ActiveTransfersDirective() {
		return {
			bindToController: true,
			controller: function() {
				var $ctrl = this;

				$ctrl.activate = function(id, $event) {
					if ($ctrl.active === id) {
						$ctrl.active = false;
					} else {
						$ctrl.active = id;
					}
				}
			},
			controllerAs: '$ctrl',
			replace: false,
			restrict: 'E',
			scope: {
				transfers: "=",
				currencies: "="
			},
			templateUrl: "partials/active-transfers.html"
		}
	}
})(window.angular);
