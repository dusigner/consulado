'use strict';

// Dust filters
_.extend(dust.filters, {
	orderNumber: function(value) {
		return value
			.split('-')
			.shift()
			.replace(/[^0-9]/g, '');
	},
	humanizeIndex: function(value) {
		return value + 1;
	},
	formatDatetimeBRL: function(value) {
		return $.formatDatetimeBRL(value);
	},
	formatDateAndHour: function(value) {
		var d = value ? new Date(value) : new Date(),
			month = d.getUTCMonth() + 1,
			day = d.getUTCDate(),
			hours = d.getUTCHours(),
			minutes = d.getUTCMinutes();

		return (
			(day < 10 ? '0' : '') +
			day +
			'/' +
			(month < 10 ? '0' : '') +
			month +
			' - ' +
			(hours < 10 ? '0' : '') +
			hours +
			':' +
			(minutes < 10 ? '0' : '') +
			minutes
		);
	},
	intAsCurrency: function(value) {
		return _.intAsCurrency(value);
	},
	sanitize: function(value) {
		return $.replaceSpecialChars(value).toLowerCase();
	},
	shortName: function(value) {
		var sku = value.split('-'),
			name = sku[0].length > 40 ? sku[0].substr(0, 40) + '...' : sku[0];

		sku = sku[1] ? sku[1] : false;

		return '<strong>' + name + '</strong>' + (sku ? ' ' + sku : '');
	},
	frequencyText: function(value) {
		var text = {
			monthly: 'meses',
			weekly: 'semanas',
			daily: 'dia(s)'
		};

		return text[value];
	},
	recurrenceSemanas: function(value) {
		var intPeriod = value.match(/^\d{1,}/gim);

		if (intPeriod && intPeriod[0] > 12) {
			value = intPeriod / 4 + ' meses';
		}

		return value;
	},
	statusText: function(value) {
		var finalText = '';

		if (value === 'ACTIVE') {
			finalText = 'ativa';
		} else {
			finalText = 'inativa';
		}

		return finalText;
	}
});

// Dust Helpers
dust.helpers.if = function(chunk, context, bodies, params) {
	var location = params.key,
		value = params.value,
		body = bodies.block;
	if (location === value) {
		chunk.render(body, context);
	}

	return chunk;
};
dust.helpers.neq = function(chunk, context, bodies, params) {
	var location = params.key,
		value = params.value,
		body = bodies.block;
	if (location !== value) {
		chunk.render(body, context);
	}

	return chunk;
};
dust.helpers.gt = function(chunk, context, bodies, params) {
	var location = params.key,
		value = params.value,
		body = bodies.block;
	if (location > value) {
		chunk.render(body, context);
	}

	return chunk;
};

/**
 * Função serialize em objeto com dados de um formulário
 * @param  {Object} data jQuery seletor do formulário submitado
 * @returns {Object} Objeto serializado com dados submitados pelo formulário
 */
$.serializeForm = function(data) {
	var result = {};

	$.map(data.serializeArray(), function(x) {
		if (!x.value || x.value === '') {
			return;
		}

		result[x.name] = x.value;
	});

	return result;
};

/**
 * Função encapsula e faz ações padrões para chamadas ajax nos modais de meus pedidos e recorrências
 * @param  {Function} step função do whpModal que permite a troca de passo para feedback do usuário
 * @param  {Promise} CRM "Promise" que deve retornar a chamada ajax e continuar a promise
 */
$.crmHandler = function(step, CRM) {
	$('.modal-whp__content').append('<div class="loading"></div>');

	CRM()
		.fail(function() {
			$('.js-feedback-account').text('Ocorreu um erro, tente novamente mais tarde');
			step('next');
		})
		.always(function() {
			$('.modal-whp__content .loading').remove();
			$('.modal-whp__body ').scrollTop(0);
		});
};

/**
 * Função retorna texto "sanitizado" com status atual da recorrência
 * @param  {String} status Texto de status
 * @param  {String} CRM Frase parseada em texto legível
 */
$.titleStatus = function(status) {
	var finalTitle = 'Recorrência ';

	if (status === 'ACTIVE') {
		finalTitle += 'ativa';
	} else {
		finalTitle += 'inativa';
	}

	return finalTitle;
};
