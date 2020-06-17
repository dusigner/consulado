Nitro.module('filterFamilySize', function() {

	this.filterSize = () => {
		$('#parent > div').hide();
		$('#parent > div:first-of-type').show();


		let $buttons = $('.btn').click(function() {
			$('#parent > div').fadeIn(450);
			let $card = $('.' + this.id).fadeIn(450);
			$('#parent > div').not($card).hide();

			$buttons.removeClass('active');
			$(this).addClass('active');
		})
	};

	this.slickVitrineFamilia = () => {
		var $bannerPrincipal = $('.banners-static .slider-banner');

		$bannerPrincipal
			.slick({
				autoplay: true,
				autoplaySpeed: 7000,
				mobileFirst: true,
				dots: true,
				arrows: false,
			});
	};

	this.init = () => {
		this.slickVitrineFamilia();
	};

	this.init();
});
