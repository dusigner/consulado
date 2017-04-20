'use strict';

require('../../templates/custom/modal.cupom10off.html');


Nitro.module('modal.cupom10off', function() {


	var categories = ['7', '12', '17'],
		date = new Date();

	this.setup = function() {
		dust.render('modal.cupom10off', {}, function(err, out) {
			if (err) {
				throw new Error('Modal Warranty Dust error: ' + err);
			}

			$(out).vtexModal({
				id: 'cupom-10off',
				destroy: true
			});
		});
	};

	if (categories.indexOf(vtxctx.categoryId) !== -1 && date.getDate() === 22 && date.getMonth() === 1) {
		this.setup();
	}
});
