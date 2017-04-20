'use strict';

require('vendors/vtex-modal-cookie');

Nitro.module('promo.lightbox', function() {


	if (vtxctx && vtxctx.categoryId === 7) {

		$('#modal-napoleao').vtexModal({
			id: 'napoleao',
			cookieOptions: {
				expires: 1,
				path: '/'
			}
		});

	}

});
