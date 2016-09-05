'use strict';

var CRM = require('modules/store/crm');
require('../../../templates/orders/warrantySpare.btnWarranty.html');
require('../../../templates/orders/warrantySpare.btnDownloadWarranty.html');

require('../../../templates/orders/warrantySpare.modal-add.html');
require('../../../templates/orders/warrantySpare.modal-confirm.html');
require('../../../templates/orders/warrantySpare.modal-payment.html');

Nitro.module('order.warranty', function() {


    var self = this;

    var profileData = sessionStorage.getItem('profileVtex');

    profileData = JSON.parse(profileData);

    var dateNow = new Date();

    var boxOrder = {};

    var boxPlans = {};

    var PDVBox = {

        username: 'compracerta',

        password: '8MUKHL5VSqeK8YaFCngUYcpuZZnn2WA4',

        // Chamadas de ambiente de Produção

        // getPlansURI: 'https://pdvbox.nxd.com.br/compracerta/api/v2/product/',

        // addPlanURI: 'https://pdvbox.nxd.com.br/compracerta/api/v2/purchase/',

        // cancelPlanURI: 'https://pdvbox.nxd.com.br/compracerta/api/v2/purchase/cancel/',

        // printPlanURI: 'https://pdvbox.nxd.com.br/compracerta/api/v2/print/',

        // Chamadas de ambiente de QA

        getPlansURI: 'http://compracerta.nxd.com.br/api/v2/product/',

        addPlanURI: 'http://compracerta.nxd.com.br/api/v2/purchase/',

        cancelPlanURI: 'http://compracerta.nxd.com.br/api/v2/purchase/cancel/',

        printPlanURI: 'http://compracerta.nxd.com.br/api/v2/print/',

        getPlans: function(orderId, itemName) {
            return vtexjs.checkout.getOrders(orderId).then(function(orders) {

                var item = [];

                $.each(orders, function(i, order) {
                    item = $.each(order.items, function(index, product) {
                        if (product.name === itemName) {
                            return product;
                        }
                    });
                });


                var orderDate = $.formatDatetime(orders.creationDate);


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
                            id: profileData.Email
                        },
                        sale: {
                            id: orderId,
                            sale_date: orderDate
                        }
                    }
                };

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
            if (data.transaction.sale) {
                data.transaction.sale.store = 33;
                data.transaction.sale.sale_date = $.formatDatetime(dateNow, '-');
            }
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
        $('.box-my-orders').each(function(i, e) {
            self.init(e);
        });
    };

    self.init = function(order) {

        var orderId = $(order).data('order-group');

        boxOrder[orderId] = {};
        boxOrder[orderId].id = orderId;
        boxOrder[orderId].status = $(order).data('order-status');
        boxOrder[orderId].formattedDate = $(order).data('order-date');

        boxOrder[orderId].name = $(order).data('order-name');
        boxOrder[orderId].street = $(order).data('order-street');
        boxOrder[orderId].neighborhood = $(order).data('order-neighborhood');
        boxOrder[orderId].city = $(order).data('order-city');
        boxOrder[orderId].state = $(order).data('order-state');
        boxOrder[orderId].postalCode = $(order).data('order-zipcode');
        boxOrder[orderId].complement = $(order).data('order-complement');
        boxOrder[orderId].addresstype = $(order).data('order-addressType');
        boxOrder[orderId].number = $(order).data('order-number');
        boxOrder[orderId].reference = $(order).data('order-reference');

        var orderDate = boxOrder[orderId].formattedDate.split('/');
        orderDate = orderDate[2] + '/' + orderDate[1] + '/' + orderDate[0];

        boxOrder[orderId].date = orderDate;

        // if ($.diffDate(dateNow, orderDate) <= 334 && boxOrder[orderId].status.toLowerCase() !== 'cancelado' && boxOrder[orderId].status.toLowerCase() !== 'pedido cancelado' && boxOrder[orderId].status.toLowerCase() !== 'aguardando pagamento') {
            self.addButton(boxOrder[orderId]);
        // }
    };

    this.addButton = function(order) {

        boxOrder[order.id].products = [];

        $('.items-' + order.id).each(function(i, e) {
            var product = {};

            product.id = $(e).data('product-id');
            product.refId = $(e).data('product-refId');
            product.name = $(e).data('product-name');
            product.price = $(e).data('product-price');
            product.quantity = $(e).data('product-quantity');

            boxOrder[order.id].products.push(product);

            self.getPlans(order, product);

        });

    };

    self.getPlans = function(order, product) {

        PDVBox.getPlans(order.id, product.name).done(function(res) {

            boxPlans[order.id] = res;

            if (res.message === 'Sale found') {
                var btnCancel = true,
                    price = 'R$ ' + _.formatCurrency(res.price);

                if (res.status === 'N') {
                    btnCancel = false;
                    price = 'Cancelado';
                }

                var templateData = [];

                templateData.idWarranty = res.id;
                templateData.price = (price) ? price : '';
                templateData.period = (res.period) ? res.period + ' meses' : '';
                templateData.btnCancel = btnCancel;

                dust.render('warrantySpare.btnDownloadWarranty', templateData, function(err, out) {
                    if (err) {
                        throw new Error('Modal Warranty Dust error: ' + err);
                    }
                    $('.items-' + order.id + '.item-' + product.id).after(out);
                });

                self.cancelWarranty();
                self.downloadWarranty();

            } else if (res.message === 'Coverages found') {

                dust.render('warrantySpare.btnWarranty', {
                    id: order.id
                }, function(err, out) {
                    if (err) {
                        throw new Error('Modal Warranty Dust error: ' + err);
                    }
                    $('.items-' + order.id + '.item-' + product.id).after(out);
                });

                $('.add-warranty').unbind('click').click(function() {
                    var orderId = $(this).data('id');
                    self.openSelectWarranty(boxOrder[orderId], boxPlans[orderId]);
                });
            }
        }).fail(function() {
            self.alert('erro', 'Ocorreu algum erro, tente novamente');
        });
    };

    self.openSelectWarranty = function(order, plan) {
        $.each(plan.coverages, function(i, coverage) {
            plan.coverages[i].price = ($.isNumeric(plan.coverages[i].price)) ? _.formatCurrency(coverage.price) : plan.coverages[i].price;
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
            self.confirmRegister(plan, idPlan);
        });
    };

    self.confirmRegister = function(skuInfo, idPlan) {
        var order = boxOrder[skuInfo.orderId];

        return CRM.clientSearchByEmail(profileData.Email).done(function(user) {

            $('#vtex-selecione-garantia .close').trigger('click');

            var address = [];

            address.street = order.street;
            address.number = order.number;
            address.complement = order.complement;
            address.neighborhood = order.neighborhood;
            address.city = order.city;
            address.state = order.state;
            address.countryName = 'Brasil';
            address.postalCode = order.postalCode;
            address.reference = order.reference;

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
                self.addWarranty(user, address, skuInfo, idPlan);
            });

            $('#vtex-confirmar-dados-garantia .back').click(function() {
                self.confirmRegister(skuInfo, idPlan)
                    .done(function() {
                        $('#vtex-confirmar-dados-garantia .close').trigger('click');
                    });
            });

        }).fail(function() {
            self.alert('erro-user', 'Ocorreu algum erro, tente novamente');
        });
    };

    self.addWarranty = function(user, address, skuInfo, idPlan) {
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
                    id: profileData.Email,
                    cpf: user.document,
                    name: user.firstName + ' ' + user.lastName,
                    address1: address.street,
                    address2: address.complement || 'nenhum',
                    addrnum: address.number,
                    city: address.city,
                    state: address.state,
                    zip: address.postalCode,
                    phone: user.phone,
                    email: profileData.Email
                },
                sale: {
                    id: skuInfo.orderId,
                    store: 33,
                    sale_date: $.formatDatetime(dateNow, '-')
                },
                plan: {
                    id: idPlan
                }
            }
        };


        PDVBox.addPlan(data).done(function(res) {
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
                    self.confirmRegister(skuInfo, idPlan)
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

    self.cancelWarranty = function() {
        $('.cancel-warranty').unbind('click').click(function() {
            var idPlan = $(this).data('id');
            PDVBox.cancelPlan(idPlan);
        });
    };

    self.downloadWarranty = function() {
        $('.download-warranty').unbind('click').click(function() {
            var idPlan = $(this).data('id');

            PDVBox.printPlan(idPlan).done(function(template) {

                var $template = $(template).filter('div');
                $template.find('tr:eq(0)').remove();
                $template.find('a').attr('target', '_blank').removeClass('btn').addClass('secondary-button purple-button').wrapInner('<span></span>');

                $template.filter('div').vtexModal({
                    id: 'imprimir-garantia',
                    title: 'Seguro de Garantia Estendida Original',
                    destroy: true
                });

            }).fail(function() {
                self.alert('erro-cancel', 'Ocorreu algum erro, tente novamente');
            });
        });
    };

});
