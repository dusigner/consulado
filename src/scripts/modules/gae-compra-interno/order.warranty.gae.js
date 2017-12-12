'use strict';

var CRM = require('modules/store/crm');
var ORDERCRM = require('modules/store/orders-crm');
require('../../../templates/gae-compra-interno.html');
require('../../../templates/gae-compra-interno/priceInfo.html');
require('../../../templates/gae-compra-interno/productInfo.html');
require('../../../templates/gae-compra-interno/warrantyInfo.html');
require('../../../templates/gae-compra-interno/warrantySpare.confirm.html');
require('../../../templates/gae-compra-interno/warrantySpare.emptyWarranty.html');
require('../../../templates/gae-compra-interno/warrantySpare.payment.html');
require('../../../templates/gae-compra-interno/warrantySpare.profile.html');

Nitro.module('order.warranty.gae', function() {
	var self = this,
		boxOrder = {},
		allOrders = [],
		idCurrentOrder,
		indexProductSelected,
		idPlanSelected,
		profileData,
		dateNow = new Date(),
		loading = '<div class="load"><div class="loading"></div></div>',
		$slider = $('.garantia-estendida-compra>.content-gae');

	var PDVBox = {

		username: 'compracerta',

		password: '8MUKHL5VSqeK8YaFCngUYcpuZZnn2WA4',

		// Chamadas de ambiente de Produção

		getPlansURI: 'https://pdvbox.nxd.com.br/compracerta/api/v2/product/',

		addPlanURI: 'https://pdvbox.nxd.com.br/compracerta/api/v2/purchase/',

		cancelPlanURI: 'https://pdvbox.nxd.com.br/compracerta/api/v2/purchase/cancel/',

		printPlanURI: 'https://pdvbox.nxd.com.br/compracerta/api/v2/print/',

		statusPaymentURI: 'https://pdvbox.nxd.com.br/compracerta/api/v2/purchase/status/',

		// Chamadas de ambiente de QA

		// getPlansURI: 'http://compracerta.nxd.com.br/api/v2/product/',

		// addPlanURI: 'http://compracerta.nxd.com.br/api/v2/purchase/',

		// cancelPlanURI: 'http://compracerta.nxd.com.br/api/v2/purchase/cancel/',

		// printPlanURI: 'http://compracerta.nxd.com.br/api/v2/print/',

		// statusPaymentURI: 'http://compracerta.nxd.com.br/api/v2/purchase/status/',

		addPlan: function(data) {
			return $.post(PDVBox.addPlanURI, JSON.stringify(data)).then(function(res) {
				res = JSON.parse(res);

				return res;
			});
		}
	};

	this.init = function() {
		//inicia passo a passo ('slider')
		$slider.not('.slick-initialized').slick({
			dots: false,
			arrows: false,
			fade: true,
			infinite: false,
			speed: 500,
			slidesToShow: 1,
			slidesToScroll: 1,
			swipe: false
		});

		$('.breadcrumb a[href="#orders"]').click(function(){
			$slider.slick('slickGoTo', 0);
		});

		$('.breadcrumb a[href="#profile"]').click(function(){
			$slider.slick('slickPrev');
		});

		$('.breadcrumb a[href="#payment"]').click(function(){
			$slider.slick('slickNext');
		});

		$slider.on('beforeChange', function(event, slick, currentSlide, nextSlide){
			//scrolltop
			$('html, body').animate({ scrollTop: 0 }, 600);

			if (nextSlide === 0) {
				$('.breadcrumb a[href=#orders]').addClass('active');
				$('.breadcrumb a[href=#orders]').parent().nextAll().find('a').removeClass('inactive show active');

				self.getPlans(allOrders);
			} else {
				$('.breadcrumb .active').addClass('show');
				$('.breadcrumb .active').removeClass('active');

				if (nextSlide === 1) {
					$('.breadcrumb a[href=#profile]').addClass('active');

					self.renderProfileData();

					if(idPlanSelected === '9683'){
						dataLayer.push({ event: 'GAE Purchase', step: 'step1', tipo: '+ 1 ano de Garantia Estendida' });
					}
					if(idPlanSelected === '9684'){
						dataLayer.push({ event: 'GAE Purchase', step: 'step1', tipo: '+ 2 ano de Garantia Estendida' });
					}


				} else if (nextSlide === 2) {
					$('.breadcrumb a[href=#payment]').addClass('active');

					self.renderPayment();

					if(idPlanSelected === '9683'){
						dataLayer.push({ event: 'GAE Purchase', step: 'step2', tipo: '+ 1 ano de Garantia Estendida' });
					}
					if(idPlanSelected === '9684'){
						dataLayer.push({ event: 'GAE Purchase', step: 'step2', tipo: '+ 2 ano de Garantia Estendida' });
					}

					$('#iframe-pagamento').load(function() {
						$.get(boxOrder[idCurrentOrder].linkPayment).error(function() {
							self.alert('erro-pagamento', 'Ocorreu algum erro, tente novamente');
						});
					});
				} else if (nextSlide === 3) {
					$('.breadcrumb a[href=#confirm]').addClass('active');

					$('.breadcrumb a[href="#profile"], .breadcrumb a[href="#payment"]').addClass('inactive');

					if(idPlanSelected === '9683'){
						dataLayer.push({ event: 'GAE Purchase', step: 'step3', tipo: '+ 1 ano de Garantia Estendida' });
					}
					if(idPlanSelected === '9684'){
						dataLayer.push({ event: 'GAE Purchase', step: 'step3', tipo: '+ 2 ano de Garantia Estendida' });
					}


					self.renderConfirmation();
				}
			}
		});
	};

	this.alert = function(id, text, time) {
		var delay = time || 5000;

		$('<div class="alert-box" id="' + id + '">' + text + '</div>').hide().prependTo('body').fadeIn();
		setTimeout(function() {
			$('.alert-box#' + id).fadeOut('400', function() {
				$(this).remove();
			});
		}, delay);
	};

	this.formatDate = function(date) {
		var from = date.split('/');
		return from[1] + '/' + from[0] + '/' + from[2];
	};

	this.setup = function(orders) {
		vtexjs.checkout.getOrderForm().done(function(res){
			profileData = res.clientProfileData;
			self.getPlans(orders);

		});
	};

	this.getPlans = function(orders) {
		$('#orders').empty();
		allOrders = [];

		$.each(orders, function(indexOrder, order) {
			$.each(order.products, function(indexProduct, product) {
				var data = {
					transaction: {
						login: {
							username: PDVBox.username,
							password: PDVBox.password
						},
						product: {
							sku: product.refId,
							price: product.sellingPrice / 100
						},
						client: {
							id: profileData.email
						},
						sale: {
							id: order.orderGroup,
							sale_date: order.formattedDate
						}
					}
				};

				$.post(PDVBox.getPlansURI, JSON.stringify(data)).then(function(res) {
					res = JSON.parse(res);

					if (res.message === 'Coverages found') {
						$.each(res.coverages, function(i) {
							res.coverages[i].price = 'R$ ' + _.formatCurrency(res.coverages[i].price);

							if (res.coverages[i].period === 12) {
								res.coverages[i].name = '+ 1 ano de Garantia Estendida';
							} else {
								res.coverages[i].name = '+ 2 anos de Garantia Estendida';
							}
						});

						order.products[indexProduct].plans = {};
						order.products[indexProduct].plans = res;
					}

					if (indexProduct === order.products.length - 1 && indexOrder === orders.length - 1) {
						self.reduceOrder(orders);
					}
				});
			});
		});
	};

	this.reduceOrder = function(orders) {
		$.each(orders, function(index, order){
			orders[index].products = order.products.filter(function(product){
				return typeof product.plans !== 'undefined';
			});

			if (order.products.length > 0) {
				allOrders.push(order);
			}
		});

		if(allOrders.length === 0) {
			self.renderEmptyWarranty();
		} else {
			$.each(allOrders, function(index,order){
				self.getOrderInfo(order);
			});
		}
	};

	this.getOrderInfo = function(order) {
		idCurrentOrder = order.orderGroup;

		boxOrder[idCurrentOrder] = {};
		boxOrder[idCurrentOrder].id = order.orderGroup;
		boxOrder[idCurrentOrder].orderId = order.orderId;
		boxOrder[idCurrentOrder].orderIdFormatted = order.orderIdFormatted;
		boxOrder[idCurrentOrder].orderGroup = order.orderGroup;
		boxOrder[idCurrentOrder].status = order.currentState.orderLabel;
		boxOrder[idCurrentOrder].formattedDate = order.formattedDate;
		boxOrder[idCurrentOrder].name = order.name;
		boxOrder[idCurrentOrder].street = order.address.street;
		boxOrder[idCurrentOrder].neighborhood = order.address.neighborhood;
		boxOrder[idCurrentOrder].city = order.address.city;
		boxOrder[idCurrentOrder].state = order.address.state;
		boxOrder[idCurrentOrder].postalCode = order.address.postalCode;
		boxOrder[idCurrentOrder].complement = order.address.complement;
		boxOrder[idCurrentOrder].addresstype = order.address.addressType;
		boxOrder[idCurrentOrder].number = order.address.number;
		boxOrder[idCurrentOrder].reference = order.address.reference;

		var timestampDays = 334*86400*1000,
			timestampOrder = new Date(order.orderDate).getTime(),
			limitBuyDate = $.formatDatetimeBRL(timestampDays + timestampOrder);

		boxOrder[idCurrentOrder].limitBuyDate = limitBuyDate;
		boxOrder[idCurrentOrder].products = order.products;

		self.getProductInfo();
	};

	this.getProductInfo = function() {
		$.each(boxOrder[idCurrentOrder].products, function(i) {
			var product = {};

			product.id = boxOrder[idCurrentOrder].products[i].id;
			product.refId = boxOrder[idCurrentOrder].products[i].refId;
			product.name = boxOrder[idCurrentOrder].products[i].name;
			product.sellingPrice = boxOrder[idCurrentOrder].products[i].sellingPrice;
			product.imageUrl = boxOrder[idCurrentOrder].products[i].imageUrl;
			product.plans = boxOrder[idCurrentOrder].products[i].plans;
			product.plans.orderId = boxOrder[idCurrentOrder].orderId;

			boxOrder[idCurrentOrder].products[i] = product;
		});

		self.renderOrder();
	};

	this.renderOrder = function() {
		dust.render('gae-compra-interno', boxOrder[idCurrentOrder], function(err, out) {
			if (err) {
				throw new Error('My Orders Dust error: ' + err);
			}

			$('.load').remove();

			$('#orders').append(out); // adiciona pedido no DOM

			var divList = $('.box-my-orders'); // pega todos os pedidos no DOM

			// reordena as divs pela data do pedido
			divList.sort(function(a, b){
				return new Date(self.formatDate($(b).data('order-date'))).getTime() - new Date(self.formatDate($(a).data('order-date'))).getTime();
			});

			$('#orders').html(divList); // remonta o DOM reordenado

			var height = $('#orders').height();
			$slider.find('.slick-list').height(height);

			var $product = $('.box-my-orders .order-products');

			//primeiro box vem selecionado
			$product.find('.gae-content .box-plan:first-child input').prop('checked',true);
			$product.find('.gae-content .box-plan:first-child .wrapper').addClass('selected');

			//seleciona box que for clicado
			$product.find('.gae-content .box-plan input').click(function(){
				$(this).parents('form').find('.selected').removeClass('selected');
				$(this).parents('.wrapper').addClass('selected');
			});

			// click em 'COMPRAR'
			$product.find('.confirm').click(function(){
				idCurrentOrder = $(this).data('id');
				indexProductSelected = $(this).parents('.order-products').index();
				idPlanSelected = $(this).parents('.order-products').find('input:checked').val();

				$slider.slick('slickNext');
			});
		});
	};

	this.renderProfileData = function() {
		$('#profile').append(loading);

		return CRM.clientSearchByEmail(profileData.email).done(function(user) {
			boxOrder[idCurrentOrder].currentProduct = boxOrder[idCurrentOrder].products[indexProductSelected];

			dust.render('warrantySpare.profile', $.extend({}, user, boxOrder[idCurrentOrder]), function(err, out) {
				if (err) {
					throw new Error('Modal Warranty Dust error: ' + err);
				}

				$('.load').remove();

				$('#profile').html(out);

				$('.back').click(function(){
					$slider.slick('slickPrev');
				});

				var height = $('#profile').outerHeight();
				$slider.find('.slick-list').height(height);

				$('.profile-info .confirm').click(function(){
					self.addWarranty(user);
				});
			});
		});
	};

	this.addWarranty = function(user) {
		var data = {
			transaction: {
				login: {
					username: PDVBox.username,
					password: PDVBox.password
				},
				product: {
					sku: boxOrder[idCurrentOrder].currentProduct.refId,
					price: boxOrder[idCurrentOrder].currentProduct.sellingPrice
				},
				client: {
					id: profileData.email,
					cpf: user.document,
					name: user.firstName + ' ' + user.lastName,
					address1: boxOrder[idCurrentOrder].street,
					address2: boxOrder[idCurrentOrder].complement || 'nenhum',
					addrnum: boxOrder[idCurrentOrder].number,
					city: boxOrder[idCurrentOrder].city,
					state: boxOrder[idCurrentOrder].state,
					zip: boxOrder[idCurrentOrder].postalCode,
					phone: user.phone,
					email: profileData.email
				},
				sale: {
					id: boxOrder[idCurrentOrder].id,
					store: 32,
					sale_date: $.formatDatetime(dateNow, '-')
				},
				plan: {
					id: idPlanSelected
				}
			}
		};

		$.getJSON(ORDERCRM.omsURI + boxOrder[idCurrentOrder].orderId).then(function (result) {
			//pega data de faturamento do pedido
			if (result && result.packageAttachment && result.packageAttachment.packages && result.packageAttachment.packages.length > 0) {
				data.transaction.sale.sale_date = $.formatDatetime(result.packageAttachment.packages[0].issuanceDate, '-');
			}

			PDVBox.addPlan(data).done(function (res) {
				if (res.message === 'Sale inserted' || res.message === 'Sale already inserted') {
					$.each(boxOrder[idCurrentOrder].currentProduct.plans.coverages, function (i) {
						if (boxOrder[idCurrentOrder].currentProduct.plans.coverages[i].id === parseInt(idPlanSelected)) {
							boxOrder[idCurrentOrder].warrantyPrice = boxOrder[idCurrentOrder].currentProduct.plans.coverages[i].price;

							if (boxOrder[idCurrentOrder].currentProduct.plans.coverages[i].period === 12) {
								boxOrder[idCurrentOrder].warrantyPeriod = '1 ano';
							} else {
								boxOrder[idCurrentOrder].warrantyPeriod = '2 anos';
							}
						}
					});

					boxOrder[idCurrentOrder].linkPayment = res.link;

					$slider.slick('slickNext');
				}
			}).fail(function () {
				self.alert('erro-addplan', 'Ocorreu algum erro, tente novamente');
			});
		});
	};

	this.renderPayment = function() {
		$('#payment').append(loading);

		dust.render('warrantySpare.payment', boxOrder[idCurrentOrder], function(err, out) {
			if (err) {
				throw new Error('Modal Warranty Dust error: ' + err);
			}

			$('.load').remove();

			$('#payment').html(out);

			$('.back').click(function(){
				$slider.slick('slickPrev');
			});

			var height = $('#payment').outerHeight();
			$slider.find('.slick-list').height(height);

			var url = '';

			$(document).ajaxComplete(function(event, xhr, settings) {
				if (/purchase\/form/.test(settings.url)) {
					var session = settings.url.split('/form/')[1];

					if (session !== undefined) {
						url = PDVBox.statusPaymentURI + session;
					}
				}
			});

			var interval = setInterval(function(){
				$.get(url,function(res){
					res = JSON.parse(res);

					if (res.status) {
						$slider.slick('slickNext');
						clearInterval(interval);
					}
				});
			}, 1000);
		});
	};

	this.renderConfirmation = function() {
		$('#confirm').append(loading);

		dust.render('warrantySpare.confirm', boxOrder[idCurrentOrder], function(err, out) {
			if (err) {
				throw new Error('Modal Warranty Dust error: ' + err);
			}

			$('.load').remove();

			$('#confirm').html(out);

			var height = $('#confirm').outerHeight();
			$slider.find('.slick-list').height(height);
		});
	};

	this.renderEmptyWarranty = function() {
		$('.load').remove();

		dust.render('warrantySpare.emptyWarranty', {}, function(err, out) {
			if (err) {
				throw new Error('My Orders Dust error: ' + err);
			}

			$('#orders').append(out);
		});
	};


	self.init();
});
