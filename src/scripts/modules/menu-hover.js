'use strict';

require('../../templates/customItemMenuDesktop.html');
require('../../templates/customItemMenuMobile.html');

Nitro.module('menu-hover', function() {
	var ItemDesktop = $('.top-navigation .customItemMenu').text();
	var ItemMobile = $('.menu-mobile .customItemMenu').text();


	ItemDesktop = JSON.parse('{' + ItemDesktop + '}');
	ItemMobile = JSON.parse('{' + ItemMobile + '}');

	dust.render('customItemMenuDesktop', ItemDesktop, function(err, out) {
		if (err) {
			throw new Error('Modal Warranty Dust error: ' + err);
		}
		$('.top-navigation .customItemMenu').html(out).removeClass('hide');
	});

	dust.render('customItemMenuMobile', ItemMobile, function(err, out) {
		if (err) {
			throw new Error('Modal Warranty Dust error: ' + err);
		}
		$('.menu-mobile .customItemMenu').html(out).removeClass('hide');
	});
});
