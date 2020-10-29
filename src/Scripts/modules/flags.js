
'use strict';

Nitro.module('flags', function() {
	let self = this;

	self.init = () => {
        self.formatFlagBFPDP();
		self.formatFlagPercentOff();
	}

	self.formatFlagPercentOff = () => {

		$('.box-produto').map(function(index, item){
			let flagPercentOff = $(item).find('.prod-info .price .por .off').clone();
			if($(flagPercentOff[0]).text() !== ''){
				$(flagPercentOff).removeAttr('style');
				$(this).find('.FlagsHightLight').append(flagPercentOff[0]);
			}
		})
		// const flagPercentOff = $('.prod-info .price .por .off').clone();

    }

	self.formatFlagBFPDP = () => {
        const blackFridayCoupon = $('.prod-info .prod-selos .flag[class*="blackfriday-2020"]')

        if(blackFridayCoupon.length) {
            $('.prod-info .prod-selos').append(`
                <p class="flag blackfriday-tag">Black Friday</p>
            `);
        }

    }

    self.formatFlagBFPDP = () => {

        $('.box-produto').map(function(index, item){
            const blackFridayCoupon = $(item).find('.FlagsHightLight .flag[class*="blackfriday-2020"]')
			if($(blackFridayCoupon)[0]){
                console.info('tem')
				$(this).find('.FlagsHightLight').append((`
                    <p class="flag blackfriday-tag">Black Friday</p>
                `));
			}
		})
    }

    self.init();
});
