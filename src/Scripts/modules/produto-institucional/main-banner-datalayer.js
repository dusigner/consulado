'use strict'

Nitro.module('main-banner-datalayer', function() {

    this.init = () => {
		this.mainBannerDataLayer();
    };

	this.mainBannerDataLayer = () => {
        // CTA DataLayer
        $('.main-banner__text .cta').on('click', function(){
            dataLayer.push({
                event: 'generic',
                category: 'PDP_institucional',
                action: 'banner_principal_pdp ',
                label: 'clique_botão_descubra_mais '
            })
        })
        // CTA DataLayer

        // Viability DataLayer
        var firstMainBannerPDPInstitucional = true;
        var intervalMainBannerPDPInstitucional = null;

        $(window).on('scroll', function () {
            setTimeout(function () {
                // Features
                if (firstMainBannerPDPInstitucional && $('#main-banner-lp').isOnScreen(1, 0.5)) {
                    var counter = 0;

                    intervalMainBannerPDPInstitucional = setInterval(function () {
                        counter++;
                        if (counter >= 12) {
                            clearInterval(intervalMainBannerPDPInstitucional);
                            return;
                        } else {
                            if (
                                counter == 1 &&
                                $('#main-banner-lp').isOnScreen(1, 0.5)
                            ) {
                                dataLayer.push({
                                    event: 'generic',
                                    category: 'PDP_institucional',
                                    action: 'banner_principal_pdp ',
                                    label: 'viability_1_segundo'
                                })
                            } else if (
                                counter == 4 &&
                                $('#main-banner-lp').isOnScreen(1, 0.5)
                            ) {
                                dataLayer.push({
                                    event: 'generic',
                                    category: 'PDP_institucional',
                                    action: 'banner_principal_pdp ',
                                    label: 'viability_4_segundos'
                                })
                            } else if (
                                counter == 10 &&
                                $('#main-banner-lp').isOnScreen(1, 0.5)
                            ) {
                                dataLayer.push({
                                    event: 'generic',
                                    category: 'PDP_institucional',
                                    action: 'banner_principal_pdp ',
                                    label: 'viability_10_segundos'
                                })
                            }
                        }
                    }, 1000);

                    firstMainBannerPDPInstitucional = false;
                }

                if ($('#main-banner-lp')[0].getBoundingClientRect().bottom < 0) {
                    clearInterval(intervalMainBannerPDPInstitucional);
                }
            }, 500);
        });

        // Viability DataLayer
	};

	this.init();
});
