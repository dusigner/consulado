'use strict';

var orderStates = {
	_statusGroup: {
		regular: {
			pedidoRealizado: {
				orderLabel: 'Confirmação de Pedido',
				trackingLabels: [
					{ label: 'Pedido confirmado', class: 'current' },
					{ label: 'Pagamento', class: false },
					{ label: 'Processamento de Pedido', class: false },
					{ label: 'Pedido faturado', class: false },
					// {label: 'Pedido em transferência', class: false},
					{ label: 'Entrega', class: false, estimate: true }
				],
				group: 'pedidoRealizado'
			},

			pagamento: {
				orderLabel: 'Aguardando pagamento',
				trackingLabels: [
					{ label: 'Pedido confirmado', class: 'active' },
					{ label: 'Aguardando pagamento', class: 'pending' },
					{ label: 'Processamento de Pedido', class: false },
					{ label: 'Pedido faturado', class: false },
					// {label: 'Pedido em transferência', class: false},
					{ label: 'Entrega', class: false, estimate: true }
				],
				group: 'pagamento'
			},

			pagamentoAprovado: {
				orderLabel: 'Processamento',
				trackingLabels: [
					{ label: 'Pedido confirmado', class: 'active' },
					{ label: 'Pagamento Aprovado', class: 'active' },
					{ label: 'Processando Pedido', class: 'current' },
					{ label: 'Pedido faturado', class: false },
					// {label: 'Pedido em transferência', class: false},
					{ label: 'Entrega', class: false, estimate: true }
				],
				group: 'pagamentoAprovado'
			},

			faturado: {
				orderLabel: 'Faturado',
				trackingLabels: [
					{ label: 'Pedido confirmado', class: 'active' },
					{ label: 'Pagamento Aprovado', class: 'active' },
					{ label: 'Pedido processado', class: 'active' },
					{ label: 'Pedido faturado', class: 'current' },
					// {label: 'Pedido em transferência', class: false},
					{ label: 'Entrega', class: false, estimate: true }
				],
				group: 'faturado'
			},

			pedidoEntregue: {
				orderLabel: 'Entregue',
				trackingLabels: [
					{ label: 'Pedido confirmado', class: 'active' },
					{ label: 'Pagamento Aprovado', class: 'active' },
					{ label: 'Pedido processado', class: 'active' },
					{ label: 'Pedido faturado', class: 'active' },
					// {label: 'Pedido em transferência', class: 'active'},
					{ label: 'Pedido Entregue', class: 'active finished' }
				],
				group: 'pedidoEntregue'
			},

			cancelado: {
				orderLabel: 'Cancelado',
				trackingLabels: [
					{ label: 'Pedido confirmado', class: 'active' },
					{ label: 'Pedido Cancelado', class: 'canceled' },
					{ label: 'Pedido processado', class: false },
					{ label: 'Pedido faturado', class: false },
					// {label: 'Pedido em transferência', class: false},
					{ label: 'Entrega', class: false, estimate: true }
				],
				group: 'cancelado'
			},

			cancelamento: {
				orderLabel: 'Em cancelamento',
				trackingLabels: [
					{ label: 'Pedido confirmado', class: 'active' },
					{ label: 'Em cancelamento', class: 'canceled' },
					{ label: 'Pedido processado', class: false },
					{ label: 'Pedido faturado', class: false },
					// {label: 'Pedido em transferência', class: false},
					{ label: 'Entrega', class: false, estimate: true }
				],
				group: 'cancelado'
			}
		},

		gift: {
			pedidoRealizado: {
				orderLabel: 'Confirmação de Pedido',
				trackingLabels: [
					{ label: 'Confirmação de Pedido', class: 'current order__state--isgift' },
					{ label: 'Pagamento', class: 'order__state--isgift' },
					{ label: 'Valor Creditado', class: 'order-gift order__state--isgift' }
				],
				group: 'pedidoRealizado'
			},

			pagamento: {
				orderLabel: 'Aguardando pagamento',
				trackingLabels: [
					{ label: 'Confirmação de Pedido', class: 'active order__state--isgift' },
					{ label: 'Aguardando pagamento', class: 'pending order__state--isgift' },
					{ label: 'Valor Creditado', class: 'order-gift order__state--isgift' }
				],
				group: 'pagamento'
			},

			pagamentoAprovado: {
				orderLabel: 'Pagamento aprovado',
				trackingLabels: [
					{ label: 'Confirmação de Pedido', class: 'active order__state--isgift' },
					{ label: 'Pagamento aprovado', class: 'current order__state--isgift' },
					{ label: 'Valor Creditado', class: 'order-gift order__state--isgift' }
				],
				group: 'pagamentoAprovado'
			},

			faturado: {
				orderLabel: 'Pagamento aprovado',
				trackingLabels: [
					{ label: 'Confirmação de Pedido', class: 'active order__state--isgift' },
					{ label: 'Pagamento aprovado', class: 'current order__state--isgift' },
					{ label: 'Valor Creditado', class: 'order-gift order__state--isgift' }
				],
				group: 'faturado'
			},

			pedidoEntregue: {
				orderLabel: 'Valor Creditado',
				trackingLabels: [
					{ label: 'Confirmação de Pedido', class: 'active order__state--isgift' },
					{ label: 'Pagamento aprovado', class: 'active order__state--isgift' },
					{
						label: 'Valor Creditado',
						class: 'order-gift order__state--active order__state--finished order__state--isgift'
					}
				],
				group: 'pedidoEntregue'
			},

			cancelado: {
				orderLabel: 'Pedido cancelado',
				trackingLabels: [
					{ label: 'Confirmação de Pedido', class: 'active order__state--isgift' },
					{ label: 'Pedido cancelado', clas: 'canceled order__state--isgift' },
					{ label: 'Valor Creditado', class: 'order-gift order__state--isgift' }
				],
				group: 'cancelado'
			}
		}
	},

	_states: {
		'order-created': 'pedidoRealizado',
		'waiting-for-seller-confirmation': 'pedidoRealizado',
		'waiting-for-authorization': 'pedidoRealizado',
		'order-accepted': 'pedidoRealizado',
		'payment-pending': 'pagamento',
		'window-to-change-payment': 'pagamento',
		'approve-payment': 'pagamentoAprovado',
		'payment-approved': 'pagamentoAprovado',
		'waiting-ffmt-authorization': 'pagamentoAprovado',
		'authorize-fulfillment': 'pagamentoAprovado',
		'window-to-cancel': 'pagamentoAprovado',
		handling: 'faturado',
		'ready-for-handling': 'faturado',
		'start-handling': 'faturado',
		ship: 'faturado',
		invoice: 'faturado',
		shipped: 'faturado',
		invoiced: 'faturado',
		'waiting-for-seller-decision': 'cancelamento',
		'cancellation-requested': 'cancelado',
		'payment-denied': 'cancelado',
		'request-cancel': 'cancelado',
		cancel: 'cancelado',
		canceled: 'cancelado',
		pedidoEntregue: 'pedidoEntregue'
	},

	getState: function(isGift, param) {
		var state = orderStates._states[param],
			res = $.extend({}, isGift ? orderStates._statusGroup.gift[state] : orderStates._statusGroup.regular[state]);

		return res;
	}
};

module.exports = orderStates;
