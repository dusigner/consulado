'use strict'

import {
	checkInlineDatalayers,
	pushDataLayer
} from 'modules/_datalayer-inline';

Nitro.module('dataLayer-produto-institucional', function () {
	self.init = () => {
		checkInlineDatalayers();
		self.tagProdInstitucional();
	};

	self.tagProdInstitucional = () => {
		$('.card-body-blog .btn-saiba-mais').on('click', function () {

			let option = $(this).parent().find('.card-title-blog').text().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\-]+/g, '_').toLowerCase();
			pushDataLayer(
				'PDP_institucional', //event
				'facilita_consul_pdp', //category
				`saiba_mais_${option}` //label
			);
		});

		$('.card-blog').on('click', function () {
			let option = $(this).find('.card-title-blog').text().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\-]+/g, '_').toLowerCase();
			pushDataLayer(
				'PDP_institucional', //event
				'facilita_consul_pdp', //category
				`${option}` //label,
			);
		});
	};
	self.init();
});
