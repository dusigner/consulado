/* global $: true, Nitro: true, dust */

'use strict';

require('Dust/product/upsell-cns.html');


Nitro.module('upsell', function() {
	console.clear();

	const self = this;
	
	let 
		// pegando valores do produto atual		
		titleproductatual  = $('.productName').text(),
		skureferenc        = $('.productSku .skuReference').text(),
		imagematual        = $('.prod-galeria .slick-active a img').attr('src'),
		valorProatual      = $('.prod-preco .skuBestPrice').text(),
		valorProatualFormt = $('.prod-preco .skuBestPrice').text().replace(/\D/gmi, ''),
		capacidadeatual    = $('td.value-field.Capacidade').text() || $('td.value-field.Capacidade-Total-L-').text(),
		painelautal        = $('td.value-field.Display').text(),
		formatoatual  	   = $('td.value-field.Formato').text(),
		urlUpgradetd       = $('td.value-field.Link-do-Upgrade'),
		urlUpgrade         = $('td.value-field.Link-do-Upgrade').text(),
		

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

		
		

	this.setup = () => {
		self.openclose();
		self.valordiferenca();
		self.verificadowngrade();
		self.montandomodal();
		self.responsivo();

		if (window.location.host.indexOf('consulqa') === -1) {
			self.tagueamento();
		}
	};

	this.renderHtml = () => {
		var settings = {
			'url': '/api/catalog_system/pub/products/search/' + urlUpgrade + ' ',
			'method': 'GET'
		};

		$.ajax(settings).then(function (response) {
			console.log('✔', response);

			return response;
		}).then(function(data) {
			dust.render('upsell-cns', data, function(err, out) {
				if (err) { throw new Error('Product Dust error: ' + err); }
				if(urlUpgradetd.length >= 1){$('#upsell').append(out);}
			});
		}).done(function() {
			self.setup();
		});
	};

	this.responsivo = () => {

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

	this.valordiferenca = () => {		
		valorProdatualcalc = $('.prod-preco .skuBestPrice').text().replace(/\D/gmi, ''),
		valorProupgrade    = $('.title-price-upgrade span').text().replace(/\D/gmi, ''),
		valordiferenca     = Number(valorProupgrade) - Number(valorProdatualcalc),
		price              = 'POR + R$' + _.formatCurrency( valordiferenca / 100);
		$('.textupgrade span, .info-product-mobile > span').html( price );
	};

	this.montandomodal = () => {
		// pegando valores do produto upgrade
		urlupgrade              = $('.ir-para-produto').attr('href'),
		skureferencup           = $('.skureferenc ul li').text(),
		capacidadeOportunidade  = $('.espe-oportunidade .licapacidade ul li').text().replace('L', ''),
		painelOportunidade      = $('.espe-oportunidade .lipainel ul li').text(),
		temperaturaOportunidade = $('.espe-oportunidade .litemperatura ul li').text();

					
		// montando vitrine do produto atual dentro do modal
		$('.voce-esta-vendo h2:nth-child(3)').html(titleproductatual + ' - <strong>' + skureferenc + '</strong>');
		$('.voce-esta-vendo span').html(valorProatual);
		$('.espe-voce-esta-vendo .licapacidadea').html(capacidadeatual.replace('L', '') + ' litros');
		$('.espe-voce-esta-vendo .lipainela').html(painelautal);
		$('.espe-voce-esta-vendo .litemperaturaa').html(formatoatual);
		$('.voce-esta-vendo img').attr('src', imagematual);

		// montando dados do produto upgrade
		$('.title-price-upgrade p strong, .info-product-mobile h3 strong').html(skureferencup);
		$('.oportunidadePro h2:nth-child(3) strong').html(skureferencup);
		$('.espe-oportunidade .licapacidade, .especifi-product-mobile .licapacidadem span').html(capacidadeOportunidade + ' litros');
		$('.espe-oportunidade .lipainel, .especifi-product-mobile .lipainelm span').html(painelOportunidade);
		$('.espe-oportunidade .litemperatura, .especifi-product-mobile .litemperaturam span').html(temperaturaOportunidade);
		$('.ir-para-produto, .aceito-mobile .btn-interessado-upgrade-mobile').attr('href', urlupgrade + '?upgrade=' + window.skuJson_0.productId);
	};

	this.openclose = () => {

		// Abre o modal de upgrade
		$('.btn-interessado-upgrade').click(function() {			
			$('#modal-produto-upgrade').vtexModal();			
		});

		// fecha barra fixa
		$('.close-fixed, .icon-open-upgrade').click(function() {
			$('#upsell').toggleClass('ativo');
			$('.icon-open-upgrade').toggleClass('ativo');
		});


	};

	this.verificadowngrade = () => {
		
		if (uri.indexOf('upgrade') > 0 ){

			$('#upsell li[layout]').addClass('hide');
			$('.product-upgrade.'+idurl[1]).parent('li[layout]').removeClass('hide').addClass('downgrade');
			$('.downgrade .textupgrade h2, .downgrade .upgrade-mobile h2').html('<strong> você estava visualizando...</strong>');	
			$('.downgrade .product-upgrade .textupgrade p').html('Ficou na dúvida? Você pode visitar o produto que estava navegando clicando aqui.');	
			$('.downgrade .btn-interessado-upgrade, .downgrade .btn-interessado-upgrade-mobile').addClass('hide');
			$('.icon-open-upgrade').addClass('voltar');
			$('.downgrade .btn-interessado-downgrade, .downgrade .btn-interessado-downgrade-mobile').removeClass('hide');
					
		} else {

			$.each($('#upsell li[layout]'), function() {
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

	this.tagueamento = () => {
		
		//Tagueamento datalayer
		$('.btn-interessado-upgrade').click(function() {			
			//Tagueamento datalayer
			dataLayer.push({
				event: 'visualTracking',
				category: 'de um Upgrade',
				action: 'barra',
				label: 'Estou interessado'
			});
		});

		//Tagueamento dataLayer
		$('.icon-open-upgrade').click(function(){
			if( $(this).hasClass('voltar') ){
				dataLayer.push({
					event: 'visualTracking',
					category: 'ver produto anterior',
					action: 'icon',
					label: 'click'
				});
			}else{
				dataLayer.push({
					event: 'visualTracking',
					category: 'de um Upgrade',
					action: 'icon',
					label: 'click'
				});
			}			
		});

		//Tagueamento dataLayer
		$('.close-fixed').click(function(){
			dataLayer.push({
				event: 'visualTracking',
				category: 'de um Upgrade',
				action: 'barra',
				label: 'Sair'
			});
		});

		//Tagueamento dataLayer
		$('.aceitarounao a').click(function(){
			var action = $(this).text();
			dataLayer.push({
				event: 'visualTracking',
				category: 'de um Upgrade',
				action: 'Modal',
				label: action
			});
		});

		//Tagueamento dataLayer
		$('.aceitarounao a').click(function(){
			var action = $(this).text();
			dataLayer.push({
				event: 'visualTracking',
				category: 'de um Upgrade',
				action: 'Modal',
				label: action
			});
		});

		//Tagueamento datalayer
		$('.vtex-modal[id*=vtex-modal-produto-] .modal-header .close').click(function(){	
			dataLayer.push({
				event: 'visualTracking',
				category: 'de um Upgrade',
				action: 'Modal',
				label: 'Sair'
			});
		});		

		//Tagueamento datalayer
		$('.btn-interessado-downgrade').click(function(){	
			dataLayer.push({
				event: 'visualTracking',
				category: 'ver produto anterior',
				action: 'barra',
				label: 'Ver produto novamente'
			});
		});	
	};

	this.renderHtml();
});