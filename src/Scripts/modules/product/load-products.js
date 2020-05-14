/* global $: true, Nitro: true */
'use strict';

Nitro.module('load-products', function() {

	// Exibe Informação de "Compra segura" quando o
	// botão comprar estiver exibindo na página
	setTimeout(function() {
		if ( skuJson.available === true ) {
			$('.secure').show();
			$('body').addClass('produto-disponivel');
		} else {
			if ( !$('body').hasClass('product-outline-accept') ) {
				$('body').addClass('produto-indisponivel');
				$('.calc-frete').hide();
				$('.secure').hide();
				$('.cta-containers').hide();
				$('.prod-more-info').hide();
			}
		}

		// Esconder/Aparecer barra de preço e comprar em determinada posição da tela
		if ($(window).width() <= 1024) {

			if (!$('body').hasClass('produto-indisponivel')) {
				$('.product-info-bar').css('display', 'block');
				$(window).scroll(function(e) {
					e.preventDefault();
					var _pos = $(window).scrollTop();

					if ($('body').hasClass('produto-indisponivel') || (_pos >= ($('#BuyButton').offset().top + 32))) {
						$('.product-info-bar').addClass('formas-pagamento-is--active');

					} else {
						$('.product-info-bar').removeClass('formas-pagamento-is--active');
						$('.formas-pagamento-container').removeClass('is--active');
					}
				})
			}
		}
	}, 1000)
});
