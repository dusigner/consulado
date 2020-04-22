'use strict';

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

    var vitrine = document.querySelector('.container.vitrines.covid ul')

    if (vitrine) {
        dataLayer.push({
            category: 'lp_garantia_de_entrega_covid',
            action: 'viability_sugestão_de_compra',
            label: 'o_que_voce_precisa_na_sua_casa',
            event: 'generic'
        })

        vitrine.addEventListener('click', function() {
            dataLayer.push({
                category: 'lp_garantia_de_entrega_covid',
                action: 'clique_produto',
                label: 'comprar',
                event: 'generic'
            })
        })
    }
}
