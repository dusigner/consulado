'use strict';
Nitro.module('entrega-agendada', function() {
	var $body = $('body'),
		self = this;

	this.setup = function(orderForm) {
		this.orderForm = orderForm;
		if ($body.is('.testeab-entregas--a')) {
			this.entregasVariacaoA();
		} else if ($body.is('.testeab-entregas--b')) {
			this.entregasVariacaoB();
		}
	};

	this.entregasVariacaoA = function() {
		if (this.orderForm && this.orderForm.shippingData && this.orderForm.shippingData.logisticsInfo) {
			// verifica quantas entregas possui no pedido e executa script para cada uma
			$.each(this.orderForm.shippingData.logisticsInfo, function(i, slas) {
				//  Verifica se a forma de frete selecionada é "Entrega Agendada I Econômica"
				if (slas.selectedSla === 'Entrega Agendada I Econômica') {
					// retira da variável slas a opções "Entrega Agendada I Econômica"
					var newSlas = slas.slas.filter(function(obj) {
						return obj.id !== 'Entrega Agendada I Econômica';
					});

					// Seta a nova opção de frete para a primeira disponível após a remoção da "Entrega Agendada I Econômica"
					// caso ainda há outros tipos de entrega disponíveis
					if (newSlas[0]) {
						self.orderForm.shippingData.logisticsInfo[i].selectedSla = newSlas[0].id;

						// Atualiza o orderForm
						vtexjs.checkout.sendAttachment('shippingData', self.orderForm.shippingData);
					} else {
						$('#change-sla-items-list')
							.eq(i)
							.add('.shipping-sla-options, .shipping-options')
							.addClass('not-hide');
						$body.addClass('not-hide-shipping-options');
					}
				}
			});
		}
	};

	this.entregasVariacaoB = function() {
		if (this.orderForm && this.orderForm.shippingData && this.orderForm.shippingData.logisticsInfo) {
			// verifica quantas entregas possui no pedido e executa script para cada uma
			$.each(this.orderForm.shippingData.logisticsInfo, function(i, slas) {
				//  Verifica se a forma de frete selecionada é Econômica ou Convencional
				if (slas.selectedSla === 'Econômica' || slas.selectedSla === 'Convencional') {
					// retira da variável slas as opções de Econômica e Convencional
					var newSlas = slas.slas.filter(function(obj) {
						return obj.id !== 'Econômica' && obj.id !== 'Convencional';
					});

					// Seta a nova opção de frete para a primeira disponível após a remoção da Econômica e Convencional
					// caso ainda há outros tipos de entrega disponíveis
					if (newSlas[0]) {
						self.orderForm.shippingData.logisticsInfo[i].selectedSla = newSlas[0].id;
						// Atualiza o orderForm
						vtexjs.checkout.sendAttachment('shippingData', self.orderForm.shippingData);
					} else {
						$('#change-sla-items-list')
							.eq(i)
							.add('.shipping-sla-options, .shipping-options')
							.addClass('not-hide');
						$body.addClass('not-hide-shipping-options');
					}
				}
			});
		}
	};
});
