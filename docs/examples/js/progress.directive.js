(function(angular) {
	'use strict';

	angular
		.module('ExampleApp')
		.directive('twProgressSteps', TwProgressSteps);

	function TwProgressSteps() {
		return {
			controller: TwProgressStepsController,
			template:
			"<div> \
				<div ng-class='{ \
					\"nav-justified-2-p-x\": $ctrl.steps.length === 2, \
					\"nav-justified-3-p-x\": $ctrl.steps.length === 3, \
					\"nav-justified-4-p-x\": $ctrl.steps.length === 4, \
					\"nav-justified-5-p-x\": $ctrl.steps.length === 5, \
					\"nav-justified-6-p-x\": $ctrl.steps.length === 6, \
					\"nav-justified-7-p-x\": $ctrl.steps.length === 7, \
					\"nav-justified-8-p-x\": $ctrl.steps.length === 8 \
				}'> \
					<div class='progress'> \
						<div class='progress-bar' role='progressbar' \
							aria-valuenow='{{$ctrl.progressPercentage}}' aria-valuemin='0' \
							aria-valuemax='100' ng-style='{width: $ctrl.progressPercentage + \"%\"}'> \
							<span class='sr-only'>{{$ctrl.progressPercentage}}% Complete</span> \
						</div> \
					</div> \
				</div> \
				<ul class='nav nav-pills nav-justified small hidden-xs hidden-sm'> \
					<li role='presentation' ng-repeat='step in $ctrl.steps' \
						ng-class='{ \
							active: $ctrl.step === step.value, \
							invisible: step.hidden, \
							disabled: step.disabled \
						}'> \
						<a href='' ng-click='$ctrl.step = step.value;'> \
							{{step.label}} \
						</a> \
					</li> \
				</ul> \
				<div class='visible-xs visible-sm form-inline text-xs-center'> \
					<div style='dislay: inline-block;'> \
						<tw-select class='m-t-1' \
							style='display: inline-block;' \
							ng-model='$ctrl.step' \
							options='$ctrl.steps' \
							ng-change='$ctrl.selectStep()'></tw-select> \
					</div> \
				</div> \
			</div>",
			controllerAs: '$ctrl',
			bindToController: true,
			restrict: 'E',
			scope: {
				steps: "=",
				step: "=",
				onStepSelect: "&"
			}
		};
	}

	function TwProgressStepsController() {
		var $ctrl = this;
		var activeStep;

		init();

		$ctrl.$onChanges = function(changes) {
			/*
			if (changes.steps) {
				var activeStepNumber = getActiveStepNumber($ctrl.steps);
				$ctrl.progressPercentage = getProgressPercentageFromSteps(activeStepNumber, $ctrl.steps.length);
				$ctrl.visibleSteps = getVisibleSteps($ctrl.steps);

				$ctrl.activeStepForTwSelect = activeStep;
			}
			*/
		};

		$ctrl.selectStep = function(step) {
			/*
			var newStep = step ? step: $ctrl.activeStepForTwSelect;
			var newIndex = $ctrl.visibleSteps.indexOf(step);

			if (newIndex > stepsVisibleUpTo) {
				stepsVisibleUpTo = newIndex + 1;
			}

			$ctrl.onStepSelect({step: newStep});
			*/
		};

		function init() {
			if (!$ctrl.step && $ctrl.steps && $ctrl.steps.length > 0) {
				$ctrl.step = $ctrl.steps[0];
			}
			$ctrl.progressPercentage = getProgressPercentageFromSteps($ctrl.steps);
		}

		function getProgressPercentageFromSteps(steps) {
			if (!steps || steps.length < 2) {
				return 0;
			}

			var activeStepNumber = getActiveStepIndex($ctrl.steps, $ctrl.step);
			if (!activeStepNumber) {
				return 0;
			}

			var stepCount = steps.length;
			var stepPercentage = 100 * (activeStepNumber / (stepCount - 1));
			console.log(stepPercentage);
			return Math.round(stepPercentage);
		}

		function getActiveStepIndex(steps, activeStep) {
			for(var i=0; i<steps.length; i++) {
				if (steps[i].value === activeStep) {
					return i;
				}
			}
			return 0;
		}
	}


})(window.angular);
