'use strict';

Nitro.module('characteristics', function () {

	this.init = function () {
		this.handleChangeImage();
	};

	this.handleChangeImage = () => {
        let pathImage;
        let button = $('.characteristics-block__image .image-buttons .image-buttons__item')
        $(button).on('click', function(){
            if ($(button).hasClass('is-active')) {
                $(button).removeClass('is-active')
            }
            $(this).addClass('is-active')
            pathImage = $(this).attr('data-image');
            $('.characteristics-block__image img').attr('src', `/arquivos/${pathImage}`);
        })
    }

	this.init();
});
