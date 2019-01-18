'use strict';

require('Dust/product/recurrence.html');

Nitro.module('recurrence', function() {

	this.init = () => {
		this.signExchange();
	};

	// Object with recurrences
	const periods = {
		'W10515645'  : '6 meses',
		'326070989'  : '6 meses',
		'326070749'  : '2 meses',
		'326070783'  : '2 meses',
		'326027570'  : '2 meses',
		'W10738288'  : '2 meses',
		'W10324578'  : '6 meses',
		'W10322320'  : '6 meses',
		'W10637798'  : '6 meses',
		'CIX01AXONA' : '36 semanas',
		'CIX06AXONA' : '6 meses',
		'C3L02AB'    : '36 semanas',
		'C3L02ABANA' : 'diaria',
		'W10601110' : '6 meses'
	};
	
	// Render infos recurrence page product
	this.signExchange = () => {
		
		vtexjs.checkout.getOrderForm().then((e) => {						
			$.each(periods, function (i) {
				let skuProduct = window.skuJson.skus[0].skuname === i ? true : false,				
					sku;
				
				if (skuProduct) {
					sku = periods[i];

					const renderInfoRecurrence = `<a href="" id="exchange-recurrence">
													<b>Troca recomendada a cada ${sku}</b>
													<span>Assine e receba um novo próximo da data de troca</span>
													<span>Saiba mais</span>
												</a>`;
				
					$('.sku-selector-container').append(renderInfoRecurrence);
				}				
			});

			this.renderInfoRecurrence(e);
		});

	};	

	// Render modal recurrence page page product with Dust Render
	this.renderInfoRecurrence = (e) => {		

		let item = {
			id: skuJson.skus[0].sku,
			quantity: 1,
			seller: '1'
		};
		
		dust.render('recurrence', e, function (err, out) {			
			
			if (err) {
				throw new Error('RecurrenceSteps Dust error: ' + err);
			}

			$('#exchange-recurrence').on('click', function(e) {
				e.preventDefault();

				$(out).vtexModal();

				vtexjs.checkout.addToCart([item], null, window.jssalesChannel)
					.done(function() {
						const buyButtonRecurrence = $('#BuyButton'),
							cloneButton = $('#buy-button-recurrence');

						// console.log('cloneButton', cloneButton);

						buyButtonRecurrence.clone().appendTo(cloneButton);
					});
			});

		});
				
	};

	// Render mode recurrence button Modal
	this.addRecurrenceToCart = () => {

		const $btnRecurrence = $('.js-recurrence-add-cart');
		let item = 0;

		$btnRecurrence.on('click', function (e) {
			e.preventDefault();
			vtexjs.checkout.addItemAttachment(item, 'Recorrência' /*,content*/).then(function() {
				$('#modal-recurrence').modal('hide');
			});
		});
	};

	this.init();
});