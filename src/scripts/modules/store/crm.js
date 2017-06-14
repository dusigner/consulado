/* global $: true */

'use strict';

var CRM = {

	clientURI: '/api/ds/pub/documents/CL',
	geURI: '/api/ds/pub/documents/GE',
	ordersURI: '/api/ds/pub/documents/SP',
	cancelGaeURI: '/api/ds/pub/documents/CG',

	getOrderById: function(orderId) {
		return $.ajax({
			url: CRM.ordersURI,
			type: 'GET',
			contentType: 'application/json; charset=utf-8',
			data: {
				f: 'orderId,state,city,status,description,lastChange,finished',
				fq: 'orderId:' + orderId
			}
		});
	},

	insertClient: function(data) {
		return $.ajax({
			url: CRM.clientURI,
			type: 'POST',
			data: JSON.stringify(data),
			contentType: 'application/json; charset=utf-8'
		});
	},

	insertClientGE: function(data) {
		return $.ajax({
			url: CRM.geURI,
			type: 'POST',
			data: JSON.stringify(data),
			contentType: 'application/json; charset=utf-8'
		});
	},

	clientSearchByEmail: function(field) {
		return $.getJSON(CRM.clientURI, {
			f: 'id,userId,email,firstName,lastName,document,phone,xAdditionalPhone,xSkuSalesChannel5',
			fq: 'email:' + field
		}).then(function(res) {
			return res && res.Documents[0];
		});
	},

	clientSearchByCPF: function(cpf) {

		return $.getJSON(CRM.clientURI, {
			f: 'id,userId,email,firstName,lastName,document,phone,xAdditionalPhone,xSkuSalesChannel5',
			fq: 'document:' + cpf
		}).then(function (res) {
			return res && res.Documents;
		});
	},

	clientSearchByID: function(field) {
		return $.getJSON(CRM.clientURI, {
			f: 'id,userId,email,firstName,lastName,document,phone,xAdditionalPhone',
			fq: 'userId:' + field
		}).then(function(res) {
			return res && res.Documents[0];
		});
	},

	insertCancelGae: function(data) {
		return $.ajax({
			url: CRM.cancelGaeURI,
			type: 'POST',
			data: JSON.stringify(data),
			contentType: 'application/json; charset=utf-8'
		});
	}
};

module.exports = CRM;
