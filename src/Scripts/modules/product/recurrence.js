'use strict';

require('Dust/product/recurrence.html');

Nitro.module('recurrence', function() {

	var itemIndex = 0;

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

	// console.log('periods', periods);
	
	this.signExchange = () => {
		vtexjs.checkout.getOrderForm().then((e) => {
			var hasRecurrence = false;
			
			const renderInfoRecurrence = `<a href="" id="exchange-recurrence">CLICK
			</a>`;
			// <span>Troca recomendada a cada ${e.items[0].attachments[0].content.periodo}</span>

			// if(e.items[0].attachmentOfferings[0].name.indexOf('Recorrência') !== -1) {
			hasRecurrence = true;
			$('.sku-selector-container').append(renderInfoRecurrence);

			this.renderInfoRecurrence(e);

			// return false;
			// }
			
			vtexjs.checkout.addItemAttachment(itemIndex, 'Recorrência', periods).done(function() {
				// console.log('fim', e);
			});
			
			return hasRecurrence;
		});

	};	

	this.renderInfoRecurrence = (e) => {
		// console.log('eeee', e);
		dust.render('recurrence', e, function (err, out) {
			
			if (err) {
				throw new Error('RecurrenceSteps Dust error: ' + err);
			}

			$('#exchange-recurrence').on('click', function(e) {
				e.preventDefault();

				$(out).vtexModal();

			});

		});
				
	};

	this.init();
});