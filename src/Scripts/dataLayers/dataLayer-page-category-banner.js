(function (window, document) {

    "use strict";

    function getIndexSlick() {
        var html_banners = document.querySelectorAll('.box-banner');
        window.dataLayer_banners = window.dataLayer_banners || [];
        var banner;
        var id;
        var canPersist;
        var position = 0;
        if (html_banners) {
            for (var i = 0, max = html_banners.length; i < max; i += 1) {
                banner = html_banners[i].querySelector('img');
                if (banner && html_banners[i].offsetHeight > 0 && !(html_banners[i].classList.contains('slick-cloned'))) {
                    html_banners[i].querySelector('a').addEventListener('mousedown', function (event) {
                        window.dataLayer = window.dataLayer || [];
                        var banner,
                            promos,
                            id = this.querySelector('img').getAttribute('src').split('/')[5];

                        for (var j = 0, max_dataLayer = window.dataLayer.length; j < max_dataLayer; j += 1) {
                            if (window.dataLayer[j].page) {
                                if (window.dataLayer[j].page.promos) {
                                    promos = window.dataLayer[j].page.promos;
                                    for (var k = 0, max_impressionPromos = promos.length; k < max_impressionPromos; k += 1) {
                                        if (promos[k].id === id) {
                                            banner = promos[k];
                                            break;
                                        }
                                    }
                                    break;
                                }
                            }
                        }
                        window.dataLayer.push({
                            'event': 'generic',
                            'promos': [banner]
                        });
                    });
                    id = banner.getAttribute('src').split('/')[5];
                    canPersist = true;
                    for (var db = 0, max_db = window.dataLayer_banners.length; db < max_db; db += 1) {
                        if (window.dataLayer_banners[db].id && (window.dataLayer_banners[db].id === id)) {
                            canPersist = false;
                        }
                    }
                    if (canPersist) {
                        window.dataLayer_banners.push({
                            'id': id,
                            'name': banner.getAttribute('alt'),
                            'creative': banner.getAttribute('src').split('/')[6].split('.')[0],
                            'position': (position + 1)
                        });
                        position += 1;
                    }
                }
            }
        }
    }

    window.onload = function () {
        // init();
        getIndexSlick();
    }

})(window, document);
