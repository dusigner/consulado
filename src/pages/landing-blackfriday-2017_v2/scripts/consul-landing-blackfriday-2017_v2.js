/* global store:true, FB:true */

'use strict';

require('modules/helpers');

//load Nitro Lib
require('vendors/nitro');

require('expose?store!modules/store/store');
require('vendors/slick');
require('modules/store/facebook-init');
// require('modules/product/facebook-share');

var CRM = require('modules/store/crm');

Nitro.setup(['facebook-init'], function () {

	var cupons = null;

	var contador;

	var Index = {

		init: function(){
			this.leadsBf();
			this.sliderDepoimentos();
			this.sliderPrateleira();
			this.clickAction();
			this.consultaCupom();

			contador = setInterval(this.countdown, 1000);
		},

		consultaCupom: function() {
			var qtdCupom = $('#quantidade-cupom');

			$.getJSON(CRM.formatUrl('CB', 'search'), {
				_fields: 'qtdCupons',
				nomeCupom: 'BLACKFRIDAY50'
			}).done(function(data) {

				if ( data ) {
					qtdCupom.text( data[0].qtdCupons );
					cupons = data[0].qtdCupons;
				}
				else {
					qtdCupom.text( 4999 );
				}
			});
		},

		atualizaCupom: function() {
			if ( cupons ) {
				var  data = {};
				data.nomeCupom = 'BLACKFRIDAY50';
				data.qtdCupons = cupons - 1;

				return CRM.ajax({
					url: CRM.formatUrl('CB', 'documents'),
					type: 'PATCH',
					data: JSON.stringify(data)
				});
			}
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
			var endDate       = '2017/11/24',
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

					var dados = {
						'nome': nome,
						'email': email,
						'categoria': categorias
					};

					$.ajax({
						url: 'https://api.jussi.com.br/whp/leads/consul/submit',
						dataType: 'json',
						type: 'post',
						contentType: 'application/json',
						data: JSON.stringify(dados),
						processData: false
					});


					CRM.insertClient(data).done(function (){

						dataLayer.push({ 'event' : 'blackfriday_cadastro' });

						$('.lpbf-ofertas-bf').fadeOut('slow');
						$('.facebook-share').fadeIn('slow');

						setTimeout(function(){
							$('.form-blackfriday-2017 .sucesso').hide();
						}, 5000);

						$('#nome-bf-2017').val('');
						$('#email-bf-2017').val('');

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

		// monta slick da prateleira
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
		},

		// acao de compartilhar no facebook
		clickAction: function() {
			$('.facebook-share button').unbind().click(function(e) {
				e.preventDefault();

				if(FB) {
					FB.ui({
						method: 'feed',
						caption: 'Consul',
						link: 'http://loja.consul.com.br'
					}, function(response){
						if (response && !response.error_code) {
							$('.facebook-share').fadeOut('slow');
							$('.lpbf-success').fadeIn('slow');

							// Se o compartilhamento foi feito
							Index.atualizaCupom();

						} else {
							$('.facebook-share').fadeIn('slow');
						}
					});
				}
			});
		}
	};

	Index.init();
});