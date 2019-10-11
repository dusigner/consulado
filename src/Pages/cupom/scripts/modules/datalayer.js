class DataLayer {

	setup()  {

		if( !dataLayer ) return;

		const pushDataLayer = (cat, act, lbl) => {
			dataLayer.push({
				event: 'generic',
				category: cat,
				action: act,
				label: lbl
			})
		}

		const copyCoupon = $('.vitrine-desconto__card-cupom-button'),
			boxProduct = $('.box-produto'),
			slickLeft = $('.slick-prev'),
			slickRight =$('.slick-next');

		copyCoupon.on('click', function() {
			pushDataLayer($(this).siblings('.vitrine-desconto__card-cupom-codigo').text(), 'Copiar código!', 'Página Cupom de Desconto - Copiar código do cupom');
		});

		boxProduct.find('a').on('click', function() {
			pushDataLayer(($(this).parents('.detalhes').find('.nome').text() + ' - ' + $(this).parents('.mx-auto').find('.vitrine-desconto__card-cupom-codigo').text() + ' - ' + $(this).parents('.slick-slide').attr('data-slick-index')), 'Clique no Produto', 'Página Cupom de Desconto - Ver produto na página');
		});

		slickLeft.on('click', function() {
			pushDataLayer(('Scroll para a esquerda - ' + $(this).parents('.mx-auto').find('.vitrine-desconto__card-cupom-codigo').text()), 'Scroll para a esquerda', 'Seta esquerda');
		});

		slickRight.on('click', function() {
			pushDataLayer(('Scroll para a direita - ' + $(this).parents('.mx-auto').find('.vitrine-desconto__card-cupom-codigo').text()), 'Scroll para a direita', 'Seta direita');
		});
	}
}

export default DataLayer;