/* global $: true, Nitro: true, dust: true, dust: true, _: true, vtexjs:true */
'use strict';

Nitro.module('checkout.recurrence', function() {

    var self = this;

    this.setup = function() {
        console.log('here', self.orderForm);
        self.link();
    };

    this.selectHasWarranty = function($select) {
        var hasWarranty = false;

        $select.each(function() {
            if($(this).text().indexOf('Recorrência') !== -1) {
                hasWarranty = true;
            }
        });

        return hasWarranty;
    };

    this.link = function() {
        var $link = $('<a href="#" class="primary-button text-uppercase link-recurrence">Adicionar Compra Recorrente</a>');

        $('.product-item').each(function(i) {
            var $self = $(this),
                $selfService = $(this).find('.add-item-attachment'),
                $currentLink = $self.find('.link-recurrence'),
                $currentServices = $self.nextUntil('.product-item');

            if ($currentLink.length === 0 && self.selectHasWarranty($selfService)) {
                $link.clone()
                    .appendTo('.add-item-attachment-container')
                    .attr('data-index', i)
                    .on('click', function() { alert(0); });
            }
        });
    };

});

/*jshint strict: false */
dust.filters.intAsCurrency = function(value) {
    return _.intAsCurrency(value);
};
