
'use strict';

var CRM = require('modules/store/crm'),
    Warranty = require('modules/orders/order.warrant'),
    StatusGroup = require('modules/orders/order.states'),
    Estimate =  require('modules/orders/order.estimate');

require('../../templates/orders/orderStates.html');
require('modules/removeBootstrap');
require('modules/orders/orders.recurrence');

Nitro.controller('meuspedidos', ['removeBootstrap', 'orders.recurrence'], function() {

    $(document).ajaxComplete(function( event, xhr, settings ){
        if( (/api\/checkout\/pub\/orders/.test( settings.url )) && !(/api\/checkout\/pub\/orders\/order-group/.test( settings.url )) ) {
            var ordersObj = $.parseJSON(xhr.responseText);

            $('.ordergroup').each(function() {
                var $self = $(this),
                    //Helper to select
                    $selector = function ( selector ) {
                        return $self.find(selector);
                    },
                    $id = $selector('.title-ordergroup-number'),
                    $orderDetails = $selector('.order-details'),
                    $orderInfo = $selector('.order-info'),
                    //This order object from ajax
                    selfOrderObj = $.grep(ordersObj, function(obj) {
                        return obj.orderGroup === $id.text();
                    }),
                    //General Order data
                    orderData = {
                        'order-id': selfOrderObj[0].orderId,
                        'order-group': selfOrderObj[0].orderGroup,
                        'order-status' : $selector('.order-status').first().text(),
                        'order-date' : $selector('.order-date').first().text(),
                        'order-name' : $selector('span[data-bind="text: receiverName"]').first().text(),
                        'order-street' : $selector('span[data-bind="text: street"]').first().text(),
                        'order-neighborhood' : $selector('span[data-bind="text: neighborhood"]').first().text(),
                        'order-city' : $selector('span[data-bind="text: city"]').first().text(),
                        'order-state' : $selector('span[data-bind="text: state"]').first().text(),
                        'order-zipcode' : $selector('span[data-bind="text: postalCode"]').first().text(),
                        'order-number' : $selector('span[data-bind="text: number"]').first().text()
                    },
                    orderStatusClass = (orderData['order-status'] === 'Cancelado' || orderData['order-status'] === 'Pedido entregue') ? ' title__order-status--complete' : '',
                    //Estimate Data
                    shippingMethod = (selfOrderObj[0].shippingData.logisticsInfo[0]) ? selfOrderObj[0].shippingData.logisticsInfo[0].selectedSla : '',
                    slas = (selfOrderObj[0].shippingData.logisticsInfo[0]) ? selfOrderObj[0].shippingData.logisticsInfo[0].slas : '',
                    currentSla = Estimate.getSla(shippingMethod, slas),
                    orderEstimateDate = Estimate.calculateSla(selfOrderObj[0].creationDate, currentSla),
                    trackingTemplate = '<p class="order-tracking__item">{lastChange}: {description}</p>',
                    addInfoTemplate = '<div class="body__order-add-info">' +
                                            '<p>Data da compra: <strong class="add-info__estimated">' + orderData['order-date'] + '</strong></p>' +
                                            '<p>Status do pedido: <strong class="add-info__status">' + orderData['order-status'] + '</strong></p>' +
                                            '<p>Entrega estimada para: <strong class="add-info__estimated">' + orderEstimateDate + '</strong></p>' +
                                        '</div>',
                    renderStatusBar = function() {
                        dust.render('orderStates', StatusGroup[orderData['order-status']], function(err, out) {
                            if (err) {
                                throw new Error('Order states Dust error: ' + err);
                            }
                            $selector('.body__order-add-info').after(out);
                        });

                        $selector('.tite__order-date').append('<span class="title__order-status' + orderStatusClass +'">' + orderData['order-status'] + '</span>');
                        $selector('.add-info__status').text(orderData['order-status']);
                    };

                //Prepare 'data' items to orders
                $self.data(orderData);

                //Format ID to only numbers
                $id.text($id.text().split('-').shift().replace(/[^0-9]/g, ''));

                //Prepare and title changes
                $selector('.title-ordergroup-order.hide').add($selector('.title-ordergroup-number')).wrapAll('<div class="pull-left tite__order-number"></div>');
                $selector('.title-ordergroup-order.muted').add($selector('.order-date')).wrapAll('<div class="pull-right tite__order-date"></div>');
                $selector('.order-header').after(addInfoTemplate);

                //Change html order
                $orderDetails.detach().insertBefore($orderInfo);

                //Wrap content to accordion
                $selector('.body__order-add-info').add($orderDetails).add($orderInfo).wrapAll('<div class="body__order"></div>');

                //Remove title from list of product (except first)
                $selector('.order-details').find('.items').slice(1).find('thead').remove();

                //Accordion on orders
                $selector('.order-title').click(function(e) {
                    e.preventDefault();
                    $(this).toggleClass('order-title--closed');
                    $selector('.body__order').stop().stop().slideToggle();
                });

                //Prepare products to interations and warranty modules
                $selector('.cart-items .product-item').each(function(i) {
                    var productName = $(this).find('.product-name a').text(),
                        selfItem = [],
                        productData = {};

                    $.each(selfOrderObj, function(i, v) {
                        //This item product
                        selfItem = $.grep(v.items, function(obj) {
                            return obj.name === productName;
                        });

                        if(selfItem.length > 0) {
                            return false;
                        }
                    });

                    productData = {
                        'product-id' : selfItem[0].productId,
                        'product-refid' : selfItem[0].refId,
                        'product-name' : selfItem[0].name,
                        'product-price' : selfItem[0].price,
                        'product-quantity' : selfItem[0].quantity,
                        'product-bundle' : (selfItem[0].bundleItems[0] ? selfItem[0].bundleItems[0].name : ''),
                        'product-index' : i
                    };

                    $(this).data(productData);
                    $(this).addClass('items-' + $self.data('order-group')).addClass('item-' + selfItem[0].productId);
                });

                //Warranty modules call
                Warranty.init($self);

                //Render buttons orderinfo
                $selector('.order-info .row-fluid').append('<div class="span4 order-info__buttons"><a href="https:/consul.custhelp.com/app/atendimento?pedido=' + orderData['order-id'] + '" target="_blank" class="order-info__help primary-button">Ajuda</a></div>');

                //Render Tracking Info
                //v202503881ccbr-01
                //orderData['order-id']
                CRM.getOrderById(orderData['order-id']).then(function(result) {
                    if (!result) {
                        return false;
                    }

                    var trackingData = {};
                    $selector('.body__order-add-info').after('<div class="box-order-tracking"></div>');

                    $(result && result.Documents).each(function(i, e) {
                        if (e.finished) {
                            orderData['order-status'] = 'Pedido entregue';
                        }

                        trackingData = {
                            description: e.description,
                            lastChange: $.formatDatetimeBRL(e.lastChange)
                        };

                        $selector('.box-order-tracking').append(trackingTemplate.render(trackingData));
                    });

                }).then(renderStatusBar, renderStatusBar);

            }).promise().done(function() {
                //Mobile changes
                $(window).resize(function() {
                    if( $(window).width() <= 768 ) {
                        $('.ordergroup .product-item:not(.run)').each(function() {
                            var $self = $(this),
                                itemData = {
                                    nome: $self.find('.product-name a').text(),
                                    entrega: $self.find('.shipping-date .shipping-estimate').text(),
                                    quantidade: $self.find('.quantity span').text(),
                                    total: $self.find('.quantity-price .total-price').text()
                                },
                                itemTemplate = '<span>Entrega: <strong>{entrega}</strong></span><br />' +
                                               '<span>Quantidade: <strong>{quantidade}</strong></span><br />' +
                                               '<span>Total: <strong>{total}</strong></span><br />';

                            $self.find('.product-name').append(itemTemplate.render(itemData));
                            $self.addClass('run');
                        });
                    }
                }).resize();
            });

        }
    });

});
