(function(angular) {
	'use strict';
	angular
		.module('ExampleApp')
		.directive('transferList', TransferListDirective);

	function TransferListDirective() {
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

				$ctrl.canRepeat = function(transfer) {
					return transfer.type !== 'CARD' && transfer.type !== 'REQUEST' &&
						(transfer.status === 'CANCELLED' || transfer.status === 'COMPLETED');
				}
			},
			controllerAs: '$ctrl',
			replace: false,
			restrict: 'E',
			scope: {
				transfers: "=",
				currencies: "=",
				inactive: "="
			},
			templateUrl: "partials/transfer-list.html"
		}
	}
})(window.angular);
