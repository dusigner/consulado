'use strict';

var Uri = require('vendors/Uri');
// var CRM = require('modules/store/crm');

var redirect = require('modules/store/redirect');

define('store', function() {

	this.uri          = null;
	this.userData     = {};
	this.isPersonal   = false;
	this.isCorp       = false;
	this.isQA         = false;
	this.isTelevendas = false;
	this.salesChannel = null;
	this.accountName  = 'consul';

	var publicUrl = [
		'^\/$', // eslint-disable-line
		'/institucional',
		'/pre-home'
	];

	var self = this;

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

		this.isQA = /consulqa/.test(window.jsnomeLoja || window.vtex.accountName || window.vtex.vtexid.accountName || window.location.host);

		this.accountName = window.jsnomeLoja || window.vtex.accountName || account;

		this.setup();

		this.checkTelevendas();

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

		try {
			this.uri = new Uri(window.location.href);
		} catch(e) {
			window.location.href = '/';
		}

		this.userData = $.cookie('userData') || {};
		this.salesChannel = this.uri.getQueryParamValue('sc') || window.jssalesChannel || (this.isCorp ? '2' : '1');

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

		var approved = false;

		if(Object.keys(this.userData).length && this.userData.xValidationPJ !== 'reprovado') {
			approved = true;
		}

		if ( this.isTelevendas ) {
			approved = true;
		}

		return !(!approved && this.isPrivateUrl);
	};

	this.checkTelevendas = function() {
		$(window).on('orderFormUpdated.vtex', function(e, orderform) {
			if ( orderform.userType  === 'callCenterOperator' ) {
				self.isTelevendas = true;
			}
		});
	};

	this.init();

});

//window._Common = {}; //keep gtm happy
