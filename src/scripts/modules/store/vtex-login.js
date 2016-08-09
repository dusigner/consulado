/* global $: true, Nitro: true */
'use strict';

Nitro.module('vtex-login', function() {


    var self = this;

    this.setup = function(userData) {

        window.vtexjs.checkout.getOrderForm().done(function(orderForm) {
            self.setClientProfileData(orderForm, userData);
        });

    };

    this.setClientProfileData = function(orderForm, userData) {

        if (orderForm.clientProfileData && orderForm.clientProfileData.email) {
            return $.Deferred;  
        }

        var clientProfileData = $.extend({}, orderForm.clientProfileData, userData);

        clientProfileData.documentType = 'cpf';

        //avisar o VTEX ID que o email do cliente mudou
        window.vtexid.setEmail(clientProfileData.email);

        // levantar o evento para o script de navegação
        window.vtex.NavigationCapture.SendEvent('SendUserInfo', {
            visitorContactInfo: [clientProfileData.email, clientProfileData.firstName]
        });

        // Avisar ao Checkout qual o email do cliente
        return window.vtexjs.checkout.sendAttachment('clientProfileData', clientProfileData);
    };

});
