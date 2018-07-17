/* global store: true */

'use strict';

var CRM = {

	ordersURI: $.cookie('vtex-current-user') ? '/api/checkout/pub/orders/?customerEmail=' + $.cookie('vtex-impersonated-customer-email') : '/api/checkout/pub/orders/',
	statusPedidoURI: '/api/ds/pub/documents/SP',
	omsURI: '/api/oms/user/orders/',
	recurrenceURI: '/api/' + window.jsnomeLoja + '/subscriptions/',

	getOrders: function() {
		return $.getJSON(CRM.ordersURI).then(function(res) {
			return res;
		});
	},

	getOrderById: function(orderId) {
		//promessa que retorna uma promessa que se não for cumprida, mesmo assim eu falo que cumpri
		var dfd = jQuery.Deferred(); //retorna nova promise que sempre resolve (feels bad, mas é p/ usar o "promiseall" do jquery)

		$.ajax({
			url: CRM.statusPedidoURI,
			type: 'GET',
			contentType: 'application/json; charset=utf-8',
			data: {
				f: 'orderId,state,city,status,description,lastChange,finished',
				fq: 'orderId:' + orderId
			}
		}).always(function(res) {
			if( res && res.Documents && res.Documents.length > 0 ) {
				dfd.resolve(res.Documents[0]);
			} else {
				dfd.resolve(false);
			}
		});

		return dfd.promise();
	},

	getOmsById: function(orderId) {
		//promessa que retorna uma promessa que se não for cumprida, mesmo assim eu falo que cumpri
		var dfd = jQuery.Deferred(); //retorna nova promise que sempre resolve (feels bad, mas é p/ usar o "promiseall" do jquery)

		$.ajax({
			url: CRM.omsURI + orderId,
			type: 'GET',
			contentType: 'application/json; charset=utf-8'
		}).always(function(res) {
			if( res
				&& res.packageAttachment
				&& res.packageAttachment.packages
				&& res.packageAttachment.packages.length > 0 ) {
				dfd.resolve(res);
			} else {
				dfd.resolve(false);
			}
		});

		return dfd.promise();
	},

	cancelOrder: function(id, data) {
		return $.ajax({
			url: CRM.ordersURI + id + '/user-cancel-request',
			type: 'POST',
			dataType: 'json',
			data: JSON.stringify(data)
		}).then(function(res) {
			return res;
		});
	},

	getRecurrences: function() {
		return $.ajax({
			url: CRM.recurrenceURI + 'me',
			headers: {
				'Content-Type': 'application/json',
				'vtexidclientautcookie': $.cookie('VtexIdclientAutCookie')
			},
			type: 'GET',
			dataType: 'json'
		}).then(function(res) {
			return res;
		});
	},

	pauseRecurrence: function(id, data) {
		return $.ajax({
			url: CRM.recurrenceURI + id,
			type: 'PATCH',
			data: data
		}).then(function(res) {
			return res;
		});
	},

	getAccounts: function(id) {
		return $.getJSON(CRM.recurrenceURI + id + '/accounts').then(function(res) {
			res.subscription = id;
			return res;
		});
	},

	changeAccount: function(id, data) {
		return $.ajax({
			url: CRM.recurrenceURI + id + '/accounts',
			headers: {
				'Content-Type': 'application/json',
				'vtexidclientautcookie': $.cookie('VtexIdclientAutCookie')
			},
			type: 'PUT',
			dataType: 'json',
			data: JSON.stringify(data)
		}).then(function(res) {
			return res;
		});
	},

	getAddresses: function(id) {
		return $.getJSON(CRM.recurrenceURI + id + '/addresses').then(function(res) {
			res.subscription = id;
			return res;
		});
	},

	updateItem: function(id, item, data) {
		return $.ajax({
			url: CRM.recurrenceURI + id + '/items/' + item,
			type: 'PATCH',
			data: data
		}).then(function(res) {
			return res;
		});
	},

	deleteItem: function(id, item) {
		return $.ajax({
			url: CRM.recurrenceURI + id + '/items/' + item,
			headers: {
				'Content-Type': 'application/json',
				'vtexidclientautcookie': $.cookie('VtexIdclientAutCookie')
			},
			type: 'DELETE'
		}).then(function(res) {
			return res;
		});
	}
};

module.exports = CRM;