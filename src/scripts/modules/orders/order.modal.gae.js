'use strict';

require('modules/helpers');

var ModalGae = {
	self: this,
	$body: $('body'),
	$modal: $('.modal-gae__mask'),
	template: '<div class="modal-gae__body">' +
					'<span class="modal-gae__close"><a href="javascript:void()">X</a></span>' +
					'<span class="modal-gae__title">{title}</span>' +
					'<div class="modal-gae__body">{content}</div>' +
				'</div>',
	modal: function(templateData) {
		console.log(self.template);
		this.$body.append('<div class="modal-gae__mask"></div>');
		this.$modal.data('modal', self)
					.addClass('.modal-gae__mask--enter')
					.append(self.template.render(templateData))
					.delay(500)
					.removeClass('modal-gae__mask--enter')
					.addClass('modal-gae__mask--loaded');
		// this.close();
	},
	close: function(cb) {
		$('.modal-gae__close').click(function(e) {
			e.preventDefault();

			this.$modal.remove();
		});

		cb();
	},
	requestTerms: function(pedido, cb) {
		var steps = {
				stepOne: '<p class="modal-gae__text">Deseja solicitar os termos do <br /> seguro de garantia estendida?</p>' +
							'<p class="modal-gae__ticket">' + pedido + '</p>' +
							'<div class="modal-gae__ctas">' +
								'<a href="javascript:void()" class="primary-button modal-gae__confirm js-modal-gae-confirm">SOLICITAR</a>' +
								'<a href="javascript:void()" class="secondary-button modal-gae__cancel js-modal-gae-cancel">CANCELAR</a>' +
							'</div>',
				stepTwo: '<p class="modal-gae__text">A sua solicitação foi realizada com sucesso! <br /> Enviaremos os termos do seguro de garantia estendida no e-mail cadastrado na loja.</p>',
			},
			templateData = {
				title: 'TERMOS DA GARANTIA ESTENDIDA',
				content: '<div class="modal-gae__request-terms step step-one current">' + steps.stepOne + '</div>' +
							'<div class="modal-gae__request-terms step step-two">' + steps.stepTwo + '</div>'
			};

		this.modal(templateData);

		this.$modal.addClass('modal-gae__mask--request-terms');

		cb(this.changeStep);
	},
	changeStep: function() {
		var $current = $('.step.current');

		$current.removeClass('current').next().addClass('current');
	},
	requestCancel: function(pedido, cb) {
		var templateData = {
			title: 'CANCELAR GARANTIA ESTENDIDA',
			stepOne: '<p class="modal-gae__text">Deseja solicitar o cancelamento do <br /> seguro de garantia estendida?</p>' +
						'<div class="modal-gae__ctas">' +
							'<a href="javascript:void()" class="secondary-button modal-gae__confirm js-modal-gae-confirm">SIM</a>' +
							'<a href="javascript:void()" class="primary-button modal-gae__cancel js-modal-gae-cancel">NÃO</a>' +
						'</div>',
			stepTwo: '<p class="modal-gae__text">A sua solicitação foi realizada com sucesso! <br /> O pedido de cancelamento será analisado e respondido no e-mail cadastrado na loja.</p>',
			content: '<div class="modal-gae__request-cancel step step-one current">' + templateData.stepOne + '</div>' +
						'<div class="modal-gae__request-cancel step step-two">' + templateData.stepTwo + '</div>'
		};

		this.modal(templateData);

		this.$modal.addClass('modal-gae__mask--request-cancel');

		cb(this.changeStep);
	}
};

module.exports = ModalGae;