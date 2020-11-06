/**
 *
 * @fileOverview counter
 *
 */
"use strict";

Nitro.module("counter-bf-2020", function() {
	this.init = () => {
		this.initCounter();
	};

	this.initCounter = () => {
		let $counter = $(".counter"),
			$endMessage = $(".counter__end-promotion"),
			$buyButton = $(".counter__offer-cta"),
			$counterSubSection = $(".counter__offer-count"),
			$counterSection = $(".counter__section"),
			$counterProd = $(".counter__offer-prod"),
			timeRemaining;

		$(".counter__offer-btn").attr(
			"href",
			$(".counter__offer .shelf__buy-button").attr("href")
		);



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

		const lista = $counterProd.find(".prateleira.default");
		lista.map(function(i, element) {
			const endDate = $(element)
				.find("h2")
				.text();
			// console.log(endDate);
			// endDate.split(', ');

			$(element).append(`<div class="counter__offer-count">
				<div class="counter">
				<div class="counter__title"><span>Corre!</span> Essa oferta encerra em </div>
				<div class="counter__clock"><div class="counter__item"><span class="counter__time hours">${timeRemaining.hours}</span>
				<span class="counter__timetext">Horas</span></div><div class="counter__item">
				<span class="counter__time minutes">${timeRemaining.minutes}</span><span class="counter__timetext">Minutos</span></div>
				<div class="counter__item"><span class="counter__time seconds">${timeRemaining.seconds}</span>
				<span class="counter__timetext">Segundos</span></div></div>
				<div class="counter__title"> Ou enquanto durar o estoque! </div></div>
				<div class="counter__end-promotion hide"><span class="counter__end-message">Essa oferta acabou :(</span></div></div>`);
				console.log('teste baixo' + timeRemaining);

			function countdown() {

				timeRemaining = getTimeRemaining(endDate);

				if (timeRemaining === null) {
					$counterSection.addClass("hide");
					return;
				} else {
					$counterSection.removeClass("hide");
				}
				if (
					timeRemaining.days === 0 &&
					timeRemaining.hours === 0 &&
					timeRemaining.minutes === 0 &&
					timeRemaining.seconds === 0
				) {
					// clearInterval(countdown);
					$buyButton.addClass("hide");
					$counterSubSection.addClass("button-hidden");
					$counter.addClass("hide");
					$counterProd.addClass("hide");
					$endMessage.removeClass("hide");
				}

				timeRemaining.day =
					timeRemaining.days > 9
						? timeRemaining.days
						: "0" + timeRemaining.days;

				timeRemaining.hours =
					timeRemaining.hours > 9
						? timeRemaining.hours
						: "0" + timeRemaining.hours

				timeRemaining.minutes =
					timeRemaining.minutes > 9
						? timeRemaining.minutes
						: "0" + timeRemaining.minutes

				timeRemaining.seconds =
					timeRemaining.seconds > 9
						? timeRemaining.seconds
						: "0" + timeRemaining.seconds

				setTimeout(countdown, 1000);


			};


			countdown();

		});
		// const endDate = $('.counter__offer-prod .prateleira.default h2').text();
	};
	// Start it
	this.init();
});
