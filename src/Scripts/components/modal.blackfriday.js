'use strict';

require('vendors/vtex-modal-cookie');
var CRM = require('modules/store/crm');

Nitro.module('modal.blackfriday', function() {


	var $template = '<div class="modal-body">' +
		'<div class="row">' +
		'<div class="col-12"><img src="/arquivos/consul-blackfriday-logo-lb.jpg" alt="Black Friday"/></div>' +
		'</div>' +
		'<div class="row">' +
		'<h4 class="col-12">Cadastre-se agora e receba as ofertas<br/>da Black Friday antes</h4>' +
		'</div>' +
		'<form action="" class="form-cadastro cf" method="GET">' +
		'<input type="hidden" name="xBlackFriday" value="true" />' +

		'<div class="fields">' +
		'<input type="text" id="txt-nome" name="fullName" placeholder="Nome completo" required />' +
		'<input type="email" id="txt-email" name="email" placeholder="E-mail" required />' +
		'<div class="row">' +
		'<div class="col-1"><input type="checkbox" id="rules" required name="rules" value="1" checked="checked" /></div>' +
		'<div class="col-11"><label for="rules" class="lbl-aceito">li e aceito os <a id="termos" href="/landing/blackfriday#modal-termos">termos</a></label></div>' +
		'</div>' +

		'<input type="submit" class="cadastrar" value="Cadastre-se" />' +
		'</div>' +
		'</form>' +
		'</div>';

	var $success = '<div class="modal-body">' +
		'<div class="row">' +
		'<div class="col-12"><img src="/arquivos/consul-blackfriday-logo-lb.jpg" alt="Black Friday"/></div>' +
		'</div>' +
		'<h2>Cadastro realizado com sucesso!</h2>' +
		'</div>';


	this.setup = function() {
		$($template).vtexModal({
			id: 'blackfriday',
			cookieOptions: {
				expires: 1,
				path: '/'
			}
		});

		$('.form-cadastro').submit(this.submit);
	};

	this.submit = function(e) {
		e.preventDefault();


		var $inputs = $('.form-cadastro').find('input[type="email"], input[type="text"], input[type="hidden"]');
		// console.log($inputs);
		var data = {};

		$.map($inputs, function(x) {
			if (!x.value || x.value === '') {
				return;
			}
			data[x.name] = x.value;
		});

		if (data.fullName) {
			var splitedName = data.fullName.split(' ');
			data.firstName = splitedName[0];
			if (splitedName.length !== 1) {
				data.lastName = splitedName.slice(1, splitedName.length).join(' ');
			}
		}

		delete data.fullName;


		CRM.insertClient(data)
			.then(function() {
				$('#vtex-blackfriday .close').trigger('click');

				$($success).vtexModal({
					id: 'blackfriday-success'
				});
			})
			.fail(function() {
				$('#vtex-blackfriday .close').trigger('click');
			});

	};

	this.setup();




});
