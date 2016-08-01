/* global $:true, Nitro: true, vtexjs: true */

require('modules/orders/order.estimateLoading');
require('modules/orders/order.warrantySpare');

Nitro.controller('pedidos', ['order.estimateLoading', 'order.warrantySpare'], function(loading, warrantySpare) {

    'use strict';

    var self = this;

    this.init = function() {
        this.orderStatus();
        this.garantiaInfo();
        this.setLinksServices();
        //this.cancelServices();
        this.linkGeneratePdf();
        this.submitFormCrm();

        //if($('body').is('.gae-avulsa')){
        warrantySpare.setup();
        //}
    };

    this.orderStatus = function() {
        var statusFake = {};
        statusFake.pedido_recebido = ['Pedido Realizado! Aguarde pela aprovação do pagamento.', '', '', '', ''];
        statusFake.processando_pagamento = ['Pedido Realizado! Aguarde pela aprovação do pagamento.', 'Estamos aguardando a confirmação do seu pagamento.', '', '', ''];
        statusFake.preparando_entrega = ['Pedido Realizado!', 'Seu pagamento foi aprovado', 'Seu produto já está separado e pronto para ser entregue pela transportadora.', '', ''];
        statusFake.enviado = ['Pedido Realizado!', 'Seu pagamento foi aprovado', 'Seu produto já foi separado e entregue para transportadora.', 'Seu produto já está a caminho da sua casa.', ''];
        statusFake.cancelado = ['', '', '', '', 'Seu pedido foi cancelado.'];
        statusFake.processando_cancelamento = ['', '', '', '', 'Seu pedido foi cancelado.'];

        var tooltips = '',
            orderStatusFake = '';

        $('.order-status-info').each(function() {
            $(this).prev().removeClass('span9').addClass('span3');
            $(this).removeClass('span3').addClass('span9');
            orderStatusFake = $(this).find('.order-status-wrapper span').text().replace(' ', '_').toLowerCase();
            if (orderStatusFake === 'processando_pagamento')
                $(this).find('.request-cancel').show();
            $(this).find('.order-status-wrapper').addClass($(this).find('.order-status-wrapper span').text().replace(' ', '-').toLowerCase());
            tooltips = tooltips + '<div class="pedido-recebido" title="' + statusFake[orderStatusFake][0] + '"></div>';
            tooltips = tooltips + '<div class="aguardando-pagamento" title="' + statusFake[orderStatusFake][1] + '"></div>';
            tooltips = tooltips + '<div class="preparando-entrega" title="' + statusFake[orderStatusFake][2] + '"></div>';
            tooltips = tooltips + '<div class="enviado" title="' + statusFake[orderStatusFake][3] + '"></div>';
            tooltips = tooltips + '<div class="cancelado" title="' + statusFake[orderStatusFake][4] + '"></div>';
            $(this).find('.order-status-wrapper').append(tooltips);
        });

    };

    this.garantiaInfo = function() {

        $('.cart-items .item-service').each(function() {
            var self = $(this),
                serviceName = self.find('.bundle-item-name span').text(),
                textDownload = '<span class="download">Clique para download</span>';
            if ((serviceName.indexOf('Garantia Estendida') !== -1) && (self.find('.download').length === 0)) {
                self.find('.bundle-item-name').append(textDownload);
            }
        });
    };

    this.setLinksServices = function() {

        var textCanceled = '<span class="canceled-service">cancelamento do seguro de garantia estendida original solicitado</span>',
            textCancel = '<a class="cancel-service" href="javascript:void(0)">cancelar garantia</a>';

        $('.cart-items').each(function() {

            var self = $(this),
                selfId = $(this).parents('.ordergroup').attr('id');
            self.find('.item-service').addClass('orderGroupId-' + selfId.replace(/\D+/g, ''));

            self.find('.item-service').each(function(index) {
                $(this).addClass('index-' + index);
            });

            vtexjs.checkout.getOrders(selfId).done(function(orders) {
                $.each(orders, function(index, obj) {

                    var orderGroupId = obj.orderGroup.replace(/\D+/g, '');
                    loading.setup(obj);

                    $.each(obj.items, function(i, item) {
                        console.log('Index do pedido ' + orderGroupId + ': ' + i);
                        var skuRefId = item.refId,
                            cancelado = false;
                        $('.product-item .product-name a:contains(' + item.name + ')')
                            .parents('.product-item')
                            .next('.item-service')
                            .addClass('skuRefId-' + skuRefId);

                        $.get('/api/ds/pub/documents/CG?f=cancel&fq=order:' + orderGroupId + '%20AND%20skuRefId:' + skuRefId + '%20AND%20indice:' + i, function(data) {
                            $.each(data.Documents, function(docIndex, doc) {
                                if (doc.cancel) {
                                    cancelado = true;
                                }
                                return false; //sai do loop, pois pode haver outras retornos de cancelado do mesmo objeto
                            });
                            var trService = $('.item-service.orderGroupId-' + orderGroupId + '.skuRefId-' + skuRefId + '.index-' + i);
                            trService.find('.bundle-item-name + td').html(cancelado ? textCanceled : textCancel);

                        }).fail(function() { //falha ao tentar acessar poque o pedido não foi cancelado.
                            var trService = $('.item-service.orderGroupId-' + orderGroupId + '.skuRefId-' + skuRefId + '.index-' + i);
                            trService.find('.bundle-item-name + td').html(textCancel);
                        });
                    });
                });
            });
        });

        $(document).ajaxStop(function() {
            self.cancelServices();
        });

    };

    this.cancelServices = function() {

        $('.cancel-service').on('click', function() {

            var indexSku = $(this).parents('.ordergroup').find('.cancel-service, .canceled-service').index(this);
            $('#modal-services').modal();

            var orderGroupId = $(this).parents('.ordergroup').attr('id'),
                productToCompare = $(this).parents('.item-service').prev('.product-item').find('.product-name a').text(),
                tipoGarantia = $(this).parents('.item-service').find('.bundle-item-name span:eq(0)').text();

            if (tipoGarantia.indexOf('12') !== -1) {
                tipoGarantia = '12';
            } else if (tipoGarantia.indexOf('24') !== -1) {
                tipoGarantia = '24';
            }
            $('#CG_garantia').val(tipoGarantia);
            vtexjs.checkout.getOrders(orderGroupId).then(function(orders) {
                $('#CG_document').val(orders[0].clientProfileData.document);
                $('#CG_order').val(orders[0].orderId.split('-').shift().replace(/[^0-9]/g, ''));

                $.each(orders[0].items, function(elemIndex, elem) {
                    if (elem.name === productToCompare)
                        $('#CG_skuRefId').val(elem.refId);
                    $('#CG_indice').val(indexSku);
                });
            });
        });
    };

    this.linkGeneratePdf = function() {
        var clientCpf, clientOrderId, pdfUrl, clientSequenceId;
        $('.bundle-item-name span').on('click', function() {
            clientOrderId = $(this).parents('.ordergroup').attr('id');
            vtexjs.checkout.getOrders(clientOrderId).then(function(orders) {
                clientCpf = orders[0].clientProfileData.document;
                console.log(orders[0].orderId);
                clientSequenceId = orders[0].orderId.split('-').shift().replace(/[^0-9]/g, '');
                console.log(clientSequenceId);
                while (clientSequenceId.toString().length < 10) {
                    clientSequenceId = '0' + clientSequenceId;
                }
                pdfUrl = 'http://garantia.elasticbeanstalk.com/listagem?cpf=' + clientCpf + '&id=' + clientSequenceId + '&loja=consul';
                $('#modal-generate-pdf iframe').attr('src', pdfUrl);
            });

            $('#modal-generate-pdf').modal();
        });
    };

    this.submitFormCrm = function() {
        $('#btn-concordo').on('click', function() {
            var formWebToVtex = $('form[name="FormWebToVtex"]');
            //urlToPost = formWebToVtex.attr('action'),
            //dataToPost = formWebToVtex.serialize();
            formWebToVtex.submit();
        });
    };


    $(document).ajaxComplete(function(e, xhr, settings) {

        if (!/checkout\/pub\/orders/.test(settings.url)) return;

        $('.order-details').each(function() {

            var self = $(this),
                orderId = self.find('.orderid span:last'),
                info = self.find('.order-status-info'),
                wrapper = info.find('.order-status-wrapper');

            orderId.text(orderId.text().split('-').shift().replace(/[^0-9]/g, ''));

            info.prev().removeClass('span9').addClass('span3');

            info.removeClass('span3').addClass('span9');

            var orderStatus = wrapper.text().trim().replace(' ', '-').toLowerCase();

            if (orderStatus === 'processando-pagamento') {
                info.find('.request-cancel').show();
            }

            wrapper.addClass(orderStatus);
        });

        if (/documents/.test(settings.url)) {
            //Account.cancelServices();
        } else if (!/order-group/.test(settings.url)) {
            self.init();
        }
    });

});
