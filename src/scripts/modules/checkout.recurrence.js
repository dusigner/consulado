/* global $: true, Nitro: true, dust: true, dust: true, _: true, vtexjs:true */
'use strict';

Nitro.module('checkout.recurrence', function() {

    var self = this;

    this.setup = function() {
        console.log('here', self.orderForm);
        self.link();
    };

    this.selectHasRecurrence = function($select) {
        var hasRecurrence = false;

        $select.each(function() {
            if($(this).text().indexOf('Recorrência') !== -1) {
                hasRecurrence = true;
            }
        });

        return hasRecurrence;
    };

    this.link = function() {
        var linkTemplate = '<div class="recurrence">' +
                                '<div class="recurrence__step recurrence__step--one">' +
                                    '   <a href="#" class="primary-button text-uppercase recurrence__link" data-index={index}>Adicionar Compra Recorrente</a>' +
                                    '   <div class="recurrence__tip-container">' +
                                    '       <div class="recurrence__doubt">?' +
                                    '           <div class="recurrence__tip">' +
                                                    '<p>A compra recorrente permite que o produto selecionado seja comprado automaticamente no intervalo de tempo selecionado. Dessa forma você não precisa se preocupar em comprar toda vez que estiver próximo ao vencimento.</p>' +
                                                    '<p>Você poderá pausar ou cancelar a qualquer momento em "meus pedidos".</p>' +
                                                    '<p><strong>Atenção: A recorrência só pode ser ativada caso o meio de pagamento seja cartão de crédito. Caso haja reajuste no valor do produto, você será informado por e-mail.</strong></p> ' +
                                                '</div>' +
                                    '       </div>' +
                                    '   </div>' +
                                '</div>' +
                            '</div>';

        $('.product-item').each(function(i) {
            var $self = $(this),
                $selfService = $(this).find('.add-item-attachment'),
                $currentLink = $self.find('.recurrence__link');

            if ($currentLink.length === 0 && self.selectHasRecurrence($selfService)) {
                $('.add-item-attachment-container').append(linkTemplate.render({index: i}));

                $('.recurrence__link').click(self.cta);
            }
        });
    };

    this.changeStep = function() {
    };

    this.cta = function() {
        var $self = $(this);
        alert($self.data('index'));
    };

});

/*jshint strict: false */
dust.filters.intAsCurrency = function(value) {
    return _.intAsCurrency(value);
};
