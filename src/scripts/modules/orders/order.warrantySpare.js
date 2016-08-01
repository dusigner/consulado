var CRM = require('modules/store/crm');

require('../../../templates/orders/warrantySpare.bought.html');
require('../../../templates/orders/warrantySpare.modal-add.html');
require('../../../templates/orders/warrantySpare.modal-confirm.html');
require('../../../templates/orders/warrantySpare.modal-payment.html');

Nitro.module('order.warrantySpare', function() {

    'use strict';

    var self = this;

    var dateNow = new Date();

    var PDVBox = {

        username: 'compracerta',

        password: '8MUKHL5VSqeK8YaFCngUYcpuZZnn2WA4',

        // Chamadas de ambiente de Produção

        getPlansURI: 'https://pdvbox.nxd.com.br/compracerta/api/v1/product/',

        addPlanURI: 'https://pdvbox.nxd.com.br/compracerta/api/v1/purchase/',

        cancelPlanURI: 'https://pdvbox.nxd.com.br/compracerta/api/v1/purchase/cancel/',

        printPlanURI: 'https://pdvbox.nxd.com.br/compracerta/api/v1/print/',

        // Chamadas de ambiente de QA

        /*getPlansURI: 'http://compracerta.nxd.com.br/api/v1/product/',

        addPlanURI: 'http://compracerta.nxd.com.br/api/v1/purchase/',

        cancelPlanURI: 'http://compracerta.nxd.com.br/api/v1/purchase/cancel/',

        printPlanURI: 'http://compracerta.nxd.com.br/api/v1/print/',*/

        getPlans: function(orderId, itemName) {
            return vtexjs.checkout.getOrders(orderId).then(function(orders) {

                var item = [];

                $.each(orders, function(i, order) {
                    item = $.each(order.items, function(index, product) {
                        if (product.name === itemName) {
                            //console.log('item',item);
                            return product;
                        }
                    });
                    //console.log('item', item);
                });


                var orderDate = $.formatDatetime(orders.creationDate),
                    userEmail = $('.email.personal-info .personal-info-value span').first().text();

                //console.log('item2', item);

                var data = {
                    transaction: {
                        login: {
                            username: PDVBox.username,
                            password: PDVBox.password
                        },
                        product: {
                            sku: item[0].refId,
                            price: item[0].sellingPrice / 100
                        },
                        client: {
                            id: userEmail
                        },
                        sale: {
                            id: orderId,
                            sale_date: orderDate
                        }
                    }
                };

                //console.log('data',JSON.stringify(data));

                return $.post(PDVBox.getPlansURI, JSON.stringify(data)).then(function(res) {
                    res = JSON.parse(res);

                    res.sku = item[0].refId;
                    res.skuName = item[0].name;
                    res.skuPrice = item[0].sellingPrice / 100;
                    res.orderId = orderId;
                    res.orderDate = orderDate;

                    return res;
                });
            });
        },

        addPlan: function(data) {
            return $.post(PDVBox.addPlanURI, JSON.stringify(data)).then(function(res) {
                res = JSON.parse(res);

                return res;
            });
        },
        cancelPlan: function(idPlan) {
            var data = {
                transaction: {
                    login: {
                        username: PDVBox.username,
                        password: PDVBox.password
                    },
                    sale_coverage: {
                        id: idPlan
                    }
                }
            };
            $.post(PDVBox.cancelPlanURI, JSON.stringify(data))
                .then(function(res) {
                    res = JSON.parse(res);

                    if (res.status) {
                        $('<p>Sua garantia foi cancelada com sucesso!</p>').vtexModal({
                            id: 'cancelar-garantia',
                            title: 'Seguro de Garantia Estendida Original',
                            destroy: true
                        });

                        setTimeout(function() {
                            location.reload();
                        }, 5000);
                    } else {
                        if (res.message === 'Sale already canceled') {
                            self.alert('erro-cancel', 'A garantia desso produto já foi cancelada');
                        } else {
                            self.alert('erro-cancel', 'Ocorreu algum erro, tente novamente');
                        }
                    }
                })
                .fail(function() {
                    self.alert('erro-cancel', 'Ocorreu algum erro, tente novamente');
                });
        },
        printPlan: function(idPlan) {
            var data = {
                transaction: {
                    login: {
                        username: PDVBox.username,
                        password: PDVBox.password
                    }
                }
            };
            return $.post(PDVBox.printPlanURI + idPlan, JSON.stringify(data)).then(function(res) {
                return res;
            });
        }
    };

    self.alert = function(id, text, time) {
        var delay = time || 5000;

        $('<div class="alert-box" id="' + id + '">' + text + '</div>').hide().prependTo('body').fadeIn();
        setTimeout(function() {
            $('.alert-box#' + id).fadeOut('400', function() {
                $(this).remove();
            });
        }, delay);
    };


    self.setup = function() {
        self.addButton();
    };


    self.addButton = function() {
        var $orderGroup = $('.ordergroup'),
            $buttonWarranty = '<button class="primary-button float-left add-warranty"><span>Adicionar Garantia Estendida</span></button>';
        $orderGroup.each(function() {
            //console.log('data: ' + $(this).find('.order-date').text());
            var orderDate = $(this).find('.order-date').text(),
                orderId = $(this).attr('id'),
                orderStatus = $(this).find('.order-status-wrapper .order-status:eq(0)').text();

            orderDate = orderDate.split('/');
            orderDate = orderDate[2] + '/' + orderDate[1] + '/' + orderDate[0];
            orderDate = new Date(orderDate);

            if ($.diffDate(dateNow, orderDate) <= 334 && orderStatus !== 'Cancelado' && orderStatus !== 'Processando Pagamento') {
                //if($.diffDate(dateNow, orderDate) <= 334 && orderStatus !== 'Cancelado'){
                //$(this).find('.cart-items:not(:has(.item-service))').after($buttonWarranty);
                $(this).find('.cart-items:not(:has(.item-service))').each(function(index, el) {
                    var itemName = $(el).find('.product-name a').text();


                    PDVBox.getPlans(orderId, itemName).done(function(res) {
                        //console.log(res);
                        if (res.message === 'Sale found') {
                            //console.log('Sale found', res);
                            var btnCancel = true,
                                price = 'R$ ' + _.formatCurrency(res.price);

                            if (res.status === 'N') {
                                btnCancel = false;
                                price = 'Cancelado';
                            }
                            var templateData = [];

                            templateData.btnCancel = btnCancel;
                            templateData.price = price;
                            templateData.period = res.period;
                            templateData.idWarranty = res.id;

                            dust.render('warrantySpare.bought', templateData, function(err, out) {
                                if (err) {
                                    throw new Error('Modal Warranty Dust error: ' + err);
                                }
                                $(el).find('.product-item').after(out);
                            });

                            $('.download-avulso').unbind('click').click(function() {
                                var idPlan = $(this).data('id');
                                //console.log('clicou no download', idPlan);
                                PDVBox.printPlan(idPlan).done(function(template) {

                                    var $template = $(template).filter('div');
                                    $template.find('tr:eq(0)').remove();
                                    $template.find('a').attr('target', '_blank').removeClass('btn').addClass('secondary-button').wrapInner('<span></span>');

                                    $template.filter('div').vtexModal({
                                        id: 'imprimir-garantia',
                                        title: 'Seguro de Garantia Estendida Original',
                                        destroy: true
                                    });

                                }).fail(function() {
                                    self.alert('erro-cancel', 'Ocorreu algum erro, tente novamente');
                                });
                            });

                            $('.cancel-warranty').unbind('click').click(function() {
                                var idPlan = $(this).data('id');
                                //console.log('clicou no download', idPlan);
                                PDVBox.cancelPlan(idPlan);
                            });

                        } else if (res.message === 'Coverages found') {
                            $(el).after($buttonWarranty);

                            $('.add-warranty').unbind('click').click(function() {
                                //console.log($(this),e);
                                self.openSelectWarranty($(this));
                            });
                        }
                    }).fail(function() {
                        self.alert('erro', 'Ocorreu algum erro, tente novamente');
                    });
                });
            }
        });
    };

    self.openSelectWarranty = function(button) {
        //console.log('id Pedido: ' + $(button).parents('.ordergroup').attr('id'));

        var $orderGroup = $(button).parents('.ordergroup'),
            orderId = $orderGroup.attr('id'),
            orderDate = $orderGroup.find('.order-date').text();

        orderDate = orderDate.split('/');
        orderDate = orderDate[2] + '-' + orderDate[1] + '-' + orderDate[0];

        var itemName = $(button).prev('.cart-items').find('.product-name a').text();

        //console.log('item-name: ' + itemName);

        return PDVBox.getPlans(orderId, itemName)
            .then(function(plan) {
                if (plan.message === 'Coverages found') {

                    $.each(plan.coverages, function(i, coverage) {
                        plan.coverages[i].price = _.formatCurrency(coverage.price);
                    });

                    dust.render('warrantySpare.modal-add', plan, function(err, out) {
                        if (err) {
                            throw new Error('Modal Warranty Dust error: ' + err);
                        }

                        $(out).vtexModal({
                            id: 'selecione-garantia',
                            title: 'Seguro de Garantia Estendida Original',
                            destroy: true
                        });
                    });

                    $('#vtex-selecione-garantia .add').click(function() {
                        var idPlan = $('#coverages').val();
                        $(this).addClass('loading').find('span').remove();
                        self.confirmRegister(plan, idPlan, button);
                    });
                }
            }).fail(function() {
                self.alert('erro-plan', 'Ocorreu algum erro, tente novamente');
            });

    };

    self.confirmRegister = function(skuInfo, idPlan, button) {

        var userEmail = $('.email.personal-info .personal-info-value span').first().text();

        return CRM.clientSearchByEmail(userEmail).done(function(user) {

            $('#vtex-selecione-garantia .close').trigger('click');
            var $orderGroup = $(button).parents('.ordergroup'),
                $addressBox = $orderGroup.find('.shipping-address'),
                address = [];

            address.street = $addressBox.find('span[data-bind = "text: street"]').text();
            address.number = $addressBox.find('span[data-bind = "text: number"]').text();
            address.complement = $addressBox.find('span[data-bind = "text: complement"]').text();
            address.neighborhood = $addressBox.find('span[data-bind = "text: neighborhood"]').text();
            address.city = $addressBox.find('span[data-bind = "text: city"]').text();
            address.state = $addressBox.find('span[data-bind = "text: state"]').text();
            address.countryName = $addressBox.find('span[data-bind = "text: countryName"]').text();
            address.postalCode = $addressBox.find('span[data-bind = "text: postalCode"]').text();
            address.reference = $addressBox.find('span[data-bind = "text: reference"]').text();

            dust.render('warrantySpare.modal-confirm', $.extend({}, address, user, skuInfo), function(err, out) {
                if (err) {
                    throw new Error('Modal Warranty Dust error: ' + err);
                }

                $(out).vtexModal({
                    id: 'confirmar-dados-garantia',
                    title: 'Seguro de Garantia Estendida Original',
                    destroy: true
                });
            });

            $('#vtex-confirmar-dados-garantia .confirm').click(function() {
                $(this).addClass('loading').find('span').remove();
                self.addWarranty(user, address, skuInfo, idPlan, button);
            });

            $('#vtex-confirmar-dados-garantia .back').click(function() {
                $(this).addClass('loading').find('span').remove();
                self.openSelectWarranty(button)
                    .done(function() {
                        $('#vtex-confirmar-dados-garantia .close').trigger('click');
                    });
            });

        }).fail(function() {
            self.alert('erro-user', 'Ocorreu algum erro, tente novamente');
        });

    };

    self.addWarranty = function(user, address, skuInfo, idPlan, button) {
        var userEmail = $('.email.personal-info .personal-info-value span').eq(0).text();
        var data = {
            transaction: {
                login: {
                    username: PDVBox.username,
                    password: PDVBox.password
                },
                product: {
                    /*sku: 'BRM48NBANA',*/
                    sku: skuInfo.sku,
                    price: skuInfo.skuPrice
                },
                client: {
                    id: userEmail,
                    cpf: user.document,
                    name: user.firstName,
                    address1: address.street,
                    address2: address.complement || 'nenhum',
                    addrnum: address.number,
                    city: address.city,
                    state: address.state,
                    zip: address.postalCode,
                    phone: user.phone,
                    email: userEmail
                },
                sale: {
                    id: skuInfo.orderId
                },
                plan: {
                    id: idPlan
                }
            }
        };


        PDVBox.addPlan(data).done(function(res) {
            //console.log(res);

            if (res.message === 'Sale inserted') {
                $('#vtex-confirmar-dados-garantia .close').trigger('click');

                dust.render('warrantySpare.modal-payment', res, function(err, out) {
                    if (err) {
                        throw new Error('Modal Warranty Dust error: ' + err);
                    }

                    $(out).vtexModal({
                        id: 'pagamento-garantia',
                        title: 'Seguro de Garantia Estendida Original',
                        destroy: true,
                        static: true
                    });
                });


                $('#iframe-pagamento').load(function() {
                    $.get(res.link).error(function() {
                        self.alert('erro-pagamento', 'Ocorreu algum erro, tente novamente');
                    });
                });


                $('#vtex-pagamento-garantia .close').click(function() {
                    location.reload();
                });

                $('#vtex-pagamento-garantia .back').click(function() {
                    $(this).addClass('loading').find('span').remove();
                    self.confirmRegister(skuInfo, idPlan, button)
                        .done(function() {
                            $('#vtex-pagamento-garantia').fadeOut('400', function() {
                                $(this).remove();
                            });
                        });
                });

            }
        }).fail(function() {
            self.alert('erro-addplan', 'Ocorreu algum erro, tente novamente');
        });
    };


});
