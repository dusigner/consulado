'use strict';


(function(){
	const $canaisAtendimentoTtitle = $('.canais-atendimento__title');
	const $openMobileNewsletter = $('.open-mobile-newsletter');
	const $leadNewsletter = $('.lead-newsletter');

	const footer = {};

	footer.init = () => {
		footer.toogleAtendimento();
		footer.toogleNewsletterMobile();
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

	footer.init();

})();





