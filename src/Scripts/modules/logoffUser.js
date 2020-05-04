'use strict';

Nitro.module('logoffUser', function () {
	this.removeProducts = () => {
		$('body').on('click', '.account .welcome-message.show-personal .welcome em a:not(#login)', () => {
			vtexjs.checkout.getOrderForm().done(function (response) {
				if (response.items.length) {
					let orderFormId = response.orderFormId,
						data = {
							'orderItems': [{
								'index': 0,
								'quantity': 0
							}],
							'expectedOrderFormSections': [
								'items',
								'totalizers',
								'clientProfileData',
								'shippingData',
								'paymentData',
								'sellers',
								'messages',
								'marketingData',
								'clientPreferencesData',
								'storePreferencesData',
								'giftRegistryData',
								'ratesAndBenefitsData',
								'openTextField',
								'commercialConditionData',
								'customData'
							],
							'noSplitItem': true
						};


					$.ajax({
						url: `/api/checkout/pub/orderForm/${orderFormId}/items?sc=1`,
						data: JSON.stringify(data),
						type: 'PATCH',
						contentType: 'application/json; charset=utf-8'
					});
				}
			});
		});
	};

	this.removeProducts();
});
