/* global $: true, Nitro: true, escape:true */
'use strict';

Nitro.module('compare', function() {


	window.alert = function(e) {
		console.error(e);
		return;
	};

	var compareBox = $('.box-compare'),
		compareList = compareBox.find('.product-list'),
		compareMax = 3,
		productList = [],
		$btnLimpar = $('.btn-limpar-custom'),
		params = _.urlParams();

	if (params.ComparacaoProdutos !== undefined) {
		var selectedProducts = params.ComparacaoProdutos.split(',');

		$.each(selectedProducts, function(i, v) {
			compareBox.fadeIn();
			var p = $('article[data-idproduto=' + v + ']');
			p.closest('article.box-produto').find('.image img:first').clone()
				.attr('rel', v)
				.appendTo(compareList);
			productList.add(v);
		});

		compareBox.fadeIn();
	}

	$(document).on('change', '.compare-product-checkbox', function() {
		var self = $(this),
			productId = self.attr('rel');

		if ($('.compare-product-checkbox:checked').length > compareMax) {
			$(this).prop('checked', false);
		}

		compareList.find('img[rel="' + productId + '"]').remove();
		productList.remove(productId);

		if (self.is(':checked')) {
			if (compareList.children().length < compareMax) {
				self.closest('article.box-produto').find('.image img:first').clone()
					.attr('rel', productId)
					.appendTo(compareList);
				productList.add(productId);
			}
		}

		compareBox[compareList.children().length > 0 ? 'fadeIn' : 'fadeOut']();
	});

	$('.btn-comparar').on('click', function(e) {
		e.preventDefault();

		var products = productList.toString();
		products = products.replace(/,/g, ';');

		var compareUrl = '/Compare?refp=' + products + '&ReturnUrl=' + escape(document.location.href);

		document.location.href = compareUrl;

	});

	$btnLimpar.on('click', function() {
		$('.compare-product-checkbox').prop('checked', false);
		productList = [];
		window.selectedForComparison = [];
		$('.compare-selection-count').text(0);
		compareList.find('img').remove();
		compareBox[compareList.children().length > 0 ? 'fadeIn' : 'fadeOut']();
	});

});
