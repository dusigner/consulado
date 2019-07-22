'use strict';

require('vendors/jquery.whp-modal');
require('modules/orders/order.helpers');

require('Dust/orders/recurrence/recurrences.html');
require('Dust/orders/recurrence/recurrenceStatus.html');
require('Dust/orders/recurrence/recurrenceData.html');
require('Dust/orders/recurrence/recurrenceToggle.html');
require('Dust/orders/recurrence/recurrencePayments.html');
require('Dust/orders/recurrence/recurrenceAddresses.html');

var CRM = require('modules/store/orders-crm');

Nitro.module('order.recurrences', function() {
	var self = this;

	this.$container = $('#myorders'); //Container geral
	this.$recurrencesContainer = $('#recurrences-render'); //Container de recorrências
	this.recurrences = {
		recurrences: null,
		isLoaded: false
	}; //Status geral do módulo
	this.$modals = $('#order-modals'); //Container de modals

	/**
	 * Função bootstrap recurrence | Carrega e atribui subscriptions da API p/ o módulo e/ou renderiza o módulo Recorrências
	 */
	this.init = function() {
		self.$container.addClass('myorders--loading');

		if (!self.recurrences.recurrences) {
			CRM.getRecurrences()
				.then(function(res) {
					if (res.status === 'INACTIVE') {
						$.each(res.items, function(i, v) {
							v.status = 'INACTIVE';
						});
					}

					self.recurrences.recurrences = res;

					// Criar string com periodo de recorrência final
					$.each(self.recurrences.recurrences.items, function(i, item) {
						item.frequency.frequency =
							item.frequency.interval + ' ' + dust.filters.frequencyText(item.frequency.periodicity);
					});

					self.recurrenceRender(self.recurrences.recurrences);

					return res;
				})
				.then(function(res) {
					return CRM.getAccounts(res.id).then(function(res) {
						self.accountRender(res);

						return res;
					});
				})
				.then(function(res) {
					CRM.getAddresses(res.subscription).then(function(res) {
						self.addressRender(res);
					});
				})
				.fail(function() {
					self.$container.removeClass('myorders--loading');
					self.recurrences.isLoaded = true;
					self.$recurrencesContainer.html('<h2 class="text-center">Não há recorrências ativas</h2>');
				});
		} else {
			self.recurrenceRender(self.recurrences.recurrences);
		}
	};

	/**
	 * Reseta módulo de recorrência
	 */
	this.resetRecurrence = function() {
		self.recurrences.recurrences = null;
		self.recurrences.isLoaded = false;
		self.$recurrencesContainer.find('*').unbind();
		self.$recurrencesContainer.html('');
		self.init();
	};

	/**
	 * Dust render do módulo e invocação dos métodos bind de eventos
	 * @param {Object} data retorno da API /subscriptions/me
	 */
	this.recurrenceRender = function(data) {
		self.$container.removeClass('myorders--loading');
		self.recurrences.isLoaded = true;

		dust.render('recurrences', data, function(err, out) {
			if (err) {
				throw new Error('Modal Orders Dust error: ' + err);
			}

			self.$recurrencesContainer.append(out);

			self._events();
		});
	};

	/**
	 * Bind eventos do módulo renderizado
	 */
	this._events = function() {
		self.$recurrencesContainer
			.find('.js-toggle-orders')
			.first()
			.removeClass('order__header--closed')
			.next('.js-toggle-container')
			.css('display', 'block');

		self.$recurrencesContainer.find('.js-toggle-orders').click(function(e) {
			e.preventDefault();
			$(this).toggleClass('order__header--closed');
			$(this)
				.next('.js-toggle-container')
				.stop()
				.stop()
				.slideToggle();
		});

		self._modals();
	};

	/**
	 * Chamadas das ações feitas por modal whpModal
	 */
	this._modals = function() {
		//Alterar forma de pagamento modal
		$('.js-recurrence-payment').whpModal({
			innerNav: true,
			onOpen: function(step) {
				$('.js-change-account').submit(function(e) {
					e.preventDefault();

					var $self = $(this); //current form

					$.crmHandler(step, function() {
						return CRM.changeAccount(self.recurrences.recurrences.id, $.serializeForm($self)).then(
							function() {
								step('next');
							}
						);
					});
				});
			}
		});

		//Alterar status ativo/inativo recorrência geral
		$('.js-header-toggle .js-recurrence-toggle').whpModal({
			innerNav: true,
			onOpen: function(step) {
				$('.js-pause-recurrence, .js-unpause-recurrence').click(function(e) {
					e.preventDefault();

					var $self = $(this); //clicked button

					$.crmHandler(step, function() {
						return CRM.pauseRecurrence(
							self.recurrences.recurrences.id,
							'status=' + $self.data('status')
						).then(function() {
							$('.modal-whp__title').text($.titleStatus($self.data('status')));
							step('next');
							self.resetRecurrence();
						});
					});
				});
			}
		});

		//Excluir item de recorrência
		$('.js-recurrence-item-cancel').whpModal({
			innerNav: true,
			onOpen: function(step) {
				var $self = $(this); //cta pre-modal

				$('.recurrence__modal-image').html(
					'<img src="' +
						$self.data('image') +
						'" alt="' +
						$self.data('name') +
						'" title="' +
						$self.data('name') +
						'" />'
				);
				$('.recurrence__modal-name').html('<p>' + $self.data('name') + '</p>');
				$('.recurrence__modal-period').text($self.data('period'));
				$('.recurrence__modal-next').text($self.data('next'));

				$('.js-cancel-recurrence-item').click(function(e) {
					e.preventDefault();

					$.crmHandler(step, function() {
						return CRM.deleteItem(self.recurrences.recurrences.id, $self.data('id')).then(function() {
							step('next');
							self.resetRecurrence();
						});
					});
				});
			}
		});

		//Alterar item de recorrência
		$('.js-recurrence-item-edit').whpModal({
			innerNav: true,
			onOpen: function(step) {
				var $self = $(this); //cta pre-modal

				$('.recurrence__modal-image').html(
					'<img src="' +
						$self.data('image') +
						'" alt="' +
						$self.data('name') +
						'" title="' +
						$self.data('name') +
						'" />'
				);
				$('.recurrence__modal-name').html('<p>' + $self.data('name') + '</p>');
				$('.modal-whp__content #quantity').val($self.data('quantity'));

				$('.js-form-edit-item').submit(function(e) {
					e.preventDefault();

					var $form = $(this); //current form

					$.crmHandler(step, function() {
						return CRM.updateItem(
							self.recurrences.recurrences.id,
							$self.data('id'),
							$form.serialize() +
								'&frequency[periodicity]=' +
								$self.data('period-periodicity') +
								'&frequency[interval]=' +
								$self.data('period-frequency')
						).then(function() {
							step('next');
							self.resetRecurrence();
						});
					});
				});
			}
		});

		//Alterar status ativo/inativo item de recorrência
		if (self.recurrences.recurrences.status === 'ACTIVE') {
			$('.js-single-recurrence .js-recurrence-toggle').whpModal({
				innerNav: true,
				onOpen: function(step) {
					var $self = $(this); //cta pre-modal

					$('.recurrence__modal-image').html(
						'<img src="' +
							$self.data('image') +
							'" alt="' +
							$self.data('name') +
							'" title="' +
							$self.data('name') +
							'" />'
					);
					$('.recurrence__modal-name').html('<p>' + $self.data('name') + '</p>');
					$('.recurrence__modal-period').text($self.data('period'));
					$('.recurrence__modal-next').text($self.data('next'));

					$('.js-pause-recurrence, .js-unpause-recurrence').click(function(e) {
						e.preventDefault();

						var $button = $(this); //clicked button

						$.crmHandler(step, function() {
							return CRM.updateItem(
								self.recurrences.recurrences.id,
								$self.data('id'),
								'frequency[periodicity]=' +
									$self.data('period-periodicity') +
									'&frequency[interval]=' +
									$self.data('period-frequency') +
									'&status=' +
									$button.data('status')
							).then(function() {
								$('.modal-whp__title').text($.titleStatus($self.data('status')));
								step('next');
								self.resetRecurrence();
							});
						});
					});
				}
			});
		}
	};

	/**
	 * Dust render de account (cartões) relacionados a recorrência do usuário
	 * @param  {Object} data retorno da API
	 */
	this.accountRender = function(data) {
		dust.render('recurrencePayments', data, function(err, out) {
			if (err) {
				throw new Error('Modal Orders Dust error: ' + err);
			}

			self.$modals.append(out);
		});
	};

	/**
	 * Dust render de addresses (endereços) relacionados a recorrência do usuário
	 * @param  {Object} data retorno da API
	 */
	this.addressRender = function(data) {
		dust.render('recurrenceAddresses', data, function(err, out) {
			if (err) {
				throw new Error('Modal Orders Dust error: ' + err);
			}

			self.$modals.append(out);
		});
	};
});
