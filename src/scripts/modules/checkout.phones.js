/* global $: true, Nitro: true */

require('vendors/jquery.inputmask');

/*jshint strict: false */
var CRM = require('modules/store/crm');

Nitro.module('checkout.phones', function() {

    'use strict';

    var self = this,
        $formPhones = $('#formPhones'),
        $submit = $formPhones.find('[type="submit"]'),
        $inputsPhones = $formPhones.find('input[type="tel"]'),
        $inputHorario = $formPhones.find('input[name="horarios"]');

    this.setup = function() {

        $inputsPhones.inputmask('(99) 9999[9]-9999');

        CRM.clientSearchByEmail(self.getEmailClient())
            .done(self.fillPhones)
            .always(function() {
                $('#modal-more-phones').modal({
                    backdrop: 'static'
                });
            });

        $formPhones.submit(this.submit);
    };

    this.getEmailClient = function() {

        if (!self.clientEmail) {
            self.clientEmail = $('.orderplaced-sending-email strong').text().replace(/\s+/g, '');
        }

        return self.clientEmail;
    };

    this.fillPhones = function(data) {

        if (data) {

            if (data.phone) {
                $inputsPhones.filter('[name="phone"]').val(data.phone.replace('+55', ''));
            }

            if (data.xAdditionalPhone) {
                $inputsPhones.filter('[name="xAdditionalPhone"]').val(data.xAdditionalPhone.replace('+55', ''));
            }

        }

    };

    this.validateForm = function() {

        var valid = false;
        $('.alert-danger').removeClass('active');

        if ($inputsPhones.filter(':blank').length <= 1 && $inputHorario.is(':checked')) {
            valid = true;
        } else {
            if ($inputsPhones.filter(':blank').length > 1) {
                $('.phone-error-message').addClass('active');
            } else {
                $('.phone-error-message').removeClass('active');
            }

            if (!$inputHorario.is(':checked')) {
                $('.turnoLigacao-error-message').addClass('active');
            } else {
                $('.turnoLigacao-error-message').removeClass('active');
            }
        }

        if (valid) {
            $submit.addClass('icon-loading');
        }

        return valid;
    };

    this.submit = function(e) {
        e.preventDefault();

        if (self.validateForm()) {

            var data = {};

            $.map($inputsPhones, function(x) {
                if (!x.value || x.value === '') return;
                data[x.name] = x.value;
            });

            data.turnoLigacao = $inputHorario.filter(':checked').val();

            data.email = self.getEmailClient();

            CRM.insertClient(data)
                .then(function() {
                    $formPhones.find('.data, .default-message').hide();
                    $formPhones.find('.messages,.success-message').fadeIn();

                    setTimeout(function() {
                        $('#modal-more-phones').modal('hide');
                    }, 2000);
                })
                .fail(function() {
                    $submit.removeClass('icon-loading');
                });

        }
    };

});
