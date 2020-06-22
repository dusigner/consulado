'use strict';

Nitro.module('checkout-billet', function() {
	var self = this;

	this.init = () => {
		this.htmtBillet();
	};

	this.htmtBillet = () => {
		$('body[class*=consul].body-checkout-confirmation #app-top .ph3-ns .cconf-alert .fr').before(`
			<div class="checkout-billet">
				<div class="checkout-billet-top">
					<p class="checkout-billet-top--text">Para realizar o pagamento, copie<br />o código do boleto ou imprima.</p>
				</div>
				<div class="checkout-billet-bottom">
					<button class="checkout-billet-bottom--button">Copiar Código</button>
				</div>
			</div>
		`);
	};

	this.clipToBoard = () => {
		$('body').on('click', '.checkout-billet-bottom--button', function() {
			var $orderID = $('#order-id').text().split('-')[0];
			  $.getJSON('/api/checkout/pub/orders/order-group/' + $orderID).then((res) => {

				console.log(res)

			 });
			// $(this).select();
			document.execCommand('copy');
		  })
	}

	this.init();
});
