/* global $: true */

'use strict';

var CRM = {

	clientURI: '/api/ds/pub/documents/CL',
	geURI: '/api/ds/pub/documents/GE',
	ordersURI: '/api/ds/pub/documents/SP',
	cancelGaeURI: '/api/ds/pub/documents/CG',
	addressURI: '/api/ds/pub/documents/AD',

	getOrderById: function (orderId) {
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

	insertClient: function (data) {
		return $.ajax({
			url: CRM.clientURI,
			type: 'POST',
			data: JSON.stringify(data),
			contentType: 'application/json; charset=utf-8'
		});
	},

	insertClientGE: function (data) {
		return $.ajax({
			url: CRM.geURI,
			type: 'POST',
			data: JSON.stringify(data),
			contentType: 'application/json; charset=utf-8'
		});
	},

	clientSearchByEmail: function (field) {
		return $.getJSON(CRM.clientURI, {
			f: 'id,userId,email,firstName,lastName,document,phone,xAdditionalPhone,xSkuSalesChannel5,corporateDocument,corporateName,tradeName,stateRegistration,approved,xDisapproved',
			fq: 'email:' + field
		}).then(function (res) {
			return res && res.Documents[0];
		});
	},

	clientSearchByID: function (field) {
		return $.getJSON(CRM.clientURI, {
			f: 'id,userId,email,firstName,lastName,document,phone,xAdditionalPhone,xSkuSalesChannel5,corporateDocument,corporateName,tradeName,stateRegistration,approved,xDisapproved',
			fq: 'userId:' + field
		}).then(function (res) {
			return res && res.Documents[0];
		});
	},
	clientSearchByDocument: function (document, type) {

		type = type ? type : 'document';

		return $.getJSON(CRM.clientURI, {
			f: 'approvedid,userId,email,firstName,lastName,document,phone,xAdditionalPhone,xSkuSalesChannel5,corporateDocument,corporateName,tradeName,stateRegistration',
			fq: type + ':' + document
		}).then(function (res) {
			return res && res.Documents;
		});
	},
	clientSearchByCorporateDocument: function (document) {

		return $.getJSON(CRM.clientURI, {
			f: 'approved,id,userId,email,firstName,lastName,document,phone,xAdditionalPhone,corporateDocument',
			fq: 'corporateDocument:' + document
		}).then(function (res) {
			return res && res.Documents[0];
		});
	},

	insertCancelGae: function (data) {
		return $.ajax({
			url: CRM.cancelGaeURI,
			type: 'POST',
			data: JSON.stringify(data),
			contentType: 'application/json; charset=utf-8'
		});
	},

	insertLocation: function(data) {
		return $.ajax({
			url: CRM.addressURI,
			type: 'POST',
			data: JSON.stringify(data),
			contentType: 'application/json; charset=utf-8'
		});
	}
};

module.exports = CRM;
