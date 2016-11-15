(function(angular) {
	'use strict';
	angular
		.module('ExampleApp')
		.directive('profileBlock', ProfileBlock);

	function ProfileBlock() {
		return {
			bindToController: true,
			controller: function() {

			},
			controllerAs: '$ctrl',
			replace: false,
			restrict: 'E',
			scope: {},
			templateUrl: "partials/profile-block.html"
		}
	}
})(window.angular);
