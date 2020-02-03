Nitro.module('static-banner', function() {

	this.slickStaticBanner = () => {
		var $bannerPrincipal = $('.banners-static .slider-banner');

		$bannerPrincipal
			.slick({
				autoplay: false,
				autoplaySpeed: 7000,
				mobileFirst: true,
				dots: true,
				arrows: false
			});
	};

	this.init = () => {
		this.slickStaticBanner();
	};

	this.init();
});
