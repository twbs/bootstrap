(function(angular) {
	'use strict';
	angular
		.module('ExampleApp')
		.directive('historicTransfers', HistoricTransfersDirective);

	function HistoricTransfersDirective() {
		return {
			bindToController: true,
			controller: function() {
				var $ctrl = this;

				$ctrl.activate = function(id, $event) {
					if ($event.target.tagName === 'INPUT' ||
				 		$event.target.tagName === 'BUTTON') {
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
			replace: false,
			restrict: 'E',
			scope: {
				transfers: "=",
				currencies: "="
			},
			templateUrl: "partials/historic-transfers.html"
		}
	}
})(window.angular);
