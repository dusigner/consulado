const Ofertas = {
	showcaseRegularCervejeiras: () => {
		let showcase = $('.vitrine-promocoes').find('.adicional');

		$(window).resize(function() {
			const widthPage = $(window).width();

			if (widthPage < 960) {
				$('.vitrine-promocoes .prateleira>ul')
					.not('.slick-initialized')
					.slick({
						infinite: false,
						arrows: true,
						dots: true,
						slidesToShow: 1,
						slidesToScroll: 1
					});
			} else {
				if ($('.vitrine-promocoes .prateleira>ul').hasClass('slick-initialized')) {
					$('.vitrine-promocoes .prateleira>ul').slick('unslick');
				}
			}
		});

		showcase.each(function(index, element) {
			let parcel = $(element).find('strong');
			if (parcel.length > 0) {
				let text = `${parcel
					.eq(0)
					.text()
					.toLowerCase()
					.replace('r$ ', 'R$')} ${parcel
					.eq(1)
					.text()
					.toLowerCase()
					.replace('r$ ', 'R$')}`;

				$(element).append(`<p class="preco-parcelado"> ${text} </p>`);
			}
		});
	}
};

export default Ofertas;
