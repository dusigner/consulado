/* global $: true, Nitro: true */
'use strict';


Nitro.module('deliveryTime', () => {

	let $loadingFret,
		$containerFrete,
		flag = 0;


	/**
	 * Close box of shipping opttions
	 *
	 * @memberof deliveryTime
	 */
	this.closeShippingOptions = () => {
		$('body').on('click', '.freight-values .closed', function () {
			$containerFrete.html('').removeClass('active erro');
		});
	};

	/**
	 * Open box of shipping opttions
	 *
	 * @memberof deliveryTime
	 */
	this.openShippingOptions = () => {
		const $simulatorSelector = $('#btnFreteSimulacao');


		$simulatorSelector.on('click', function () {
			$loadingFret.addClass('loading');
			if (flag === 0) {
				flag = 1;
			}
		});
	};

	/**
	 * Close box of shipping opttions
	 *
	 * @memberof deliveryTime
	 */
	this.handleData = () => {
		$(document).ajaxComplete(function (event, xhr, settings) {
			var frete = settings.url.split('/')[1];

			if (frete === 'frete') {

				$loadingFret.removeClass('loading');
				$containerFrete.addClass('active');
				$containerFrete.prepend('<i class="closed"></i>');
				if (flag === 1) {
					dataLayer.push({
						event: 'simuladorCEP',
						status: 'ok'
					});
					flag = 0;
				}
			}
		});
	};

	/**
	 * Active freight calculation on product page
	 *
	 * @memberof deliveryTime
	 */
	this.activeShippingCalculate = () => {
		$('#popupCalculoFreteWrapper a').trigger('click');
	};

	/**
	 * Handle wrong field alert
	 *
	 * @memberof deliveryTime
	 */
	this.handleAlert = () => {
		window.alert = function (e) {
			if (e === 'O CEP deve ser informado.' || e === 'CEP inválido.' || e === 'Preencha um CEP válido.') {
				$containerFrete.html('Preencha um CEP válido.').addClass('active erro').css('display', 'block');
				$containerFrete.prepend('<i class="closed"></i>');
			}
			return;
		};
	};

	/**
	 * init deliveryTime module
	 *
	 * @memberof deliveryTime
	 */
	this.init = () => {
		this.activeShippingCalculate();
		this.handleAlert();

		$(window).load(() => {

			$loadingFret = $('span.frete-calcular');
			$containerFrete = $('.freight-values');
			flag = 0;

			this.openShippingOptions();
			this.handleData();
			this.closeShippingOptions();

		});

	};

	this.init();


});
