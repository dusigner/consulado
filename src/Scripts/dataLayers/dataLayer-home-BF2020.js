import {
    checkInlineDatalayers,
    pushDataLayer
} from 'modules/_datalayer-inline';


Nitro.module('dataLayer-home-bf-2020', function () {


    this.init = () => {
        checkInlineDatalayers

        this.dataLayerVitrineTop10();
    };


    this.dataLayerVitrineTop10 = () => {

        $('.module-top10 .box-produto').on('click', function () {

            const itemIdex = $(this).parent().attr('data-slick-index');

            const itemSKU = $(this).attr('data-idproduto');

            pushDataLayer(
                'black_friday_2020',
                'home_top10_ofertas',
                `click_posicao_${itemIdex}`
            );

            pushDataLayer(
                'black_friday_2020',
                'home_top10_ofertas',
                `click_produto_${itemSKU}`
            );

            const nameSelo = $(this).find('.promo-destaque__text').text().trim().replace('\n\t\t\t\t\t', '');

            pushDataLayer(
                'black_friday_2020',
                'home_top10_ofertas',
                `click_selos_${nameSelo}`
            );
        })
    }

    this.init();
});
