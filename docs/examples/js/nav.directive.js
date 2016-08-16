(function(angular) {
	'use strict';
	
	angular
		.module('ExampleApp')
		.directive('navBar', NavBarDirective);

	function NavBarDirective() {
		return {
			bindToController: true,
			controller: function() {
				var vm = this;

				vm.translations = {
					"en": {
						"transfers": "Transfers",
						"history": "History",
						"recipients": "Recipients",
						"rewards": "Rewards",
						"help": "Help",
						"send1": "Send money",
						"send2": "Send"
					},
					"de": {
						"transfers": "Überweisungen",
						"history": "Verlauf",
						"recipients": "Empfänger",
						"rewards": "Freunde einladen",
						"help": "Hilfe",
						"send1": "Geld überweisen",
						"send2": "Überweisen"
					}
				}
				vm.language = "en";
			},
			controllerAs: 'vm',
			replace: true,
			restrict: 'E',
			scope: {},
			templateUrl: "partials/nav-bar.html"
		}
	}
})(window.angular);
