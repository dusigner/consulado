'use strict';

var Index = {

	init: function () {
		this.calcQntBanners();
	},

	calcQntBanners: function () {

		var $banners = $('.banner-secundario-mosaico');
		var qntBanners = $banners.size();

		$banners.removeClass('one-banner');
		$banners.removeClass('two-banner');

		if(qntBanners === 1) {
			$banners.parent().addClass('one-banner');
		} else if (qntBanners === 2) {
			$banners.parent().addClass('two-banner');
		} else {
			$banners.parent().removeClass('one-banner');
			$banners.parent().removeClass('two-banner');
		}
	}

};

Index.init();
