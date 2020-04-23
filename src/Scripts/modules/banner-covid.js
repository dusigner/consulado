'use strict';

require('../vendors/slick');

var alreadySendEvent = false

window.addBannerCovid = function() {
    const bannerDesk = `
        <div class="hide-small hide-extra-small">
            <div class="covid-shipping-guarantee">
                <div>
                    <img src="/arquivos/covid-shipping-guarantee-icon.png" alt="Icone garantia de entrega" />
                    <span>Estamos <b>entregando normalmente</b>, conheça as medidas que tomamos para sua <b>segurança</b> contra o Covid-19.</span>
                </div>
                <a href="/covid" class="saiba-mais-covid">Saiba mais</a>
            </div>
        </div>`

    const bannerMobile = `
        <div class="hide-medium hide-large hide-extra-large">
            <div class="covid-shipping-guarantee-mobile">
                <img src="/arquivos/covid-shipping-guarantee-icon.png" alt="Icone garantia de entrega" />
                <span>Estamos <b>entregando normalmente</b></span>
                <a href="/covid" class="saiba-mais-covid">Saiba mais</a>
            </div>
        </div>`

    $('body').prepend($.parseHTML(bannerDesk))
    $('header').prepend($.parseHTML(bannerMobile))

    document.querySelectorAll('.saiba-mais-covid').forEach(function(item) {
        item.addEventListener('click', () => {
            dataLayer.push({
                category: 'banner_garantia_de_entrega_covid',
                action: 'saiba_mais',
                label: 'saiba_mais_superior',
                event: 'generic'
            });
        })
    })

    function isScrolledIntoView(elem) {
        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();

        var elemTop = $(elem).offset().top;
        var elemBottom = elemTop + $(elem).height();

        return ((elemBottom - 100 <= docViewBottom) && (elemTop - 100 >= docViewTop));
    }

    document.addEventListener('scroll', function() {
        if (isScrolledIntoView(document.querySelector('.container.vitrines.covid ul li')) && !alreadySendEvent) {
            dataLayer.push({
                category: 'lp_garantia_de_entrega_covid',
                action: 'viability_sugestão_de_compra',
                label: 'o_que_voce_precisa_na_sua_casa',
                event: 'generic'
            })
            alreadySendEvent = true
        }
    })

    var ul = document.querySelector('.container.vitrines.covid ul')

    ul.addEventListener('click', function() {
        dataLayer.push({
            category: 'lp_garantia_de_entrega_covid',
            action: 'clique_produto',
            label: 'comprar',
            event: 'generic'
        })
    })

    $('.container.vitrines.covid').find('.prateleira>ul').not('.slick-initialized').slick({
        mobileFirst: false,
        slidesToShow: 3,
        slidesToScroll: 3,
        centerPadding: '10px',
        arrows: true,
        infinite: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2.1,
                    slidesToScroll: 2.1,
                    centerPadding: '30px',
                    initialSlide: 1,
                    arrows: true,
                    centerMode: true,
                    index: 0
                }
            },
            {
                breakpoint: 998,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    centerPadding: '30px',
                    arrows: true,
                    initialSlide: 0,
                    index: 0
                }
            },
            {
                breakpoint: 580,
                settings: {
                    slidesToShow: 1.3,
                    slidesToScroll: 1,
                    centerPadding: '20px',
                    initialSlide: 0,
                    arrows: true,
                    centerMode: true,
                    index: 0
                }
            },
            {
                breakpoint: 414,
                settings: {
                    slidesToShow: 1.1,
                    slidesToScroll: 1,
                    centerPadding: '24px',
                    initialSlide: 0,
                    centerMode: true,
                    arrows: true,
                    index: 0
                }
            },
            {
                breakpoint: 375,
                settings: {
                    slidesToShow: 1.1,
                    slidesToScroll: 1,
                    centerPadding: '20px',
                    initialSlide: 0,
                    centerMode: true,
                    arrows: true,
                    index: 0
                }
            }
        ]
    })
}
