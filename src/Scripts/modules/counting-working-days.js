'use strict';

Nitro.module('workingdays-counter', function() {
	const self = this;

	/**
	 * Counts how many working days exists between today and Christmas
	 * @returns number of working days between these dates
	 */
	this.countWorkingDays = function() {
		const christmas = new Date('December 25, 2018 00:00:00'); // Christmas date
		let now = new Date(); // Actual date
		let holidays = 0; // Set number of holidays
		let weekendDays = 0; // Number of Saturdays and Sundays

		now.setHours(0, 0, 0, 0);

		// Count how many days exists between these dates
		const days = Math.round((christmas - now) / 1000 / 60 / 60 / 24) - 1;

		if (now <= new Date('November 2, 2018 23:59:59')) {
			holidays = 2;
		} else if (now <= new Date('November 15, 2018 23:59:59')) {
			holidays = 1;
		}

		// Count how many Saturdays and Sundays exists between these dates
		for (let i = 0; i < days; i++) {
			if (now.getDay() === 0 || now.getDay() === 6) {
				weekendDays++;
			}

			now.setDate(now.getDate() + 1);
		}

		// Return total number of days, minus weekend days and holidays
		return days - (weekendDays + holidays);
	};

	/**
	 * Set text message if shipping can arrive before Christmas
	 * @param {HTMLElement} $workingDaysElement
	 */
	this.setShippingMessage = function($workingDaysElement) {
		// Rule to not consider schedule shipping.
		if (
			$workingDaysElement.text().indexOf('Agendada') > 0 ||
			$workingDaysElement.text().indexOf('Chega antes do Natal') > 0
		) {
			return;
		}
		const workingDays = $workingDaysElement.text().match(/ (\d+) /g); // Get the number of days, if the string has this value

		// If the string has a day value, calculate how many days exists between today and Christmas and check if the order will arrive before Christmas
		if (workingDays) {
			const workingDaysUntilChristmas = self.countWorkingDays();

			workingDaysUntilChristmas - parseInt(workingDays[0]) >= 0
				? $workingDaysElement.append(' <em>(Chega antes do Natal)</em>')
				: '';
		}
	};
});
