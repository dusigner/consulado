Nitro.module('static-banner', function() {

	this.slickStaticBanner = () => {
		var $bannerPrincipal = $(window).width() >= 768 ? $('.banners-static .slider-banner') : '';

		$bannerPrincipal
			.slick({
				autoplay: true,
				autoplaySpeed: 7000,
				mobileFirst: true,
				dots: true,
				arrows: false,
				responsive: [
					{
						breakpoint: 568,
						settings: {
							arrows: true
						}
					}
				]
			});
	};

	this.init = () => {
		this.slickStaticBanner();
	};

	this.init();
});
