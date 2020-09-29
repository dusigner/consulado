/* global $: true, Nitro: true, dust: true */

'use strict';

Nitro.module('beneficios', function() {
    var self = this;
    self.init = () => {
        this.toggleVideoIframe();
    }

    self.toggleVideoIframe = () => {
        $('.benefits__item .title').on('click', function(){
            if($('.benefits__item').hasClass('is-active')){
                $('.benefits__item').removeClass('is-active')
                $('.title').removeClass('is-active')
                $('.accordion').css('display', 'none')
            }
            let dataVideo = $(this).attr('data-video');
            $(this).parent().toggleClass('is-active')
            $(this).toggleClass('is-active');
            $(this).parent().find('.accordion').slideToggle();

            $('.container-benefits .videos iframe').attr('src', dataVideo)
        });
    }

    self.init();


});
