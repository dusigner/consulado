/* global $: true, Nitro: true, skuJson: true */
'use strict';

require('vendors/slick');
require('vendors/vtex-modal');
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
// require('modules/product/special-content');

Nitro.controller('produto', [ 'sku-fetch', 'gallery', 'product-nav', 'video', 'details', 'specifications', 'selos', 'supermodel', 'sku-select', 'boleto', 'notify-me' /*, 'special-content'*/ ], function() {

	var self = this;

	window.alert = function(e) {
		console.error(e);
		return;
	};

	// Exibe Informação de "Compra segura" quando o
	// botão comprar estiver exibindo na página
	if ($('#BuyButton .buy-button').is(':visible')) {
		$('.secure').show();
	} else {
		$('body').addClass('produto-indisponivel');
	}

	var $reference = $('.reference'),
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
			// console.log(_pos);
			if(_pos >= 100 && _pos <= 300) {
				$('#BuyButton .buy-button').hide();
			} else{
				$('#BuyButton .buy-button').show();
			}
		});
	}


	var $slider = $('section.slider .prateleira-slider .prateleira>ul').not('.slick-initialized');

	this.setupSlider = function($currentSlider) {
		$currentSlider.not('.slick-initialized').slick({
			infinite: true,
			slidesToShow: 3,
			slidesToScroll: 3,
			responsive: [{
				breakpoint: 990,
				settings: {
					dots: true,
					slidesToShow: 2,
					slidesToScroll: 2
				}
			}, {
				breakpoint: 480,
				settings: {
					dots: true,
					slidesToShow: 1,
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
		var $valoresParcelas = $('.valores-parcelas'),
			$showParcelas = $valoresParcelas.find('.titulo-parcelamento'),
			$opcoesParcelamento = $valoresParcelas.find('.other-payment-method-ul');

		$showParcelas.text('Ver parcelas');

		$opcoesParcelamento.find('li').each(function() {
			var $numeroParcelas = $(this).find('span:first-child'),
				numeroParcelas = $numeroParcelas.text().split('X')[0],
				$valorParcela = $(this).find('strong'),
				valorParcela = parseFloat($valorParcela.text().replace('.','').replace(',', '.').split('R$')[1]),
				text = $numeroParcelas.text().replace('de', ''),
				precoTotal = parseFloat(numeroParcelas * valorParcela).toFixed(2);

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



	//Rating TruxtVox
	$(document).on('click', '.trustvox-fluid-jump', function(e) {
		e.preventDefault();

		$('html, body').animate({
			scrollTop: $('#trustvox-rating').offset().top + 'px'
		}, 'slow');
	});


	//Google PLA
	if ($.getParameterByName('utmi_cp') === 'pla' || $.cookie('google_pla')) {
		$.cookie('google_pla', true, {
			path: '/',
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
			Index.changeQntStoq();
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
					var nome = data[0].items[0].name;

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

});
