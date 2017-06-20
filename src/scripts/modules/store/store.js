'use strict';

var Uri = require('vendors/Uri');
/*var CRM = require('modules/store/crm');*/

require('vendors/jquery.cookie');

var redirect = require('modules/store/redirect');

define('store', function() {

	this.uri = null;
	this.userData = {};
	this.isPersonal = false;
	this.isCorp = false;
	this.isQA = false;


	var publicUrl = [
		'^\/$',
		'/institucional',
		'/pre-home'
	];

	/*var self = this;*/

	this.init = function() {

		this.isPersonal = (/consul/.test(window.jsnomeLoja || window.vtex.accountName || window.location.host)) && !(/consulempresa/.test(window.jsnomeLoja || window.vtex.accountName || window.location.host));

		this.isCorp = /consulempresa/.test(window.jsnomeLoja || window.vtex.accountName || window.location.host);

		this.isQA = /consulqa/.test(window.jsnomeLoja || window.vtex.accountName || window.location.host);

		this.setup();

		this.autoLogin();

		//return this.checkAccess();

		if(this.isCorp) {
			return !this.checkAccess() && redirect.home.call(this);
		}

		return;

	};

	this.setup = function() {
		$.cookie.json = true;

		this.userData = $.cookie('userData') || {};

		try {
			this.uri = new Uri(window.location.href);
		} catch(e) {
			window.location.href = '/';
		}


		$(window).load(function(){
			if (document.body.classList) {
				document.body.classList.add(window.jsnomeLoja);
			} else {
				document.body.className += ' ' + window.jsnomeLoja;
			}
		});
	};

	this.setUserData = function(data, persist) {

		return $.cookie('userData', $.extend(this.userData, data), {
			path: '/',
			expires: persist ? 30 : null
		});
	};

	this.autoLogin = function() {
		if (this.userData.email && this.uri.path() === '/') { //pre-home
			return redirect.login.call(this, this.userData);
		}
	};

	this.logout = function() {
		$.cookie('checkout.vtex.com', null, { expires: 0, path: '/', domain: '.' + window.location.hostname });
		$.removeCookie('userData', {path: '/'});
	};

	this.checkAccess = function() {

		this.isPrivateUrl = !publicUrl.some(function(item) {

			return new RegExp(item, 'i').test(this.uri.path());

		}.bind(this));

		/*if(this.userData) {
			this.userData.partner = 1021540;
		}*/

		return !(!this.userData.approved && this.isPrivateUrl);
	};



	this.init();

});

//window._Common = {}; //keep gtm happy
