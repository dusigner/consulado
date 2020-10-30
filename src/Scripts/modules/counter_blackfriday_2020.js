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

		// $(".counter__offer-btn").attr(
		// 	"href",
		// 	$(".counter__offer .shelf__buy-button").attr("href")
		// );

		const lista = $counterProd.find(".prateleira.default");
		lista.map(function(i, element) {
			const endDate = $(element)
				.find("h2")
				.text();
			// console.log(endDate);
			// console.log(element);
			// endDate.split(', ');

		$(element).append(`<div id="countdown_dashboard">
			<div class="dashp">
			<span class="dashtitle">Dias</span>
			<p id="days_${i}"></p>
			</div>
			<div class="dashp">
			<span class="dashtitle">Horas</span>
			<p id="hours_${i}"></p>
			</div>
			<div class="dashp">
			<span class="dashtitle">Minutos</span>
			<p id="minutes_${i}"></p>
			</div>
			<div class="dashp">
			<span class="dashtitle">Segundos</span>
			<p id="seconds_${i}"></p>
			</div>
		</div>`);
			function countdown(){

				var now = new Date();
							// Altere a data do seu evento aqui
				var eventDate = new Date(endDate);
				var currentTiime = now.getTime();
				var eventTime = eventDate.getTime();
				var remTime = eventTime - currentTiime;
				// calculando o dia, hora, minuto e segundo
				  var d = Math.floor(remTime / (1000 * 60 * 60 * 24));
				  var h = Math.floor((remTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
				  var m = Math.floor((remTime % (1000 * 60 * 60)) / (1000 * 60));
				  var s = Math.floor((remTime % (1000 * 60)) / 1000);
				document.getElementById("days_" + i).textContent = d;
				// document.getElementById("days").innerText = d;
				document.getElementById("hours_" + i).textContent = h;
				document.getElementById("minutes_" + i).textContent = m;
				document.getElementById("seconds_" + i).textContent = s;
				setTimeout(countdown, 1000);
				// Verifica se acabou o período do evento
				if (remTime < 0) {
				clearInterval(countdown);
				  //document.getElementById("demogrande").innerHTML = "FIM";
				document.getElementById("days_" + i).innerHTML = " ";
				document.getElementById("hours_" + i).innerHTML = " ";
				document.getElementById("minutes_" + i).innerHTML = " ";
				document.getElementById("seconds_" + i).innerHTML = "<small>FIM</small>";
				}
			}
			countdown();
		});
		// const endDate = $('.counter__offer-prod .prateleira.default h2').text();
	};
	// Start it
	this.init();
});
