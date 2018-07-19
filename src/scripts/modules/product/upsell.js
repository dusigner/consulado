
'use strict';

Nitro.module('upsell', function() {
	


	var 
		// pegando valores do produto atual		
		titleproductatual  = $('.productName').text(),
		skureferenc        = $('.productSku .skuReference').text(),
		imagematual        = $('.prod-galeria .slick-active a img').attr('src'),
		valorProatual      = $('.prod-preco .skuBestPrice').text(),
		valorProatualFormt = $('.prod-preco .skuBestPrice').text().replace(/\D/gmi, ''),
		capacidadeatual    = $('td.value-field.Capacidade').text().replace('L', ' litros') || $('td.value-field.Capacidade-Total-L-').text().replace('L', ' litros'),
		painelautal        = $('td.value-field.Display').text(),
		formatoatual  	   = $('td.value-field.Formato').text(),
	
		// variaveis para mostrar o valor do upgrade
		valorProdatualcalc,
		valorProupgrade,
		valordiferenca,		
		price,

		// pegando valores do produto upgrade
		capacidadeOportunidade,
		painelOportunidade,
		temperaturaOportunidade,
		skureferencup,
		urlupgrade,
		
		uri   = window.location.href,
		idurl = uri.split('upgrade=');
		

	this.setup = function() {
		this.valordiferenca();
		this.montandomodal();
		this.openclose();
		this.verificadowngrade();		
		this.responsivo();
	};



	this.responsivo = function() {

		if ($(window).width() <= 667) {

			$(document).ready(function(){
				$('.icon-open-upgrade').addClass('ativo');
				$('.product-upgrade').removeClass('hide').addClass('mobile');			
				$('.upgrade-mobile').removeClass('hide');			
				$('#upsell').addClass('mobile');			
			});			
			
		} else {
			
			$(document).ready(function(){
				$('.icon-open-upgrade').addClass('ativo');				
				$('.product-upgrade').removeClass('hide');		
			});			
		}
		
	};

	this.valordiferenca = function() {	

		$.each($('#upsell li[layout]'), function( index, value ) {

			valorProdatualcalc = $('.prod-preco .skuBestPrice').text().replace(/\D/gmi, ''),
			valorProupgrade    = $(this).find('.title-price-upgrade span').text().replace(/\D/gmi, ''),
			valordiferenca     = Number(valorProupgrade) - Number(valorProdatualcalc),
			price              = 'POR + R$' + _.formatCurrency( valordiferenca / 100),
			$(this).find('.textupgrade span, .info-product-mobile > span').html( price );			

		});

	};


	this.montandomodal = function() {

		$.each($('#upsell li[layout]'), function( index, value ) {
			
			// pegando valores do produto upgrade
			urlupgrade              = $(this).find('.ir-para-produto').attr('href'),
			skureferencup           = $(this).find('.skureferenc ul li').text(),
			capacidadeOportunidade  = $(this).find('.espe-oportunidade .licapacidade ul li').text().replace('L', ' litros'),
			painelOportunidade      = $(this).find('.espe-oportunidade .lipainel ul li').text(),
			temperaturaOportunidade = $(this).find('.espe-oportunidade .litemperatura ul li').text();

						
			// montando vitrine do produto atual dentro do modal
			$('.voce-esta-vendo h2:nth-child(3)').html(titleproductatual + ' - <strong>' + skureferenc + '</strong>');
			$('.voce-esta-vendo span').html(valorProatual);
			$('.espe-voce-esta-vendo .licapacidadea').html(capacidadeatual);
			$('.espe-voce-esta-vendo .lipainela').html(painelautal);
			$('.espe-voce-esta-vendo .litemperaturaa').html(formatoatual);
			$('.voce-esta-vendo img').attr('src', imagematual);

			// montando dados do produto upgrade
			$(this).find('.title-price-upgrade p strong, .info-product-mobile h3 strong').html(skureferencup);
			$(this).find('.oportunidadePro h2:nth-child(3) strong').html(skureferencup);
			$(this).find('.espe-oportunidade .licapacidade, .especifi-product-mobile .licapacidadem span').html(capacidadeOportunidade);
			$(this).find('.espe-oportunidade .lipainel, .especifi-product-mobile .lipainelm span').html(painelOportunidade);
			$(this).find('.espe-oportunidade .litemperatura, .especifi-product-mobile .litemperaturam span').html(temperaturaOportunidade);
			$(this).find('.ir-para-produto, .aceito-mobile .btn-interessado-upgrade-mobile').attr('href', urlupgrade + '?upgrade=' + window.skuJson_0.productId);
		
		});

	};

	

	this.openclose = function () {

		// Abre o modal de upgrade
		$('.btn-interessado-upgrade').click(function() {			
			$('#modal-produto-upgrade' + $(this).attr('data-id')).vtexModal();			
		});

		// fecha barra fixa
		$('.close-fixed, .icon-open-upgrade').click(function() {
			$('#upsell').toggleClass('ativo');
			$('.icon-open-upgrade').toggleClass('ativo');
		});


	};


	this.verificadowngrade = function () {
		
		if (uri.indexOf('upgrade') > 0 ){

			$('#upsell li[layout]').addClass('hide');
			$('.product-upgrade.'+idurl[1]).parent('li[layout]').removeClass('hide').addClass('downgrade');
			$('.downgrade .textupgrade h2, .downgrade .upgrade-mobile h2').html('<strong> você estava visualizando...</strong>');	
			$('.downgrade .product-upgrade .textupgrade p').html('Ficou na dúvida? Você pode visitar o produto que estava navegando clicando aqui.');	
			$('.downgrade .btn-interessado-upgrade, .downgrade .btn-interessado-upgrade-mobile').addClass('hide');
			$('.icon-open-upgrade').addClass('voltar');
			$('.downgrade .btn-interessado-downgrade, .downgrade .btn-interessado-downgrade-mobile').removeClass('hide');
					
		} else {

			$.each($('#upsell li[layout]'), function( index, value ) {
				$(this).addClass('hide');
				$('.icon-open-upgrade').css('display', 'none');
				valorProupgrade = $(this).find('.title-price-upgrade span').text().replace(/\D/gmi, '');
				$(this).attr('data-price', valorProupgrade);

				if ( valorProupgrade > valorProatualFormt ){
					$(this).removeClass('hide');
					$('.icon-open-upgrade').css('display', 'block');
				}
				
			});
			

		}
	};



	this.setup();
});