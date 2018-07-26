'use strict';

Nitro.controller('compare', function() {

	var self = this,
		$titlePage = $('.compare-produtos-wrapper > h2'),
		$body = $('body'),
		$corpoComparacao = $('.corpo-comparacao');
	$('.corpo-comparacao table thead').addClass('dadosCompar');

	this.init = function() {
		//self.removeRows();
		self.buildRemoveButtons();
		self.buildTitleTR();
		self.buildBuyButtons();
		self.settDiffAndEqRows();
		self.buildHighlightDiff();
		self.listeners();
	};

	this.removeRows = function() {
		$('table tbody tr').each(function() {
			if(!$(this).hasClass('Características') && !$(this).hasClass('remover')) {
				$(this).remove();
			}
		});
	};

	this.buildBuyButtons = function() {

		$corpoComparacao.find('tbody .remover td').each(function(idx){
			if($(this).find('.remover-produto').length > 0) {
				var prodLink = $corpoComparacao.find('thead tr th').eq(idx).find('a.image').attr('href'),
					prodName = $corpoComparacao.find('thead tr th').eq(idx).find('a.image').text();

				var buyButton = '<a class="primary-button js-track-buy_button" data-category="Comparador" data-text="Comprar -'+prodName+'" href="'+prodLink+'">Comprar</a>';

				$(this).remove('.remover-produto');
				$(this).html(buyButton);
			}
		});
	};

	this.buildRemoveButtons = function() {
		var removeButton 	= '<span class="remove-button"></span>',
			$produtoLi		= $('.produto .box-produto');

		$produtoLi.each(function() {
			$(this).append(removeButton);
		});
	};

	this.buildTitleTR = function() {
		var $tbody	= $corpoComparacao.find('table > tbody'),
			$title	= '<tr class="specs-title">'+
                          '<td colspan="4">Especificações Técnicas</td>'+
                      '</tr>';

		$tbody.find('tr').eq(0).after($title);
	};

	// função para pegar os ids dos produtos na página
	this.updateStore = function(id) {
		var newsIds = localStore.get('comparador');

		newsIds.forEach(function(val, idx) {
			val.rel === id ? newsIds.splice(idx, 1): '';
		});

		//localStore.remove('comparador');
		localStore.set('comparador', newsIds);

	};

	this.listeners = function() {
		loadMobile();

		var categoryName = localStore.get('comparador')[0].category;

		// CHANGE TITLE TEXT
		$titlePage.html('<div>Comparador de produtos</div>'+
			'<div><a href="'+window.location.search.match(/&ReturnUrl=(.+)/)[1]+'" class="btn btn-secondary js-track-items__link" data-category="Comparador">Voltar para '+categoryName+'</a></div>');
		$titlePage.css('display', 'flex');

		// REMOVE BUTTON
		$body.on('click', '.remove-button', function() {
			var id = $(this).parent().parent().parent().parent().parent().parent().attr('class');
			$('td.{0}, th.{0}'.format(id)).remove();

			dataLayer.push({event: 'generic', category: 'Comparador de Produtos', action: 'Remover Produto', label: '-'});

			self.updateStore(id);

			if (document.querySelectorAll('.corpo-comparacao > table th .produto').length === 1){
				var url 		= new URL(window.location.href),
					urlToReturn = url.searchParams.get('ReturnUrl');

				if(urlToReturn) {
					window.location.href = urlToReturn;
				}

				$('.diff-highlight-container .selection-product strong:nth-child(2)').text('1');

			} else if (document.querySelectorAll('.corpo-comparacao > table th .produto').length === 2) {
				$('.diff-highlight-container .selection-product strong:nth-child(2)').text('2');
			}


		});

		// eventos tagueamento
		$body.on('click', '.compare-bar_add-product', function() {
			dataLayer.push({event: 'generic', category: 'Comparador de Produtos', action: 'Adicionar Outro Produto', label: '-'});
		}).on('click', '.js-track-buy_button', function(e) {
			e.preventDefault();

			dataLayer.push({event: 'generic', category: 'Comparador de Produtos', action: 'Comprar Produto', label: '-'});

			window.location.href = $(this).attr('href');
		}).on('click', '.box-produto .detalhes a', function(e) {
			e.preventDefault();
			var skuProduto = $(this).parent('.box-produto').find('.nome .product-field ul li').text();
			dataLayer.push({event: 'generic', category: 'Comparador de Produtos', action: 'Abrir Produto', label: skuProduto});
		});

		// MOBILE
		function loadMobile() {
			if ($(window).width() <= 768) {
				// const $thDiff = $corpoComparacao.find('table thead tr:nth-child(2) th:nth-child(1)');

				$(window).on('scroll', function() {
					$(this).scrollTop() > 360 ? $body.addClass('-is-mobile--active') : $body.removeClass('-is-mobile--active');
					$(this).scrollTop() >= 100 && $('thead.dadosCompar').length === 1 ? $('thead.dadosCompar').clone().prependTo('body').addClass('barraFixa') : '';
				});

				// $thDiff.addClass('d-none');
				// $corpoComparacao.find('table thead').append(`<tr>HEHEHEH</tr>`);

				if (document.querySelectorAll('.corpo-comparacao > table th .produto').length === 3) {
					// REMOVE THE THIRD PRODUCT
					var idThirdProd = $corpoComparacao.find('table thead tr:nth-child(2) th').next().attr('class');
					$('td.'+idThirdProd+', th.'+idThirdProd.format(idThirdProd)).remove();
				}
			} else {
				$(window).on('scroll', function() {
					var insertContent = $('.-is-desktop--active .diff-highlight-container'),
						txtStr = $('.title .link').text(),
						firstWord = txtStr.split(' ')[0],
						compareBar = $('.corpo-comparacao thead tr:nth-child(2)'),
						qntCompare = $('.corpo-comparacao th .produto').length;					

					$(this).scrollTop() >= 460 ? $body.addClass('-is-desktop--active') : $body.removeClass('-is-desktop--active');
					$(this).scrollTop() >= 160 && $('thead.dadosCompar').length === 1 ? $('thead.dadosCompar').clone().prependTo('body').addClass('barraFixa') : '';

					if ($('.selection-product').length === 0) {
						insertContent.prepend('<div class="selection-product">' +
											'<h2 class="mb-3">Comparador de produtos</h2>' +
											'Você selecionou ' +
											'<strong>' + qntCompare + '</strong>' +
											' produtos da<br />categoria ' +
											'<strong>' + firstWord + '</strong>' +
											'.</div>');
					}

					if ($('.corpo-comparacao th .produto').length === 2 && $('.compare-bar__product-image').length === 0) {
						compareBar.append('<th><a href="'+window.location.search.match(/&ReturnUrl=(.+)/)[1]+'" class="compare-bar_add-product"><div class="compare-bar__product-image"></div></a></th>');
					}

					$(this).scrollTop() < 160 ? $('.compare-bar__product-image').hide() : $('.compare-bar__product-image').show();
				});
			}
		}
	};

	this.buildHighlightDiff = function() {

		$corpoComparacao.find('thead tr:nth-child(2) th:nth-child(1)').html('<div class="diff-highlight">'+
				'<span>Destacar</span><br />'+
				'<div>'+
					'<div class="form-check form-check-inline form-check-diff">'+
						'<input class="form-check-input js-diff-check" type="radio" value="diff" id="isDiff" name="compare-highlight">'+
						'<label class="form-check-label" for="isDiff">'+
							'<h6>Diferenças</h6>'+
						'</label>'+
					'</div>'+
					'<div class="form-check form-check-inline form-check-eq">'+
						'<input class="form-check-input js-diff-check" type="radio" value="eq" id="isEq" name="compare-highlight">'+
						'<label class="form-check-label" for="isEq">'+
							'<h6>Semelhanças</h6>'+
						'</label>'+
					'</div>'+
				'</div>'+
			'</div>').addClass('diff-highlight-container');

		$body.on('change', '.js-diff-check', function() {
			var elemento = $(this).parent('.form-check').find('label').text();
			dataLayer.push({event: 'generic', category: 'Comparador de Produtos', action: 'Botão '+elemento, label: '-'});
			$corpoComparacao
				.removeClass (function (index, className) {
					return (className.match(/(^|\s)highlight-\S+/g) || []).join(' ');
				})
				.addClass('highlight-'+$('.js-diff-check:checked').val());
		});
	};

	this.settDiffAndEqRows = function() {

		$('tbody .atributos').each(function() {

			var firstValue = $(this).find('td:first').text();
			var diff = false;

			$(this).find('td').each(function() {

				if( firstValue !== $(this).text() ) {
					diff = true;
					return false;
				}
			});

			if( diff ) {
				$(this).addClass('diff');
			} else {
				$(this).addClass('eq');
			}
		});
	};

	self.init();
});
