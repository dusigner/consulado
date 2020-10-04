'use strict';

Nitro.module('characteristics', function () {

	this.init = function () {
		this.handleChangeImage();
	};

	this.handleChangeImage = () => {
        let pathImage;
        let button = $('.characteristics-block__image .image-buttons .image-buttons__item');
        let textDescription = $('.characteristics-block__text .product-description');
        console.log(textDescription)
        $(button).on('click', function(){
            let buttonClicked = $(this);
            if ($(button).hasClass('is-active')) {
                $(button).removeClass('is-active')
            }

            $(buttonClicked).addClass('is-active')
            pathImage = $(buttonClicked).attr('data-image');
            $('.characteristics-block__image img').attr('src', `/arquivos/${pathImage}`);

            if($(textDescription).hasClass('is-active')) {
                $(textDescription).removeClass('is-active')
            }

            $.map(textDescription, function(item){
                let itemId = item.getAttribute('id')
                if($(buttonClicked).attr('data-option') === itemId) {
                    $(item).toggleClass('is-active');
                }
            })

        });
    }

	this.init();
});
