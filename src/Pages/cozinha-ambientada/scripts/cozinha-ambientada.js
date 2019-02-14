/**
 *
 * @fileOverview
 *
 */
'use strict';


import './../Dust/mosaic-banner.html';

Nitro.setup([], function() {

	var hasSlideActive = false;

	this.init = () => {
		this.buildMosaic();
		this.setListeners();
	};

	/* Build Mosaic Banner */
	this.buildMosaic = () => {
		const data = this.getDataFromPlaceholders();

		dust.render('mosaic-banner', data, function (err, out) {
			if (err) {
				throw new Error('Mosaic Dust error: ' + err);
			}

			$('.cozinha-ambientada__mosaic.mosaic-banner').append(out);
		});
	};

	/* Build a object with only usefull data from placeholders */
	this.getDataFromPlaceholders = () => {
		let data = {},
			iterator = 0;

		$('.cozinha-ambientada-placeholders__item').each(function() {
			const $this = $(this);
			let banners = $this.find('.box-banner');

			data[iterator] = {
				banner: $(banners[0]).find('img').attr('src'),
				text: $this.text(),
				detail: $(banners[1]).find('img').attr('src')
			};

			++iterator;
		});

		return data;
	};

	this.setListeners = () => {

		/* Button to toggle banner item modal */
		$('.-js-toggle-active-item').on('click', function() {
			handleActiveItem(this);
		});

		var handleActiveItem = (toggleActiveEl) => {
			const	$activeButton 	=	$(toggleActiveEl);
			const	$itemSlide		=	$activeButton.parent().parent();

			if (!hasSlideActive) {
				$itemSlide.addClass('-is-active');
				$('body').addClass('-displaying-mosaic-item');

				hasSlideActive = true;
			} else {
				$itemSlide.removeClass('-is-active');
				$('body').removeClass('-displaying-mosaic-item');

				hasSlideActive = false;
			}
		};
	};

	this.init();
});
