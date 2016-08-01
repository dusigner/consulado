require('modules/store/vtex-login');

var CRM = require('modules/store/crm');


Nitro.module('login.url', ['vtex-login'], function(vtexLogin) {

    'use strict';

    this.setup = function() {

        if (_.urlParams().login) {

            CRM.clientSearchByEmail(_.urlParams().login)
                .done(function(userData) {
                    vtexLogin.setup(userData);
                });

        } else if (_.urlParams().id) {

            CRM.clientSearchByID(_.urlParams().id)
                .done(function(userData) {
                    vtexLogin.setup(userData);
                });

        }
    };

    this.setup();

});
