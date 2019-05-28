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
		$(document).ajaxComplete((event, xhr, settings) => {
			var frete = settings.url.split('/')[1];

			if (frete === 'frete') {

				$('.freight-values td').each((i, el) => {
					const optionText = $(el).text();
					if ($body.is('.testeab-entregas--a') && (optionText.indexOf('Frete Entrega Agendada - Convencional') !== -1 || optionText.indexOf('Frete Convencional') !== -1)) {
						$(el).parent('tr').addClass('hide');
					}

					if ($body.is('.testeab-entregas--b')) {
						if (optionText.indexOf('Frete Entrega Agendada - Econômica') !== -1 || optionText.indexOf('Frete Econômica') !== -1) {
							$(el).parent('tr').addClass('hide');
						}
						// Muda o nome de Convencional para Econômica (no backend vende a convencional, mas no front apresenta como Econômica)
						if (optionText.indexOf('Frete Entrega Agendada - Convencional') !== -1 || optionText.indexOf('Frete Convencional') !== -1) {
							$(el).text(optionText.replace('Convencional', 'Econômica'));
						}

					}
				});
			}

		});
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

		// Muda o texto de Convencional para Econômica  na página cart e de shipping
		const changeName = () => {
			const textCartSlaConvencional = $('.seller-1-sla-Convencional span').html();
			const textCartSlaAgendadaConvencional = $('.seller-1-sla-EntregaAgendada-Convencional span').html();

			$('.seller-1-sla-Convencional span').html(textCartSlaConvencional.replace('Convencional', 'Econômica'));
			$('.seller-1-sla-EntregaAgendada-Convencional span').html(textCartSlaAgendadaConvencional.replace('Convencional', 'Econômica'));

			// Espera a VTEX carregar os dados de entrega na página de shipping
			setTimeout(() => {
				$('.shipping-option-item-name').each((i, name) => {
					const nameText = $(name).text();
					if (nameText.indexOf('Convencional') !== -1) {
						$(name).text(nameText.replace('Convencional', 'Econômica'));
					}
				});

				$('.shipping-selected-sla .sla').text($('.shipping-selected-sla .sla').text().replace('Convencional', 'Econômica'));
			}, 600);

		};

		//chama a função de trocar o nome toda vez que a hash na url mudar
		window.hasher.changed.add(() => changeName());
		window.crossroads.routed.add(() => changeName());

		//inicia a função de trocar o nome
		changeName();

	};
});
