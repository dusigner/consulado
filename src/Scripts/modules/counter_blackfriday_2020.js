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

		let $counterSection = $(".counter__section"),
			$counterProd = $(".counter__offer-prod");


		const lista = $counterProd.find(".prateleira.default");
		let itensProd = $(lista).length;

		if(itensProd === 0) {
			$counterSection.hide();
		} else {
			$counterSection.show();
		}

		lista.map(function(i, element) {

			const endDate = $(element).find("h2").text();

			$(element).append(`<div class="countdown_dashboard">
				<div class="title">Essas ofertas terminam em </div>
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


			let botao = $(element).find(".sku_buy").text("Eu quero!");
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

			var d = d > 9 ? d : "0" + d;
			var h = h > 9 ? h : "0" + h;
			var m = m > 9 ? m : "0" + m;
			var s = s > 9 ? s : "0" + s;

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
					$(".slick-dots").find(".slick-active").first().hide();
					itensProd--;
				}
		}

		countdown();
	});
	$('.counter__offer-prod').slick({
		slidesToShow: 1,
		arrows: false,
		dots: true,
		infinite: false
	});

	// $('.counter__offer-prod').on('afterChange', function(event, slick, currentSlide, nextSlide){
	// 	console.log(event, slick, currentSlide, nextSlide);

	// if (itensProd.length === 0) {
	// 	$('.counter__offer-prod').remove('slick-slide');
	// }
	};
	// Start it
	this.init();
});
