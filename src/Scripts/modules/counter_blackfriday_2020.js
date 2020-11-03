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
			$counterProd = $(".counter__offer-prod");


		const lista = $counterProd.find(".prateleira.default");
		let itensProd = $(lista).length;

		if($(itensProd) === 0) {
			$counterSection.hide();
		} else {
			$counterSection.show();
		}


		lista.map(function(i, element) {

			const endDate = $(element).find("h2").text();

			$(element).append(`<div id="countdown_dashboard" style="height: 100px">
				<div class="title">Corre! Essa oferta encerra em </div>
				<div class="dashp hidden">
					<p id="days_${i}"></p>
					<span class="dashtitle">Dias</span>
				</div>
				<div class="dashp">
					<p id="hours_${i}"></p>
					<span class="dashtitle">Horas</span>
				</div>
				<span class="pontos">:</span>
				<div class="dashp">
					<p id="minutes_${i}"></p>
					<span class="dashtitle">Minutos</span>
				</div>
				<span class="pontos">:</span>
				<div class="dashp">
					<p id="seconds_${i}"></p>
					<span class="dashtitle">Segundos</span>
				</div>
				<div class="title"> Ou enquanto durar o estoque! </div>
			</div>`);



			let botao = $(element).find(".sku_buy");
			$(element).append(botao);

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


			// var d = $days > 9 ? $days : "0" + $days;
			// var h = $hours > 9 ? $hours : "0" + $hours
			// var m = $minutes > 9 ? $minutes : "0" + $minutes
			// var s = $seconds > 9 ? $seconds : "0" + $seconds

			document.getElementById("days_" + i).textContent = d;
			document.getElementById("hours_" + i).textContent = h;
			document.getElementById("minutes_" + i).textContent = m;
			document.getElementById("seconds_" + i).textContent = s;


			let tempo = setTimeout(countdown, 1000);

			// Verifica se acabou o período do evento
				if (remTime <= 0) {
					clearInterval(tempo);
					document.getElementById("days_" + i).innerHTML = " ";
					document.getElementById("hours_" + i).innerHTML = " ";
					document.getElementById("minutes_" + i).innerHTML = " ";
					document.getElementById("seconds_" + i).innerHTML = " ";
					$(element).remove();
					$(".slick-dots").find("button").first().remove();
					itensProd--;
				}
		}
		countdown();
	});
		$('.counter__offer-prod').slick({
			slidesToShow: 1,
			arrows: true,
			dots: true
		});
	};
	// Start it
	this.init();
});
