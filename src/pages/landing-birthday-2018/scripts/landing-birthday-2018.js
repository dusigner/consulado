/* global store:true, FB:true */

'use strict';
require('modules/helpers');

//load Nitro Lib
require('vendors/nitro');
require('vendors/slick');
require('modules/store/facebook-init');
var CRM = require('modules/store/crm');
console.clear();

Nitro.setup(['facebook-init'], function () {
	// VARS
	var $containerSelect = $('.select-category'),
		$selectLi = $('.select-category ul li'),
		$valueSelected = $('.select-category > span'),
		$inputCategory = $('input.category'),
		$iconPlay = $('.icon-play'),
		$iframePlay = $('.embed-responsive-item'),
		$formRegister = $('.form-register'),
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
	// Open Select
	$containerSelect.click(function(){
		$(this).toggleClass('active');
	});

	// SELECT CATEGORY
	$selectLi.click(function(){
		$valueSelected.text($(this).text());
		$inputCategory.val($(this).text());
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
	});

	// Resetar os Vídeos
	$(window).load(function(){
		$('.slick-dots li').click(function(){
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


	$formRegister.submit(function(e){
		e.preventDefault();
		var $inputName = $('.name').val(),
			$inputEmail = $('.email').val(),
			$inputcategoryD = $('.category').val();
		if($inputName === ''){
			$('input.name').addClass('error');
		}else if($inputEmail === ''){
			$('input.email').addClass('error');
		}else if($inputcategoryD === ''){
			$('.select-category').addClass('error');
		}else {
			$('.select-category, input.email, input.name').removeClass('error');
			$(this)[0].reset();
			$valueSelected.html('selecione sua categoria');
			// concatena as variaveis no date
			var data = {
				'category': $inputcategoryD,
				'email': $inputEmail,
				'name': $inputName
			};
			// Faz a inserção no MasterData
			CRM.ajax({
				url: CRM.formatUrl('BT', 'documents'),
				type: 'PATCH',
				data: JSON.stringify(data),
				success: function (success) {
					$('#modal-sucess').vtexModal();
					console.info('Sucesso', success);
				},
				error: function (error) {
					console.info('error; ' + error);
				}
			});
		}
	});
});