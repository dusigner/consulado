/* global $: true, Nitro: true, dust: true */

/*
	ROOT:Tipo do produto, Cor, Mais Informações, Manual do Produto, Marca, Garantia do Fornecedor (mês), Portfólio
	eletro: Consumo Aproximado de Energia (kWh),   Eficiência Energética, Informações para Instalação , Dimensões com embalagem (LxAxP) (cm)
*/

'use strict';

require('Dust/specifications-v2.html');

Nitro.module('specifications-v2', function() {
	var self = this,
		$holder = $('#especificacoes'),
		$caracteristicas = $('#caracteristicas'),
		$especificacoes = $caracteristicas.find('h4.Caracteristicas-Tecnicas + table tr'),
		$arquivos = $caracteristicas.find('h4.Arquivos + table tr'),
		// $body = $('body'),

		specs = {
			'Mais Informações': 'Info',
			'Tipo do produto': 'Tipo',
			'Cor': 'Cor',
			'Garantia do Fornecedor (mês)': 'Garantia',
			'Consumo Aproximado de Energia (kWh)': 'Consumo',
			'Eficiência Energética': 'Eficiência',
			'Garantia do Compressor (meses)': 'Garantia Compressor',
			'Garantia do Microcanal (meses)': 'Garantia Microcanal',
			'Dimensões com embalagem (LxAxP) (cm)': 'dimension-box'
		},
		ignore = ['Manual do Produto', 'Informações para Instalação'],
		data = {
			dimensionsBox:[],
			specs: [],
			items: [],
			downloads: [],
			info: []
		};

	$especificacoes.each(function() {
		var self = $(this),
			key = self.find('.name-field').text(),
			value = self.find('.value-field').text();

		if (ignore.indexOf(key) > 0 || value === '') {
			return;
		}

		if (key in specs) {

			if (key === 'Dimensões com embalagem (LxAxP) (cm)') {
				let dimensionsBox = value.replace(/,/g, '.').split('x');
				data.dimensionsBox = {
					width: parseFloat(dimensionsBox[0]),
					height: parseFloat(dimensionsBox[1]),
					length: parseFloat(dimensionsBox[2])
				}
			} else if (key === 'Mais Informações') {
				let string = value.trim().replace(/"/g, '');
				data.info.push(`${string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()}.`);
			} else {
				data.specs.push({
					key: specs[key],
					value: value + (specs[key].indexOf('garantia') >= 0 ? ' meses' : '')
				});
			}

			//order specs and send info to last
			data.specs.sort(function(item) {
				return (item.key === 'info') ? 1 : -1;
			});
		} else {
			data.items.push({
				key: self.find('.name-field').text(),
				value: self.find('.value-field').text()
			});
		}
	});

	$arquivos.each(function() {
		var self = $(this),
			value = self.find('.value-field').text();

		if (value && value !== '') {
			value = $.getImagePath(value).replace(/ids\/.+\//, '');
		}

		data.downloads.push({
			name: self.find('.name-field').text(),
			file: value
		});
	});

	this.render = function() {
		dust.render('specifications-v2', data, function(err, out) {
			if (err) {
				throw new Error('Specifications Dust error: ' + err);
			}

			$holder.html(out).show();


		});
		this.initScripts(data);
		this.openSection();

		$('.specs__links-content-list:empty, .specs__specs-list:empty, .specs__additionalInfo-content-value:empty, .specs__specs-list:empty').parents('.specs__section').addClass('hide');

		if ($('.specs__footer-content').find('.hide').length === 2) {
			$('.specs__footer-content').addClass('hide');
		}

		const $footerSpecs = $('.specs__footer-content');

		if ($footerSpecs.find('.hide').length === 1 && !$footerSpecs.find('.specs__additionalInfo').hasClass('hide')) {
			$footerSpecs.find('.specs__additionalInfo').addClass('expand');
		}
	};

	//listen only to the first one sku;
	$(document).one('skuFetch', function(e, skuData) {
		if (skuData) {
			data.dimensions = {
				height: skuData.RealHeight,
				width: skuData.RealWidth,
				length: skuData.RealLength,
				weight: skuData.RealWeightKg
			};

			data.dimensionsBox.weight = skuData.RealWeightKg;
		}

		self.render();
	});

	this.initScripts = (data) => {
		const elementSelector = $('.specs__measure-selector'),
			elementBox = $('.specs__measure-box h4');


		elementSelector.find('a:first').addClass('active');
		$(`.specs__measure-box h4[data-selector=${elementSelector.find('a:first').attr('data-selector')}]`).addClass('active');

		elementSelector.find('a').on('click', function() {
			elementSelector.find('a').removeClass('active');
			elementBox.removeClass('active');

			$(this).addClass('active');
			$(`.specs__measure-box h4[data-selector=${$(this).attr('data-selector')}]`).addClass('active');
		});

		if (data.dimensionsBox.width === undefined) {
			$('.specs__measure-selector-withBox').addClass('hideElement');
		}
	};

	this.openSection = function() {
		$('.specs__measure, .specs__items, .specs__specs, .specs__additionalInfo, .specs__links').find('h4').on('click', function() {
			let $this = $(this);
			$this.toggleClass('specActive');
			$this.parents('.specs__section').toggleClass('inactive');
		});


	}
});
