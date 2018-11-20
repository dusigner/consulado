'use strict';

require('modules/helpers');

//load Nitro Lib
require('vendors/nitro');

// require('modules/store/store');
require('expose-loader?store!modules/store/store');
require('vendors/slick');
require('modules/store/facebook-init');
// require('modules/product/facebook-share');

require('./modules/accordion');

var CRM = require('modules/store/crm');

Nitro.setup(['accordion'], function () {
	var contador;

	var Index = {

		init: function(){
			this.leadsBf();
			this.sliderDepoimentos();
			this.sliderPrateleira();
			this.showProducts();
			this.tags();

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
			var endDate       = '2018/11/23',
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
			var inputs = $('input[type="text"], input[type="email"]');

			inputs.on('input', function() {
				$(this).removeClass('error');
			});
			$('#form-bf-2018 #submit-bf2018[type="submit"]').on('click', function(e) {
				e.preventDefault();

				var formBlackFriday2018 = $('.form-blackfriday-2018');
				var categoryArray =	$('.lpbf-categorys__item input[type=checkbox]:checked').map(function() { return this.value; } ).get();
				var category = categoryArray.join(', ');
				var email = $('#email-bf-2018').val();
				var nome = $('#nome-bf-2018').val();
				var concordo = $('#li-concordo').is(':checked') ? true : false;

				$('.success_p').remove();
				$('.error_p').remove();
				$(inputs).addClass('erro');

				formBlackFriday2018.append('<p class="message error_p">Preencha os campos corretamente</p>');

				// Verifica se todos os campos foram preenchidos
				if( Index.emailValidation( email ) && nome !== '' ) {

					$(inputs).removeClass('erro');
					$('.error_p').remove();
					$('#form-bf-2018').addClass('success');

					// Dados do formulário
					var data = {
						'receberOfertasBlackFriday' : category,
						'firstName' : nome,
						'email': email,
						'isNewsletterOptIn' : concordo,
						'cadastroBlackFriday': true
					};

					var dados = {
						'nome': nome,
						'email': email,
						'categoria': category
					};

					// Disparo dos dados para a API que cadastra na Sales Force
					$.ajax({
						url: 'https://api.jussi.com.br/whp/leads/consul/submit',
						dataType: 'json',
						type: 'post',
						contentType: 'application/json',
						data: JSON.stringify(dados),
						processData: false
					});

					// Disparo dos dados para o MasterData
					CRM.insertClient(data).done(function() {
						// console.log('data', data);

						formBlackFriday2018.append('<p class="message success_p">Você foi cadastrado</p>');

						setTimeout(function() {
							formBlackFriday2018.find('.sucesso').hide();
							$('#form-bf-2018').addClass('hide');
							$('.lpbf-form-success').removeClass('hide');

							dataLayer.push(
								{ event: 'generic-event-trigger', label: 'sucesso cadastro', action: 'Cadastro de Interesses', category: 'LP - Black Friday' }
							);

							$(categoryArray).each((index, category) => {

								dataLayer.push(
									{ event: 'generic-event-trigger', label: category, action: 'Sucesso Cadastro', category: 'LP - Black Friday' }
								);
							});

						}, 1000);

						$('#nome-bf-2018').val('');
						$('#email-bf-2018').val('');
					});
				}
			});
		},

		sliderDepoimentos: function() {
			// if ($(window).width() <= 980) {
			$('.depoimentos .bg-depoimentos').slick({
				arrows: false,
				infinite: true,
				dots: true,
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
			// }
		},

		// monta slick da prateleira
		sliderPrateleira: function() {
			$('.helperComplement').remove();
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

		// mostra mais produtos para selecionar
		showProducts: function () {

			var $elementForm = $('#form-bf-2018');

			$('.chose-more-products').on('click', function (e) {
				e.preventDefault();
				$elementForm.find('.js-categories').hide();
				$elementForm.addClass('active');
				$elementForm.find('#click-more-products, .form-blackfriday-2018').hide();
				$elementForm.find('.lpbf-categorys').css('display', 'flex');
				$elementForm.find('.js-categories li').remove();
			});

			// Exibe mais produtos para escolher
			$('#click-more-products a').on('click', function (e) {
				e.preventDefault();
				$elementForm.addClass('active');
				$elementForm.find('#click-more-products, .form-blackfriday-2018').hide();
			});

			// Esconde a opção de mais produtos
			$('a.btn-close').on('click', function () {
				$elementForm.removeClass('active');
				$elementForm.find('#click-more-products, .form-blackfriday-2018').fadeIn();
			});

			// Continua para preenchimento do form
			$('#form-bf-2018 #submit-continued[type="submit"]').on('click', function (e) {
				e.preventDefault();

				var category = $('.lpbf-categorys__item input[type=checkbox]:checked').map(function() {
					return this.value;
				});

				// Renderiza opções de categorias escolhidas
				$.each(category, function (i) {
					var $renderOptions = ' <li class="txt-categories">' + category[i] + '</li>';
					$('.js-categories ul').append($renderOptions);
				});

				$('.js-categories').show();
				$('.lpbf-categorys').hide();
				$elementForm.addClass('active-chosen');
				$elementForm.removeClass('active');
				$elementForm.find('.form-blackfriday-2018').fadeIn();

			});
		},

		tags : function() {
			$('.faq .wrapper__question').on('click', function() {
				dataLayer.push({
					event: 'generic-event-trigger',
					category: 'LP - Black Friday',
					action: 'FAQ ',
					label: $(this).text()
				});
			});
		}
	};

	Index.init();
});
