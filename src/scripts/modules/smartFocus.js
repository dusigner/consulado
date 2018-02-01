'use strict';

require('modules/helpers');

Nitro.module('smartFocus', function() {

	var cookieIPI = window.getCookie('IPI') || '',
		UID = cookieIPI.match(/UsuarioGUID=[a-zA-Z0-9\-]+/ig);
	if ($(window).width() <= 667) {
		var bannerTemplate = '<div class="box-banner box-smart-mobile">' +
							'<a href="http://api-public-p3-eu1.advisor.smartfocus.com/api-public/3.0/click/1?a=3d025fc8-2cab-4670-87d7-6ff64cb4e869&e=11032&uc={0}&l=en&cacheTimeout=0&channel=web&pos=default">' +
								'<img class="smartfocus-banner" src="http://renderer-p3-eu1.advisor.smartfocus.com/api-public/3.0/personaliseemail?a=3d025fc8-2cab-4670-87d7-6ff64cb4e869&uc={0}&e=11032&f=gif&l=pt&h=360&w=360&cacheTimeout=0&channel=web&pos=default"  alt="SmartFocus Personalisation" />' +
							'</a>' +
						'</div>';
	}else {
		bannerTemplate = '<div class="box-banner box-smart-desk">' +
							'<a href="http://api-public-p3-eu1.advisor.smartfocus.com/api-public/3.0/click/1?a=3d025fc8-2cab-4670-87d7-6ff64cb4e869&e=10897&uc={0}&l=en&cacheTimeout=0&channel=web&pos=default">' +
								'<img class="smartfocus-banner" src="http://renderer-p3-eu1.advisor.smartfocus.com/api-public/3.0/personaliseemail?a=3d025fc8-2cab-4670-87d7-6ff64cb4e869&uc={0}&e=10897&f=gif&l=en&h=340&w=1900&cacheTimeout=0&channel=web&pos=default" height="268" width="1500" alt="SmartFocus Personalisation" />' +
							'</a>' +
						'</div>';
	}

	if(UID && UID.length >= 0) {
		UID = [UID[0].replace('UsuarioGUID=', '')];
	} else {
		UID = [window.getCookie('janus_sid')] || 1;
	}

	this.renderBanner = function($container) {
		$container = $container || $('.banners .banner-principal.slides, .banners-mobile .banner-principal.slides');

		$container.prepend(bannerTemplate.render(UID));

		$('.smartfocus-banner').load(function() {
			if($(this).height() > 1000) {
				$(this).remove();
			}
		});
	};
});
