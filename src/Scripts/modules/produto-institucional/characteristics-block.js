'use strict';

Nitro.module('characteristics', function () {

	this.init = function () {
        this.handleChangeImage();
        this.seeMoreDescription();
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

    this.seeMoreDescription = () => {
        $('.product-characteristics-see-more').on('click', function(){

            $(this).toggleClass('is-open');

            $(this).parent().find('.product-characteristics-description').toggleClass('is-open');

            if($(this).text() === 'LEIA MAIS') {
                $(this).text('LEIA MENOS')
            } else {
                $(this).text('LEIA MAIS')
            }
        })
    }

	this.init();
});
