'use strict';

require('Dust/product/recurrence.html');

Nitro.module('recurrence', function() {
	var self = this;

	this.init = () => {
		this.signExchange();
	};

	// Object with recurrences
	const periods = {
		'W10320833'  : '4 meses',
		'000340510'  : '6 meses',
		'326023173'  : '4 meses',
		'W10322320'  : '6 meses', 
		'326070989'  : '6 meses',
		'W10324578'  : '6 meses',
		'326027999'  : '4 meses',
		'326075868'  : '4 meses',
		'W10501072'  : '4 meses',
		'W11043747'  : '4 meses',
		'W10349302'  : '6 meses',

		'CIX01AXONA' : '9 meses',
		'CIX06AXONA' : '6 meses',
		'C3L02AB'    : '9 meses',
		'C3L02ABANA' : '6 meses',
		'W10601110' : '6 meses'
	};
	
	// Render infos recurrence page product
	this.signExchange = () => {	
		let sku = [];				
		$.each(periods, function (i) {
			let skuProduct = $('.productReference').text() === i ? true : false;
			if (skuProduct) {
				let productInfo = window.skuJson;
				sku.period = periods[i];
				sku.productName = productInfo.name;
				sku.productImage = productInfo.skus[0].image;
				sku.productSku = productInfo.skus[0].sku;
				sku.productId = productInfo.productId;
				sku.productSellerId = productInfo.skus[0].sellerId;
				const renderInfoRecurrence = `<div class="recurrence-step">
												<a href="javascript:void(0)" id="exchange-recurrence" class="recurrence-step-exchange">
													<div class="recurrence-step-container">
													<div class="recurrence-step-text">
														<p class="recurrence-step-title">Troca recomendada a cada ${sku.period}</p>
														<p class="recurrence-step-message">Assine e receba um novo próximo da data de troca</p>
														<p class="recurrence-step-link">Saiba mais</p>
													</div>
												</div>
											</a>
										</div>`;
			
				$(renderInfoRecurrence).insertAfter('.prod-sku-selector');
			}				
		});
		
		this.renderInfoRecurrence(sku);
	};	

	// Render modal recurrence page page product with Dust Render
	this.renderInfoRecurrence = (sku) => {		

		dust.render('recurrence', sku, function (err, out) {			
			
			if (err) {
				throw new Error('RecurrenceSteps Dust error: ' + err);
			}

			$('#exchange-recurrence').on('click', function(e) {
				e.preventDefault();

				$('html').addClass('overflow-hidden');

				$(out).vtexModal();

				/** Create and insert all mobile buttons */
				let mobileButtons = `<div class="modal-recurrence__cta-buttons cta-mobile">
										<a href="javascript:void(0)" class="modal-recurrence__cta -mobile -buy-recurrence primary-button text-uppercase js-recurrence-add -teste-b">Comprar produto e assinar</a>
										<a href="javascript:void(0)" class="modal-recurrence__cta -mobile -buy primary-button text-uppercase js-recurrence-add -teste-b">Comprar produto</a>
									</div>`;

				$(mobileButtons).insertAfter('#modal-recurrence');

				/** Create an add recurrence function */
				$('.-buy-recurrence').on('click', function() {
					var recurrenceSku = {
						id: sku.productSku,
						quantity: 1,
						seller: sku.productSellerId
					};
					vtexjs.checkout.getOrderForm().done(function(orderForm) {
						let recurrenceItemIndex = orderForm.items.findIndex(e => e.id === sku.productSku.toString());
						if (recurrenceItemIndex > -1) {
							vtexjs.checkout.addItemAttachment(recurrenceItemIndex, 'Recorrência', {periodo : sku.period}).then(function() { 
								window.location.href = "/checkout/#/cart";
							});
						} else {
							vtexjs.checkout.addToCart([recurrenceSku], null, window.jssalesChannel).done(function(orderForm) {	
								recurrenceItemIndex = orderForm.items.findIndex(e => e.id === sku.productSku.toString());
								vtexjs.checkout.addItemAttachment(recurrenceItemIndex, 'Recorrência', {periodo : sku.period}).then(function() { 
									window.location.href = "/checkout/#/cart";
								});
							});
						}
					});
				});

				/** Create an add non recurrence function */
				$('.-buy').on('click', function() {
					var recurrenceSku = {
						id: sku.productSku,
						quantity: 1,
						seller: sku.productSellerId
					};
					vtexjs.checkout.getOrderForm().done(function(orderForm) {
						let recurrenceItemIndex = orderForm.items.findIndex(e => e.id === sku.productSku.toString());
						if (recurrenceItemIndex > -1) {
							vtexjs.checkout.addToCart([recurrenceSku], null, window.jssalesChannel).done(function() {	
								window.location.href = "/checkout/#/cart";	
							});
						} else {
							window.location.href = "/checkout/#/cart";
						}
					});
				});

				/** Create a close function when user clicks outside of modal or click on X or press Escape*/
				$('.close.i-close').on('click', function() {
					self.closeAll();
				});

				$(window).on('closeVtexModal', function() {
					self.closeAll();
				});
					
			});
		});			
	};

	this.closeAll = function() {
		$('#vtex-modal-recurrence').fadeOut(300);
		$('.cta-mobile').fadeOut(300, function() {
			$('.cta-mobile').remove();
		});
		$('html').removeClass('overflow-hidden');
	};

	this.init();
});