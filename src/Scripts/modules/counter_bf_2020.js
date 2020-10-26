/**
 *
 * @fileOverview counter
 *
 */
"use strict";

Nitro.module("counter-bf-2020", function() {
	const endDate = "2020/11/27";

	this.init = () => {
		this.initCounter();
		this.enviarEmail();
		this.tagueamento();
	};

	this.initCounter = () => {
		let $counter = $(".counter-bf-2020"),
			$endMessage = $(".counter__end-promotion"),
			$counterSection = $(".bg-counter"),
			$days = $counter.find(".days"),
			$hours = $counter.find(".hours"),
			$minutes = $counter.find(".minutes"),
			$seconds = $counter.find(".seconds"),
			timeRemaining;

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
				$counterSection.addClass("hide");
				$endMessage.removeClass("hide");
			}

			$days.text(
				timeRemaining.days > 9
					? timeRemaining.days
					: "0" + timeRemaining.days
			);
			$hours.text(
				timeRemaining.hours > 9
					? timeRemaining.hours
					: "0" + timeRemaining.hours
			);
			$minutes.text(
				timeRemaining.minutes > 9
					? timeRemaining.minutes
					: "0" + timeRemaining.minutes
			);
			$seconds.text(
				timeRemaining.seconds > 9
					? timeRemaining.seconds
					: "0" + timeRemaining.seconds
			);
		}, 1000);
	};
	this.enviarEmail = () => {
		$(".form-envio").on("submit", function(e) {
			e.preventDefault();

			var mensagem = $(".mensagem");
			var email = $(this).find("#email");

			var body = {
				email: email.val(),
				pagina: "Página Home",
				produto: ""
			};

			// Validações
			const validateEmail = email => {
				const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				return re.test(email);
			};
			if (body.email == "") {
				email.focus();
				mensagem.text("Por favor, preencha o campo de e-mail");
			} else if (!validateEmail($("#email").val())) {
				mensagem.html("<p><span class='icone'></span>Este e-mail não é válido. Digite novamente.</p>").show(500);
			} else {
				$.ajax({
					headers: {
						"Content-Type": "application/json",
						Accept: "application/vnd.vtex.ds.v10+json"
					},
					type: "POST",
					url: "/api/dataentities/TS/documents",
					data: JSON.stringify(body),
					beforeSend: function() {
						$("#send").append(
							'<div class="load"><div class="loading"></div></div>'
						);
						$("#send").attr("disabled", "disabled");
					}
				})
					.success(() => {
						mensagem.html("<p class='msg-sucesso'>Pronto, e-mail cadastrado! Agora é só aproveitar a Black Friday antes de todo mundo.</p>").show();
						$(".load").fadeOut(500);
						$("#send").removeAttr("disabled");

						dataLayer.push({
							event: 'generic',
							category: 'black_friday_2020',
							action: 'home_contador_ofertas',
							label: 'exibicao_email_cadastrado'
						});
					})
					.fail(() => {
						mensagem
							.text("Ocorreu um erro, tente novamente mais tarde")
							.show();
					})
					.done(() => {
						$(".form-envio").each(() => {
							this.reset();
						});
						setTimeout(() => {
							mensagem.fadeOut(500);
						}, 5000);
					});
			}
		});
	};
	this.tagueamento = () => {
		//click avise-me
		$('.cont-mobile').find('.btn-enviar').on('click', function(){
			dataLayer.push({
				event: 'generic',
				category: 'black_friday_2020',
				action: 'home_contador_ofertas',
				label: 'click_avise_me'
			})
		});
		//click input
		$('#email').on('click', function(){
			dataLayer.push({
				event: 'generic',
				category: 'black_friday_2020',
				action: 'home_contador_ofertas',
				label: 'click_digitacao'
			})
		});
		//click enviar
		$('#send').on('click', function(){
			dataLayer.push({
				event: 'generic',
				category: 'black_friday_2020',
				action: 'home_contador_ofertas',
				label: 'click_enviar'
			})
		});
	}

	// Start it
	this.init();
});
