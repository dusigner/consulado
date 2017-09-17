'use strict';

require('modules/helpers');

//load Nitro Lib
require('vendors/nitro');

var CRM = require('modules/store/crm');

Nitro.setup([], function () {

	var dados = {
		'produtos' : [
			{
				'image'  : '//whirlpoolqa.vteximg.com.br/arquivos/01.png',
				'nome'   : 'Geladeira Brastemp Inverse 422 litros Evox',
				'codigo' : 'BRE50NK',
				'url'    : '//loja.brastemp.com.br/geladeira-brastemp-inverse-422-litros-bre50nk/p'
			},
			{
				'image'  : '//whirlpoolqa.vteximg.com.br/arquivos/02.png',
				'nome'   : 'Cooktop à Gás Brastemp Ative! 5 Bocas em Vidro',
				'codigo' : 'BDD75AE',
				'url'    : '//loja.brastemp.com.br/cooktop-a-gas-brastemp-ative-5-bocas-em-vidro-preto-bdd75ae/p'
			},
			{
				'image'  : '//whirlpoolqa.vteximg.com.br/arquivos/03.png',
				'nome'   : 'Forno à Gás de Embutir Brastemp Clean',
				'codigo' : 'BOA61AR',
				'url'    : '//loja.brastemp.com.br/forno-a-gas-de-embutir-brastemp-clean-inox-boa61ar/p'
			},
			{
				'image'  : '//whirlpoolqa.vteximg.com.br/arquivos/04.png',
				'nome'   : 'Fogão 6 Bocas Brastemp de Piso Mesa Compartimentada',
				'codigo' : 'BFS6NBR',
				'url'    : '//loja.brastemp.com.br/fogao-de-piso-brastemp-6-bocas-mesa-compartimentada-bfs6nbr/p'
			},
			{
				'image'  : '//whirlpoolqa.vteximg.com.br/arquivos/05.png',
				'nome'   : 'Adega Dual Zone Brastemp Gourmand 31 Garrafas',
				'codigo' : 'BZB31AE',
				'url'    : '//loja.brastemp.com.br/adega-dual-zone-brastemp-gourmand-31-garrafas-preta-bzb31ae/p'
			},
			{
				'image'  : '//whirlpoolqa.vteximg.com.br/arquivos/06.png',
				'nome'   : 'Lava-Louças Brastemp Ative! 8 Serviços',
				'codigo' : 'BLF08AS',
				'url'    : '//loja.brastemp.com.br/lava-loucas-brastemp-ative-8-servicos-prata-blf08as/p'
			},
			{
				'image'  : '//whirlpoolqa.vteximg.com.br/arquivos/07.png',
				'nome'   : 'Lavadora Brastemp 11Kg',
				'codigo' : 'BWK11AB',
				'url'    : '//loja.brastemp.com.br/lavadora-brastemp-11kg-top-load-bwk11ab/p'
			},
			{
				'image'  : '//whirlpoolqa.vteximg.com.br/arquivos/08.png',
				'nome'   : 'Geladeira Brastemp Ative 429 Litros Evox',
				'codigo' : 'BRM50NK',
				'url'    : '//loja.brastemp.com.br/geladeira-brastemp-ative-platinum-429-litros-brm50nk/p'
			}
		]
	};

	var Index = {

		init: function(){
			this.leadsBf();
			this.slider();

			setInterval(this.countdown, 1000);
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
		},

		emailValidation: function ( email ){
			var rx = /^[\w-]+(\.[\w-]+)*@([a-z0-9-]+(\.[a-z0-9-]+)*?\.[a-z]{2,6}|(\d{1,3}\.){3}\d{1,3})(:\d{4})?$/;

			return rx.test(email);
		},

		leadsBf: function (){
			var inputs = $('input[type="text"]');
			var catItem = $('.lpbf-categorys__image, .lpbf-categorys__text');

			inputs.on('input', function() { $(this).removeClass('error'); });

			// catItem.click(function(){
			// 	$(this).parent().toggleClass('is--active');
			// });

			$('#form-bf-2017').on('submit', function(e) {
				e.preventDefault();

				var categorias = $('input[type=checkbox]:checked').map(function() { return this.value;} ).get().join(', ');
				var email = $('#email-bf-2017').val();
				var nome = $('#nome-bf-2017').val();

				$('.success_p').remove();
				$('.error_p').remove();
				$(inputs).addClass('erro');

				$('.form-blackfriday-2017').append('<p class="message error_p">Preencha os campos corretamente</p>');

				if( Index.emailValidation( email ) && nome !== '' ){

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

						// dataLayer.push({
						// 	'event' : 'BTP-BF-FormSuccess',
						// 	'email' : email
						// });

						$('.form-blackfriday-2017').append('<p class="message success_p">Você foi cadastrado</p>');

						setTimeout(function(){
							$('.form-blackfriday-2017').addClass('fjksahbfjkashbjkfbsahfsafsjhfslbdlfjbs');
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

		slider: function(){
			var $sliderProdutos = $('.slider_produtos');

			$sliderProdutos.slick({
				adaptiveHeight: true,
				dots: true
			});

			var slider = $sliderProdutos.slick('getSlick');
			var itens = slider.$slides;

			for( var i = 0; i < itens.length; i++ ){

				$(itens[i]).find('img').prop('src', dados.produtos[i].image);
				$(itens[i]).find('img').prop('alt', dados.produtos[i].nome + ' - ' + dados.produtos[i].codigo);
				$(itens[i]).find('a').prop('href', dados.produtos[i].url);
				$(itens[i]).find('a').prop('title', dados.produtos[i].nome + ' - ' + dados.produtos[i].codigo);
				$(itens[i]).find('figcaption').html(dados.produtos[i].nome + '<br><strong>' + dados.produtos[i].codigo + '</strong>');
			}
		}
	};

	Index.init();
});