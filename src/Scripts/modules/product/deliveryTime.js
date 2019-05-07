/* global $: true, Nitro: true */
'use strict';


Nitro.module('deliveryTime', () => {

	let $loadingFret,
		$containerFrete,
		flag = 0,
		ajaxCompleted = false;


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
		$(document).ajaxComplete( (event, xhr, settings) => {
			var calculaFrete = settings.url.split('/')[2];

			if (calculaFrete === 'calcula') {

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

				this.setPostalCodeStorage();
			}
		});
	};

	/**
	 * Set localStorage for user CEP
	 *
	 * @memberof deliveryTime
	 */
	this.setPostalCodeStorage = () => {

		try {
			const textCep = $('#txtCep').val();

			localStorage.setItem('user_cep', textCep);
			this.setPostalCodeOrderForm(textCep);
		} catch (error) {
			console.info(error);
		}
	};

	/**
	 * Set orderForm for user CEP
	 *
	 * @memberof deliveryTime
	 */
	this.setPostalCodeOrderForm = (textCep) => {

		const orderForm = vtexjs.checkout.orderForm;

		if ((!orderForm.canEditData) || (orderForm.shippingData && orderForm.shippingData.address && orderForm.shippingData.address.postalCode && orderForm.shippingData.address.postalCode === textCep)) {
			return;
		}

		try {
			vtexjs.checkout.getOrderForm().done(() => {
				const address = {
					"postalCode": textCep,
					"country": 'BRA'
				};
				return vtexjs.checkout.calculateShipping(address);
			});

		} catch (error) {
			console.info(error);
		}
	};

	/**
	 * Auto get Postal Code by localStorage
	 *
	 * @memberof deliveryTime
	 */
	this.autoGetPostalCode = () => {
		if (localStorage && localStorage.getItem('user_cep')) {
			$('#txtCep').val(localStorage.getItem('user_cep'));

			$('#btnFreteSimulacao').trigger('click');

		}
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

		$(document).ajaxComplete((event, xhr, settings) => {
			var frete = settings.url.split('/')[1];

			if (frete === 'frete' && !ajaxCompleted) {

				$loadingFret = $('span.frete-calcular');
				$containerFrete = $('.freight-values');
				flag = 0;

				this.openShippingOptions();
				this.handleData();
				this.closeShippingOptions();
				this.autoGetPostalCode();

				ajaxCompleted = true;
			}

		});

	};


	this.init();


});
