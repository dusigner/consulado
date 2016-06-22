/* global $: true, Nitro: true */

require('vendors/vtex-modal');

Nitro.module('sku-select', function() {

	'use strict';
	
	var self = this;
	
	this.modalComplete = function( modal, content ){

		/*content.on('change', 'input', function() {
			
			var input = $(this);

			$('input[id="' + $(this).attr('for') + '"]').prop('checked', true);

			input.prop('checked', true);
		});*/
		
		// because we can't have two radios with the same name in a page;
		content.wrap( $('<form />') );

		content.on('click', 'label', function() {
			//e.preventDefault();

			$(this).prev().trigger('click');
		});
	};
	
	this.buttonHandler = function(e, id, message){
		
		if( message === 'Por favor, selecione o modelo desejado.' ) {

			$('#modal-sku').vtexModal({
				complete: self.modalComplete
			});
		}
	};

	$('.buy-button').on('buyButtonFailedAttempt.vtex', this.buttonHandler);
	
});

