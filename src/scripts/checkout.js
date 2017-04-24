 /* global VERSION: true, Nitro: true, $: true */

'use strict';

require('modules/helpers');

if (VERSION) {

    // console.log('%c %c %c Jussi | %s Build Version: %s %c %c ', 'background:#dfdab0;padding:2px 0;', 'background:#666; padding:2px 0;', 'background:#222; color:#bada55;padding:2px 0;', (window.jsnomeLoja || '').replace(/\d/, '').capitalize(), VERSION, 'background:#666;padding:2px 0;', 'background:#dfdab0;padding:2px 0;');

    window._trackJs = window._trackJs || {};

    window._trackJs.version = VERSION;
}

//load Nitro Lib
require('vendors/nitro');

require('modules/checkout.gae');
require('modules/checkout.recurrence');
require('modules/checkout.phones');
require('modules/checkout.termoColeta');
require('modules/checkout.modify');

Nitro.setup(['checkout.gae', 'checkout.phones', 'checkout.termoColeta', 'checkout.recurrence'], function(gae, phones, termoColeta, recurrence) {

    var self = this,
        $body = $('body');

    this.init = function() {
        this.orderFormUpdated(null, window.vtexjs && window.vtexjs.checkout.orderForm);
        this.orderPlacedUpdated();

        if (window.hasher) {
            window.hasher.changed.add(function(current) {
                return self[current] && self[current].call(self);
            });
        }

        return window.crossroads && window.crossroads.routed.add(function(request) {
            //console.log('crossroads', request, data);
            return self[request] && self[request].call(self);
        });
    };

    this.isCart = function() {
        return $body.hasClass('body-cart');
    };

    this.isOrderForm = function() {
        return $body.hasClass('body-order-form');
    };

    this.isOrderPlaced = function() {
        return $body.hasClass('body-order-placed');
    };

    //event
    this.orderFormUpdated = function(e, orderForm) {
        console.info('orderFormUpdated');

        self.orderForm = orderForm;

        gae.orderForm = orderForm;

        recurrence.orderForm = orderForm;

        if (self.isOrderForm()) {
            $('.modal-masked-info-template .masked-info-button').text('Voltar');

            gae.info();
        }

        if (self.isCart()) {
            self.cart();
        }
        // self.rioOlimpiadas();
    };

    //event
    this.orderPlacedUpdated = function(e, orderPlaced) {

        if (self.isOrderPlaced()) {
            console.info('orderPlacedUpdated', orderPlaced);

            self.infoBoleto();
            self.replaceOrderId();
            self.reorderDivs();

            phones.setup();
            termoColeta.setup();
        }
    };

    //state
    this.cart = function() {
        console.info('cart');

        $('.info-shipping').remove();

        $('.Shipping td:first').prepend('<span class="info-shipping">Frete para</span>');
        $('.Shipping td:first').attr('colspan', '4');
        $('.caret').removeClass('caret').addClass('icon icon-chevron-down');

        gae.setup();

        recurrence.setup();

        this.fakeButton();
    };

    //state
    this.shipping = function() {
        console.info('shipping');

        $('#ship-more-info, #ship-number').attr('maxlength', 10);

        $('#ship-street, #ship-name').attr('maxlength', 35);

        return ($.listen && $.listen('parsley:field:init', function(e) {

            $('.ship-more-info').find('label span').empty().addClass('custom-label-complemento');
            $('.ship-reference').show().find('label span').empty().addClass('custom-label-referencia');

            if (e.$element.is('#ship-more-info, #ship-number')) {
                e.$element.attr({
                    'maxlength': 10,
                    'data-parsley-maxlength': 10
                });
            }

            if (e.$element.is('#ship-street, #ship-name')) {
                e.$element.attr({
                    'maxlength': 35,
                    'data-parsley-maxlength': 35
                });
            }

            if (e.$element.is('#ship-postal-code')) {
                if ($('#ship-street').val().length > 35) {
                    $('.ship-filled-data').addClass('hide');
                    $('#ship-street').parent().removeClass('hide');
                    $('#ship-number').blur();
                    $('#ship-street').focus();
                }
            }
        }));
    };

    //state
    this.profile = function() {
        console.info('profile');

        if (self.orderForm && self.orderForm.clientProfileData && self.orderForm.clientProfileData.document) {
            $('#client-document').attr('disabled', 'disabled');
        }

        $('.box-client-info-pj').remove();
    };

    //state
    this.payment = function() {
        console.info('payment');

        $('.payment-card-number input, .payment-card-cvv input').addClass('inspectletIgnore');

        recurrence.hidePayments();
    };

    this.replaceOrderId = function() {
        $('.orderid').each(function() {
            var span = $(this).find('span:last');
            span.text(span.text().split('-').shift().replace(/[^0-9]/g, ''));
        });
    };

    this.reorderDivs = function() {
        $('.payment-info').removeClass('span5').addClass('span4');
        $('.shipping-info').removeClass('span2').addClass('span4');
        $('.total-info').removeClass('span3').addClass('span4');
    };

    this.infoBoleto = function() {

        var bankInvoice = $('.bank-invoice-print');
        if (bankInvoice.length > 0) {
            $('.orderplaced-alert-content h4').text('Falta pouco! Efetue o pagamento do boleto e finalize seu pedido.');
        }
    };

    this.clickFakeButton = function(e) {
        e.preventDefault();

        if (gae.hasAnyActiveWarranty()) {
            $('#modal-services').modal('show');
        } else {
            window.location.href = '#/orderform';
        }

        return false;
    };

    this.fakeButton = function() {

        var $fakeButton = $('.fake-buttom');

        if ($fakeButton.length === 0) {
            $fakeButton = $('<a href="#" class="fake-buttom btn-success btn btn-large">Fechar pedido</a>').appendTo('.cart-links');

            $fakeButton.on('click', self.clickFakeButton);

            $('.btn-place-order').addClass('hide');
        }
    };

    // this.rioOlimpiadas = function() {
    //     // console.log(self.orderForm);
    //     if (self.orderForm && self.orderForm.shippingData.address) {
    //         var $cep = self.orderForm.shippingData.address.postalCode;
    //         $cep = $.currencyToInt($cep);
    //         if ($cep >= 20000001 && $cep <= 23799999) {
    //             window.vtex.checkout.MessageUtils.showMessage({
    //                 text: 'Importante: Os prazos de entrega para a cidade do Rio de Janeiro podem sofrer atrasos durante as Olimpíadas, uma vez que muitas vias estão interditadas.',
    //                 status: 'info'
    //             });
    //         }
    //     }
    // };

    this.init();

    $(window)
        .on('orderFormUpdated.vtex', this.orderFormUpdated)
        .on('orderPlacedReady.vtex', this.orderPlacedUpdated);

});

/*$(window).on('stateUpdated.vtex', function (a, b, c) {
	console.log(a, b, c);
});*/

/*if( window.router ) {
	window.router.state.subscribe(function(newValue, b) {
		console.log('router', newValue, b);
	});
}*/
