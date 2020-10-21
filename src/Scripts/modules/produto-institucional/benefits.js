/* global $: true, Nitro: true, dust: true */

'use strict';

Nitro.module('beneficios', function() {
    var self = this;
    self.init = () => {
        this.toggleVideoIframe();
        this.benefitsTagsGA();
    };

    self.toggleVideoIframe = () => {
        $('.benefits__item .title').on('click', function(){
            if($('.benefits__item').hasClass('is-active')){
                $('.benefits__item').removeClass('is-active')
                $('.title').removeClass('is-active')
                $('.accordion').css('display', 'none')
            }
            $(this).parent().toggleClass('is-active')
            $(this).toggleClass('is-active');
            $(this).parent().find('.accordion').slideToggle();

        });
    };

    self.benefitsTagsGA = () => {
        $('.benefits__item .title').on('click', function(){
            let benefitOption = $(this).text().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\-]+/g, '_').toLowerCase();
            dataLayer.push({
                event: 'generic',
                category: 'PDP_institucional',
                action: 'beneficios',
                label: benefitOption
            })
        });
    }

    self.init();


});
