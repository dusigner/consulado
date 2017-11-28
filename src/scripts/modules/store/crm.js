/* global $: true */

'use strict';

var CRM = {

	baseURL: '/{accountName}/dataentities/{table}/{action}',

	ajax: function(options) {

		return $.ajax($.extend({}, {
			accept: 'application/vnd.vtex.ds.v10+json',
			contentType: 'application/json; charset=utf-8',
			headers: {
				'REST-Range': 'resources=0-100'
			}
		}, options));

	},

	formatUrl: function(table, action) {
		return CRM.baseURL.render({
			accountName: window.jsnomeLoja || window.vtex.accountName || store.accountName,
			table: table,
			action: action
		});
	},

	getOrderById: function (orderId) {
		return $.getJSON(CRM.formatUrl('GE', 'search'), {
			_fields: 'orderId,state,city,status,description,lastChange,finished',
			orderId: orderId
		});
	},

	insertClient: function (data) {
		return CRM.ajax({
			url: CRM.formatUrl('CL', 'documents'),
			type: 'PATCH',
			data: JSON.stringify(data)
		});
	},

	insertClientGE: function (data) {
		return CRM.ajax({
			url: CRM.formatUrl('GE', 'documents'),
			type: 'PATCH',
			data: JSON.stringify(data)
		});
	},

	clientSearchByEmail: function (field) {
		return $.getJSON(CRM.formatUrl('CL', 'search'), {
			_fields: 'id,userId,email,firstName,lastName,document,phone,homePhone,xAdditionalPhone,xSkuSalesChannel5,corporateDocument,corporateName,tradeName,stateRegistration,xValidationPJ',
			email: field
		}).then(function (res) {
			return res && res[0];
		});
	},

	clientSearchByID: function (field) {
		return $.getJSON(CRM.formatUrl('CL', 'search'), {
			_fields: 'id,userId,email,firstName,lastName,document,phone,xAdditionalPhone,xSkuSalesChannel5,corporateDocument,corporateName,tradeName,stateRegistration,xValidationPJ',
			userId: field
		}).then(function (res) {
			return res && res[0];
		});
	},

	clientSearchByDocument: function (document, type) {

		type = type ? type : 'document';

		return $.getJSON(CRM.formatUrl('CL', 'search'), {
			_fields: 'approvedid,userId,email,firstName,lastName,document,phone,xAdditionalPhone,xSkuSalesChannel5,corporateDocument,corporateName,tradeName,stateRegistration,xStatusPJ',
			_where: type + '=' + document
		}).then(function (res) {
			return res;
		});
	},

	getCotasByCPF: function(field) {
		return $.getJSON(CRM.formatUrl('CL', 'search'), {
			_fields: 'xSkuSalesChannel5',
			document: field
		}).then(function(res) {
			return res;
		});
	},

	clientSearchByCorporateDocument: function (document) {

		return $.getJSON(CRM.formatUrl('CL', 'search'), {
			_fields: 'approved,id,userId,email,firstName,lastName,document,phone,xAdditionalPhone,corporateDocument,xStatusPJ',
			corporateDocument: document
		}).then(function (res) {
			return res && res[0];
		});
	},

	insertCancelGae: function (data) {
		return CRM.ajax({
			url: CRM.formatUrl('CG', 'documents'),
			type: 'PATCH',
			data: JSON.stringify(data)
		});
	},

	insertLocation: function (data) {
		return CRM.ajax({
			url: CRM.formatUrl('AD', 'documents'),
			type: 'PATCH',
			data: JSON.stringify(data)
		});
	},

	insertTermsGae: function (data) {
		return CRM.ajax({
			url: CRM.formatUrl('TG', 'documents'),
			type: 'PATCH',
			data: JSON.stringify(data)
		});
	},

	insertCadastroSerialize: function (data) {
		return CRM.ajax({
			url: CRM.formatUrl('CD', 'documents'),
			type: 'PATCH',
			data: JSON.stringify(data)
		});
	}
};

module.exports = CRM;
