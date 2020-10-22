import {
    checkInlineDatalayers,
    pushDataLayer
} from 'modules/_datalayer-inline';

Nitro.module('dataLayer-captacao-lead-pdp', function () {

    this.init = () => {
        checkInlineDatalayers();

        this.captureLead();
        this.captureLead();
    };

    this.captureLead = () => {
        $('.content').find('#email').on('click', function () {
            pushDataLayer(
                'black_friday_2020',
                'pdp_captação_lead',
                'click_digitacao'
            );
        });

        $('.content').find('.cta.cta--gray').on('click', function () {
            pushDataLayer(
                'black_friday_2020',
                'pdp_captação_lead',
                'click_cadastrar'
            );
        });

        $('form').on('submit', function () {
            pushDataLayer(
                'black_friday_2020',
                'pdp_captação_lead',
                'click_email_cadastrado'
            );
        });
    }

    this.captureSku = () => {
        const getParams = (name, href) => {

            if (!name) return false;

            href = href || window.location.href;
            name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");

            const regexS = "[\\?&]" + name + "=([^&#]*)";
            const regex = new RegExp(regexS);
            const results = regex.exec(href);

            if (results == null)
                return "";
            else
                return decodeURIComponent(results[1].replace(/\+/g, " "));
        }

        //return skuId in url
        const getSkuJson = () => {
            const url = $('.buy-button-ref').attr('href')
            return getParams('sku', url)
        }

        $('form').on('submit', function () {
            pushDataLayer(
                'black_friday_2020',
                'pdp_captação_lead_SKU',
                `${getSkuJson}`
            );
        });
    },

        this.init();
});
