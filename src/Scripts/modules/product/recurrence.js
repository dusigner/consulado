'use strict';

require('Dust/product/recurrence.html');

Nitro.module('recurrence', function() {

	$('body').addClass('-teste-b');

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
		'C3L02AB'    : '6 meses',
		'C3L02ABANA' : 'diaria'
	};
	
	// Render infos recurrence page product
	this.signExchange = () => {	
		let sku = [];				
		$.each(periods, function (i) {
			let skuProduct = $('.productReference').text() === i ? true : false;

			if (skuProduct) {
				sku.period = periods[i];
				const renderInfoRecurrence = `<div class="recurrence-step">
												<a href="" id="exchange-recurrence" class="recurrence-step-exchange">
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
	this.renderInfoRecurrence = (e) => {		
				
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