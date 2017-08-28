'use strict';

require('modules/helpers');

var ModalGae = {
	$body: $('body'),
	template: '<div class="text-center modal-gae__body">' +
					'<span class="modal-gae__close"><a href="javascript:void(0);">X</a></span>' +
					'<h3 class="modal-gae__title">{title}</h3>' +
					'<div class="modal-gae__content">{content}</div>' +
				'</div>',
	modal: function(templateData) {
		ModalGae.$body.append('<div class="modal-gae__mask"></div>');
		$('.modal-gae__mask').data('modal', ModalGae)
					.html(ModalGae.template.render(templateData))
					.delay(10)
					.queue(function(next) {
						$(this).addClass('modal-gae__mask--enter');
						next();
					})
					.delay(500)
					.queue(function(next) {
						$(this).addClass('modal-gae__mask--loaded');
						next();
					});

		$('.modal-gae__close, .js-modal-gae-cancel').click(function(e) {
			e.preventDefault();

			ModalGae.close();
		});
	},
	close: function(cb) {
		$('.modal-gae__mask')
				.removeClass('modal-gae__mask--loaded')
				.removeClass('modal-gae__mask--enter')
				.delay(500)
				.queue(function(next) {
					$(this).remove();
					next();
				});

		if(cb && typeof cb === 'function') {
			cb();
		}
	},
	changeStep: function() {
		var $current = $('.step.current');

		$current.removeClass('current').next().addClass('current');
	},
	requestTerms: function(data, cb) {
		var steps = {
				stepOne: '<p class="modal-gae__text no-margin">Deseja solicitar os termos do <br /> seguro de garantia estendida?</p>' +
							'<p class="modal-gae__ticket">' + data.order + '</p>' +
							'<div class="modal-gae__ctas">' +
								'<a href="javascript:void(0);" class="primary-button modal-gae__confirm js-modal-gae-confirm">SOLICITAR</a>' +
								'<a href="javascript:void(0);" class="secondary-button modal-gae__cancel js-modal-gae-cancel">CANCELAR</a>' +
							'</div>',
				stepTwo: '<p class="modal-gae__text">A sua solicitação foi realizada com sucesso! <br /> Enviaremos os termos do seguro de garantia estendida no e-mail cadastrado na loja.</p>',
			},
			templateData = {
				title: 'TERMOS DA GARANTIA ESTENDIDA',
				content: '<div class="modal-gae__request-terms step step-one current">' + steps.stepOne + '</div>' +
							'<div class="modal-gae__request-terms step step-two">' + steps.stepTwo + '</div>'
			};

		ModalGae.modal(templateData);

		$('.modal-gae__mask').addClass('modal-gae__mask--request-terms');

		if(cb && typeof cb === 'function') {
			cb(ModalGae.changeStep, ModalGae.close, data);
		}
	},
	requestCancel: function(data, cb) {
		var steps = {
				stepOne: '<p class="modal-gae__text">Deseja solicitar o cancelamento do <br /> seguro de garantia estendida?</p>' +
							'<div class="modal-gae__ctas">' +
								'<a href="javascript:void(0);" class="primary-button modal-gae__confirm js-modal-gae-confirm">SIM</a>' +
								'<a href="javascript:void(0);" class="secondary-button modal-gae__cancel js-modal-gae-cancel">NÃO</a>' +
							'</div>',
				stepTwo: '<p class="modal-gae__text">A sua solicitação foi realizada com sucesso! <br /> O pedido de cancelamento será analisado e respondido no e-mail cadastrado na loja.</p>',
			},
			templateData = {
				title: 'CANCELAR GARANTIA ESTENDIDA',
				content: '<div class="modal-gae__request-cancel step step-one current">' + steps.stepOne + '</div>' +
							'<div class="modal-gae__request-cancel step step-two">' + steps.stepTwo + '</div>'
			};

		ModalGae.modal(templateData);

		$('.modal-gae__mask').addClass('modal-gae__mask--request-cancel');

		if(cb && typeof cb === 'function') {
			cb(ModalGae.changeStep, ModalGae.close, data);
		}
	}
};

module.exports = ModalGae;