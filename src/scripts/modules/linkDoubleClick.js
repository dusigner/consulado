'use strict';
var Uri = require('vendors/Uri');

Nitro.module('linkDoubleClick', function () {

	var self = this,
		linkDoubleClick;

	this.init = function() {
		linkDoubleClick = new linkWithDoubleClick();
		linkDoubleClick.init();
	};

	var linkWithDoubleClick = function () {
		var app = this,
			$linkBanner = $('.box-banner > a'),
			linkBannerAtualizado,
			banners = [];

		app.getParameterLinkAlternate = function (link) {

			var uri = new Uri(link),
				parameters = uri.queryPairs;

			return parameters.find(function (parameter) {
				return parameter[0] === 'link-alternate';
			});
		};

		app.searchBannesWithDoubleClick = function () {

			linkBannerAtualizado = $linkBanner.filter(function() {
				return $(this).attr('href');
			});
		};

		app.createObjectBanners = function() {
			
			linkBannerAtualizado.map(function(index) {

				if ($(this).attr('href')) {
					var link = $(this).attr('href');
					if (app.getParameterLinkAlternate(link)) {
						var left = link;
						var right = app.getParameterLinkAlternate(link)[1];
						banners.push({
							'position': index,
							'left': left,
							'right': right
						});
					}
				}
			});
		};

		app.checkClick = function () {

			banners.map(function(banner) {
				var linkBanner = $(linkBannerAtualizado.get(banner.position));
				var widthBanner = linkBanner.find('img').get(0).clientWidth;

				$(linkBanner).on('click', function(event){
					event.preventDefault();
					
					if(event.offsetX > (widthBanner/2)) {
						$(window.document.location).attr('href', banner.right);
					} else {
						$(window.document.location).attr('href', banner.left);
					}
				});
			});
		};

		app.init = function () {
			app.searchBannesWithDoubleClick();
			app.createObjectBanners();
			app.checkClick();
		};

		return app;
	};
	
	self.init();
});