var statusGroup = {

    'pedidoRealizado': {
        'orderLabel': 'Pedido realizado',
        'trackingLabels': ['Pedido realizado', 'Pagamento', 'Preparo para envio', 'Entrega de pedido'],
        'message': 'Pedido realizado.',
        'group': 'pedidoRealizado',
        'class': ['current', '', '', '']
    },

    'pagamento': {
        'orderLabel': 'Aguardando pagamento',
        'trackingLabels': ['Pedido realizado', 'Aguardando pagamento', 'Preparo para envio', 'Entrega de pedido'],
        'message': 'Aguardando a confirmação do pagamento.',
        'group': 'pagamento',
        'class': ['active', 'current', '', '']
    },

    'preparoParaEnvio': {
        'orderLabel': 'Preparando pedido',
        'trackingLabels': ['Pedido realizado', 'Pagamento aprovado', 'Preparando pedido', 'Entrega de pedido'],
        'message': 'Estamos preparando o seu pedido para envio.',
        'group': 'preparoParaEnvio',
        'class': ['active', 'active', 'current', '']
    },

    'entregaDoPedido': {
        'orderLabel': 'A caminho da entrega',
        'trackingLabels': ['Pedido realizado', 'Pagamento aprovado', 'Pedido enviado', 'A caminho da entrega'], //Entrega do produto
        'message': '', //Entrega realizada
        'group': 'entregaDoPedido',
        'class': ['active', 'active', 'active', 'current']
    },

    'pedidoEntregue': {
        'orderLabel': 'Pedido entregue',
        'trackingLabels': ['Pedido realizado', 'Pagamento aprovado', 'Pedido enviado', 'Pedido entregue'], //Entrega do produto
        'message': '', //Entrega realizada
        'group': 'pedidoEntregue',
        'class': ['active', 'active', 'active', 'active finished']
    },

    'cancelado': {
        'orderLabel': 'Pedido cancelado',
        'trackingLabels': ['Pedido realizado', 'Pedido cancelado', 'Preparo para envio', 'Entrega de pedido'],
        'message': 'Pedido cancelado.',
        'group': 'cancelado',
        'class': ['active', 'canceled', '', '']
    }

};


var states = {
    'waiting-for-seller-confirmation': 'pedidoRealizado',
    'waiting-for-authorization': 'pedidoRealizado',
    'order-accepted': 'pedidoRealizado',
    'payment-pending': 'pagamento',
    'approve-payment': 'pagamento',
    'payment-approved': 'preparoParaEnvio',
    'waiting-ffmt-authorization': 'preparoParaEnvio',
    'authorize-fulfillment': 'preparoParaEnvio',
    'window-to-cancel': 'preparoParaEnvio',
    'handling': 'preparoParaEnvio',
    'ready-for-handling': 'preparoParaEnvio',
    'start-handling': 'preparoParaEnvio',
    'ship': 'entregaDoPedido',
    'invoice': 'entregaDoPedido',
    'shipped': 'entregaDoPedido',
    'invoiced': 'entregaDoPedido',
    'waiting-for-seller-decision': 'cancelado',
    'cancellation-requested': 'cancelado',
    'payment-denied': 'cancelado',
    'request-cancel': 'cancelado',
    'cancel': 'cancelado',
    'canceled': 'cancelado',
    'pedidoEntregue': 'pedidoEntregue'
};

Nitro.module('order.states', function() {

    'use strict';

    this.get = function(param) {
        var state = states[param];
        return statusGroup[state];
    };

});
