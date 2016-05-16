/* global $: true */

'use strict';

var CRM = {

	clientURI: '/api/ds/pub/documents/CL',

	insertClient: function (data) {
		return $.ajax({
			url: CRM.clientURI,
			type: 'POST',
			data: JSON.stringify(data),
			contentType: 'application/json; charset=utf-8'
		});
	},

	clientSearchByEmail: function (field) {

		return $.getJSON(CRM.clientURI, {
			f: 'id,userId,email,firstName,lastName,document,phone,xAdditionalPhone',
			fq: 'email:' + field
		}).then(function (res) {
			return res && res.Documents[0];
		});
	},

	clientSearchByID: function (field) {

		return $.getJSON(CRM.clientURI, {
			f: 'id,userId,email,firstName,lastName,document,phone,xAdditionalPhone',
			fq: 'userId:' + field
		}).then(function (res) {
			return res && res.Documents[0];
		});
	}
};

module.exports = CRM;