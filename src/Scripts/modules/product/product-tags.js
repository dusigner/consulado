/* global $: true, Nitro: true */
'use strict';

Nitro.module('tagueamento', function() {

    this.init = () => {
        this.tagContratacao();
        this.tagTiposEntrega();
        this.tagVendasCorp();
        this.tagDetalhamentoProd();
        this.tagParcelamento();
        this.tagGallery();
        this.tagMedidas();
        this.tagDownloads();
    }

    this.tagContratacao = () => {
        const $contratacaoButton = $('.product-assist-block.infos .second-block').find('a');

        $contratacaoButton.on('click', () => {
            dataLayer.push({
                event: 'generic',
                category: 'Assistência e Relacionados',
                action: 'Informações de contratação',
                label: 'Veja Mais'
            });
        });
    }

    this.tagTiposEntrega = () => {
        const $entregasButton = $('.product-assist-block.delivery .second-block').find('a[data-modal="tipo-entrega"]');

        $entregasButton.on('click', () => {
            dataLayer.push({
                event: 'generic',
                category: 'Assistência e Relacionados',
                action: 'Tipos de entrega',
                label: 'Veja Mais'
            });
        });
    }

    this.tagVendasCorp = () => {
        const $corpButton = $('.product-assist-block.corp .second-block').find('a');

        $corpButton.on('click', () => {
            dataLayer.push({
                event: 'generic',
                category: 'Assistência e Relacionados',
                action: 'Vendas corporativas',
                label: 'Veja Mais'
            });
        });
    }

    this.tagDetalhamentoProd = () => {
        const $avaliationButton = $('.row.anchors ul li').find('a[href="#trustvox-reviews"]');

        $avaliationButton.on('click', () => {

            dataLayer.push({
                event: 'generic',
                category: 'Produto',
                action: 'Detalhamento do Produtos',
                label: 'Avaliações'
            });
        })
    }

    this.tagParcelamento = () => {
        const $parcelButton = $('.formas-pagamento-container .other-payment-method').find('span.titulo-parcelamento');

        $parcelButton.on('click', ({currentTarget}) => {
            const $element = $(currentTarget);

            if (!$element.parents('.formas-pagamento-container').hasClass('is--active')) {
                dataLayer.push({
                    event: 'generic',
                    category: 'Produto',
                    action: 'Formas de parcelamento',
                    label: 'Abrir'
                });
            } else {
                dataLayer.push({
                    event: 'generic',
                    category: 'Produto',
                    action: 'Formas de parcelamento',
                    label: 'Fechar'
                });
            }
        })
    }

    this.tagGallery = () => {
        const $galleryButtons = '.prod-galeria ul.galleryThumbs li a',
            $document = $(document);

        $document.on('click', $galleryButtons, ({currentTarget}) => {
            const $element = $(currentTarget),
                $position = String(parseInt($element.parent().attr('data-slick-index')) + 1),
                $productId = $('.reference .productReference').text();

            dataLayer.push({
                event: 'generic',
                category: 'Produto',
                action: 'Interação Galeria',
                label: $element.attr('href').indexOf('youtube') !== -1 ? `Video|${$productId}` : `${$position}|${$productId}`
            });
        });
    }

    this.tagMedidas = () => {
        const $boxButton = $('.specs__measure-selector.specs__list').find('.specs__measure-selector-withBox');

        $boxButton.on('click', () => {
            dataLayer.push({
                event: 'generic',
                category: 'Produto',
                action: 'Medidas',
                label: 'Com Caixa'
            });
        });
    }

    this.tagDownloads = () => {
        const $productManual = $('.specs__links-content.specs__list ul li:first-child').find('a'),
            $productGuide = $('.specs__links-content.specs__list ul li:nth-child(2)').find('a'),
            $productEnergy110v = $('.specs__links-content.specs__list ul li:nth-child(3)').find('a'),
            $productEnergy220v = $('.specs__links-content.specs__list ul li:nth-child(4)').find('a');

        $productManual.on('click', () => {
            dataLayer.push({
                event: 'generic',
                category: 'Produto',
                action: 'Downloads',
                label: 'Manual do Produto'
            });
        });

        $productGuide.on('click', () => {
            dataLayer.push({
                event: 'generic',
                category: 'Produto',
                action: 'Downloads',
                label: 'Guia Rapido'
            });
        });

        $productEnergy110v.on('click', () => {
            dataLayer.push({
                event: 'generic',
                category: 'Produto',
                action: 'Downloads',
                label: 'Classificacao Energetica 110v'
            });
        });

        $productEnergy220v.on('click', () => {
            dataLayer.push({
                event: 'generic',
                category: 'Produto',
                action: 'Downloads',
                label: 'Classificacao Energetica 220v'
            });
        })
    }

    this.init();
});