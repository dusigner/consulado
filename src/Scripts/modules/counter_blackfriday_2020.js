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

	// $(".counter__offer-btn").attr(
	// 	"href",
	// 	$(".counter__offer .shelf__buy-button").attr("href")
	// );

	this.initCounter = () => {
		let $counter = $(".counter"),
			$endMessage = $(".counter__end-promotion"),
			$buyButton = $(".counter__offer-cta"),
			$counterSubSection = $(".counter__offer-count"),
			$counterSection = $(".counter__section"),
			$counterProd = $(".counter__offer-prod"),
			timeRemaining;

		const lista = $counterProd.find(".prateleira.default");
		let itensProd = $(lista).length;


		if($(itensProd) === 0) {
			$counterSection.hide();
		} else {
			$counterSection.show();
		}


		lista.map(function(i, element) {

			const endDate = $(element).find("h2").text();

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


			countdown(endDate, i);


		});

		function countdown(endDate, index){
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
			console.log(d, h, m, s);

			document.getElementById("days_" + index).textContent = d;

			// console.log(document.getElementById("days_" + index));

			document.getElementById("hours_" + index).textContent = h;
			document.getElementById("minutes_" + index).textContent = m;
			document.getElementById("seconds_" + index).textContent = s;

			console.log(endDate, index);


			let tempo = setTimeout(countdown, 1000);

			// Verifica se acabou o período do evento
			if (remTime <= 0) {
				clearInterval(tempo);
				document.getElementById("days_" + index).innerHTML = " ";
				document.getElementById("hours_" + index).innerHTML = " ";
				document.getElementById("minutes_" + index).innerHTML = " ";
				document.getElementById("seconds_" + index).innerHTML = " ";
				$(lista).hide();
				itensProd--;
			}

			// if(itensProd.length === 0) {
			// 	console.log(itensProd + "teste");
			// 	$counterSection.hide();
			// }
		}



		//verifica se nao tem nenhuma coleção cadastrada
		// if($($counterSection).find('.prateleira.default').length === 0) {
		// 	$($counterSection).addClass("hide");
		// } else {
		// 	$($counterSection).removeClass("hide");
		// }
		// $('.counter__offer-prod').slick({
		// 	mobileFirst: false,
		// 	slidesToShow: 1,
		// 	fade: false,
		// 	cssEase: 'ease',
		// 	easing: 'linear',
		// 	arrows: false,
		// 	dots: true
		// });
	};
	// Start it
	this.init();
});
