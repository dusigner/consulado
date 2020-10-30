
'use strict';

Nitro.module('flags', function() {
	let self = this;

	self.init = () => {
		self.formatFlagBFPDP();
		self.formatShelfFlagBF();
		self.formatFlagPercentOff();
	}

	self.formatFlagPercentOff = () => {

		$('.box-produto').map(function(index, item){
			let flagPercentOff = $(item).find('.prod-info .price .por .off').clone();

			if(!$(this).find('.FlagsHightLight .off').length){
				if($(flagPercentOff[0]).text() !== ''){
					$(flagPercentOff).removeAttr('style');
					$(this).find('.FlagsHightLight').append(flagPercentOff[0]);
				}
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

    self.formatShelfFlagBF = () => {

        $('.box-produto').map(function(index, item){
            const blackFridayCoupon = $(item).find('.FlagsHightLight .flag[class*="blackfriday-2020"]')
			if($(blackFridayCoupon)[0]){
				if(!$(this).find('.FlagsHightLight .flag.blackfriday-tag').length){
					$(this).find('.FlagsHightLight').append((`
                    	<p class="flag blackfriday-tag">Black Friday</p>
                	`));
				}

			}
		})
    }

	if($('body').hasClass('categoria') || $('body').hasClass('listagem')) {
		$(document).ajaxStop(function () {

			self.init();

			if ($('.see-more').length && $('.see-more button').hasClass('hide')) {
				$(this).unbind("ajaxStop");
			}

		});
	} else {
		self.init();
	}
});
