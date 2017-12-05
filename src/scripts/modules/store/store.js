'use strict';

var Uri = require('vendors/Uri');
/*var CRM = require('modules/store/crm');*/

require('vendors/jquery.cookie');

var redirect = require('modules/store/redirect');

define('store', function() {

	this.uri          = null;
	this.userData     = {};
	this.isPersonal   = false;
	this.isCorp       = false;
	this.isQA         = false;
	this.isTelevendas = false;
	this.accountName  = 'consul';

	var publicUrl = [
		'^\/$',
		'/institucional',
		'/pre-home'
	];

	/*var self = this;*/

	this.init = function() {

		var bodyClass = $('body').attr('class'),
			account = 'consul';
		if( bodyClass.indexOf('consulqa') !== -1) {
			account = 'consulqa2';
			if(bodyClass.indexOf('consulqa2') === -1) {
				account = 'consulqa';
			}
		} else if( bodyClass.indexOf('consulempresa') !== -1) {
			account = 'consulempresa';
		}

		this.isPersonal = (/consul/.test(window.jsnomeLoja || window.vtex.accountName || window.location.host)) && !(/consulempresa/.test(window.jsnomeLoja || window.vtex.accountName || window.location.host)) && !(/consulqa2/.test(window.jsnomeLoja || window.vtex.accountName || window.location.host));

		this.isCorp = /consulempresa/.test(window.jsnomeLoja || window.vtex.accountName || window.location.host) || /consulqa2/.test(window.jsnomeLoja || window.vtex.accountName || window.location.host);

		this.isQA = /consulqa/.test(window.jsnomeLoja || window.vtex.accountName || window.location.host) || account;

		this.accountName = window.jsnomeLoja || window.vtex.accountName || account;

		this.isTelevendas = $('.vtex-call-center-operator').length !== 0 ? true : false;

		this.setup();

		// return this.checkAccess();

		if( this.isCorp ) {
			this.autoLogin();

			// Trocar URL logo para empresas
			$('.logo').attr('href', '/empresas');

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

		var approved = false;

		if(this.userData && this.userData.xValidationPJ !== 'reprovado') {
			approved = true;
		}

		return !(!approved && this.isPrivateUrl);
		//return true;
	};

	this.init();

});

//window._Common = {}; //keep gtm happy
