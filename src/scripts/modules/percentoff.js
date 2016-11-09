/* global $: true, Nitro: true, _: true */
'use strict';

Nitro.module('percentoff', function() {


    $('.box-produto:not(.list-percent)').each(function() {
        var self = $(this),
            valPercentage = self.data('percent'),
            txtPercentage = self.find('.off'),
            valProd = self.find('.por .val').text().replace('R$ ', '').replace('.', '').replace(',', '.'),
            promoDiscountBoleto = {},
            promoDiscountCartao = {},
            percentage;
        promoDiscountBoleto.value = [0];
        promoDiscountCartao.value = [0];

        self.find('.FlagsHightLight [class*="boleto"]').each(function(i, e) {
            var promoName = $(e).text();
            var promoValue = parseInt(promoName.match(/\d+/ig));
            if (!isNaN(promoValue) && promoValue > 0) {
                promoDiscountBoleto.value.push(promoValue);
            }
        });

        self.find('.FlagsHightLight [class*="cartao"]').each(function(i, e) {
            var promoName2 = $(e).text();
            var promoValue2 = parseInt(promoName2.match(/\d+/ig));
            if (!isNaN(promoValue2) && promoValue2 > 0) {
                promoDiscountCartao.value.push(promoValue2);
            }
        });

        var cmcDiscountBoleto = promoDiscountBoleto.value.reduce(function(prev, curr) {
            return prev + curr;
        });

        var cmcDiscountCartao = promoDiscountCartao.value.reduce(function(prev, curr) {
            return prev + curr;
        });

        if (valPercentage !== null && valPercentage !== 0) {
            percentage = Math.floor(parseFloat(valPercentage.replace(',', '.').replace(' ', '').replace('%', '')));
            if (percentage >= 20) {
                txtPercentage.text(percentage + '% OFF').show();
            }
        }

        // var total = parseFloat($(this).data('price').replace('R$ ', '').replace('.', '').replace(',', '.'));
        // $(this).find('span').text( $.formatNumber( total * (1 - discount) ) ).end().addClass('on');


        if (cmcDiscountCartao >= cmcDiscountBoleto) {
            self.find('.discount-boleto')
                .text('1x no cartão de crédito: R$ ' + _.formatCurrency(valProd - (valProd * (cmcDiscountCartao / 100))));
        }else {
            self.find('.discount-boleto')
                .text('R$ ' + _.formatCurrency(valProd - (valProd * (cmcDiscountBoleto / 100))) + ' à vista no boleto');
        }

        self.addClass('list-percent');
    });

});
