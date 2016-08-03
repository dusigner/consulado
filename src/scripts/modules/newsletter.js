/* global $: true, Nitro: true */
'use strict';

require('vendors/jquery.placeholder');

Nitro.module('newsletter', function() {


    var self = this,
        $newsletter = $('.form-newsletter'),
        $submit = $newsletter.find('[type="submit"]'),
        $inputs = $newsletter.find('input[type="text"], input[type="email"]'),
        $errorBox = $('<label class="error" />');

    $inputs.placeholder();

    this.validateForm = function() {

        $newsletter.find('label.error').remove();

        $inputs
            .removeClass('error')
            .one('focus', function() {
                $(this).removeClass('error').parent().find('.error').remove();
            })
            .each(function() {
                var self = $(this),
                    parent = self.parent();

                if (self.is(':blank')) {
                    self.add(parent).addClass('error');
                } else if (self.is('.email') && !self.validEmail()) {
                    self.add(parent).addClass('error');
                }
            });

        var valid = $inputs.filter('.error').length === 0;

        if (valid) {
            $submit.addClass('loading');
        }

        // console.log('valid', valid);

        return valid;
    };

    this.handleError = function() {
        self.addErrorBox($newsletter, $newsletter.data('msg-error'));
    };

    this.addErrorBox = function(target, message) {
        $errorBox.clone().appendTo(target).html(message);
    };

    $newsletter.submit(function(e) {
        e.preventDefault();

        $.ajax({
            url: $newsletter.attr('action'),
            type: $newsletter.attr('method'),
            dataType: 'html',
            data: $newsletter.serialize(),
            beforeSend: self.validateForm,
            error: self.handleError
        })
            .done(function(data) {

                if (data) {

                    $newsletter.addClass('success').html($newsletter.data('msg-success'));

                } else {
                    self.handleError();
                }
            })
            .always(function() {
                $submit.removeClass('loading');
            });
    });

});
