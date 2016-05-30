require('vendors/vtex-modal-cookie');

Nitro.module('modal.overlayAbandono', function(){

	'use strict';

	var self = this;

	this.setup = function() {
		var content = $('#modal-overlay-abandono')
						.find('.prateleira');

		if(content.length > 0) {
			$( 'body' ).on('mouseleave',function(e) {
				var hasSession = sessionStorage.getItem('overlayAbandono');
				if ( (e.pageY - $(window).scrollTop()) <= 1 && !hasSession ) {
			  		self.render();
				}
			});
		}
	};

	this.render = function() {
		$('#modal-overlay-abandono').vtexModal({
			destroy: true,
			cookieOptions: { expires: 1, path: '/' }
		});

		var button = '<a target="_top" class="btn-eu-quero" style="display:block">Eu Quero</a>';
		//$('.btn-eu-quero').remove();
		$('#modal-overlay-abandono .prod-info').append(button);

		sessionStorage.setItem('overlayAbandono', true);
	};

	self.setup();

});