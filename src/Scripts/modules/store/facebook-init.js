/* global FB:true */

'use strict';

Nitro.module('facebook-init', function() {
	var fbAppId = '1720337217990103'; // [ PROD ]

	if (window.location.host.indexOf('vtexcommercestable') >= 0) {
		fbAppId = '176573039585667'; // [ QA ]
	}

	//Iniciando SDK Facebook
	window.fbAsyncInit = function() {
		FB.init({
			appId: fbAppId,
			xfbml: true,
			version: 'v2.10'
		});
		//FB.AppEvents.logPageView();
	};

	(function(d, s, id) {
		var js,
			fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) {
			return;
		}
		js = d.createElement(s);
		js.id = id;
		js.src = '//connect.facebook.net/en_US/sdk.js';
		fjs.parentNode.insertBefore(js, fjs);
	})(document, 'script', 'facebook-jssdk');
});
