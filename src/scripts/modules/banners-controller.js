'use strict';

var Index = {

	init: function () {
		this.calcQntBanners();
		this.validBanners();
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
	},

	validBanners: function () {

		if($('.banner-secundario').children().length > 0 ) {
			$('.banners-secundarios').show();
		} else {
			$('.banners-secundarios').hide();
		}

		if($('.banner-secundario-mosaico').children().length > 0 ) {
			$('.banners-secundarios-mosaico').show();
		} else {
			$('.banners-secundarios-mosaico').hide();
		}

		//banners secundarios prevent empty
		if( $('.banner-secundario-mobile:empty').length === 2 ) {
			$('.banners-secundarios-mobile').hide();
		}
	}

};

Index.init();
