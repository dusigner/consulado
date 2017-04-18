/* global $: true, Nitro: true, dust: true, dust: true, _: true, vtexjs:true */
'use strict';

require('../../templates/checkout.recurrenceSteps.html');

Nitro.module('checkout.recurrence', function() {

    var self = this;

    this.setup = function() {
        console.log('here', self.orderForm);
        self.link();
    };

    this.selectHasRecurrence = function(attachmentOfferings) {
        var hasRecurrence = false;

        $.each(attachmentOfferings, function(i, v) {
            if(v.name.indexOf('Recorrência') !== -1) {
                hasRecurrence = true;
            }
        });

        return hasRecurrence;
    };

    this.link = function() {
        $.each(self.orderForm.items, function(i, v) {
            var $self = $($('.product-item').get(i)),
                $selfService = $self.find('.add-item-attachment'),
                $currentLink = $self.find('.recurrence__link'),
                templateData = {};

            if ($currentLink.length === 0 && self.selectHasRecurrence(v.attachmentOfferings)) {
                var attachmentRecurrence = $.grep(v.attachmentOfferings, function(v, i){
                    return v.name === 'Recorrência';
                });

                templateData.index = i;
                templateData.period = attachmentRecurrence[0].schema.periodo.domain;


                dust.render('checkout.recurrenceSteps', templateData, function(err, out) {
                    if (err) {
                        throw new Error('Recurrence Dust error: ' + err);
                    }

                    $self.find('.add-item-attachment-container').append(out);

                    $('.recurrence__link').click(self.cta);
                    $('.js-recurrence-nav').click(self.changeStep);
                    $('.recurrence__select').click(function() {
                        $(this).toggleClass('recurrence__select--drop');
                        $(this).find('.recurrence__select--items').toggle();
                    });
                });
            }
        });
    };

    this.changeStep = function() {
        var $self = $(this),
            nextStep = $self.data('go');

        $('.recurrence__step').addClass('hide');
        $('.recurrence__step--' + nextStep).removeClass('hide');
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
