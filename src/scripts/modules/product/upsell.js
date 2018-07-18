/* global $: true, Nitro: true, dust */

'use strict';

require('Dust/product/upsell.html');
require('Dust/product/downgrade.html');


Nitro.module('upsell', function() {
	console.clear();

	const self = this;
	
	let 
		// pegando valores do produto atual
		valorProatual      = $('.prod-preco .skuBestPrice').text(),
		valorProatualFormt = $('.prod-preco .skuBestPrice').text().replace(/\D/gmi, ''),
		urlUpgradetd       = $('td.value-field.Link-do-Upgrade'),
		urlUpgrade         = $('td.value-field.Link-do-Upgrade').text(),

		// pegando os campos a serem comparados
		diferencia_01      = $('td.value-field.Diferencial-01').text(),
		diferencia_02      = $('td.value-field.Diferencial-02').text(),
		diferencia_03      = $('td.value-field.Diferencial-03').text(),


		// variaveis para mostrar o valor do upgrade
		valorProdatualcalc,
		valorProupgrade,
		valordiferenca,		
		price,
		priceBarra,
		priceBarraFormt,

		// pegando valores do produto upgrade
		capacidadeOportunidade,
		painelOportunidade,
		temperaturaOportunidade,
		skureferencup,
		urlupgrade,
		
		uri   = window.location.href,
		utlAtual = window.location.pathname,
		idurl = uri.split('downgrade=')[1],
		apiResponse;

	this.upgrade = () => {
		self.openclose();
		self.valordiferenca();
		self.montandomodal();		
		self.responsivo();
		if (window.location.host.indexOf('consulqa') === -1) {
			self.tagueamento();
		}		
	};

	this.downgrade = () => {
		self.openclose();
		self.valordiferenca();			
		self.responsivo();
		if (window.location.host.indexOf('consulqa') === -1) {
			self.tagueamento();
		}		
	};

	this.renderHtml = () => {
		if (uri.indexOf('downgrade') > 0 ){

			var settingsDowngrade = {
				'url': `/api/catalog_system/pub/products/search/${idurl}`,
				'method': 'GET'
			};
			$.ajax(settingsDowngrade).then(function (response) {
				console.log('✔ Downdragre', response);				
				return response;
			}).then(function(data) {
				dust.render('downgrade', data, function(err, out) {
					if (err) { throw new Error('Product Dust error: ' + err); }
					$('#upsell').append(out);
				});
			}).done(function() {
				self.downgrade();			
			});
			
		}else {
			
			var settings = {
				'url': `/api/catalog_system/pub/products/search/${urlUpgrade}`,
				'method': 'GET'
			};
			$.ajax(settings).then(function (response) {
				console.log('✔ Upgrade', response);
				apiResponse = response[0];
				return response;
			}).then(function(data) {
				dust.render('upsell', data, function(err, out) {
					if (err) { throw new Error('Product Dust error: ' + err); }
					if(urlUpgradetd.length >= 1){$('#upsell').append(out);}
				});
			}).done(function() {
				self.upgrade();
			});
		}
	};

	this.responsivo = () => {

		if ($(window).width() <= 768) {

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
		// pega e formata o preço do produto upgrade
		priceBarra         = Number($('.title-price-upgrade span').text()),
		priceBarraFormt    = _.formatCurrency( priceBarra ),
		$('.title-price-upgrade span, .corpo-produtos-modal .oportunidadePro span').html(`R$ ${priceBarraFormt}`),
		
		// Pega, formata e subtrai os valores dos produtos
		valorProdatualcalc = $('.prod-preco .skuBestPrice').text().replace(/\D/gmi, ''),
		valorProupgrade    = $('.title-price-upgrade span').text().replace(/\D/gmi, ''),
		valordiferenca     = Number(valorProupgrade) - Number(valorProdatualcalc),
		price              = `POR + R$ ${_.formatCurrency( valordiferenca / 100)}`,
		$('.textupgrade span, .info-product-mobile > span').html( price );
	};

	this.montandomodal = () => {
		// Montando produto atual dentro do modal
		var settings = {
			'url': `/api/catalog_system/pub/products/search/${utlAtual}`,
			'method': 'GET'
		};
		$.ajax(settings).then(function (response) {			
			return response;
		}).done(function(response) {
			// montando vitrine do produto atual dentro do modal
			$('.voce-esta-vendo h2:nth-child(3)').html(`${response[0].productName} - <strong> ${response[0].productReference}</strong>`);
			$('.voce-esta-vendo span').html(`${valorProatual}`);
			$('.voce-esta-vendo img').attr('src', `${response[0].items[0].images[0].imageUrl}`);

			// Diferenciais do produto atuasl
			$('.especificao-produtos ul li:nth-child(2)').html(`${response[0][diferencia_01]}`);
			$('.especificao-produtos ul li:nth-child(5)').html(`${response[0][diferencia_02]}`);
			$('.especificao-produtos ul li:nth-child(8)').html(`${response[0][diferencia_03]}`);		
		});

		urlupgrade              = $('.ir-para-produto').attr('href'),
		skureferencup           = $('.skureferenc ul li').text(),
		capacidadeOportunidade  = $('.espe-oportunidade .licapacidade ul li').text().replace('L', ''),
		painelOportunidade      = $('.espe-oportunidade .lipainel ul li').text(),
		temperaturaOportunidade = $('.espe-oportunidade .litemperatura ul li').text();

		// Titulos dos diferenciais
		$('.especificao-produtos ul li:nth-child(1)').html(diferencia_01),
		$('.especificao-produtos ul li:nth-child(4)').html(diferencia_02),
		$('.especificao-produtos ul li:nth-child(7)').html(diferencia_03);

		// Upgrade
		$('.especificao-produtos ul li:nth-child(3)').html(apiResponse[diferencia_01]);
		$('.especificao-produtos ul li:nth-child(6)').html(apiResponse[diferencia_02]);
		$('.especificao-produtos ul li:nth-child(9)').html(apiResponse[diferencia_03]);
	
		// montando dados do produto upgrade
		$('.title-price-upgrade p strong, .info-product-mobile h3 strong').html(skureferencup);
		$('.oportunidadePro h2:nth-child(3) strong').html(skureferencup);		
		$('.ir-para-produto, .aceito-mobile .btn-interessado-upgrade-mobile').attr('href', urlupgrade + '?downgrade=' + window.location.pathname);
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