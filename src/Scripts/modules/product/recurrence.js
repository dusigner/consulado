'use strict';

require('Dust/product/recurrence.html');

Nitro.module('recurrence', function() {

	this.init = () => {
		this.signExchange();
	};

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
	
	this.signExchange = (sku) => {
		
		vtexjs.checkout.getOrderForm().then((e) => {
			var hasRecurrence = false;			
			
			$.each(periods, function (i) {
				let sku;
				
				if (i === e.items[0].refId) {
					sku = periods[i];
					// console.log('sku', periods[i]);
				}				
				
				return sku;
			});		
			
			// verifies that the product has recurrence
			if(e.items[0].attachmentOfferings[0].name.indexOf('Recorrência') !== -1) {				
				hasRecurrence = true;

				const renderInfoRecurrence = `<a href="" id="exchange-recurrence">CLICK
					<span>Troca recomendada a cada ${sku}</span>
				</a>`;
				
				$('.sku-selector-container').append(renderInfoRecurrence);

				this.renderInfoRecurrence(e);
				
				return false;
			}

			return hasRecurrence;
		});

	};	

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

				vtexjs.checkout.addToCart([item], null, window.jssalesChannel)
					.done(function(/*orderForm*/) {
						// console.log(orderForm);
						$(out).vtexModal();
					});
			});

		});
				
	};

	this.init();
});