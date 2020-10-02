'use strict'

import {
	checkInlineDatalayers,
	pushDataLayer
} from 'modules/_datalayer-inline';

Nitro.module('dataLayer-produto-institucional', function () {
	self.init = () => {
		checkInlineDatalayers();
		self.tagProdInstitucional();
	};

	self.tagProdInstitucional = () => {
		$('.card-body-blog .btn-saiba-mais').on('click', function () {

			let option = $(this).parent().find('.card-title-blog').text().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\-]+/g, '_').toLowerCase();
			pushDataLayer(
				'PDP_institucional', //event
				'facilita_consul_pdp', //category
				`saiba_mais_${option}` //label
			);
		});

		$('.card-blog').on('click', function () {
			let option = $(this).find('.card-title-blog').text().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\-]+/g, '_').toLowerCase();
			pushDataLayer(
				'PDP_institucional', //event
				'facilita_consul_pdp', //category
				`${option}` //label,
			);
		});


		// Check if element is on the screen
		$.fn.isOnScreen = function (x, y) {
			if (x == null || typeof x == 'undefined') x = 1;
			if (y == null || typeof y == 'undefined') y = 1;

			var win = $(window);

			var viewport = {
				top: win.scrollTop(),
				left: win.scrollLeft()
			};
			viewport.right = viewport.left + win.width();
			viewport.bottom = viewport.top + win.height();

			var height = this.outerHeight();
			var width = this.outerWidth();

			if (!width || !height) {
				return false;
			}

			var bounds = this.offset();
			bounds.right = bounds.left + width;
			bounds.bottom = bounds.top + height;

			var visible = !(
				viewport.right < bounds.left ||
				viewport.left > bounds.right ||
				viewport.bottom < bounds.top ||
				viewport.top > bounds.bottom
			);

			if (!visible) {
				return false;
			}

			var deltas = {
				top: Math.min(1, (bounds.bottom - viewport.top) / height),
				bottom: Math.min(1, (viewport.bottom - bounds.top) / height),
				left: Math.min(1, (bounds.right - viewport.left) / width),
				right: Math.min(1, (viewport.right - bounds.left) / width)
			};

			return (
				deltas.left * deltas.right >= x && deltas.top * deltas.bottom >= y
			);
		};

		// Tag viability
		var firstAppearanceBlogFacilita = true;
		var intervalBlogFacilita = null;

		$(window).on('scroll', function () {
			setTimeout(function () {
				// Features
				if (
					firstAppearanceBlogFacilita &&
					$('#container-blog-facilita').isOnScreen(1, 0.5)
				) {
					var counter = 0;

					intervalBlogFacilita = setInterval(function () {
						counter++;
						if (counter >= 12) {
							clearInterval(intervalBlogFacilita);
							return;
						} else {
							if (
								counter == 1 &&
								$('#container-blog-facilita').isOnScreen(1, 0.5)
							) {
								dataLayer.push({
									event: 'generic',
									category: 'PDP_institucional',
									action: 'facilita_consul_pdp',
									label: 'viability_facilita_1s'
								});
							} else if (
								counter == 4 &&
								$('#container-blog-facilita').isOnScreen(1, 0.5)
							) {
								dataLayer.push({
									event: 'generic',
									category: 'PDP_institucional',
									action: 'facilita_consul_pdp',
									label: 'viability_facilita_4s'
								});
							} else if (
								counter == 10 &&
								$('#container-blog-facilita').isOnScreen(1, 0.5)
							) {
								dataLayer.push({
									event: 'generic',
									category: 'PDP_institucional',
									action: 'facilita_consul_pdp',
									label: 'viability_facilita_10s'
								});
							}
						}
					}, 1000);

					firstAppearanceBlogFacilita = false;
				}

				if ($('#container-blog-facilita')[0].getBoundingClientRect().bottom < 0) {
					clearInterval(intervalBlogFacilita);
				}
			}, 500);
		});
	};
	self.init();
});
