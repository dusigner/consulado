(function (window, document) {

    "use strict";

    function getIndexSlick() {
        const html_banners = document.querySelectorAll('.box-banner');
        window.dataLayer_banners = window.dataLayer_banners || [];
        const banner;
        const id;
        const canPersist;
        const position = 0;
        if (html_banners) {
            for (const i = 0, max = html_banners.length; i < max; i += 1) {
                banner = html_banners[i].querySelector('img');
                if (banner && html_banners[i].offsetHeight > 0 && !(html_banners[i].classList.contains('slick-cloned'))) {
                    html_banners[i].querySelector('a').addEventListener('mousedown', function (event) {
                        window.dataLayer = window.dataLayer || [];
                        const banner,
                            infoIndex,
                            id = this.querySelector('img').getAttribute('src').split('/')[5];

                        for (const j = 0, max_dataLayer = window.dataLayer.length; j < max_dataLayer; j += 1) {
                            if (window.dataLayer[j].page) {
                                if (window.dataLayer[j].page.infoIndex) {
                                    infoIndex = window.dataLayer[j].page.infoIndex;
                                    for (const k = 0, max_impressioninfoIndex = infoIndex.length; k < max_impressioninfoIndex; k += 1) {
                                        if (infoIndex[k].id === id) {
                                            banner = infoIndex[k];
                                            break;
                                        }
                                    }
                                    break;
                                }
                            }
                        }
                        window.dataLayer.push({
                            'event': 'generic',
                            'infoIndex': [banner]
                        });
                    });
                    id = banner.getAttribute('src').split('/')[5];
                    canPersist = true;
                    for (const db = 0, max_db = window.dataLayer_banners.length; db < max_db; db += 1) {
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
        init();
        getIndexSlick();
    }

})(window, document);
