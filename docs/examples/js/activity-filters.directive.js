(function(angular) {
	'use strict';
	angular
		.module('ExampleApp')
		.directive('activityFilters', [ActivityFilters]);

	function ActivityFilters() {
		return {
			bindToController: true,
			controller: function() {
				this.activityTypes = [
					{value:'all',label:'All activities',icon:'icon-fast-flag'},
					{value:'sent',label:'Sent transfers',icon:'icon-send'},
					{value:'received',label:'Recieved transfers',icon:'icon-request'},
					{value:'batch',label:'Mass pay batches',icon:'icon-briefcase'},
					{value:'request-money',label:'Request money links',icon:'icon-link'},
					{value:'topup',label:'Balance top ups',icon:'icon-add'},
					{value:'conversions',label:'Balance conversions',icon:'icon-transfer'},
					{value:'bonus',label:'Bonus payments',icon:'icon-gift'}
				];
			},
			controllerAs: '$ctrl',
			replace: true,
			restrict: 'E',
			scope: {
				showSearch: '=',
				size: '@'
			},
			templateUrl: 'partials/activity-filters.html'
		}
	}
})(window.angular);
