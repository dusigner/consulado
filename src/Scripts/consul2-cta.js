'use strict';

require('modules/helpers');

//load Nitro Lib
require('vendors/nitro');

Nitro.setup('cta', function() {
	const self = this;
	let urlParams = _.urlParams(); // Parse url parameters
	let skuid = urlParams.skuid ? urlParams.skuid : null;
	let emailUser = urlParams.email ? window.atob(urlParams.email) : null;

	/**
	 * Default method to init modules
	 */
	this.init = () => $(window).load(() => self.mountOrderForm());

	/**
	 * Mount VTEX orderForm using url parameters
	 * The two parameters that we need to put on url are the user email to register on orderForm
	 * and the skuId to add the product on cart
	 */
	this.mountOrderForm = () => {
		vtexjs.checkout
			.getOrderForm()
			.done(() => {
				//avisar o VTEX ID que o email do cliente mudou
				/**
				 * Check if vtexid is available on page
				 * In case of true we register the user email on VTEXID scope
				 */
				if (window.vtexid) {
					window.vtexid.setEmail(emailUser);
				}

				/**
				 * In case of the user is logged on store we remove his email
				 */
				window.vtex.NavigationCapture &&
					window.vtex.NavigationCapture.sendEvent('SendUserInfo', {
						visitorContactInfo: [emailUser, '']
					});

				// Avisar ao Checkout qual o email do cliente

				/** Register the user email on orderForm using the url email parameter */
				window.vtexjs.checkout.sendAttachment('clientProfileData', { email: emailUser });

				vtexjs.checkout
					.addToCart(
						[
							{
								id: skuid,
								quantity: 1,
								seller: 1
							}
						],
						null,
						window.jssalesChannel
					)
					.done(orderForm => {
						console.info('orderForm', orderForm);

						/** In case of success, we redirect the user to the payment checkout step */
						window.location.replace('/checkout/#/payment');
					});

				/** In case of fail or error, we redirect the user to the root page of the store */
			})
			.fail(() => window.location.replace('/'));
	};

	this.init();
});
