'use strict';

Nitro.module('checkout.billet', function() {
	var self = this;

	this.init = () => {
		this.copyClipToBoard();
	};

	this.htmtBillet = () => {
		setTimeout(function() {

			const $bankInvoice = $('#print-bank-invoice')
			if ($bankInvoice.length > 0) {
				$('body').addClass('is--billet');

				var $orderID = $('#order-id').text().split('-')[0];
				$.getJSON('/api/checkout/pub/orders/order-group/' + $orderID).then((res) => {

					var $codBillet = res[0].paymentData.transactions[0].payments[0].bankIssuedInvoiceIdentificationNumberFormatted;

					$('body[class*=consul].body-checkout-confirmation #app-top .ph3-ns .cconf-alert .fr').before(`
						<div class="checkout-billet">
							<div class="checkout-billet-top">
								<p class="checkout-billet-top--text">Para realizar o pagamento, copie<br />o código do boleto ou imprima.</p>
							</div>
							<input id="copyBillet" value="${$codBillet}" />
							<div class="checkout-billet-bottom">
								<button class="checkout-billet-bottom--button">Copiar Código</button>
							</div>
						</div>
					`);

					$('.cconf-payment #print-bank-invoice').before(`
						<div class="checkout-billet">
							<input id="copyBillet" value="${$codBillet}" />
							<div class="checkout-billet-bottom">
								<button class="checkout-billet-bottom--button">Copiar Código</button>
							</div>
						</div>
					`);
				});
			}
		}, 1000);
	};

	this.copyClipToBoard = () => {
		$('body').on('click', '.checkout-billet-bottom--button', function() {
			$('#copyBillet').select()
			try {
				var ok = document.execCommand('copy');
				if (ok) {
					$('.checkout-billet-bottom').addClass('is--billet');
					if ( $(window).width() >= 768 ) {
						$('.checkout-billet-bottom--button').text('CÓDIGO COPIADO');
					} else {
						$('.checkout-billet-bottom--button').text('CÓD. COPIADO');
					}

					setTimeout(function(){
						$('.checkout-billet-bottom').removeClass('is--billet');
						$('.checkout-billet-bottom--button').text('COPIAR CÓDIGO');
					}, 2000)
				}
			} catch (e) {
				console.log(e)
			}
		})
	}

	this.init();
});
