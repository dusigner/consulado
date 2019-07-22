import { pushDataLayer } from 'modules/_datalayer-inline';

Nitro.module('dataLayer-cervejeira', function() {
	this.trocarCor = () => {
		$('.cervejeira-selecao-cores').on('afterChange', function() {
			const color = $(this)
				.find('.cervejeira-selecao-cores__item.slick-active')
				.data('color');

			pushDataLayer(
				`[Squad} Cervejeira Consul ${color}`,
				'Trocar cor cervejeira',
				`Trocar cor da cervejeira ${color}`
			);
		});
	};

	this.galleryImageChange = () => {
		$('.gallery').on('beforeChange', (event, slick, currentSlide, nextSlide) => {
			pushDataLayer(`[Squad] Foto ${nextSlide + 1}`, 'Trocar Foto', `Trocar Foto ${nextSlide + 1}`);
		});
	};

	this.changeSkuSmartbeer = () => {
		$(window).on('cervejeira.skuChanged', (e, data) => {
			pushDataLayer(
				`[Squad] Escolher Voltagem Cervejeira Consul smartbeer_ Carbono ${data.skuName}`,
				'Escolher Voltagem',
				`Escolher Voltagem Cervejeira Consul smartbeer_ Carbono ${data.skuName}`
			);
		});
	};

	this.clickVideo = () => {
		$('.cervejeiras-videos__video').click(() => {
			pushDataLayer('[Squad] Assistir Vídeo', 'Play no vídeo', 'Play no vídeo');
		});
	};

	this.init = () => {
		this.trocarCor();
		this.galleryImageChange();
		this.changeSkuSmartbeer();
		this.clickVideo();
	};
});
