/* global store:true, FB:true, skuJson:true */

'use strict';

Nitro.module('facebook-share', function() {

	var self = this;

	var $facebookShare = $('.facebook-share'),
		cupom50 = $facebookShare.find('.cupom .facebook-50').text().trim(),
		$body = $('body'),

	var $facebookShareModal = $facebookShare.clone(),
		close = '<a class="close" style="display:block">Não, obrigado</a>';

	$facebookShareModal.find('button').append(' no Facebook');
	$facebookShareModal.attr('id', 'facebook-share');
	$facebookShareModal.append(close);

	this.clickAction = function() {

		$('.facebook-share button').unbind().click(function(e) {
			e.preventDefault();

			if(FB) {
				FB.ui({
					method: 'feed',
					caption: 'Faça parte do Compra Certa',
					link: store.linkIndiqueFacebook
				}, function(response){
					if (response && !response.error_code) {
						//self.addCupomCheckout();
						$.cookie('cupomDescontoFacebook', discount, {path: '/', expires: null});
						$.cookie('notShowFacebookShare', true, {path: '/', expires: null});

						self.modalSuccess();
						$facebookShare.addClass('hide');
						$facebookShareModal.find('.close').trigger('click');
					}
				});
			}
		});
	};

	/**
	 * Caso nunca tenha adicionado o cupom (cookie notShowFacebookShare),
	 * Tenha na página o cupom de 50 e 100 off
	 * O produto tenha um valor mínino de R$ 1.299,00
	 * For somente corporativo
	 * E possua cotas de indicações
	 */


	if(originalBestPrice > 189900) {

		$facebookShare.find('.title span').text('R$ 100');
		$facebookShareModal.find('.title span').text('R$ 100');
	}

	if( $body.is('.facebookShareActive') || /facebook-share/.test(window.location.href) ) {
		$facebookShare.removeClass('hide');
		self.clickAction();
	} else if( $body.is('.facebookShareModalActive') || /facebook-modal-share/.test(window.location.href) ) {

		$facebookShareModal.removeClass('hide');
		$body.on('mouseleave', function() {

			$facebookShareModal.vtexModal({
				cookieName: 'visualizacaoModalFacebook',
				cookieOptions: {
					expires: 1,
					path: '/'
				}
			});

			self.clickAction();

		});

	}
});
