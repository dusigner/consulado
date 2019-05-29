'use strict';


(function(){
	const $canaisAtendimentoTtitle = $('.canais-atendimento__title');

	const footer = {};

	footer.init = () => {
		footer.toogleAtendimento();
	};

	footer.toogleAtendimento = () => {
		$canaisAtendimentoTtitle.click(function() {
			$(this).parent().toggleClass('is--active');
		});
	};

	footer.init();

})();





