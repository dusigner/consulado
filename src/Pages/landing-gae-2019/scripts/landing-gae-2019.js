
jQuery(function () {


	var width = jQuery(window).width(),
		mobile = false;

	if (width < 1024) {

		mobile = true;

	}

	if (mobile) {

		jQuery('.garantia__select').slick({
			infinite: true,
			arrows: true,
			slidesToShow: 1,
			slidesToScroll: 1,
			centerPadding: '0',
			variableWidth: false,
			centerMode: true
		});
	}

	var modulo = jQuery('.perguntas-frequentes');

	if (modulo) {

		jQuery(this).find('.perguntas-frequentes__item').on('click', function () {

			if (jQuery(this).hasClass('-is-active')) {
				jQuery(this).removeClass('-is-active');
			} else {
				jQuery(this).addClass('-is-active');
			}

		});

	}

	modulo = jQuery('.garantia');

	if (modulo) {

		var menu = modulo.find('.garantia__select');
		var conteudo = modulo.find('.garantia__modulo');

		menu.find('li a').on('click', function () {

			conteudo.removeClass('-is-active');
			menu.find('li a').removeClass('-is-active');
			jQuery(this).addClass('-is-active');

			var posicao = jQuery(this).data('order');

			conteudo.eq(posicao).addClass('-is-active');

			return false;

		});
	}

	jQuery('a.como-acionar').on('click', function () {
		jQuery('#como-acionar').click();
		return false;
	});

	var fechar = jQuery('.close');

	fechar.on('click', function () {
		jQuery('.naologado-garantia, .condicoes-gerais, .form-submit, .avalie-garantia, .mascara-garantia').removeClass('-is-active');
		return false;
	});

	jQuery('.-comprar').on('click', function () {
		if (jQuery('body').hasClass('-nao-logado')) {
			jQuery('.naologado-garantia, .mascara-garantia').addClass('-is-active');
			return false;
		}
	});

	jQuery('.planos__veja-mais').on('click', function () {
		jQuery('.table__tbody').toggleClass('-is-active');
		jQuery('.planos__veja-mais i').toggleClass('-is-active');
	});

	jQuery('.table__planos-item').on('click', function () {
		jQuery(this).addClass('-is-active').siblings().removeClass('-is-active');
		return false;
	});

	jQuery('a.como-acionar').on('click', function () {
		jQuery('#como-acionar').click();
		return false;
	});

	jQuery('.-enviar').on('click', function () {
		jQuery('.avalie-garantia').removeClass('-is-active');
		jQuery('.form-submit, .mascara-garantia').addClass('-is-active');
		return false;
	});

	jQuery('.-condicoes').on('click', function () {
		jQuery('.condicoes-gerais, .mascara-garantia').addClass('-is-active');
		return false;
	});

	jQuery('.-opiniao').on('click', function () {
		jQuery('.avalie-garantia, .mascara-garantia').addClass('-is-active');
		return false;
	});

	jQuery("#phone").bind('input propertychange', function () {

		var texto = jQuery(this).val();

		texto = texto.replace(/[^\d]/g, '');

		if (texto.length > 0) {
			texto = "(" + texto;

			if (texto.length > 3) {
				texto = [texto.slice(0, 3), ") ", texto.slice(3)].join('');
			}
			if (texto.length > 12) {
				if (texto.length > 13)
					texto = [texto.slice(0, 10), "-", texto.slice(10)].join('');
				else
					texto = [texto.slice(0, 9), "-", texto.slice(9)].join('');
			}
			if (texto.length > 15)
				texto = texto.substr(0, 15);
		}

		jQuery(this).val(texto);

	});
});
