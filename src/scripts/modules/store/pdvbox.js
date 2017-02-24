'use strict';

Nitro.module('pdvbox', function() {


    var self = this,
        profileData,
        dateNow = new Date();
    
    profileData = sessionStorage.getItem('profileVtex');
    profileData = JSON.parse(profileData);

    // var pdvBoxAPI = store.isQA ? 'http://compracerta.nxd.com.br/api/v2' : 'https://pdvbox.nxd.com.br/compracerta/api/v2';

    var pdvBoxAPI = 'https://pdvbox.nxd.com.br/compracerta/api/v2';

    var PDVBox = {

        username: 'compracerta',

        password: '8MUKHL5VSqeK8YaFCngUYcpuZZnn2WA4',

        domain: pdvBoxAPI
    };

    self.get = function(orderId, productName) {
        return vtexjs.checkout.getOrders(orderId).then(function(orders) {
            var item = [];

            $.each(orders, function(i, order) {
                item = $.each(order.items, function(index, product) {
                    if (product.name === productName) {
                        return product;
                    }
                });
            });

            var orderDate = $.formatDatetime(orders.creationDate, '-');

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

            return $.post(PDVBox.domain + '/product/', JSON.stringify(data)).then(function(res) {
                res = JSON.parse(res);

                res.sku = item[0].refId;
                res.skuName = item[0].name;
                res.skuPrice = item[0].sellingPrice / 100;
                res.orderDate = orderDate;
                res.orderId = orderId;

                return res;
            });

        });
    };

    self.add = function(user, address, skuInfo, idPlan) {
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
                    store: 31,
                    sale_date: $.formatDatetime(dateNow, '-')
                },
                plan: {
                    id: idPlan
                }
            }
        };

        return $.post(PDVBox.domain + '/purchase/', JSON.stringify(data));
    };

    self.remove = function(idPlan) {
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

        return $.post(PDVBox.domain + '/purchase/cancel/', JSON.stringify(data)).done(function(res) {
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
    };

    self.print = function(idPlan) {
        var data = {
            transaction: {
                login: {
                    username: PDVBox.username,
                    password: PDVBox.password
                }
            }
        };

        return $.post(PDVBox.domain + '/print/' + idPlan, JSON.stringify(data)).done(function(template) {
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

});
