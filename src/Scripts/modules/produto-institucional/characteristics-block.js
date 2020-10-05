'use strict';

Nitro.module('characteristics', function () {

	this.init = function () {
        this.handleChangeImage();
        this.seeMoreDescription();
        this.dataLayerFeaturesInstitutional();
	};

	this.handleChangeImage = () => {
        let pathImage;
        let button = $('.characteristics-block__image .image-buttons .image-buttons__item');
        let textDescription = $('.characteristics-block__text .product-description');

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

    this.dataLayerFeaturesInstitutional = () => {
        let button = $('.characteristics-block__image .image-buttons .image-buttons__item');
        $(button).on('click', function(){
            let option = $(this).find('span').text().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\-]+/g, '_').toLowerCase();
            dataLayer.push({
                event: 'generic',
                category: 'PDP_institucional',
                action: 'features ',
                label: `veja_mais_${option}`
            })
        })

        $(button).mouseover(function() {
            let option = $(this).find('span').text().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\-]+/g, '_').toLowerCase();
            dataLayer.push({
                event: 'generic',
                category: 'PDP_institucional',
                action: 'features ',
                label: `veja_mais_${option}`
            })
        });

        // Viability DataLayer

        var firstFeaturesInstitucional = true;
	    var intervalFeaturesInstitucional = null;

        $(window).on('scroll', function () {
            setTimeout(function () {
                // Features
                if (firstFeaturesInstitucional && $('#caracteristicas-lp').isOnScreen(1, 0.5)) {
                    var counter = 0;

                    intervalFeaturesInstitucional = setInterval(function () {
                        counter++;
                        if (counter >= 12) {
                            clearInterval(intervalFeaturesInstitucional);
                            return;
                        } else {
                            if (
                                counter == 1 &&
                                $('#caracteristicas-lp').isOnScreen(1, 0.5)
                            ) {
                                dataLayer.push({
                                    event: 'generic',
                                    category: 'PDP_institucional',
                                    action: 'features ',
                                    label: 'viability_features_1_segundo'
                                })
                            } else if (
                                counter == 4 &&
                                $('#caracteristicas-lp').isOnScreen(1, 0.5)
                            ) {
                                dataLayer.push({
                                    event: 'generic',
                                    category: 'PDP_institucional',
                                    action: 'features ',
                                    label: 'viability_features_4_segundos'
                                })
                            } else if (
                                counter == 10 &&
                                $('#caracteristicas-lp').isOnScreen(1, 0.5)
                            ) {
                                dataLayer.push({
                                    event: 'generic',
                                    category: 'PDP_institucional',
                                    action: 'features ',
                                    label: 'viability_features_10_segundos'
                                })
                            }
                        }
                    }, 1000);

                    firstFeaturesInstitucional = false;
                }

                if ($('#caracteristicas-lp')[0].getBoundingClientRect().bottom < 0) {
                    clearInterval(intervalFeaturesInstitucional);
                }
            }, 500);
        });

        // Viability DataLayer

    }

	this.init();
});
