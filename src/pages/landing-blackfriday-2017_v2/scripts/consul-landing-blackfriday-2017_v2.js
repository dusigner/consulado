'use strict';

require('modules/helpers');

//load Nitro Lib
require('vendors/nitro');

require('vendors/slick');
require('modules/product/facebook-share');

var CRM = require('modules/store/crm');

Nitro.setup([], function () {

	var contador;

	var Index = {

		init: function(){
			this.leadsBf();
			this.sliderDepoimentos();
			this.sliderPrateleira();

			contador = setInterval(this.countdown, 1000);
		},

		calculateTimeRemaining: function( endDate ) {
			var total   = Date.parse( endDate ) - Date.parse( new Date(), 'mm-dd-yyyy' ),
				seconds = Math.floor( ( total / 1000) % 60 ),
				minutes = Math.floor( ( ( total / 1000 ) / 60 ) % 60 ),
				hours   = Math.floor( ( total / ( ( 1000 * 60 ) * 60 ) ) % 24 ),
				days    = Math.floor( total / ( ( ( 1000 * 60 ) * 60 ) * 24 ) ),
				timeRemaining = {
					'total'   : total,
					'days'    : days,
					'hours'   : hours,
					'minutes' : minutes,
					'seconds' : seconds
				};

			return timeRemaining;
		},

		countdown: function() {
			var endDate       = '2017/11/25',
				$countdown    = $('.countdown'),
				$days         = $countdown.find('.countdown-days .counter'),
				$hours        = $countdown.find('.countdown-hours .counter'),
				$minutes      = $countdown.find('.countdown-minutes .counter'),
				$seconds      = $countdown.find('.countdown-seconds .counter'),
				timeRemaining = Index.calculateTimeRemaining(endDate),
				days          = timeRemaining.days,
				hours         = timeRemaining.hours,
				minutes       = timeRemaining.minutes,
				seconds       = timeRemaining.seconds;

			$days.text(days < 10 ? '0' + days : days);
			$hours.text(hours < 10 ? '0' + hours : hours);
			$minutes.text(minutes < 10 ? '0' + minutes : minutes);
			$seconds.text(seconds < 10 ? '0' + seconds : seconds);

			if ( days + hours + minutes + seconds <= 0 ) {
				clearInterval(contador);

				$('.lpbf-contador').addClass('is--end');
			}
		},

		emailValidation: function ( email ){
			var rx = /^[\w-]+(\.[\w-]+)*@([a-z0-9-]+(\.[a-z0-9-]+)*?\.[a-z]{2,6}|(\d{1,3}\.){3}\d{1,3})(:\d{4})?$/;

			return rx.test(email);
		},

		leadsBf: function (){
			var inputs = $('input[type="text"]');

			inputs.on('input', function() { $(this).removeClass('error'); });

			$('#form-bf-2017').on('submit', function(e) {
				e.preventDefault();

				var categorias = $('input[type=checkbox]:checked').map(function() { return this.value;} ).get().join(', ');
				var email = $('#email-bf-2017').val();
				var nome = $('#nome-bf-2017').val();

				$('.success_p').remove();
				$('.error_p').remove();
				$(inputs).addClass('erro');

				$('.form-blackfriday-2017').append('<p class="message error_p">Preencha os campos corretamente</p>');

				if( Index.emailValidation( email ) && nome !== '' && $('.campo-checkbox input[type="checkbox"]').is(':checked')){
					$(inputs).removeClass('erro');
					$('.error_p').remove();

					$('#form-bf-2017').addClass('success');

					var data = {
						'receberOfertasBlackFriday' : categorias,
						'firstName' : nome,
						'email': email,
						'isNewsletterOptIn' : true,
						'cadastroBlackFriday': true
					};

					CRM.insertClient(data).done(function (){

						dataLayer.push({ 'event' : 'blackfriday_cadastro' });
						
						$('.lpbf-ofertas-bf').fadeOut('slow');
						$('.lpbf-success').fadeIn('slow');

						setTimeout(function(){
							$('.form-blackfriday-2017 .sucesso').hide();
						}, 5000);

						$('#nome-bf-2017').val('');
						$('#email-bf-2017').val('');

					}).fail(function (){
						console.log('Erros ocorreram!');
					});
				}
			});
		},

		sliderDepoimentos: function() {
			if ($(window).width() <= 980) {
				$('.depoimentos .bg-depoimentos').slick({
					arrows: false,
					infinite: true,
					slidesToShow: 3,
					slidesToScroll: 3,
					responsive: [{
						breakpoint: 990,
						settings: {
							arrows: false,
							dots: true,
							slidesToShow: 1,
							slidesToScroll:1
						}
					}, {
						breakpoint: 480,
						settings: {
							arrow: false,
							dots: true,
							slidesToShow: 1,
							slidesToScroll: 1
						}
					}]
				});
			}
		},

		sliderPrateleira: function() {
			$(window).on('load', function() {
				$('.prateleira-bf .prateleira-slider ul').slick({
					arrows: true,
					dots: false,
					infinite: true,
					slidesToShow: 3,
					slidesToScroll: 3,
					responsive: [{
						breakpoint: 990,
						settings: {
							arrows: false,
							dots: false,
							slidesToShow: 1,
							slidesToScroll:1
						}
					}, {
						breakpoint: 480,
						settings: {
							arrow: false,
							dots: false,
							slidesToShow: 1,
							slidesToScroll: 1
						}
					}]
				});
			});
		}
	};

	Index.init();
});