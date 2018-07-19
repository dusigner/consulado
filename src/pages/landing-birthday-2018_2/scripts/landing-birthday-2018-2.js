/* global store:true, FB:true */

'use strict';
require('modules/helpers');

//load Nitro Lib
require('vendors/nitro');
require('vendors/slick');
require('modules/store/facebook-init');

Nitro.setup(['facebook-init'], function () {	
	// VARS
	var $iconPlay = $('.icon-play'),
		$iframePlay = $('.embed-responsive-item'),		
		$shareFace = $('.share img'),
		$url_atual = window.location.href;


	// função que abre o modal do facebook
	$shareFace.click(function() {
		FB.ui({
			method: 'share_open_graph',
			action_type:  'og.likes',
			action_properties:  JSON.stringify({
				object: $url_atual,
			})
		});
	});

	// monta slick dos produtos
	$('.new-showcase .prateleira.default ul').slick({
		arrows: true,
		dots: false,
		infinite: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		fade: true
	});

	// monta slick dos vídeos
	$('.tbs-videos').slick({
		arrows: false,
		dots: true,
		infinite: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		fade: true
	});	

	// Da Play nos Vídeos
	$iconPlay.click(function(){
		$(this).siblings('img').css('display','none');
		$(this).siblings('.embed-responsive').addClass('visible');
		$(this).siblings('.embed-responsive').find('iframe')[0].src += '&autoplay=1';
		$(this).css('display', 'none');

		dataLayer.push({
			event: 'generic',
			category: 'Página Aniversário',
			action: 'Assistir ao vídeo',
			label: 'Play video '+ $('.slick-dots li.slick-active button').text()
		});
	});

	// Resetar os Vídeos
	$(window).load(function(){
		$('.slick-dots li').click(function(){

			dataLayer.push({
				event: 'generic',
				category: 'Página Aniversário',
				action: 'Categoria de Vídeo',
				label: 'Video '+ $(this).find('button').text()
			});	
			
			$iframePlay.each(function(){
				var $srcIframe = $(this)[0].src;
				if($srcIframe.indexOf('&autoplay=1') !== -1){
					var $newSrc = $(this)[0].src.replace('&autoplay=1', ' ');
					$(this)[0].src = $newSrc;
					$(this).parents('.embed-responsive').siblings('img').css('display','block');
					$(this).parent('.embed-responsive').removeClass('visible');
					$iconPlay.css('display','block');
				}
			});
		});
	});
	$('body').on('click', '.new-showcase .detalhes > a', function(){
		dataLayer.push({
			event: 'generic',
			category: 'Página Aniversário',
			action: 'Vitrine Superior',
			label: $(this).attr('title')
		});
	});
	$('body').on('click', '.eletrodomesticos > li > a', function(){
		dataLayer.push({
			event: 'generic',
			category: 'Página Aniversário',
			action: 'Seletor de Categorias',
			label: $(this).attr('title')
		});
	});
	$('body').on('click', '.result-filter .detalhes a', function(){
		dataLayer.push({
			event: 'generic',
			category: 'Página Aniversário',
			action: 'Vitrine Inferior',
			label: $(this).attr('title')
		});
	});
});

