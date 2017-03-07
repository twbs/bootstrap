(function(angular) {
	'use strict';
	angular
		.module('ExampleApp')
		.directive('feesSequence', FeesSequence);

	function FeesSequence() {
		return {
			bindToController: true,
			controller: function() {
				var $ctrl = this;

				$ctrl.payInMethods = [
					{header: 'Payment methods'},
					{value: '2.00 GBP', label: 'Debit card', note: ' - £2.00 fee'},
					{value: '3.00 GBP', label: 'Credit card', note: ' - £3.00 fee'},
					{value: 'No additional fee', label: 'Bank transfer', note: ' - no additional fee'},
				];
			},
			controllerAs: '$ctrl',
			replace: false,
			restrict: 'E',
			scope: {
				expand: '='
			},
			templateUrl: "partials/fees-sequence.html"
		}
	}
})(window.angular);
