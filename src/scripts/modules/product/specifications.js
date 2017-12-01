/* global $: true, Nitro: true, dust: true */

/*
	ROOT:Tipo do produto, Cor, Mais Informações, Manual do Produto, Marca, Garantia do Fornecedor (mês), Portfólio
	eletro: Consumo Aproximado de Energia (kWh),   Eficiência Energética, Informações para Instalação , Dimensões com embalagem (LxAxP) (cm)
*/

'use strict';

require('../../../templates/specifications.html');

Nitro.module('specifications', function() {


	var self = this,
		$holder = $('#especificacoes .container'),
		$caracteristicas = $('#caracteristicas'),
		$especificacoes = $caracteristicas.find('h4.Caracteristicas-Tecnicas + table tr'),
		$arquivos = $caracteristicas.find('h4.Arquivos + table tr'),
		accordionBtnProduct = $('.content-toggle .title'),
		accordionBoxProduct = accordionBtnProduct.parent(),
		$body = $('body'),

		specs = {
			'Mais Informações': 'info',
			'Tipo do produto': 'tipo',
			'Cor': 'cor',
			'Garantia do Fornecedor (mês)': 'garantia',
			'Consumo Aproximado de Energia (kWh)': 'consumo',
			'Eficiência Energética': 'eficiência',
			'Garantia do Compressor (meses)': 'garantia compressor',
			'Garantia do Microcanal (meses)': 'garantia microcanal'

		},
		ignore = ['Manual do Produto', 'Informações para Instalação'],
		data = {
			specs: [],
			items: [],
			downloads: []
		};

	$especificacoes.each(function() {

		var self = $(this),
			key = self.find('.name-field').text(),
			value = self.find('.value-field').text();

		if (ignore.indexOf(key) > 0 || value === '') {
			return;
		}

		if (key in specs) {

			data.specs.push({
				key: specs[key],
				value: value + (specs[key].indexOf('garantia') >= 0 ? ' meses' : '')
			});

			//order specs and send info to last
			data.specs.sort(function(item) {
				return item.key === 'info' ? 1 : -1;
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

		// console.log('specifications data', data);

		dust.render('specifications', data, function(err, out) {
			if (err) {
				throw new Error('Specifications Dust error: ' + err);
			}

			$holder.html(out).show();
		});

	};

	//listen only to the first one sku;
	$(document).one('skuFetch', function(e, skuData) {

		if (skuData) {

			data.dimensions = {
				height: skuData.RealHeight,
				width: skuData.RealWidth,
				length: skuData.RealLength,
				weigh: skuData.RealWeightKg
			};

		}

		self.render();
	});

	// ACCORDION SPECIFICATION PRODUCTS
	var btnSpecs = false;
	var buttonTemplate = '<button id="mais-especs" class="secondary-button show-extra-small text-uppercase">Ver mais especificações</button>';

	accordionBtnProduct.on('click', function(e) {
		if ( $body.hasClass('ab-test__mobile--show-b') && btnSpecs === false ) {
			$($holder).append( buttonTemplate );

			btnSpecs = true;
		}

		if ($(window).width() > 767) {
			return true;
		}

		e.preventDefault();

		var self = $(this);

		if (self.parent().hasClass('open')) {
			accordionBoxProduct.removeClass('open');
			self.next().stop(true, true).slideUp();
		} else {
			self.parent().addClass('open');
			self.next().stop(true, true).slideDown();
		}
	});

	$holder.on('click', '#mais-especs', function(e){
		e.preventDefault();
		var $self = $(this);

		$holder.toggleClass('open--full');

		$self.toggleClass('is--active');

		if ( $self.hasClass('is--active') ) {
			$self.text('Fechar especificações');
		}
		else {
			$self.text('Ver mais especificações');
		}
	});

});
