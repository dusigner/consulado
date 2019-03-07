'use strict';

require('vendors/jquery.inputmask');
require('vendors/jquery.form-validator');
require('vendors/slick');

var CRM = require('modules/store/crm');

Nitro.controller('landing-gae-2017', [], function () {

	var accordionTitle   = $('.gae-perguntas__title');
	var formGae          = $('#form-gae-2017');
	var formGaeinputs    = formGae.find('input[type="text"]');
	var slideGae         = $('.gae-slide');
	var pageWidth        = $(window).width();

	$.validate({
		validateOnBlur : true,
		scrollToTopOnError : false
	});

	var Index = {
		init: function() {
			Index.initSlick();
			Index.serviceForm();
			Index.accordion();
		},

		accordion: function() {
			accordionTitle.click(function(e) {
				e.preventDefault();

				$(this).toggleClass('is--open');
			});
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

				// formGae.addClass('gae-form-is-sended');

				if ( formGaeinputs.hasClass('valid') ) {

					var data = formGae.serialize();
					var obj  = Index.transformForminObj(data);

					CRM.insertClientGE(obj).done(function () {

						$('#nome-gae').val('');
						$('#email-gae').val('');
						$('#horario-gae').val('');
						$('#telefone-gae').val('');

						formGae.addClass('gae-form-is-sended');
					});
				}


				// var email = $('#email-gae').val();
				// var nome = $('#nome-gae').val();

				// formGaeinputs.addClass('has--error');

				// formGaeError.html('<p class="gae-form__error">Preencha os campos corretamente</p>');

				// if( Index.emailValidation(email) ) {
				// 	formGaeinputs.removeClass('has--error');

				// 	formGaeError.remove();
				// 	// formGaeContainer.find('.gae-form__error').hide();
				// 	// formGaeError.hide();

				// 	var data = formGae.serialize();
				// 	var obj = Index.transformForminObj(data);

				// 	CRM.insertClientGE(obj).done(function (){
				// 		formGaeContainer.append('<p class="sucesso">Seus dados foram encaminhados com sucesso. Em breve entraremos em contato com você.</p>');
				// 		setTimeout(function(){
				// 			formGaeContainer.find('.sucesso').hide();
				// 		}, 10000);
				// 		$('#nome-gae').val('');
				// 		$('#email-gae').val('');
				// 		$('#horario-gae').val('');
				// 		$('#telefone-gae').val('');
				// 	});
			});
		},

		initSlick: function() {
			if ( pageWidth <= 600 && ! slideGae.hasClass('slick-initialized') ) {
				slideGae.slick({
					arrows: false,
					dots: true,
					infinite: false,
					slidesToShow: 1,
					speed: 300,
					zIndex: 10,
				});
			}
		}
	};

	$(window).on('resize', function() {
		pageWidth = $(window).width();

		if ( pageWidth <= 600 ) {
			Index.initSlick();
		}
		else if ( pageWidth > 600 && slideGae.hasClass('slick-initialized') ) {
			slideGae.slick('unslick');
		}
	});

	Index.init();
});
