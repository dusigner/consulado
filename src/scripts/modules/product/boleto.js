/* global $: true, Nitro: true, dust:true, _:true */

require('../../../templates/price.html');

Nitro.module('boleto', function() {

    'use strict';

    var promoDiscount = {};
    promoDiscount.value = [0];

    $('.prod-selos:first').find('[class*="boleto"]').each(function(i, e) {
        var promoName = $(e).text();
        var promoValue = parseInt(promoName.match(/\d+/ig));
        if (!isNaN(promoValue) && promoValue > 0) {
            promoDiscount.value.push(promoValue);
        }
    });


    var cmcDiscount = promoDiscount.value.reduce(function(prev, curr) {
        return prev + curr;
    });

    var priceCash = function(price) {
        return _.intAsCurrency(price - (price * (cmcDiscount / 100)));
    };

    var appendOff = function(el, value) {
        el.after('<span> ' + value + '% OFF</span>');
    };

    //create helper function for price template
    dust.filters.priceCash = priceCash;

    //% OFF TEXTO PREÇO
    var $prodPreco = $('.prod-preco'),
        prodAvailable = $.grep(window.skuJson.skus, function(n) {
            return n.available;
        }),
        valPercentage;

    $.each(window.skuJson.skus, function(i, sku) {

        sku.valPercentage = sku.cashPercentage = false;

        if (sku.available && sku.listPrice > sku.bestPrice) {
            valPercentage = Math.floor((sku.listPrice - sku.bestPrice) / sku.listPrice * 100);

            if (valPercentage >= 20) {
                sku.valPercentage = valPercentage;
                sku.cashPercentage = valPercentage + cmcDiscount;
            }
        }
    });

    if ($prodPreco.find('.valor-de').length > 0 && prodAvailable[0].valPercentage >= 20) {
        appendOff($('.skuBestInstallmentValue'), prodAvailable[0].valPercentage);
    }

    // A VISTA NO BOLETO
    $('.discount-boleto, .skuPrice').remove();

    $(document).on('skuSelected.vtex', function(e, productId, sku) {
        $('.discount-boleto, .skuPrice').remove();
        if (sku.available) {
            var boletoInfo = '<p class="discount-boleto"><span class="bloco"><span class="gray">ou</span> à vista no boleto</span><span></span><span class="gray">, por</span> ' + priceCash(sku.bestPrice) + '</p>';
            $('.prod-preco').append(boletoInfo);
        }
    });

    if (prodAvailable.length > 0) {
        var isDiscountOff = (cmcDiscount > 0) ? ' (' + cmcDiscount + '% OFF)' : '';
        var boletoInfo = '<p class="discount-boleto"><span class="bloco"><span class="gray">ou</span> à vista no boleto</span><span>' + isDiscountOff + '</span><span class="gray">, por</span> ' + priceCash(prodAvailable[0].bestPrice) + '</p>';
        $('.prod-preco').append(boletoInfo);

        /*
         * oh yeah, vtex hack!
         * template price.html has more variables, but price plugin doesn't
         * get data from global sku, so this overhide the plugin function.
         */
        var price = $('.plugin-preco').data('price');

        if (price) {
            var getSku = price.getSku;

            price.getSku = function() {
                var sku = getSku();

                sku.valPercentage = prodAvailable[0].valPercentage;
                sku.cashPercentage = prodAvailable[0].cashPercentage;

                return sku;
            };
        }
    }
});
