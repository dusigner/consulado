require('vendors/vtex-modal-cookie');

Nitro.module('promo.lightbox', function(){

	'use strict';

	if(vtxctx && vtxctx.categoryId === 7) {

		$('#modal-napoleao').vtexModal({
			id: 'napoleao',
			cookieOptions: { expires: 1, path: '/' }
		});

	}

});