/* global $: true, Nitro: true */
'use strict';

require('modules/product/video');
require('modules/product/sku-fetch');
require('modules/product/gallery');
require('modules/product/product-nav');
require('modules/product/details');
require('modules/product/specifications');
require('modules/product/selos');
require('modules/product/supermodel');
require('modules/product/sku-select');
require('modules/product/boleto');
require('modules/product/notify-me');
require('modules/product/share');
require('modules/product/quiz-install');
require('modules/product/upsell');
require('modules/chaordic');
// require('modules/product/special-content');

Nitro.controller('produto', ['chaordic', 'sku-fetch', 'gallery', 'product-nav', 'video', 'details', 'specifications', 'selos', 'supermodel', 'sku-select', 'boleto', 'notify-me', 'share', 'quiz-install', 'upsell' /*, 'special-content'*/ ], function(chaordic) {
	var self = this,
		$body = $('body');

	//INICIA CHAMADA DAS VITRINES CHAORDIC
	chaordic.init('product', window.skuJson.productId);

	// Teste AB
	var urlTesteAb = window.location.search;
	var testeA     = 'testeab=a';
	var testeB     = 'testeab=b';

	if ( urlTesteAb.indexOf(testeA) >= 0 ) {
		$body.addClass('ab-test__mobile--show-b');
	}
	else if ( urlTesteAb.indexOf(testeB) >= 0 ) {
		$body.addClass('ab-test__mobile--show-b');
	}

	// Exibe Informação de "Compra segura" quando o
	// botão comprar estiver exibindo na página
	if ($('#BuyButton .buy-button').is(':visible')) {
		$('.secure').show();
	} else {
		$('body').addClass('produto-indisponivel');
	}

	var $reference  = $('.reference'),
		$productSku = $('.productSku');

	//TROCA DE NOMES PRODUCT / SKUREF
	$(document).on('skuSelected.vtex', function() {
		$reference.addClass('hide');
		$productSku.removeClass('hide');
	}).on('skuUnselected.vtex', function() {
		$productSku.addClass('hide');
		$reference.removeClass('hide');
	});


	$(document).ajaxComplete(function(e, xhr, settings) {
		if (/outrasformasparcelamento/.test(settings.url)) {
			self.valoresParcelas();
		}
	});


	if($(window).width() <= 1024){
		$(window).scroll(function(e){
			e.preventDefault();
			var _pos = $(window).scrollTop();
			if($('body').hasClass('produto-indisponivel') || (_pos >= 100 && _pos <= 300)) {
				$('#BuyButton .buy-button').hide();
			} else{
				$('#BuyButton .buy-button').show();
			}
		});
	}


	var $slider = $('section.slider .prateleira-slider .prateleira>ul').not('.slick-initialized');

	this.setupSlider = function($currentSlider) {
		$currentSlider.not('.slick-initialized').slick({
			infinite      : true,
			slidesToShow  : 3,
			slidesToScroll: 3,
			responsive    : [{
				breakpoint: 990,
				settings  : {
					dots          : true,
					slidesToShow  : 2,
					slidesToScroll: 2
				}
			}, {
				breakpoint: 480,
				settings  : {
					dots          : true,
					slidesToShow  : 1,
					slidesToScroll: 1
				}
			}]
		});

		//ajusta para mobile - prateleira slider
		$('section.slider .prateleira-slider .prateleira ul').find('.detalhes>a').addClass('col-xs-6 col-md-12');

	};


	//setup modal
	$('a[data-modal]').click(function(e) {
		e.preventDefault();
		$('#modal-' + $(this).data('modal')).vtexModal();
	});


	//Opções de parcelamento
	self.valoresParcelas = function() {
		var $valoresParcelas    = $('.valores-parcelas'),
			$showParcelas       = $valoresParcelas.find('.titulo-parcelamento'),
			$opcoesParcelamento = $valoresParcelas.find('.other-payment-method-ul');

		$showParcelas.text('Ver parcelas');

		$opcoesParcelamento.find('li').each(function() {
			var $numeroParcelas = $(this).find('span:first-child'),
				numeroParcelas  = $numeroParcelas.text().split('X')[0],
				$valorParcela   = $(this).find('strong'),
				valorParcela    = parseFloat($valorParcela.text().replace('.','').replace(',', '.').split('R$')[1]),
				text            = $numeroParcelas.text().replace('de', ''),
				precoTotal      = parseFloat(numeroParcelas * valorParcela).toFixed(2);

			$(this).append('<span class="valor-total">Total: R$ ' + precoTotal.toString().replace('.',',') + '</span>');
			$numeroParcelas.text(text);
			$valorParcela.text('de ' + $valorParcela.text());
		});

		$showParcelas.click(function() {
			if ($(this).hasClass('active') || $opcoesParcelamento.find('.other-payment-method-intereset-yes').length === 0) {
				$valoresParcelas.find('>p').slideUp();
			} else {
				$valoresParcelas.find('>p').slideDown();
			}

			$(this).toggleClass('active');
			$opcoesParcelamento.slideToggle();
		});

		$('.select-voltage .select.skuList label').click(function(){
			$valoresParcelas.find('>p').slideUp();
			$opcoesParcelamento.slideUp();
		});
	};



	//Compre Junto
	$('.comprar-junto a').text('compre junto');


	//Google PLA
	if ($.getParameterByName('utmi_cp') === 'pla' || $.cookie('google_pla')) {
		$.cookie('google_pla', true, {
			path   : '/',
			expires: 1
		});

		$('body').addClass('google-pla');
	}


	//inicia automaticamente prateleiras sliders no desktop
	if ($(window).width() > 768) {
		self.setupSlider($slider);
		$('html, body').animate({scrollTop:190}, 1500);
	}


	//mobile - abrir vitrines
	if ($(window).width() <= 768) {
		$('section.slider .pre-title').click(function(e){
			e.preventDefault();

			if ($(this).hasClass('open')) {
				$(this).removeClass('open');
				$(this).siblings().find('.prateleira>ul').slideUp();
			} else {
				$('section.slider .open').siblings().find('.prateleira>ul').slideUp();
				$('section.slider .open').removeClass('open');
				$(this).addClass('open');
				$(this).siblings().find('.prateleira>ul').slideDown('slow',function(){
					self.setupSlider($(this));
				});
			}
		});

		$('section.slider').eq(0).find('.pre-title').trigger('click');
	}


	self.valoresParcelas();


	// var ID_GA, urlAPI, end, rand, dataRandom, coe;
	var qnt110v, qnt220v;
	// var pathname = window.location.pathname;
	// var users = 0;

	var Index = {

		init: function (){
			// console.log('init');
			Index.changeQntStoq();
			Index.getPecasRelacionadas();
		},
		getPecasRelacionadas: function() {
			var $btnPecas = $('.btn-pecas-produto'),
				$pecasModels = $('.value-field.Pecas-compativeis').length > 0 ? $('.value-field.Pecas-compativeis').html() : false,
				url = '//loja.consul.com.br/busca?',
				testNumber = new RegExp(/^\d/);
				// console.log('sim');
			if ($pecasModels) {
				$pecasModels = $pecasModels.replace(/\s+/g, '').split(';');
				$pecasModels = $pecasModels.filter(function(item, pos) {
					return $pecasModels.indexOf(item) === pos && testNumber.test(item) === false;
				});
				$pecasModels.forEach(function (val) {
					url += 'fq=alternateIds_RefId:' + val + '&';
				});
				$btnPecas.find('a').attr('href', url).parent().css({
					display: 'block'
				});
			}
			// else{
			// 	console.log('não');
			// }
		},
		changeQntStoq: function (){
			Index.getQntStoq();
			setInterval(function (){
				Index.getQntStoq();
			}, 900000);
		},

		getQntStoq: function (){

			Index.getAPI('/api/catalog_system/pub/products/search?fq=productId:' + window.skuJson.productId).then(function (data){

				if(data[0].items.length >= 2){


					if(data[0].items[0].name === '110V'){
						qnt110v = data[0].items[0].sellers[0].commertialOffer.AvailableQuantity;
						qnt220v = data[0].items[1].sellers[0].commertialOffer.AvailableQuantity;

						Index.calcQntStoq(qnt110v, qnt220v);
					}else{
						qnt220v = data[0].items[0].sellers[0].commertialOffer.AvailableQuantity;
						qnt110v = data[0].items[1].sellers[0].commertialOffer.AvailableQuantity;

						Index.calcQntStoq(qnt110v, qnt220v);
					}


				} else{
					qnt110v = data[0].items[0].sellers[0].commertialOffer.AvailableQuantity;
					var nome    = data[0].items[0].name;

					Index.calcQntStoqOnly(qnt110v);

					if(nome === 'BIVOLT' && qnt110v === 0){

						$('.usuarios-ativos').hide();

					}else if(nome === '110V' && qnt110v === 0){

						$('.usuarios-ativos').hide();

					}else if(nome === '220V' && qnt110v === 0){

						$('.usuarios-ativos').hide();
					}

				}

			});

		},

		calcQntStoqOnly: function (qnt110v){

			if( qnt110v > 3){
				$('#qnt_stoke').hide();

			} else if ( qnt110v === 0 ){
				$('.usuarios-ativos').hide();
			}else if( qnt110v <= 3 ){
				$('#qnt_stoke').show();
			} else{
				$('#qnt_stoke').show();
			}

		},

		calcQntStoq: function (qnt110v, qnt220v){

			if( (qnt110v > 3) && (qnt220v > 3) ){
				$('#qnt_stoke').hide();
			} else if ((qnt110v === 0) && (qnt220v === 0)){
				$('.usuarios-ativos').hide();
			} else if ( qnt110v === 0 && qnt220v > 3 ){
				$('#qnt_stoke').hide();
			} else if( qnt110v > 3 && qnt220v === 0 ){
				$('#qnt_stoke').hide();
			} else if ( qnt110v === 0 && qnt220v <= 3 ){
				$('#qnt_stoke').show();
			} else if( qnt110v <= 3 && qnt220v === 0 ){
				$('#qnt_stoke').show();
			}else if(qnt110v <= 3 && qnt220v <= 3){
				$('#qnt_stoke').show();
			}

		},

		getAPI: function (url){
			return $.get(url);
		},


	};

	(function(window, document, $){

		$(function (){

			Index.init();

		});

	})(window, document, jQuery);

	// ativa calculo de frete na pagina de produto
	$('#popupCalculoFreteWrapper a').trigger('click');
	$(window).load(function(){

		var $loadingFret = $('span.frete-calcular'),
			$containerFrete = $('.freight-values');
	
		const $simulatorSelector = $('#btnFreteSimulacao');

		var flag = 0;

		$simulatorSelector.on('click', function() {
			if(flag === 0){
				flag = 1;
			}
		});

		$simulatorSelector.ajaxStart(function() {
			$loadingFret.addClass('loading');
			$containerFrete.removeClass('active erro');

		});

		$simulatorSelector.ajaxStop(function() {
			$loadingFret.removeClass('loading');
			$containerFrete.addClass('active');
			$containerFrete.prepend('<i class="closed"></i>');	
			if (flag === 1) {
				dataLayer.push({
					event: 'simuladorCEP',
					status: 'ok'
				});			
				flag = 0;
			}

			$('.freight-values.active').find('tbody').find('td').each(function() {
				self.setShippingMessage($(this));
			});
		});

		$('body').on('click', '.freight-values .closed', function() {
			$containerFrete.html('').removeClass('active erro');
		});

		window.alert = function(e) {
			if (e === 'O CEP deve ser informado.' || e === 'CEP inválido.' || e === 'Preencha um CEP válido.') {
				$containerFrete.html('Preencha um CEP válido.').addClass('active erro').css('display', 'block');
				$containerFrete.prepend('<i class="closed"></i>');
			}
			return;
		};
	});

	/** 
	 * Counts how many working days exists between today and Christmas
	 * @returns number of working days between these dates
	 */
	this.countWorkingDays = function() {
		let christmas = new Date('December 25, 2018 00:00:00'); // Christmas date
		let now = new Date; // Actual date
		let holidays = 0; // Set number of holidays
		let weekendDays = 0; // Number of Saturdays and Sundays
		
		now.setHours(0, 0, 0, 0);

		// Count how many days exists between these dates
		let days = Math.round((christmas - now) / 1000 / 60 / 60 / 24) -1;

		if (now <= new Date('November 2, 2018 23:59:59')) {
			holidays = 2;	
		} else if (now <= new Date('November 15, 2018 23:59:59')) {
			holidays = 1;
		}

		// Count how many Saturdays and Sundays exists between these dates
		for (let i = 0; i < days; i++) {
			if (now.getDay() === 0 || now.getDay() === 6) {
				weekendDays++;
			} 

			now.setDate(now.getDate()+1);
		}

		// Return total number of days, minus weekend days and holidays
		return days - (weekendDays + holidays);
	};

	/**
	 * Set text message if shipping can arrive before Christmas
	 * @param {HTMLElement} $workingDaysElement
	 */
	this.setShippingMessage = function($workingDaysElement) {
		// Rule to not consider schedule shipping.
		if($workingDaysElement.text().indexOf('Agendada') > 0 ) {
			return;
		}
		let workingDays = $workingDaysElement.text().match(/ (\d+) /g); // Get the number of days, if the string has this value
		
		// If the string has a day value, calculate how many days exists between today and Christmas and check if the order will arrive before Christmas
		if (workingDays) {
			let workingDaysUntilChristmas = self.countWorkingDays();
			
			(workingDaysUntilChristmas - parseInt(workingDays[0]) >= 0) ? $workingDaysElement.append(' <em>(Chega antes do Natal)</em>') : '';
		}			
	};

});
