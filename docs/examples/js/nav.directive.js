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

				// TODO duplicated in simplenav, make it a service
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
			controllerAs: '$ctrl',
			replace: true,
			restrict: 'E',
			scope: {
				transparent: "=",
				fluid: "="
			},
			templateUrl: "partials/nav-bar.html"
		}
	}
})(window.angular);
