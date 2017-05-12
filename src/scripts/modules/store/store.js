'use strict';

var Uri = require('vendors/Uri');
var CRM = require('modules/store/crm');

require('vendors/jquery.cookie');

//var redirect = require('modules/store/redirect');

define('store', function() {

	this.uri = null;
	this.userData = {};
	this.isPersonal = false;
	this.isCorp = false;
	this.isQA = false;


	var publicUrl = [
		'^\/$',
		'/institucional',
		'/pap',
		'/Sistema',
		'/landing/blackfriday',
		'/pre-home',
		'/cadastrocorporativo'
	];

	var self = this;

	this.init = function() {

		this.isPersonal = /consul/.test(window.jsnomeLoja || window.location.host);

		this.isCorp = /whpnovosrentaveis/.test(window.jsnomeLoja || window.location.host);

		this.setup();

		//return this.checkAccess();
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



	this.logout = function() {
		$.cookie('checkout.vtex.com', null, { expires: 0, path: '/', domain: '.' + window.location.hostname });
		$.removeCookie('userData', {path: '/'});
	};

	this.checkAccess = function() {
		var valid = false;

		//fake login
		if (valid) {
			return this.setUserData();
		}

		this.isPrivateUrl = !publicUrl.some(function(item) {

			return new RegExp(item, 'i').test(this.uri.path());

		}.bind(this));

		return !(this.isPrivateUrl);
	};



	this.init();

});

//window._Common = {}; //keep gtm happy
