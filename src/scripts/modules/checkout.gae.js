/* global $: true, Nitro: true, dust: true, dust: true, _: true, vtexjs:true */
'use strict';

require('../../templates/modal-warranty-desktop.html');
require('../../templates/modal-warranty-mobile.html');
require('../../templates/modal-warranty-desktop-teste-ab.html');

Nitro.module('checkout.gae', function() {

    var self = this,
        $body = $('body'),
        template = $body.hasClass('teste-ab-gae') ? 'modal-warranty-desktop-teste-ab' : 'modal-warranty-desktop',
        $modalWarranty = $('#modal-warranty');

    this.setup = function() {
        this.link();
        this.terms();
        this.autoOpen();
    };

    this.showMoreMobile = function() {
        // console.log('showMoreMobile');
        $('.show-more i').off().on('click', function() {
            $(this).parent().parent().parent()
                .find('.box-list').toggleClass('hide');
            $(this).toggleClass('active');
        });
    };

    this.hasAnyActiveWarranty = function() {
        return self.orderForm && self.orderForm.items && self.orderForm.items.some(function(elem) {
            return elem.bundleItems.length > 0 && elem.bundleItems.some(function(bundle) {
                return bundle.name.indexOf('Garantia') !== -1;
            });
        });
    };

    //Exibe mensagem info sobre GAE no "resumo do pedido" quando existir garantia ativa
    this.info = function() {
        var $info = $('.garantiaInfo');

        if ($info.length === 0) {
            $info = $('<p class="garantiaInfo">O pagamento do prêmio de seguro será realizado em conjunto com o pagamento do(s) produto(s) ora adquirido(s).</p>')
                .appendTo('.orderform-template .summary-template-holder');
        }

        $info.toggleClass('active', self.hasActiveWarranty());
    };

    this.terms = function() {
        $('#btn-concordo').off().on('click', function() {

            var attachmentName = 'Aceite do Termo',
                content = {
                    'Aceito': 'Aceito'
                };

            self.orderForm.items.forEach(function(elem, elemIndex) {

                elem.bundleItems.filter(function(bundle) {
                    return bundle.attachmentOfferings.length > 0;
                }).forEach(function(bundle) {

                    // console.log('bundle', bundle);

                    return vtexjs.checkout.addBundleItemAttachment(elemIndex, bundle.id, attachmentName, content);
                });
            });

            $('#modal-services').modal('hide');
            //$('.btn-place-order').trigger('click');
            window.location.href = '#/orderform';
        });

        $('#modal-services .btn-default').off().on('click', function() {

            self.orderForm.items.forEach(function(elem, elemIndex) {

                elem.bundleItems.forEach(function(bundle) {
                    //$.each(self.orderForm.items, function (i) {
                    return vtexjs.checkout.removeOffering(bundle.id, elemIndex);
                    //});
                });
            });

            $('#modal-services').modal('hide');
        });
    };

    this.addkWarranty = function() {

        var $self = $(this),
            index = $self.data('index'),
            idOffering = $('input[name="warranty-value"]:checked').val();

        if (idOffering !== '') {
            $self.addClass('icon-loading');

            vtexjs.checkout.addOffering(idOffering, index).always(function() {
                $modalWarranty.modal('hide');

                $modalWarranty.on('hidden.bs.modal', function() {
                    $self.removeClass('icon-loading');
                });
            });
        } else {
            $modalWarranty.modal('hide');
        }
    };

    this.modalWarranty = function(e) {
        e.preventDefault();

        //pegando valores do produto clicado
        var $self = $(this),
            index = $self.attr('data-index'),
            product = self.orderForm.items[index];

        // filtra os serviços disponiveis somente para Garantia
        var offerings = $.grep(self.orderForm.items[index].offerings, function(value) {
            return value.name.indexOf('Garantia') !== -1;
        });

        var price1 = offerings[0],
            price2 = offerings[1];

        //swap valores
        if (price1.price > price2.price) {
            var temp = price2;
            price2 = price1;
            price1 = temp;
        }

        //adicionando valores nos campos do Modal
        var data = {
            product: {
                image: product.imageUrl.replace('http:', ''), //https image
                name: product.name,
                price: product.price
            },
            warranty: {
                oneYear: {
                    id: price1.id,
                    price: price1.price / 10,
                    fullPrice: price1.price,
                    priceDay: price1.price / 365
                },
                twoYear: {
                    id: price2.id,
                    price: price2.price / 10,
                    fullPrice: price2.price,
                    priceDay: price2.price / 730
                }
            },
            productIndex: index
        };

        // console.log(product, data);

        if ($(window).width() < 840) {
            template = 'modal-warranty-mobile';
        }

        dust.render(template, data, function(err, out) {
            if (err) {
                throw new Error('Modal Warranty Dust error: ' + err);
            }

            $('body').append(out);

            $modalWarranty = $('#modal-warranty');

            $modalWarranty.modal().on('hidden.bs.modal', function() {
                $modalWarranty.remove();
            });

            self.showMoreMobile();

            //classe no box de garantia
            var $anchorGae = $('.anchor-gae');
            $anchorGae.on('click', function() {
                $anchorGae.not(this).removeClass('active')
                    .filter(this).addClass('active');
            });

            //abrindo mais detalhes da garantia
            $('.box-opcao-garantia .show-more').on('click', function() {
                $(this).parents('.box-opcao-garantia').toggleClass('open');
                $(this).next('.desc').slideToggle(); // remover comentário quando não tiver no teste ab
            });

            //adicionando garantia definida ao produto
            $modalWarranty.find('.btn-continue')
                //.unbind('click')
                .on('click', self.addkWarranty); //descomentar fora do teste
        });

    };

    this.selectHasWarranty = function($select) {
        var hasWarranty = false;
        $select.find('option').each(function() {
            if($(this).text().indexOf('Garantia') !== -1) {
                hasWarranty = true;
            }
        });

        return hasWarranty;
    };

    this.hasCurrentWarranty = function($boxService) {
        var hasWarranty = false;
        $boxService.each(function() {
            if($(this).find('.bundle-item-name span').text().indexOf('Garantia') !== -1) {
                hasWarranty = true;
            }
        });
        return hasWarranty;
    };

    this.link = function() {
        var $link = $('<a href="#" class="linkWarranty btn">Adicionar Seguro Garantia Estendida Original</a>');

        //adicionando link de GAE em cada item
        $('.product-item').each(function(i) {
            var $self = $(this),
                $selfService = $(this).find('.product-service'),
                $currentLink = $self.find('.linkWarranty'),
                $currentServices = $self.nextUntil('.product-item');

            // verifica se o link de garantia já não existe disponível para o produto
            // verifica se o select de serviços escondido possui a opção de garantia estendida
            // verifica se já não existe uma garantia adicionada
            // adiciona o link de adquirir garantia
            if ($currentLink.length === 0 && self.selectHasWarranty($selfService) && !self.hasCurrentWarranty($currentServices)) {
                $link.clone()
                    .appendTo($selfService)
                    .attr('data-index', i)
                    .on('click', self.modalWarranty);
            }
        });
    };

    this.autoOpen = function() {

        setTimeout(function() {
            //Inicia o modal com o ultimo produto adicionado,
            //caso já tenha sido chamado adiciona a classe been-called
            var $cartTemplate = $('.cart-template');

            //if($(window).width() > 1000){
            if (!$cartTemplate.is('.been-called')) {
                $('.linkWarranty').last().trigger('click');
                $cartTemplate.addClass('been-called');
            }
            //}
        }, 1500);
    };
});

/*jshint strict: false */
dust.filters.intAsCurrency = function(value) {
    return _.intAsCurrency(value);
};
