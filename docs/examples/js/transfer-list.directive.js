(function(angular) {
	'use strict';
	angular
		.module('ExampleApp')
		.directive('transferList', TransferListDirective);

	function TransferListDirective() {
		return {
			bindToController: true,
			controller: [
				'$scope', '$window', '$location', '$rootScope', '$timeout',
			function($scope, $window, $location, $rootScope, $timeout) {
				var $ctrl = this;

				$ctrl.activate = function(id, $event) {
					$ctrl.updateHash(id);
				};

				$ctrl.close = function(id) {
					$ctrl.updateHash(id);
				};

				$ctrl.updateHash = function(id) {
					if ($ctrl.active === id) {
						$location.hash('');
					} else {
						$location.hash(id);
					}
				};
				$ctrl.updateOpenItem = function(id) {
					id = isNaN(parseInt(id)) ? false : parseInt(id);
					if ($ctrl.active === id) {
						$ctrl.active = false;
					} else {
						$ctrl.active = id;
					}
				};

				// Each list must check the hash to see if it should open an item
				$rootScope.$on('$locationChangeSuccess', function(event) {
					$ctrl.updateOpenItem($location.hash());
				});

				$ctrl.canRepeat = function(transfer) {
					return transfer.type !== 'CARD' && transfer.type !== 'REQUEST' &&
						(transfer.status === 'CANCELLED' || transfer.status === 'COMPLETED');
				}
			}],
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
