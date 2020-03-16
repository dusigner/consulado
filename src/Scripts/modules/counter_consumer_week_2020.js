/**
 *
 * @fileOverview counter
 *
 */
'use strict';

Nitro.module('counter', function() {
	const endDate = $('.counter__offer-prod .prateleira.default h2').text();
	this.init = () => {
		this.initCounter();
	};

	this.initCounter = () => {
		let $counter = $('.counter'),
			$endMessage = $('.counter__end-promotion'),
			$buyButton = $('.counter__offer-cta'),
			$counterSubSection = $('.counter__offer-count'),
			$counterSection = $('.counter__section'),
			$counterProd = $('.counter__offer-prod'),
			$days = $counter.find('.days'),
			$hours = $counter.find('.hours'),
			$minutes = $counter.find('.minutes'),
			$seconds = $counter.find('.seconds'),
			timeRemaining;

		$('.counter__offer-btn').attr('href', $('.counter__offer .shelf__buy-button').attr('href'));

		function getTimeRemaining(endDate) {
			var today = Date.parse(new Date()),
				finalDate = Date.parse(endDate),
				total = finalDate - today,
				seconds = Math.floor((total / 1000) % 60),
				minutes = Math.floor((total / (1000 * 60)) % 60),
				hours = Math.floor((total / (1000 * 60 * 60)) % 24),
				days = Math.floor(total / (1000 * 60 * 60 * 24)),
				timeRemaining = {
					days: days >= 0 ? days : 0,
					hours: hours >= 0 ? hours : 0,
					minutes: minutes >= 0 ? minutes : 0,
					seconds: seconds >= 0 ? seconds : 0
				};

			if (isNaN(finalDate)) {
				return null;
			}

			return timeRemaining;
		}

		setInterval(function() {
			timeRemaining = getTimeRemaining(endDate);

			if (timeRemaining === null) {
				$counterSection.addClass('hide');
				return;
			} else {
				$counterSection.removeClass('hide');
			}

			if (
				timeRemaining.days === 0 &&
				timeRemaining.hours === 0 &&
				timeRemaining.minutes === 0 &&
				timeRemaining.seconds === 0
			) {
				$buyButton.addClass('hide');
				$counterSubSection.addClass('button-hidden');
				$counter.addClass('hide');
				$counterProd.addClass('hide');
				$counterSection.addClass('hide');
				$endMessage.removeClass('hide');
			}

			$days.text(timeRemaining.days > 9 ? timeRemaining.days : '0' + timeRemaining.days);
			$hours.text(timeRemaining.hours > 9 ? timeRemaining.hours : '0' + timeRemaining.hours);
			$minutes.text(timeRemaining.minutes > 9 ? timeRemaining.minutes : '0' + timeRemaining.minutes);
			$seconds.text(timeRemaining.seconds > 9 ? timeRemaining.seconds : '0' + timeRemaining.seconds);
		}, 1000);
	};
	// Start it
	this.init();
});
