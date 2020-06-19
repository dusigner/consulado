Nitro.module('filterFamilySize', function() {

	this.filterSize = () => {
		$('#vitrines-family > div').hide();
		$('#vitrines-family > div:first-of-type').show();


		let $buttons = $('.btn').click(function() {
			$('#vitrines-family > div').fadeIn(450);
			let $card = $('.' + this.id).fadeIn(450);
			$('#vitrines-family > div').not($card).hide();

			$buttons.removeClass('active');
			$(this).addClass('active');
		})
	};

	this.slickVitrineFamilia = () => {
		var $vitrineFamilia = $('#vitrines-family').find('.prateleira>ul').not('.slick-initialized');

		$vitrineFamilia
			.slick({
				autoplay: true,
				dots: true,
				arrows: false,
			});
	};

	this.init = () => {
		this.slickVitrineFamilia();
		this.filterSize();
	};

	this.init();
});
