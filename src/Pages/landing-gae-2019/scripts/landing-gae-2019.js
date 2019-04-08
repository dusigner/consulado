'use strict';

require('vendors/jquery.inputmask');
require('vendors/jquery.form-validator');
require('vendors/slick');

import DataLayer from './modules/dataLayer';

var CRM = require('modules/store/crm');

Nitro.controller('landing-gae', [], function () {


	var width = jQuery(window).width(),
		mobile = false;

	$.validate({
		validateOnBlur : true,
		scrollToTopOnError : false
	});

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

		modulo.find('.perguntas-frequentes__item').on('click', function () {

			if (jQuery(this).hasClass('-is-active')) {
				jQuery(this).removeClass('-is-active');
			} else {
				jQuery(this).addClass('-is-active');
			}

		});

	}

	const garantia = jQuery('.garantia');

	if (garantia) {

		var menu = garantia.find('.garantia__select');
		var conteudo = garantia.find('.garantia__modulo');

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

	/* jQuery('.-comprar').on('click', function () {
		if (jQuery('body').hasClass('-nao-logado')) {
			jQuery('.naologado-garantia, .mascara-garantia').addClass('-is-active');
			return false;
		}
	}); */

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

	var formGae = $('.contatos__fale form');
	var formGaeinputs = formGae.find('input[type="text"]');
	var formOpiniao = $('.experiencia form');
	var formOpiniaoInputs = formOpiniao.find('input[type="text"],textarea');


	var Index = {
		init: function () {
			Index.serviceForm();
			Index.opinionForm();
		},

		emailValidation: function (email){
			var rx = /^[\w-]+(\.[\w-]+)*@([a-z0-9-]+(\.[a-z0-9-]+)*?\.[a-z]{2,6}|(\d{1,3}\.){3}\d{1,3})(:\d{4})?$/;

			return rx.test(email);
		},

		transformForminObj: function(obj) {
			var fsplit = obj.split('&');
			var ssplit = {};

			var i = 0;
			var t = fsplit.length;

			for(i; i<t; i++){
				var splited = fsplit[i].replace('%40', '@').replace( new RegExp('\\+','gm'), ' ').split('=');
				ssplit[splited[0]] = splited[1];
			}

			return ssplit;
		},

		serviceForm: function() {
			$('#telefone-gae').inputmask('(99) 9999[9]-9999');

			formGae.on('submit', function (e){
				e.preventDefault();

				if ( formGaeinputs.hasClass('valid') ) {

					var data = formGae.serialize();
					var obj  = Index.transformForminObj(data);

					CRM.insertClientGE(obj).done(function () {

						$('#nome-gae').val('');
						$('#email-gae').val('');
						$('#horario-gae').val('');
						$('#telefone-gae').val('');

						formGae.addClass('gae-form-is-sended');
						jQuery('.avalie-garantia').removeClass('-is-active');
						jQuery('.form-submit, .mascara-garantia').addClass('-is-active');

					});
				}
			});
		},

		opinionForm: function () {
			formOpiniao.on('submit', function (e) {
				e.preventDefault();

				if (formOpiniaoInputs.hasClass('valid')) {

					var data = formOpiniao.serialize();
					var obj = Index.transformForminObj(data);

					CRM.ajax({
						url: CRM.formatUrl('OG', 'documents'),
						type: 'PATCH',
						data: JSON.stringify(obj)
					}).done(function () {

						formOpiniaoInputs.val('');

						formOpiniao.addClass('gae-form-is-sended');
						jQuery('.avalie-garantia').removeClass('-is-active');
						jQuery('.form-submit, .mascara-garantia').addClass('-is-active');

					});
				}
			});
		}
	};

	Index.init();

	const dataLayer = new DataLayer;
	dataLayer.setup();

});

