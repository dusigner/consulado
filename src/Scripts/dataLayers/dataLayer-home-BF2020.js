import {
    pushDataLayer
} from 'modules/_datalayer-inline';

Nitro.module('dataLayer-home-bf-2020', function () {

    this.init = () => {
        this.dataLayerVitrineTop10();
        this.dataLayerTabsParcelas();
    };

    this.dataLayerTabsParcelas = () => {
        $('.vitrine-ofertas-interesses .discount-item').on('click', function () {
            let option = $(this).text().split('R$')
            option = option[1].split(',');
            pushDataLayer(
                'black_friday_2020',
                'home_vitrine_compra_parcelada',
                `click_alavanca_ate_${option[0]}_reais`
            );
        })

        $('.vitrine-ofertas-interesses .box-produto').on('click', function () {
            let itemIdex = $(this).parent().attr('data-slick-index');
            let itemSKU = $(this).attr('data-idproduto');
            let priceTab = $('.vitrine-ofertas-interesses .discount-item.active').text().split('R$');
            priceTab = priceTab[1].split(',');

            pushDataLayer(
                'black_friday_2020',
                'home_vitrine_compra_parcelada',
                `click_vitrine_posicao_${itemIdex}`
            );

            pushDataLayer(
                'black_friday_2020',
                'home_vitrine_compra_parcelada',
                `click_vitrine_ate_${priceTab[0]}_produto_${itemSKU}`
            );
        })
    }

    this.dataLayerVitrineTop10 = () => {

        $('.moduleTop10 .box-produto').on('click', function () {

            const slideIndex = $(this).parent().attr('data-slick-index');

            const getSKU = $(this).attr('data-idproduto');

            pushDataLayer(
                'black_friday_2020',
                'home_top10_ofertas',
                `click_posicao_${slideIndex}`
            );

            pushDataLayer(
                'black_friday_2020',
                'home_top10_ofertas',
                `click_produto_${getSKU}`
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
