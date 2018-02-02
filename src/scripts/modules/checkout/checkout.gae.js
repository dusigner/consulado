/* global $: true, Nitro: true, dust: true, dust: true, _: true, vtexjs:true */

'use strict';

require('../../../templates/modal-warranty-desktop.html');
require('../../../templates/modal-warranty-mobile.html');


Nitro.module('checkout.gae', function() {

	var self = this,
		// $body = $('body'),
		// template = $body.hasClass('teste-ab-gae') ? 'modal-warranty-desktop-teste-ab' : 'modal-warranty-desktop',
		$modalWarranty = $('#modal-warranty');

	this.setup = function() {
		this.link();
		this.terms();
		this.autoOpen();
	};

	this.monthToDays = function( months ) {
		var CurrentDate = new Date();
		var nextDate = new Date();
		nextDate.setMonth(nextDate.getMonth() + months);

		var timeDiff = Math.abs(nextDate.getTime() - CurrentDate.getTime());
		var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

		return diffDays;
	};

	this.showMoreMobile = function() {
		// console.log('showMoreMobile');
		$('.show-more i').off().on('click', function() {
			$(this).parent().parent().parent()
				.find('.box-list').toggleClass('hide');
			$(this).toggleClass('active');
		});
	};

	this.hasAnyActiveWarranty = function() {
		return self.orderForm && self.orderForm.items && self.orderForm.items.some(function(elem) {
			return elem.bundleItems.length > 0 && elem.bundleItems.some(function(bundle) {
				return bundle.name.indexOf('Garantia') !== -1;
			});
		});
	};

	//Exibe mensagem info sobre GAE no "resumo do pedido" quando existir garantia ativa
	this.info = function() {
		var $info = $('.garantiaInfo');

		if ($info.length === 0) {
			$info = $('<p class="garantiaInfo">O pagamento do prêmio de seguro será realizado em conjunto com o pagamento do(s) produto(s) ora adquirido(s).</p>')
				.appendTo('.orderform-template .summary-template-holder');
		}

		$info.toggleClass('active', self.hasAnyActiveWarranty());
	};

	this.terms = function() {

		/* validação via modal desativada
		$('#btn-concordo').off().on('click', function() {

			var attachmentName = 'Aceite do Termo',
				content = {
					'Aceito': 'Aceito'
				};

			self.orderForm.items.forEach(function(elem, elemIndex) {

				elem.bundleItems.filter(function(bundle) {
					return bundle.attachmentOfferings.length > 0;
				}).forEach(function(bundle) {

					// console.log('bundle', bundle);

					return vtexjs.checkout.addBundleItemAttachment(elemIndex, bundle.id, attachmentName, content);
				});
			});

			$('#modal-services').modal('hide');
			//$('.btn-place-order').trigger('click');
			window.location.href = '#/orderform';
		});

		*/


		$('#modal-services .btn-default').off().on('click', function() {

			self.orderForm.items.forEach(function(elem, elemIndex) {

				elem.bundleItems.forEach(function(bundle) {
					//$.each(self.orderForm.items, function (i) {
					if(bundle.name.indexOf('Garantia') !== -1) {
						return vtexjs.checkout.removeOffering(bundle.id, elemIndex);
					}
					//});
				});
			});

			$('#modal-services').modal('hide');
		});
	};

	this.addkWarranty = function() {

		var $self = $(this),
			index = $self.data('index'),
			idOffering = $('input[name="warranty-value"]:checked').val(),
			liAceito = $('#check-termos').is(':checked');

		if ( idOffering !== '' && liAceito ) {
			$self.addClass('icon-loading');

			vtexjs.checkout.addOffering(idOffering, index).always(function() {
				$modalWarranty.modal('hide');

				$modalWarranty.on('hidden.bs.modal', function() {
					$self.removeClass('icon-loading');
				});
			});
<<<<<<< HEAD
		} else if ( idOffering === '' && liAceito ) {
=======
		}
		else if ( idOffering === '' && !liAceito || idOffering === '' && liAceito) {
>>>>>>> modal-gae-ajuste-aceite
			$modalWarranty.modal('hide');
		} else {
			$('.form-termos').addClass('erro');

			setTimeout(function(){
				$('.form-termos').removeClass('erro');
			}, 3000);
		}
	};


	this.modalWarranty = function(e) {
		e.preventDefault();

		var template = 'modal-warranty-desktop';

		// Pegando valores do produto clicado
		var $self = $(this),
			index = $self.attr('data-index'),
			product = self.orderForm.items[index];

		// Filtra os serviços disponiveis somente para Garantia
		var offerings = $.grep(self.orderForm.items[index].offerings, function(value) {
			return value.name.indexOf('Garantia') !== -1;
		}).sort( function( a, b ) {
			// I have no idea how it works, but works!
			return a.price < b.price ? -1 : a.price > b.price ? 1 : 0;
		});

		// Adicionando valores nos campos do Modal
		var data = {
			product: {
				image: product.imageUrl.replace('http:', ''), //https image
				name: product.name,
				price: product.price
			},
			warranty: [],
			productIndex: index
		};

		$.each(offerings, function(index, val) {
			var warrantyTime = parseInt(val.name.match(/\d+/)[0]);

			data.warranty[index]            = {};
			data.warranty[index].id         = val.id;
			data.warranty[index].price      = val.price / 10;
			data.warranty[index].fullPrice  = val.price;
			data.warranty[index].priceMonth = val.price / warrantyTime;
			data.warranty[index].priceDay   = val.price / self.monthToDays(warrantyTime);
			data.warranty[index].months     = warrantyTime;
			data.warranty[index].isPrimary  = (warrantyTime === 12) ? true : false;
			data.warranty[index].isLast     = (warrantyTime === 24) ? true : false;
			data.warranty[index].isCheaper  = false;

			if( offerings[index - 1] ) {
				var prevWarrantyTime = parseInt(offerings[index - 1].name.match(/\d+/)[0]);
				data.warranty[index].diffMonths = warrantyTime - prevWarrantyTime;
				data.warranty[index].diffPrice = data.warranty[index].priceMonth - (offerings[index - 1].price / prevWarrantyTime);

				if( data.warranty[index].diffPrice < 0 ) {
					data.warranty[index].isCheaper = true;
					data.warranty[index].diffPrice = data.warranty[index].diffPrice * -1;
				}

			} else {
				data.warranty[index].diffMonths = warrantyTime - 0;
				data.warranty[index].diffPrice = data.warranty[index].priceMonth - 0;
			}
		});

		if ($(window).width() < 840) {
			template = 'modal-warranty-mobile';
		}

		dust.render(template, data, function(err, out) {
			if (err) {
				throw new Error('Modal Warranty Dust error: ' + err);
			}

			$('body').append(out);

			$modalWarranty = $('#modal-warranty');

			$modalWarranty.modal().on('hidden.bs.modal', function() {
				$modalWarranty.remove();
			});

			self.showMoreMobile();

			// Classe no box de garantia
			var $anchorGae = $('.anchor-gae');
			$anchorGae.on('click', function() {
				$anchorGae.not(this).removeClass('active')
					.filter(this).addClass('active');
			});

			// Abrindo mais detalhes da garantia
			$('.box-opcao-garantia .show-more').on('click', function() {
				$(this).parents('.box-opcao-garantia').toggleClass('open');
				$(this).next('.desc').slideToggle(); // remover comentário quando não tiver no teste ab
			});


			//Retornar true ou false
			$modalWarranty.find('.btn-continue').on('click', self.addkWarranty); //descomentar fora do teste
			// // Adicionando garantia definida ao produto
			// $('.btn-continue').click(function() {

			// 	if($('#check-termos').is(':checked') || $('#warranty1').is(':checked')) {

			// 		$('.form-termos').removeClass('erro');

			// 	}
			// 	else {
			// 		$('.form-termos').addClass('erro');
			// 	}
			// });

			$('.abreefecha').click(function() {
				$('.seguro-de-garantia').toggleClass('ativo');
			});

			$('.abreefecha-pgto').click(function() {
				$('.autorizacao-de-pgto').toggleClass('ativo');
			});


		});
	};

	this.selectHasWarranty = function($select) {
		var hasWarranty = false;
		$select.find('option').each(function() {
			if($(this).text().indexOf('Garantia') !== -1) {
				hasWarranty = true;
			}
		});

		return hasWarranty;
	};

	this.hasCurrentWarranty = function($boxService) {
		var hasWarranty = false;
		$boxService.each(function() {
			if($(this).find('.bundle-item-name span').text().indexOf('Garantia') !== -1) {
				hasWarranty = true;
			}
		});
		return hasWarranty;
	};

	this.link = function() {
		var $link = $('<a href="#" class="linkWarranty btn">Adicionar Seguro Garantia Estendida Original</a>');

		//adicionando link de GAE em cada item
		$('.product-item').each(function(i) {
			var $self = $(this),
				$selfService = $(this).find('.product-service'),
				$currentLink = $self.find('.linkWarranty'),
				$currentServices = $self.nextUntil('.product-item');

			// verifica se o link de garantia já não existe disponível para o produto
			// verifica se o select de serviços escondido possui a opção de garantia estendida
			// verifica se já não existe uma garantia adicionada
			// adiciona o link de adquirir garantia
			if ( $currentLink.length === 0 && self.selectHasWarranty( $selfService ) && !self.hasCurrentWarranty( $currentServices ) ) {
				$link.clone()
					.appendTo($selfService)
					.attr('data-index', i)
					.on('click', self.modalWarranty);
			}

			/*
				Remove a opção do select de serviços
				quando a opção for de instalação
			*/
			$selfService.find('option').each(function() {
				if( $(this).text().indexOf('instala') !== -1 || $(this).text().indexOf('Instala') !== -1 ) {
					$(this).remove();
				}
			});
		});
	};

	this.autoOpen = function() {

		setTimeout(function() {
			//Inicia o modal com o ultimo produto adicionado,
			//caso já tenha sido chamado adiciona a classe been-called
			var $cartTemplate = $('.cart-template');

			//if($(window).width() > 1000){
			if (!$cartTemplate.is('.been-called') && $('.linkWarranty').length > 0) {
				$('.linkWarranty').last().trigger('click');
				$cartTemplate.addClass('been-called');
			}
			//}
		}, 1500);
	};

	/*$(window).load(function() {
		self.autoOpen();
	});*/

});

/*jshint strict: false */
dust.filters.intAsCurrency = function(value) {
	return _.intAsCurrency(value);
};
