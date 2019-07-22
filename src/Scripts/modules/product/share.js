/* global $: true, Nitro: true, FB: true */
'use strict';

require('modules/store/facebook-init');

var CRM = require('modules/store/crm.js');

Nitro.module('share', ['facebook-init'], function() {
	var shareBtn = $('#shareBtn'),
		shareEmail = $('#compartilharEmail'),
		url_atual = window.location.href, // pega o link da pagina atual
		titulopPro = $('.productName').html(), // pega o titulo do produto
		link = $('#compartilharTw'),
		formshare = $('#formshare'); // pega o formulário de envio

	// função que abre o modal do facebook
	shareBtn.click(function() {
		FB.ui({
			method: 'share_open_graph',
			action_type: 'og.likes',
			action_properties: JSON.stringify({
				object: url_atual
			})
		});
	});

	// monta a url de compartilhamento do Twitter
	link.attr('href', '//twitter.com/share?text=' + titulopPro + '&url=' + url_atual);

	// Abre o popup e insere os dados de compartilhamento do Twitter
	link.click(function(e) {
		e.preventDefault();

		var x = screen.width / 2 - 500 / 2,
			y = screen.height / 2 - 280 / 2,
			share_link = $(this).prop('href');

		window.open(
			share_link,
			'_blank',
			'toolbar=yes,scrollbars=yes,resizable=yes,top=' + y + ',left=' + x + ',width=500,height=280'
		);
	});

	// abre o modal de compartilhamento por e-mail
	shareEmail.click(function() {
		$('#modal-custom-share').vtexModal();
	});

	// função de compartilhamento por e-mail
	formshare.submit(function(e) {
		// impede o envio do form
		e.preventDefault();

		// pega os valores dos inputs
		var remetente = $('#remetente').val();
		var destinatario = $('#destinatario').val();
		var nomeremetente = $('#nomeremetente').val();
		var assuntoemail = $('#assuntoemail').val();
		var mensagememail = $('#mensagememail').val();
		var mensagemelink = mensagememail + '<br/>' + url_atual;

		// concatena as variaveis no date
		var data = {
			assunto: assuntoemail,
			destinatario: destinatario,
			mensagem: mensagemelink,
			nome: nomeremetente,
			remetente: remetente
		};

		// Faz a inserção no MasterData
		CRM.ajax({
			url: CRM.formatUrl('CE', 'documents'),
			type: 'PATCH',
			data: JSON.stringify(data),
			success: function() {
				formshare[0].reset();
				formshare.addClass('sucesso');
			},
			error: function(error) {
				console.info('error; ' + error);
			}
		});
	});
});
