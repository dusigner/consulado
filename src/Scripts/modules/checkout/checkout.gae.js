/* global $: true, Nitro: true, dust: true, dust: true, _: true, vtexjs:true */

'use strict';

require('Dust/modal-warranty-desktop.html');
//require('Dust/modal-warranty-mobile.html');

Nitro.module('checkout.gae', function () {
	var self = this,
		winWidth = $('body').width(),
		$modalWarranty = $('#modal-warranty');

	this.setup = function () {
		this.link();
		this.terms();
		this.removeFromCart();
		// this.autoOpen();
		// this.introOpen();
	};

	/**
	 * Again another shameful function.
	 *
	 * Add a click function to remove data sku from local storage when product is going to be removed on cart
	 *
	 */
	this.removeFromCart = () => {
		$('.item-link-remove').on('click', function () {
			const skus = sessionStorage.getItem('sku-cart').split(','),
				element = $(this);

			const newListSkus = skus.filter(function (value) {
				return value !== element.parents('.product-item').attr('data-sku');
			});

			sessionStorage.setItem('sku-cart', newListSkus.join(','));
		});
	};

	this.installments = function () {
		const sortCountASC = (a, b) => b.count - a.count;
		return self.orderForm.paymentData.installmentOptions
			.map(
				elem =>
					elem.installments.length > 0 &&
					elem.installments.filter(installment => !installment.hasInterestRate).sort(sortCountASC)[0]
			)
			.sort(sortCountASC)[0].count;
	};

	this.monthToDays = function (months) {
		var CurrentDate = new Date();
		var nextDate = new Date();
		nextDate.setMonth(nextDate.getMonth() + months);

		var timeDiff = Math.abs(nextDate.getTime() - CurrentDate.getTime());
		var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

		return diffDays;
	};

	this.showMoreMobile = function () {
		// console.log('showMoreMobile');
		$('.show-more i')
			.off()
			.on('click', function () {
				$(this)
					.parent()
					.parent()
					.parent()
					.find('.box-list')
					.toggleClass('hide');
				$(this).toggleClass('active');
			});
	};

	this.hasAnyActiveWarranty = function () {
		return (
			self.orderForm &&
			self.orderForm.items &&
			self.orderForm.items.some(function (elem) {
				return (
					elem.bundleItems.length > 0 &&
					elem.bundleItems.some(function (bundle) {
						return bundle.name.indexOf('Garantia') !== -1;
					})
				);
			})
		);
	};

	//Exibe mensagem info sobre GAE no "resumo do pedido" quando existir garantia ativa
	this.info = function () {
		var $info = $('.garantiaInfo');

		if ($info.length === 0) {
			$info = $(
				'<p class="garantiaInfo">O pagamento do prêmio de seguro será realizado em conjunto com o pagamento do(s) produto(s) ora adquirido(s).</p>'
			).appendTo('.orderform-template .summary-template-holder');
		}

		$info.toggleClass('active', self.hasAnyActiveWarranty());
	};

	this.terms = function () {
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

		$('#modal-services .btn-default')
			.off()
			.on('click', function () {
				self.orderForm.items.forEach(function (elem, elemIndex) {
					elem.bundleItems.forEach(function (bundle) {
						//$.each(self.orderForm.items, function (i) {
						if (bundle.name.indexOf('Garantia') !== -1) {
							return vtexjs.checkout.removeOffering(bundle.id, elemIndex);
						}
						//});
					});
				});

				$('#modal-services').modal('hide');
			});
	};

	this.addkWarranty = function () {
		var $self = $(this),
			index = $self.data('index'),
			idOffering = $('input[name="warranty-value"]:checked').val(),
			titleOffering = $('.modal__cell.active .title-garantia span').text(),
			liAceito = $('#check-termos').is(':checked');

		if (idOffering !== undefined && liAceito) {
			$self.addClass('icon-loading');

			vtexjs.checkout.addOffering(idOffering, index).always(function () {
				$modalWarranty.modal('hide');

				$modalWarranty.on('hidden.bs.modal', function () {
					$self.removeClass('icon-loading');
				});
			});
		} else if (idOffering === '' && !liAceito && idOffering === '' && liAceito) {
			$modalWarranty.modal('hide');
		} else {
			if (liAceito === false && titleOffering !== '(Apenas garantia de fábrica)') {
				$('.form-termos').addClass('erro');

				setTimeout(function () {
					$('.form-termos').removeClass('erro');
				}, 5000);
			}
			if (idOffering === undefined) {
				$('.box-opcao-garantia').css('border', '2px solid #f78383');
				$('.modal__table .erro').fadeIn('slow');

				setTimeout(function () {
					$('.box-opcao-garantia').css('border', '2px solid #e4e4e4');
					$('.modal__table .erro').fadeOut('slow');
				}, 5000);
			}
			if (titleOffering === '(Apenas garantia de fábrica)') {
				$modalWarranty.modal('hide');
			}
		}

		if (winWidth < 991 && idOffering === undefined && titleOffering !== '(Apenas garantia de fábrica)') {
			$('#modal-warranty .modal-body, #modal-warranty .modal-content, html').animate(
				{
					scrollTop: 100
				},
				'slow'
			);
		} else if (winWidth < 991 && liAceito === false && titleOffering !== '(Apenas garantia de fábrica)') {
			$('#modal-warranty .modal-body, #modal-warranty .modal-content, html').animate(
				{
					scrollTop: 650
				},
				'slow'
			);
		}
	};

	this.modalWarranty = function (e) {
		e.preventDefault();

		var template = 'modal-warranty-desktop';

		// Pegando valores do produto clicado
		var $self = $(this),
			index = $self.attr('data-index'),
			product = self.orderForm.items[index];

		// Filtra os serviços disponiveis somente para Garantia
		var offerings = $.grep(self.orderForm.items[index].offerings, function (value) {
			return value.name.indexOf('Garantia') !== -1;
		}).sort(function (a, b) {
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

		// Remove GAE 18 months from the GAE object list
		offerings = $.grep(
			offerings,
			function (element) {
				return element.type === 'Seguro Garantia Estendida Original - 18 meses';
			},
			true
		);

		const offerningSeller = offerings.filter(o => {
			return o.type.indexOf('CNS-') >= 0;
		});

		$.each(offerningSeller, function (index, val) {
			if (!val.name.match(/\d+/)) {
				return;
			}

			var warrantyTime = parseInt(val.name.match(/\d+/)[0]);

			data.warranty[index] = {};
			data.warranty[index].id = val.id;
			data.warranty[index].price = val.price / 10;
			data.warranty[index].fullPrice = val.price;
			data.warranty[index].priceMonth = val.price / warrantyTime;
			data.warranty[index].priceInstallment = val.price / self.installments();
			data.warranty[index].priceDay = val.price / self.monthToDays(warrantyTime);
			data.warranty[index].installment = self.installments();
			data.warranty[index].months = warrantyTime;
			// prettier-ignore
			(data.warranty[index].monthsYear =
				warrantyTime === 12 ? '1' : warrantyTime === 18 ? '1' : warrantyTime === 24 ? '2' : '3'),
				(data.warranty[index].isPrimary = warrantyTime === 12 ? true : false);
			data.warranty[index].isMiddle = warrantyTime === 24 && offerings.length > 2 ? true : false;
			data.warranty[index].isLast =
				(warrantyTime === 36 && offerings.length > 2) || (warrantyTime === 24 && offerings.length < 3)
					? true
					: false;
			data.warranty[index].isCheaper = false;
			data.warranty[index].isParcel = self.installments() ? true : false;

			data.warranty[index].months === 36 ? (data.warranty[index - 1].hasThreeYears = '-not-last') : '';

			if (offerings[index - 1]) {
				var prevWarrantyTime = parseInt(offerings[index - 1].name.match(/\d+/)[0]);
				data.warranty[index].diffMonths = warrantyTime - prevWarrantyTime;
				data.warranty[index].diffPrice =
					data.warranty[index].priceInstallment - offerings[index - 1].price / self.installments();

				if (data.warranty[index].diffPrice < 0) {
					data.warranty[index].isCheaper = true;
					data.warranty[index].diffPrice = data.warranty[index].diffPrice * -1;
				}
			} else {
				data.warranty[index].diffMonths = warrantyTime - 0;
				data.warranty[index].diffPrice = data.warranty[index].priceInstallment - 0;
			}
		});

		// if ($(window).width() < 840) {
		// 	template = 'modal-warranty-mobile';
		// }

		dust.render(template, data, function (err, out) {
			if (err) {
				throw new Error('Modal Warranty Dust error: ' + err);
			}

			$('body').append(out);

			$modalWarranty = $('#modal-warranty');

			$modalWarranty.modal().on('hidden.bs.modal', function () {
				$modalWarranty.remove();
			});

			self.showMoreMobile();

			// Classe no box de garantia
			var $anchorGae = $('.anchor-gae');
			$anchorGae.on('click', function () {
				$anchorGae
					.not(this)
					.removeClass('active')
					.filter(this)
					.addClass('active');
				// $('.row-product-and-action .btn-continue').html('Continuar <span>›</span>').removeClass('locked');
				$('.modal__cell').removeClass('active');
				$(this)
					.parent('.modal__cell')
					.addClass('active');
			});

			// Abrindo mais detalhes da garantia
			$('.box-opcao-garantia .show-more').on('click', function () {
				$(this)
					.parents('.box-opcao-garantia')
					.toggleClass('open');
				$(this)
					.next('.desc')
					.slideToggle(); // remover comentário quando não tiver no teste ab
			});

			// Desmarcar opção selecionada
			// $('body').on('click', '.close-warranty', function(){
			// 	$('#warranty1').trigger('click');
			// 	$('.modal__cell').removeClass('active');
			// 	$('.row-product-and-action .btn-continue').html('Não tenho interesse <span>›</span>').addClass('locked');
			// });

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

			$('.abreefecha').click(function () {
				$('.seguro-de-garantia').toggleClass('ativo');
				$('.close-seguro-garantia.abreefecha').css('top', 0);

				if (window.innerWidth < 991) {
					$('#modal-warranty .modal-body, #modal-warranty .modal-content, html').animate(
						{
							scrollTop: 0
						},
						'slow'
					);
				}
			});

			$('.abreefecha-pgto').click(function () {
				$('.autorizacao-de-pgto').toggleClass('ativo');

				if (window.innerWidth < 991) {
					$('#modal-warranty .modal-body, #modal-warranty .modal-content, html').animate(
						{
							scrollTop: 0
						},
						'slow'
					);
				}
			});

			// Tagueamento do click de envio
			$('.garantia-box-proceed .btn-continue.btn-success').on('click', function () {
				dataLayer.push({
					event: 'generic',
					category: 'cart',
					action: 'Modal Garantia Estendida',
					label: $(this)
						.parents('.modal-body')
						.find('.active .title-garantia')
						.text()
				});
			});

			$('.gae-sub-title.-mobile').on('click', function () {
				var documento = $(this);
				if (documento.hasClass('-is-active')) {
					documento.removeClass('-is-active');
					$('#gae-show-mobile').removeClass('-is-active');
				} else {
					documento.addClass('-is-active');
					$('#gae-show-mobile').addClass('-is-active');
				}
			});

			// Scroll Event to close "modal of modals" buttons, im not proud of this.
			$('#modal-warranty .modal-body')
				.scroll(function () {
					if ($('.seguro-de-garantia').hasClass('ativo'))
						$('.close-seguro-garantia.abreefecha').css('top', $('#modal-warranty .modal-body').scrollTop());
				})
				.scroll();
		});
	};

	this.selectHasWarranty = function ($select) {
		var hasWarranty = false;
		$select.find('option').each(function () {
			if (
				$(this)
					.text()
					.indexOf('Garantia') !== -1
			) {
				hasWarranty = true;
			}
		});

		return hasWarranty;
	};

	this.hasCurrentWarranty = function ($boxService) {
		var hasWarranty = false;
		$boxService.each(function () {
			if (
				$(this)
					.find('.bundle-item-name span')
					.text()
					.indexOf('Garantia') !== -1
			) {
				hasWarranty = true;
			}
		});
		return hasWarranty;
	};

	this.link = function () {
		var $link = $('<a href="#" class="linkWarranty btn">Adicionar seguro garantia estendida original</a>');

		//adicionando link de GAE em cada item
		$('.product-item').each(function (i) {
			var $self = $(this),
				$selfService = $(this).find('.product-service'),
				$currentLink = $self.find('.linkWarranty'),
				$currentServices = $self.nextUntil('.product-item');

			// verifica se o link de garantia já não existe disponível para o produto
			// verifica se o select de serviços escondido possui a opção de garantia estendida
			// verifica se já não existe uma garantia adicionada
			// adiciona o link de adquirir garantia
			if (
				$currentLink.length === 0 &&
				self.selectHasWarranty($selfService) &&
				!self.hasCurrentWarranty($currentServices)
			) {
				$link
					.clone()
					.appendTo($selfService)
					.attr('data-index', i)
					.on('click', self.modalWarranty);
			}

			/*
				Remove a opção do select de serviços
				quando a opção for de instalação
			*/
			$selfService.find('option').each(function () {
				if (
					$(this)
						.text()
						.indexOf('instala') !== -1 ||
					$(this)
						.text()
						.indexOf('Instala') !== -1
				) {
					$(this).remove();
				}
			});
		});
	};

	/*
	* Show modal when the last item added does not have its SKU stored on local storage, and then add its SKU on sku-cart object.
	*
	* Not even proud about what I had done here. If someone ask me, I will deny until the very end!
	*/
	this.autoOpen = function (skuId) {
		setTimeout(function () {
			//Inicia o modal com o ultimo produto adicionado,
			//caso já tenha sido chamado adiciona a classe been-called
			var $cartTemplate = $('.cart-template');

			//if($(window).width() > 1000){
			if (!$cartTemplate.is('.been-called') && $('.linkWarranty').length > 0) {
				if ($(`.product-item[data-sku=${skuId}]`).find('.linkWarranty').length > 0) {

					let skuList = (sessionStorage.getItem('sku-cart')) ? sessionStorage.getItem('sku-cart').split(',') : [];
					skuList.push(skuId);

					$(`.product-item[data-sku=${skuId}]`).find('.linkWarranty')
						.trigger('click');
					$cartTemplate.addClass('been-called');

					sessionStorage.setItem('sku-cart', skuList.join(','));
				}
			}
			//}
		}, 1500);
	};

	this.introOpen = function () {
		if (winWidth < 960) {
			setTimeout(function () {
				var modalIntro = $('#modal-intro-gae');

				if ($.cookie('cns-intro-gae') == null) {
					//Entrou na condição, Cookie não existe
					//insere a classe para mostrar o modal intro
					modalIntro.addClass('-is-visible');
					modalIntro.fadeIn(300);

					$('#modal-intro-gae .btn-confirm').on('click', function () {
						//Clicou no btn então fecha o modal
						$.cookie('cns-intro-gae', 'cns-intro-gae', { expires: 60 });
						modalIntro.fadeOut(300);
					});
				} else {
					modalIntro.remove();
				}
			}, 1500);
		}
	};

	/*$(window).load(function() {
		self.autoOpen();
	});*/
});

/*jshint strict: false */
dust.filters.intAsCurrency = function (value) {
	return _.intAsCurrency(value);
};
