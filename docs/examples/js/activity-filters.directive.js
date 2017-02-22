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
					{value:'mass-pay',label:'Mass pay batches',icon:'icon-briefcase'}
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
