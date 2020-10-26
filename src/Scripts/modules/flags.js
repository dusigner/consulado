
'use strict';

Nitro.module('flags', function() {
	let self = this;

	self.init = () => {
        self.formatFlags();
	}

	self.formatFlags = () => {
        const blackFridayCoupon = $('.prod-info .prod-selos .flag[class*="blackfriday-2020"]')

        if(blackFridayCoupon.length) {
            $('.prod-info .prod-selos').append(`
                <p class="flag blackfriday-tag">Black Friday</p>
            `);
        }

    }

    self.init();
});
