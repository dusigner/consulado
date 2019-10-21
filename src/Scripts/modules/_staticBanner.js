Nitro.module('static-banner', function() {

	this.slickStaticBanner = () => {
		var $bannerPrincipal = $(window).width() >= 768 ? $('.banners-static .slider-banner') : '';

		$bannerPrincipal
			.slick({
				autoplay: true,
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
