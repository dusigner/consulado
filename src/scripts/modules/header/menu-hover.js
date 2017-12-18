'use strict';

require('../../../templates/customItemMenuDesktop.html');
require('../../../templates/customItemMenuMobile.html');

Nitro.module('menu-hover', function () {
	var controleOver = $('.customItemMenu').text(),
		ItemDesktop = $('.top-navigation .customItemMenu').text(),
		ItemMobile = $('.menu-mobile .customItemMenu').text();

	ItemDesktop = JSON.parse('{' + ItemDesktop + '}');
	ItemMobile = JSON.parse('{' + ItemMobile + '}');

	if (controleOver === '') {
		$('.customItemMenu').addClass('control-hide');
	} else {
		$('nav .item.control').addClass('control-hide');
		$('nav .item').removeClass('control');

		dust.render('customItemMenuDesktop', ItemDesktop, function (err, out) {
			if (err) {
				throw new Error('Modal Warranty Dust error: ' + err);
			}
			$('.top-navigation .customItemMenu').html(out).removeClass('hide');
		});

		dust.render('customItemMenuMobile', ItemMobile, function (err, out) {
			if (err) {
				throw new Error('Modal Warranty Dust error: ' + err);
			}
			$('.menu-mobile .customItemMenu').html(out).removeClass('hide');
		});
	}
});
