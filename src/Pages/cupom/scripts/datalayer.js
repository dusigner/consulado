class DataLayer {

	setup()  {

		if( !dataLayer ) return;

		const copyCoupon = $('.vitrine-desconto__card-cupom-button'),
			boxProduct = $('.box-produto'),
			slickLeft = $('.slick-prev'),
			slickRight =$('.slick-next');

		copyCoupon.on('click', function() {
			dataLayer.push({
				event: 'generic-event-trigger',
				category: $(this).siblings('.vitrine-desconto__card-cupom-codigo').text(),
				action: 'Copiar código!',
				label: 'Página Cupom de Desconto - Copiar código do cupom'
			});>
		});

		boxProduct.find('a').on('click', function() {
			dataLayer.push({
				event: 'generic-event-trigger'
				// ,
				// category: $(this).siblings('.vitrine-desconto__card-cupom-codigo').text(),
				// action: 'Copiar código!',
				// label: 'Página Cupom de Desconto - Copiar código do cupom'
			});
		});
	}
}