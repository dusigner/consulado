/* global $: true, Nitro: true, dust: true, _: true, vtxctx: true */
'use strict';

require('Dust/details.html');
require('Dust/detailsLancamento.html');
require('../../vendors/jquery.whp-modal');

Nitro.module('details', function() {
	var $detalhes = $('#detalhes'),
		data = {
			items: [],
			releaseImg: '',
			category: '',
			skus: ''
		},
		$lancamento = $('#caracteristicas h4.Lancamento + table'),
		isLancamento = $lancamento.find('.value-field.Lancamento').text() === 'Sim',
		$modules = $('#caracteristicas h4[class*="Modulo"] + table'),
		styleMap = [
			{
				item: 'item-full',
				text: 'text-left',
				image: 'image-right'
			},
			{
				item: 'item-half',
				text: 'text-right',
				image: 'image-left'
			},
			{
				item: 'item-half',
				text: 'text-left',
				image: 'image-right'
			},
			{
				item: 'item-half',
				text: 'text-right',
				image: 'image-left'
			},
			{
				item: 'item-full',
				text: '',
				image: ''
			}
		];

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

	console.log('details data', data);

	if (isLancamento) {
		data.releaseImg = $.getImagePath($lancamento.find('.value-field.Imagem-Lancamento').text());
		data.category = _.sanitize(vtxctx.categoryName);
		data.skus = vtxctx.skus;

		dust.render('detailsLancamento', data, function(err, out) {
			if (err) {
				throw new Error('Details Dust error: ' + err);
			}

			$detalhes.html(out).show();

			$(document).trigger('nav', 'detalhes');
		});

		var $bullet = $('.js-release-bullet');

		$.each(data.items, function(i, v) {
			$bullet.filter(':eq(' + i + ')').data('modal', v);
		});

		$bullet.whpModal({
			title: '',
			content: function() {
				return (
					'<div class="modal-release__content">' +
					'<p class="modal-release__title">' +
					this.data('modal').title +
					'</p>' +
					'<p class="modal-release__text">' +
					this.data('modal').text +
					'</p>' +
					'</div>' +
					'<div class="modal-release__image">' +
					'<img src="' +
					this.data('modal').image +
					'" alt="' +
					this.data('modal').title +
					'" title="' +
					this.data('modal').title +
					'" width="520" height="330" />' +
					'</div>'
				);
			},
			aditionalClass: 'modal-release',
			outerNav: true
		});

		return;
	}

	dust.render('details', data, function(err, out) {
		if (err) {
			throw new Error('Details Dust error: ' + err);
		}

		$detalhes.html(out).show();

		$(document).trigger('nav', 'detalhes');
	});
});
