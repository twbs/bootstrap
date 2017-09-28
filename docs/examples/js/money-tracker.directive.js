(function(angular) {
	'use strict';

	angular
		.module('ExampleApp')
		.directive('moneyTracker', MoneyTrackerDirective);

	function MoneyTrackerDirective() {
		return {
			bindToController: true,
			controller: function() {
				this.steps = [{
					date: "Today",
					title: "Your USD account ending 6789",
					description: ""
				},{
					active: true,
					title: "The money's with your bank",
					description: "Once the money's left your account, your bank could take up to \
						<strong class='text-warning'>4 hours</strong> to get it to us. \
						We'll let you know when it arrives."
				},{
					title: "TransferWise's USD account"
				},{
					title: "TransferWise's GBP account"
				},{
					date: "+ 2 days",
					title: "Banks are closed on the weekend"
				},{
					title: "Mike Marter's bank, NatWest"
				},{
					title: "{{$ctrl.targetAccount.name}}'s {{$ctrl.transfer.target}} account ending 123."
				}];
			},
			controllerAs: '$ctrl',
			restrict: 'E',
			scope: {
				transfer: "=",
				targetAccount: "=",
			},
			templateUrl: "partials/money-tracker.html"
		}
	}
})(window.angular);
