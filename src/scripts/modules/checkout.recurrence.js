/* global $: true, Nitro: true, dust: true, dust: true, _: true, vtexjs:true */
'use strict';

require('../../templates/checkout.recurrenceSteps.html');

Nitro.module('checkout.recurrence', function() {

    var self = this;

    //WHY?!
    this.setup = function() {
        self.render();
    };

    /*
     * Verifica se existe alguma oferta de recorrência no produto
     * @param {Object} orderform.items[array].attachmentOfferings
     * @return {Boolean}
     */
    this.selectHasRecurrence = function(attachmentOfferings) {
        var hasRecurrence = false;

        $.each(attachmentOfferings, function(i, v) {
            if(v.name.indexOf('Recorrência') !== -1) {
                hasRecurrence = true;
                return false;
            }
        });

        return hasRecurrence;
    };

    /*
     * Verifica se existe alguma recorrência selecionada/ativa no produto
     * @param {Object} orderform.items[array].attachments
     * @return {Boolean}
     */
    this.hasActiveRecurrence = function(attachments) {
        var hasActiveRecurrence = false;

        $.each(attachments, function(i, v) {
            if(v.name.indexOf('Recorrência') !== -1) {
                hasActiveRecurrence = true;
                return false;
            }
        });

        return hasActiveRecurrence;
    };

    /*
     * Renderiza na tela o componente completo (3 passos) de recorrência
     */
    this.render = function() {
        $.each(self.orderForm.items, function(i, v) {
            var $self = $($('.product-item').get(i)), //seleciona table>tr do produto no html
                $attachmentContainer = $self.find('.add-item-attachment-container'), //container que deve renderizar o componente
                $currentContainer = $self.find('.recurrence__link'),
                templateData = {}, //objeto com dados p/ renderizar
                hasActiveRecurrence = self.hasActiveRecurrence(v.attachments);

            if(self.selectHasRecurrence(v.attachmentOfferings)) {
                //previne renderizar o modulo mais de uma vez
                if($currentContainer.length > 0) {
                    return false;
                }

                //seleciona objeto de recorrência
                var attachmentRecurrence = $.grep(v.attachmentOfferings, function(v){
                    return v.name === 'Recorrência';
                });

                if(hasActiveRecurrence) {
                    var selectedRecurrence = $.grep(v.attachments, function(v){
                        return v.name === 'Recorrência';
                    });

                    templateData.hasActiveRecurrence = hasActiveRecurrence;
                    templateData.selectedRecurrence = selectedRecurrence[0].content.periodo;
                }

                templateData.index = i;
                templateData.period = attachmentRecurrence[0].schema.periodo.domain;

                if($attachmentContainer.length === 0) {
                    $self.find('.product-name').append('<div class="add-item-attachment-container"></div>');
                }


                dust.render('checkout.recurrenceSteps', templateData, function(err, out) {
                    if (err) {
                        throw new Error('Recurrence Dust error: ' + err);
                    }

                    $attachmentContainer.append(out);

                    if(hasActiveRecurrence) {
                        self.changeStep('three');
                    }

                    self.events();

                });
            }
        });
    };

    /*
     * Eventos de cliques/acções dos botões do módulo recorrência
     */
    this.events = function() {
        $('.js-recurrence-nav').click(self.changeStep);

        //dropdown/select de periodo
        $('.recurrence__select').click(function() {
            $(this).toggleClass('recurrence__select--drop');
            $(this).find('.recurrence__select--items').toggle();
        });

        //escolha do periodo
        $('.recurrence__select--item a').click(function(e) {
            e.preventDefault();
            e.stopPropagation();

            var $self = $(this),
                periodText = $self.text();

            $self.parents('.recurrence').find('.recurrence__select--active span').text(periodText);

            $self.parents('.recurrence__select').click();
        });

        $('.js-recurrence-add').click(function() {
            self.actionsAttachment($(this), function(item, content) {
                vtexjs.checkout.addItemAttachment(item, 'Recorrência', content);
            });
        });

        $('.js-recurrence-remove').click(function() {
            self.actionsAttachment($(this), function(item, content) {
                vtexjs.checkout.removeItemAttachment(item, 'Recorrência', content);
            });
        });
    };

    /*
     * Troca de passo na interface de recorrência, verifica se foi um clique em um botão com parâmetro (ex.: [data-go="one"]), ou se é para um passo fixo.
     * @param {String['one', 'two', 'three']} or {Object}
     */
    this.changeStep = function(step) {
        var $self = $(this),
            nextStep = (typeof step === 'object' ) ? $self.data('go') : step;

        $('.recurrence__step').addClass('hide');
        $('.recurrence__step--' + nextStep).removeClass('hide');
    };

    /*
     * Ações de recorrência no orderForm com base nos dados passados do componente
     * @param elem {Object} seletor jquery do botão clicado
     * @param callback {Function} função callback que executará a ação final
     *  *para adicionar recorrência através do método "vtexjs.checkout.addItemAttachment" do orderForm (https://github.com/vtex/vtex.js/tree/master/docs/checkout#additemattachmentitemindex-attachmentname-content-expectedorderformsections-splititem)
     *  *para remover recorrência através do método "vtexjs.checkout.removeItemAttachment" do orderForm (https://github.com/vtex/vtex.js/tree/master/docs/checkout#removeitemattachmentitemindex-attachmentname-content-expectedorderformsections)
     */
    this.actionsAttachment = function(elem, callback) {
        var $self = elem,
            item = $self.data('index'),
            currentPeriod = $self.parents('.recurrence').find(' .recurrence__select--active span').text(),
            content = { periodo: currentPeriod };

        $self.siblings('.loading-text').removeClass('hide');

        return callback(item, content);
    };

    this.hidePayments = function() {
        $.each(self.orderForm.items, function(i, v) {
            if(self.hasActiveRecurrence(v.attachments)){
                $('.payment-group-item:not(#payment-group-creditCardPaymentGroup)').addClass('hide');
                return false;
            }
        });
    };

});

/*jshint strict: false */
dust.filters.intAsCurrency = function(value) {
    return _.intAsCurrency(value);
};
