import { checkInlineDatalayers, pushDataLayer } from 'modules/_datalayer-inline';

Nitro.module('dataLayer-video-button', function() {
	const self = this

	const $document = $(document);


	this.init = () => {
		checkInlineDatalayers();
		this.videoButtonDataLayer();
	};

	this.videoButtonDataLayer = () => {
		console.log('batata');
		$document.on('click', $('.prod-galeria ul.galleryThumbs li a.thumb-video'), function() {
			pushDataLayer(
				`PDP_vitrine_superior`,
                `clique`,
                `video_do_produto`
			)
		});
	};

	this.init();
});
