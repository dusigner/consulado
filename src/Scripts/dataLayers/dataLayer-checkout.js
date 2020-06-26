import { checkInlineDatalayers, pushDataLayer } from 'modules/_datalayer-inline';

Nitro.module('dataLayer-checkout', function() {

	this.init = () => {
		checkInlineDatalayers();

		this.emailContinue();
		this.connectFacebook();
		this.connectGmail();
		this.backToCart();
		this.validateEmail();

		// copy billet
		this.buttonCopy();
		this.printTicket();
		this.newBuy();
		this.buttonRequests();
	};

	var $category = '[SQUAD] Login Facebook-Google';
	var $categoryCopyBillet = '[SQUAD] Pagamento-Boleto';

	this.emailContinue = () => {
		$('.client-email #btn-client-pre-email').on('click', function() {
			const $label = $('#client-pre-email').val();

			pushDataLayer(
				`${$category}`,
				`click email continuar`,
				`${$label}`
			);
		});
	};

	this.connectFacebook = () => {
		$('body').on('click', '.modal-custom-login-btn.facebook_access', function() {
			const $label = $(this).text();

			pushDataLayer(
				`${$category}`,
				`click conectar facebook`,
				`${$label}`
			);
		});
	};

	this.connectGmail = () => {
		$('body').on('click', '.modal-custom-login-btn.google_access', function() {
			const $label = $(this).text();

			pushDataLayer(
				`${$category}`,
				`click conectar google`,
				`${$label}`
			);
		});
	};

	this.backToCart = () => {
		$('#client-profile-data #orderform-to-cart').on('click', function() {
			const $label = $(this).text();

			pushDataLayer(
				`${$category}`,
				`click voltar carrinho`,
				`${$label}`
			);
		});
	};

	this.validateEmail = () => {
		$('.client-email #btn-client-pre-email').on('click', () => {

			var $email	= $('#client-pre-email').val();

			var $emailFilter=/^.+@.+\..{2,}$/;
			var $illegalChars= /[\(\)\<\>\,\;\:\\\/\"\[\]]/

			if(!($emailFilter.test($email))||$email.match($illegalChars)) {
				const $label = $('.client-email .validate-erro').text();

				pushDataLayer(
					`${$category}`,
					`exibicao erro email`,
					`${$label}`
				);
			}
		});
	};

	// copy billet
	this.buttonCopy = () => {
		$('body').on('click', '.checkout-billet-bottom--button', function() {
			pushDataLayer(
				`${$categoryCopyBillet}`,
				`click copiar cod`,
				`botão cop`
			);

			$('#copyBillet').select()
			try {
				var ok = document.execCommand('copy');
				if (ok) {
					pushDataLayer(
						`${$categoryCopyBillet}`,
						`exbicao cod copiado`,
						`${ok}`
					);
				}
			} catch (e) {
				console.log(e)
			}
		});
	};

	this.printTicket = () => {
		$('#print-bank-invoice').on('click', function() {
			const $label = $(this).text();

			pushDataLayer(
				`${$category}`,
				`click imprimir boleto`,
				`${$label}`
			);
		});
	};

	this.newBuy = () => {
		$('body.body-checkout-confirmation #app-container .ph3-ns .cconf-continue-button').on('click', function() {
			const $label = $(this).text();

			pushDataLayer(
				`${$category}`,
				`click nova compra`,
				`${$label}`
			);
		});
	};

	this.buttonRequests = () => {
		$('body.body-checkout-confirmation #app-container .ph3-ns .cconf-myorders-button').on('click', function() {
			const $label = $(this).text();

			pushDataLayer(
				`${$category}`,
				`click pedidos`,
				`${$label}`
			);
		});
	};

	this.init();
});
