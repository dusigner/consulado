'use strict';
Nitro.module('testeab-entrega', function() {

	var $body = $('body'),
		self = this;


	// Setup para páginas de checkout
	this.checkoutSetup = function(orderForm) {
		this.orderForm = orderForm;
		if ( $body.is('.testeab-entregas--a') ) {
			this.entregasVariacaoA();
		}
		else if ( $body.is('.testeab-entregas--b') ) {
			this.entregasVariacaoB();
		}
	};

	// Setup para página de produto
	this.productSetup = () => {
		if ($body.is('.testeab-entregas--a')) {
			$(document).ajaxComplete((event, xhr, settings) => {
				var frete = settings.url.split('/')[1];

				if (frete === 'frete') {

					$('.freight-values td').each((i, el) => {
						const optionText = $(el).text();
						if (optionText.indexOf('Frete Entrega Agendada - Convencional') !== -1 || optionText.indexOf('Frete Convencional') !== -1) {
							$(el).parent('tr').addClass('hide');
						}
					});
				}

			});
		} else if ($body.is('.testeab-entregas--b')) {
			$(document).ajaxComplete((event, xhr, settings) => {
				var frete = settings.url.split('/')[1];

				if (frete === 'frete') {

					$('.freight-values td').each((i, el) => {
						const optionText = $(el).text();
						if (optionText.indexOf('Frete Entrega Agendada - Econômica') !== -1 || optionText.indexOf('Frete Econômica') !== -1) {
							$(el).parent('tr').addClass('hide');
						}
					});
				}

			});
		}
	};

	this.entregasVariacaoA = function() {
		if ( this.orderForm && this.orderForm.shippingData && this.orderForm.shippingData.logisticsInfo ) {

			// verifica quantas entregas possui no pedido e executa script para cada uma
			$.each(this.orderForm.shippingData.logisticsInfo, function(i, slas) {

				// Verifica se a forma de frete selecionada é "Entrega Agendada Convencional" ou "Convencional"
				// Esconder as opções é feito pelo css, o js somente seleciona uma outra opção caso as da verificação abaixo estiverem invisíveis e selecionadas
				if (slas.selectedSla === 'Entrega Agendada - Convencional' || slas.selectedSla === 'Convencional') {

					// retira da variável slas a opções "Entrega Agendada Convencional" ou "Convencional"
					var newSlas = slas.slas.filter(obj => obj.id !== 'Entrega Agendada - Convencional' && obj.id !== 'Convencional' );

					// Seta a nova opção de frete para a primeira disponível após a remoção da "Entrega Agendada Convencional" ou "Convencional"
					// caso ainda há outros tipos de entrega disponíveis
					if( newSlas[0] ) {
						self.orderForm.shippingData.logisticsInfo[i].selectedSla = newSlas[0].id;

						// Atualiza o orderForm
						vtexjs.checkout.sendAttachment('shippingData', self.orderForm.shippingData);
					} else {
						$('#change-sla-items-list').eq(i).add('.shipping-sla-options, .shipping-options').addClass('not-hide');
						$body.addClass('not-hide-shipping-options');
					}
				}
			});
		}
	};

	this.entregasVariacaoB = function() {
		if ( this.orderForm && this.orderForm.shippingData && this.orderForm.shippingData.logisticsInfo ) {

			// verifica quantas entregas possui no pedido e executa script para cada uma
			$.each(this.orderForm.shippingData.logisticsInfo, function(i, slas) {

				// Verifica se a forma de frete selecionada é Entrega Agendada Econômica ou Econômica
				// Esconder as opções é feito pelo css, o js somente seleciona uma outra opção caso as da verificação abaixo estiverem invisíveis e selecionadas
				if ( slas.selectedSla === 'Entrega Agendada - Econômica' || slas.selectedSla === 'Econômica' ) {

					// retira da variável slas as opções de Entrega Agendada Econômica ou Econômica
					var newSlas = slas.slas.filter(obj => obj.id !== 'Entrega Agendada - Econômica' && obj.id !== 'Econômica' );

					// Seta a nova opção de frete para a primeira disponível após a remoção da Entrega Agendada Econômica ou Econômica
					// caso ainda há outros tipos de entrega disponíveis
					if( newSlas[0] ) {
						self.orderForm.shippingData.logisticsInfo[i].selectedSla = newSlas[0].id;
						// Atualiza o orderForm
						vtexjs.checkout.sendAttachment('shippingData', self.orderForm.shippingData);
					} else {
						$('#change-sla-items-list').eq(i).add('.shipping-sla-options, .shipping-options').addClass('not-hide');
						$body.addClass('not-hide-shipping-options');
					}
				}
			});
		}
	};
});
