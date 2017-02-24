
'use strict';
var CRM = require('modules/store/crm');
require('modules/orders/order.states');
require('modules/orders/order.warranty');
require('../../templates/myorders.html');

Nitro.controller('meuspedidos', ['order.states', 'order.warranty'], function(states, warranty) {

    var self = this,
        arrOrder = [],
        template = 'myorders',
        loading = '<div class="load"><div class="loading"></div></div>';

    var Order = {

        list: function() {

            return $.ajax({

                url: '/api/checkout/pub/orders/',

                accept: 'application/vnd.vtex.ds.v10+json',

                crossDomain: true,

                type: 'GET',

                dataType: 'json',

                contentType: 'application/json; charset=utf-8',

                beforeSend: function() {
                    $('.box-meuspedidos').append(loading);
                }

            });

        }

    };

    this.prepareRender = function(data) {
        // data.orderId = '	v202503881ccbr-01	';
        // If the request is not found show default message

        data.isMessage = true;

        var order = CRM.getOrderById(data.orderId).then(function(result) {
            data.tracking = [];
            if (!result) {
                return false;
            }

            $(result && result.Documents).each(function(i, e) {
                if (e.finished) {
                    data.currentState  = states.get( 'pedidoEntregue' );
                }

                data.tracking[i] = {
                    description: e.description,
                    lastChange: $.formatDatetimeBRL(e.lastChange)
                };
                data.isMessage = false;
            });

        }).then(function() {

            $('.box-meuspedidos').trigger('renderTracking', data);

        }, function() {
            $('.box-meuspedidos').trigger('renderTracking', data);
        });

        arrOrder.push(order);
    };

    this.formatDate = function(date) {
        var from = date.split('/');
        return from[1] + '/' + from[0] + '/' + from[2];
    };

    /*this.sortByDate2 = function(a, b) {
        return new Date(self.formatDate(a.orderDate)).getTime() - new Date(self.formatDate(b.orderDate)).getTime();
    };*/

    this.listenRender = function() {
        $('.box-meuspedidos').on('renderTracking', function(event, data) {
            //console.log('listenRender', data);
            dust.render(template, data, function(err, out) {
                if (err) {
                    throw new Error('My Orders Dust error: ' + err);
                }

                /*var ordersData = [];
                data.newOrder = true; //adiciona informação de nova ordem a ser renderizada

                //procura as ordens já renderizada e adiciona no array ordersData
                $('.box-my-orders').each(function() {
                    var pedido = [];
                    pedido.orderId = $(this).data('order-id');
                    pedido.orderDate = $(this).data('order-date');
                    ordersData.push(pedido);
                });
                ordersData.push(data); // adiciona também a nava ordem no array ordersData


                ordersData.sort(self.sortByDate2).reverse(); //ordena o array pela data.

                //pega o index da nova ordem dentro do array
                var indexOrder = ordersData.indexOf(ordersData.filter(function(item) {
                    return item.newOrder === true;
                })[0]);

                //Caso não haja ordem nenhum, é adicionado um primeiro pedido
                //Caso haja pedido, renderiza de acordo com a posição do index já capturado.
                if(ordersData.length <= 1) {
                    $('.box-meuspedidos').append(out);
                } else {
                    if (indexOrder >= 1) {
                        //console.log('div','data-order-id='+ordersData[indexOrder-1].orderId);
                        $('.box-meuspedidos').find('.box-my-orders[data-order-id=' + ordersData[indexOrder-1].orderId + ']').after(out);
                    } else {
                        $('.box-meuspedidos').prepend(out);
                    }
                }*/

                $('.box-meuspedidos').append(out); // adiciona pedido no DOM

                var divList = $('.box-my-orders'); // pega todos os pedidos no DOM
                // reordena as divs pela data do pedido
                divList.sort(function(a, b){
                    return new Date(self.formatDate($(b).data('order-date'))).getTime() - new Date(self.formatDate($(a).data('order-date'))).getTime();
                });

                //console.log('divList', divList);
                $('.box-meuspedidos').html(divList); // remonta o DOM reordenado




            });
        });
    };

    this.showMore = function() {
        // Somente para mobile
        $('.show-more-txt').on('click', function() {
            var boxData = $(this).parent().parent().find('.list-data span');
            var boxAddress = $(this).parent().parent().find('.list-address');

            $(this).toggleClass('active');

            if ($(this).hasClass('active')) {

                $(this).html('Ver menos');
                boxData.show();
                boxAddress.show();

            } else {

                $(this).html('Ver mais');
                boxData.hide();
                boxAddress.hide();

            }

        });

        $('.show-detail').on('click', function() {
            var orderId = $(this).data('order-id');

            var boxOrder = $('.box-' + orderId);

            var textBoxOrder = boxOrder
                .parent().find('button .text-show-detail');

            $(this).toggleClass('active');

            if ($(this).hasClass('active')) {

                textBoxOrder.html('Ver menos informações');

                boxOrder.slideDown();

            } else {

                textBoxOrder.html('Ver mais informações');

                boxOrder.slideUp();

            }

        });
    };

    this.getSla = function(selectedSla, slas) {
        var obj = slas.filter(function(e) {
            if (e.name === selectedSla) {
                return e.shippingEstimate;
            }
        });
        return obj[0];
    };

    this.calculateSla = function(orderDate, currentSla) {
        var isBusinessDay = (currentSla.shippingEstimate && currentSla.shippingEstimate.indexOf('bd')) ? true : false;
        var isScheduled = (currentSla.name && currentSla.name.indexOf('Agendada')) ? true : false;
        var estimateDate;

        if (isScheduled && currentSla.shippingEstimateDate) {
            // sem cálculo quando for agendada
            estimateDate = $.formatDatetimeBRL(currentSla.shippingEstimateDate);
        } else if (isBusinessDay) {
            // Calculo para dias comerciais
            estimateDate = $.calculateBusinessDays(orderDate, currentSla.shippingEstimate.replace('bd', ''));
            estimateDate = $.formatDatetimeBRL(estimateDate);
        } else {
            // Calculo para dias corridos
            estimateDate = $.calculateDays(orderDate, currentSla.shippingEstimate.replace('d', ''));
            estimateDate = $.formatDatetimeBRL(estimateDate);
        }

        return estimateDate;
    };

    this.getData = function(e) {

        var totalName = {
            'Discounts': 'Descontos',
            'Shipping': 'Entrega',
            'Items': 'Subtotal',
            'Tax': 'Taxas'
        };

        var data = {};

        data.currentState = states.get(e.state);

        data.orderId = e.orderId;
        data.orderIdFormatted = data.orderId.split('-').shift().replace(/[^0-9]/g, '');
        data.orderGroup = e.orderGroup;
        data.orderDate = $.formatDatetimeBRL(e.creationDate);
        data.name = e.clientProfileData.firstName + ' ' + e.clientProfileData.lastName;
        data.address = e.shippingData.address;
        data.shippingMethod = (e.shippingData.logisticsInfo[0]) ? e.shippingData.logisticsInfo[0].selectedSla : '';
        data.paymentType = (e.paymentData.payments[0]) ? e.paymentData.payments[0].paymentSystemName : '';
        data.payments = e.paymentData.payments;
        data.products = e.items;
        data.totals = e.totals;
        data.totalPrice = _.formatCurrency(e.value / 100);

        if (data.paymentType) {
            data.isBoleto = (data.paymentType.toString().indexOf('Boleto') >= 0 && data.currentState.group === 'pagamento') ? true : false;
        }

        data.Installment = (e.paymentData.payments[0]) ? e.paymentData.payments[0].installments : '';
        data.boletoURL = (e.paymentData.payments[0]) ? e.paymentData.payments[0].url : '';

        var slas = (e.shippingData.logisticsInfo[0]) ? e.shippingData.logisticsInfo[0].slas : '';
        var currentSla = self.getSla(data.shippingMethod, slas);

        data.orderEstimateDate = self.calculateSla(e.creationDate, currentSla);

        if (data.boletoURL) {
            data.boletoURL = data.boletoURL.replace('{Installment}', data.Installment);
        }

        data.products.forEach(function(e, i) {
            if (e.imageUrl) {
                e.imageUrl = e.imageUrl.replace('55-55', '500-500');
            }
            if (e.price) {
                e.price = _.formatCurrency(e.sellingPrice / 100);
            }
            e.indexItem = i;
        });

        data.totals.forEach(function(e) {
            e.name = totalName[e.id];
            e.value = _.formatCurrency(e.value / 100);
        });

        return data;
    };

    this.sortByDate = function(a, b) {
        return new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime();
    };

    Order.list().done(function(orders) {

        $('.load').remove();

        self.listenRender();

        orders.reduce(function(prev, curr, i) {

            if (prev.orderGroup === curr.orderGroup) {

                delete orders[i - 1];

                //MERGE ITEMS
                $(prev.items).each(function(i, e) {
                    curr.items.push(e);
                });

                //MERGE TOTALS
                $(prev.totals).each(function(i, e) {
                    if (curr.totals[i]) {
                        curr.totals[i].value += e.value;
                    } else {
                        curr.totals[i] = e;
                    }
                });

                curr.value += prev.value;

            }

            return curr;
        });

        //console.log('orders', orders);

        orders.sort(self.sortByDate).reverse();

        //console.log('orders sorted', orders);

        $(orders).each(function(i, e) {

            if (typeof e !== 'undefined') {

                var data = self.getData(e);

                self.prepareRender(data);

            }

        });

        /*console.log('arrOrder',arrOrder);
        console.log('dataOrder', dataOrder);*/


        self.showMore();

    }, function() {
        var currentOrders = [];

        $(arrOrder).each(function(index, promise) {

            promise.always(function(e) {
                currentOrders.push(e);
                if (arrOrder.length === currentOrders.length) {
                    warranty.setup();
                    self.showMore();
                }
            });

        });
    });

});
