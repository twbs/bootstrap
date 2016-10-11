(function(angular) {
	angular.module('ExampleApp').service('SelectOptionsService', [SelectOptionsService]);

	function SelectOptionsService() {

		this.icons = [
			{value: '1', label: 'Profile', icon: 'icon-profile'},
			{value: '2', label: 'Globe', icon: 'icon-globe'},
			{value: '3', label: 'Bank', icon: 'icon-bank'}
		];

		this.currencies = [
			{header: 'Popular currencies'},
			{value: 'eur', label: 'EUR', note: 'Euro', currency: 'EUR'},
			{value: 'gbp', label: 'GBP', note: 'Great British Pound', currency: 'GBP'},
			{value: 'usd', label: 'USD', note: 'United States Dollar', currency: 'USD'},
			{header: 'All currencies'},
			{value: 'aud', label: 'AUD', note: 'Australian Dollar', currency: 'AUD'}
		];

		this.circles = [
			{value: '1', label: 'Image', circleImage: "../assets/img/mike.jpg"},
			{value: '2', label: 'Initials', circleText: "JD"},
			{value: '3', label: 'Icon', circleIcon: "icon-globe"}
		];

		this.accounts = [
			{value: '1', label: 'Bob Smith', note: "GBP", secondary: 'Account ending 1234', circleImage: "../assets/img/mike.jpg"},
			{value: '2', label: 'James Davies', note: "GBP", secondary: 'Account ending 9876', circleText: "JD"},
			{value: '3', label: 'Helen Williams', note: "EUR", secondary: 'Accont ending 4321', circleText: "HW"}
		];

		this.secondary = [
			{value: '1', label: 'Bob Smith', secondary: 'Account ending 1234'},
			{value: '2', label: 'James Davies', secondary: 'Account ending 9876'},
			{value: '3', label: 'Helen Williams', secondary: 'Accont ending 4321'}
		];

		this.notes = [
			{value: '1', label: 'Main value 1', note: 'Note type information that could be quite long'},
			{value: '2', label: 'Main value 2', note: 'Great British Pound'},
			{value: '3', label: 'Main value 3', note: 'United States Dollar'}
		];

		this.countryCodes = [
			{value: '44', label: '+44'},
			{value: '01', label: '+01'}
		];

		this.months = [
			{value: '1', label: 'January'},
			{value: '2', label: 'February'},
			{value: '3', label: 'March'},
			{value: '4', label: 'April'},
			{value: '5', label: 'May'},
			{value: '6', label: 'June'},
			{value: '7', label: 'July'},
			{value: '8', label: 'August'},
			{value: '9', label: 'September'},
			{value: '10', label: 'October'},
			{value: '11', label: 'November'},
			{value: '12', label: 'December'}
		];
	}
})(window.angular);
