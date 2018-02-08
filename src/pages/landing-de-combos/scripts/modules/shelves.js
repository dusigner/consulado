'use strict';

require('./../../templates/prateleira-combos.html');

var Helpers = require('./helpers');

Nitro.module('shelves', function () {

	var self = this,
		discounts = [
			{
				quantity: 6,
				discount: 10
			},
			{
				quantity: 5,
				discount: 8
			},
			{
				quantity: 4,
				discount: 6
			},
			{
				quantity: 3,
				discount: 5
			},
			{
				quantity: 2,
				discount: 5
			},
			{
				quantity: 1,
				discount: 0
			},
			{
				quantity: 0,
				discount: 0
			}
		];

	self.init = function () {
		self.loadPrateleiras();
		self.loadPrice();
	};

	self.actionPrateleiraMobile = function() {
		if ($(window).width() <= 992) {
			$(window).on('load', function () {
				$('#combos .combos-price__real-price').prepend('Todos os produtos por:');
				$('#combos .combos-price__installment-price').prepend('Ou');
			});

			$('.prateleira-combos').each(function() {
				var $prateleiraMobile = $(this),
					imgs = $prateleiraMobile.find('a.combo-product__link img').clone();

				// console.log('images', imgs);
				$(imgs).each(function (index) {
					// console.log('attr', $(this));
					$(this).attr('data-index', index);

					$(this).on('click', function() {
						$prateleiraMobile.find('li').hide();
						$prateleiraMobile.find('li').eq($(imgs).index(this)).fadeIn();
						$prateleiraMobile.find('img').css('border', '1px solid #d3d3d3');
						$('#combos .combos__preteleira').find('img').eq($('.prateleira-combos img').index(this)).css('border', '2px solid #f35216');
					});
				});

				$prateleiraMobile.prepend(imgs);
			});
		}
	};

	self.actionCombo = function () {
		$('.combo-product__button').on('click', function (event) {
			event.preventDefault();
			var quantityInactive = $(this).closest('.combos-prateleira').find('.combo-product--inactive').length,
				quantityTotal = $(this).closest('.combos-prateleira').find('.combo-product').length;

			if( (quantityTotal-quantityInactive) >=3 || $(this).hasClass('combo-product__button--add-item') ) {
				self.toggleCombo(this);
				self.loadQuantity(this);
				self.loadPrice(this);
			}
		});
	};

	self.addTemplatePrateleiras = function (data) {
		dust.render('prateleira-combos', data, function (err, out) {
			if (err) {
				throw new Error('Prateleira Combos Dust error: ' + err);
			}

			$('.combos > .container.combos__preteleira').html(out);

			self.actionCombo();
			self.actionPrateleiraMobile();
		});
	};

	self.loadPrateleiras = function () {

		var prateleira = $('.prateleira-combos'),
			data = {
				prateleiras: []
			};

		prateleira.map(function () {
			var $self = $(this),
				titles = $self.find('h2').text().split('|'),
				title = titles[0],
				subtitle = titles[1],
				quantity = $self.find('ul>li').length;

			// Combos de maximo 6 itens
			if( quantity > 0 && quantity <= 6 ) {
				data.prateleiras.push(
					{
						'title': title,
						'subtitle': subtitle,
						'quantity': quantity,
						'body': $self.find('ul').html()
					}
				);
			}
		});

		self.addTemplatePrateleiras(data);
	};

	self.loadQuantity = function (button) {
		var quantity = $(button).closest('.combos-prateleira').find('.combos-product-kit__quantity'),
			textQuantity = $(button).closest('.combos-prateleira').find('.combos-product-kit__quantity').text();

		$(button).text() === 'Adicionar ao combo' ? textQuantity = self.toggleProduto(textQuantity, true) : textQuantity = self.toggleProduto(textQuantity, false);
		quantity.text(textQuantity);
	};

	self.applyPrice = function(button, prices, quantity) {
		prices = prices || [];

		var $button = $(button),
			totalPrice = $button.closest('.combos-prateleira').find('.combos-price__real-price strong'),
			installmentPrice = $button.closest('.combos-prateleira').find('.combos-price__installment-price-value'),
			textTotalPrice,
			textInstallmentPrice,
			discount = self.getDiscounts(button, quantity),
			discountPrice;

		if( Array.isArray(prices) ) {
			$button.find('.combos-prateleira__product-item .combo-product__price').map(function () {
				prices.push(Helpers.formatFloat($(this).text()));
			});

			textTotalPrice = Helpers.sumPrice(prices);
		} else {
			$button.text() === 'Remover do combo' ? textTotalPrice = self.togglePrice(prices, totalPrice.attr('data-price'), false) : textTotalPrice = self.togglePrice(prices, totalPrice.attr('data-price'), true);
			textTotalPrice = Helpers.formatFloat(textTotalPrice);
		}

		totalPrice.attr('data-price', _.formatCurrency(textTotalPrice));

		$button.closest('.combos-prateleira').find('.combos-finalization__title .combos-finalization__title--strong').text(discount +'%');
		$button.closest('.combos-prateleira').find('.combos-price__list-price strong').text('R$ ' + _.formatCurrency(textTotalPrice));

		discountPrice = ( textTotalPrice * (discount/100) );
		textTotalPrice -= discountPrice;

		textTotalPrice = _.formatCurrency(textTotalPrice);

		textInstallmentPrice = Helpers.getInstallmentPrice(textTotalPrice);

		installmentPrice.text('R$ ' + textInstallmentPrice);
		totalPrice.text('R$ ' + textTotalPrice);
	};

	self.loadPrice = function (button) {

		if (!button) {
			$('.combos-prateleira__product-items').map(function () {
				var prices = [],
					quantity = $(this).find('.combos-prateleira__product-item .combo-product__price').length;

				self.applyPrice(this, prices, quantity);
			});
		} else {
			var prices = $(button).closest('.combo-product').find('.combo-product__price').text(),
				quantity = parseInt($(button).closest('.combos-prateleira').find('.combos-product-kit__quantity').text());

			self.applyPrice(button, prices, quantity);
		}
	};

	self.getDiscounts = function(button, quantity) {
		var result;

		result = discounts.find(function(value) {
			return value.quantity === quantity;
		});

		return result.discount;
	};

	self.toggleCombo = function (combo) {
		var produto = $(combo).closest('.combo-product');
		produto.toggleClass('combo-product--inactive');
		produto.find('.combo-product__button').toggleClass('combo-product__button--active');
	};

	self.toggleProduto = function (textQuantity, operation) {
		var quantity = textQuantity.replace(/[^0-9]/g, ''),
			result = parseInt(quantity);

		operation ? result++ : result--;
		result = result + ' Produtos';
		return result;
	};

	self.togglePrice = function (price, totalPrice, operation) {
		var result;
		price = Helpers.formatFloat(price);
		result = Helpers.formatFloat(totalPrice);
		operation ? result += price : result -= price;
		return result;
	};

	self.init();
});
