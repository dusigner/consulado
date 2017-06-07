'use strict';

var statusGroup = {

	'Pedido realizado': {
		'orderLabel': 'Pedido realizado',
		'trackingLabels': ['Pedido realizado', 'Pagamento', 'Preparo para envio', 'Entrega de pedido'],
		'message': 'Pedido realizado.',
		'group': 'pedidoRealizado',
		'class': ['current', '', '', '']
	},

	'Aguardando pagamento': {
		'orderLabel': 'Aguardando pagamento',
		'trackingLabels': ['Pedido realizado', 'Aguardando pagamento', 'Preparo para envio', 'Entrega de pedido'],
		'message': 'Aguardando a confirmação do pagamento.',
		'group': 'pagamento',
		'class': ['active', 'current', '', '']
	},

	'Processando Pagamento': {
		'orderLabel': 'Aguardando pagamento',
		'trackingLabels': ['Pedido realizado', 'Aguardando pagamento', 'Preparo para envio', 'Entrega de pedido'],
		'message': 'Aguardando a confirmação do pagamento.',
		'group': 'pagamento',
		'class': ['active', 'current', '', '']
	},

	'Preparando Entrega': {
		'orderLabel': 'Preparando pedido',
		'trackingLabels': ['Pedido realizado', 'Pagamento aprovado', 'Preparando pedido', 'Entrega de pedido'],
		'message': 'Estamos preparando o seu pedido para envio.',
		'group': 'preparoParaEnvio',
		'class': ['active', 'active', 'current', '']
	},

	'A caminho da entrega': {
		'orderLabel': 'Processando seu pedido',
		'trackingLabels': ['Pedido realizado', 'Pagamento aprovado', 'Pedido enviado', 'Processando seu pedido'], //Entrega do produto
		'message': '', //Entrega realizada
		'group': 'entregaDoPedido',
		'class': ['active', 'active', 'active', 'current']
	},

	'Enviado': {
		'orderLabel': 'Processando seu pedido',
		'trackingLabels': ['Pedido realizado', 'Pagamento aprovado', 'Pedido enviado', 'Processando seu pedido'], //Entrega do produto
		'message': '', //Entrega realizada
		'group': 'entregaDoPedido',
		'class': ['active', 'active', 'active', 'current']
	},

	'Pedido entregue': {
		'orderLabel': 'Pedido entregue',
		'trackingLabels': ['Pedido realizado', 'Pagamento aprovado', 'Pedido enviado', 'Pedido entregue'], //Entrega do produto
		'message': '', //Entrega realizada
		'group': 'pedidoEntregue',
		'class': ['active', 'active', 'active', 'active finished']
	},

	'Cancelado': {
		'orderLabel': 'Pedido cancelado',
		'trackingLabels': ['Pedido realizado', 'Pedido cancelado', 'Preparo para envio', 'Entrega de pedido'],
		'message': 'Pedido cancelado.',
		'group': 'cancelado',
		'class': ['active', 'canceled', '', '']
	}

};


module.exports = statusGroup;