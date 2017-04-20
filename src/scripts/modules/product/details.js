/* global $: true, Nitro: true, dust: true */
'use strict';

require('../../../templates/details.html');

Nitro.module('details', function() {


	var $detalhes = $('#detalhes'),
		$modules = $('#caracteristicas h4[class*="Modulo"] + table'),
		data = {},
		styleMap = [{
			item: 'item-half item-single',
			text: 'text-left col-v2 l5',
			image: ''
		}, {
			item: 'item-full',
			text: 'text-left col-v2 l7 m12 offset-l2',
			image: ''
		}, {
			item: 'item-half item-right',
			text: 'text-left col-v2 l4',
			image: ''
		}, {
			item: 'item-half',
			text: 'text-right col-v2 l4',
			image: ''
		}, {
			item: 'item-extrafull item-center',
			text: 'col-v2 l6 offset-l4 m12 offset-m3',
			image: ''
		}];

	if ($modules.length === 0) {
		return;
	}

	data.items = $.map($modules, function(item, i) {

		var values = $(item).find('.value-field');

		return {
			title: values.filter('[class*="Titulo"]').text(),
			text: values.filter('[class*="Texto"]').html(),
			image: $.getImagePath(values.filter('[class*="Imagem"]').text()),
			style: styleMap[i]
		};
	});

	// console.log('details data', data);

	dust.render('details', data, function(err, out) {
		if (err) {
			throw new Error('Details Dust error: ' + err);
		}

		$detalhes.html(out).show();

		$(document).trigger('nav', 'detalhes');
	});


});
