'use strict';

Nitro.module('orders.recurrence', function() {
	$(document).ajaxComplete(function( event, xhr, settings ){
		if( (/subscriptions\/me/.test( settings.url ))) {
			$('.subscription-title').each(function() {
				var $self = $(this);
				$self.add($self.next('.delivery-container')).wrapAll('<div class="recurrence__delivery"></div>');
			});

			$('.recurrence__delivery').each(function() {
				$(this).find('.subscription-title').clone().appendTo($(this)).addClass('subscription-title--active');
			});
		}
	});
});