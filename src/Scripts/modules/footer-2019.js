/* global $: true, Nitro: true */
'use strict';

(function(){
	const $window = $(window);
	const $canaisAtendimentoTtitle = $('.canais-atendimento__title');
	const $openMobileNewsletter = $('.open-mobile-newsletter');
	const $leadNewsletter = $('.lead-newsletter');
	const $footer = $('footer');
	const $toTop = $('.bt-gototop');

	const footer = {};


	footer.init = () => {
		footer.toogleAtendimento();
		footer.toogleNewsletterMobile();
		footer.animateScrollTop();
	};


	footer.toogleAtendimento = () => {
		$canaisAtendimentoTtitle.click(function() {
			$(this).parent().toggleClass('is--active');
		});
	};


	footer.toogleNewsletterMobile = () => {
		$openMobileNewsletter.click(function() {
			$leadNewsletter.toggleClass('is--mobile-active');
		});
	};


	footer.animateScrollTop = () => {
		//BACK TO TOP
		var reachBottom = 0;

		$window.scroll(function() {
			if ($window.scrollTop() >= 560) {
				$toTop.removeClass('hide');
				reachBottom = ($footer.offset().top - $window.scrollTop()) - $window.height() - 80;
				if (reachBottom < 0) {
					$toTop.css('bottom', 10 + Math.abs(reachBottom));
				} else {
					$toTop.css('bottom', 10);
				}
			} else {
				$toTop.addClass('hide');
			}
		}).scroll();

		$toTop.click(function(){
			$('html, body').animate({ scrollTop: 0 }, 600);
		});
	};



	footer.init();

})();
