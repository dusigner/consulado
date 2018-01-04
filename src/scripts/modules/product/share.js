/* global $: true, Nitro: true, FB: true */
'use strict';

require('modules/store/facebook-init');
require('vendors/vtex-modal');

var CRM = require('modules/store/crm.js');

Nitro.module('share', ['facebook-init'], function() {

	// função que abre o modal do facebook
	document.getElementById('shareBtn').onclick = function() {
		FB.ui({
			method: 'share_open_graph',
			action_type:  'og.likes',
			action_properties:  JSON.stringify({
				object: url_atual,
			})
		}, function(){});
	};

	// pega o link da pagina atual
	var url_atual = window.location.href;

	// pega o titulo do produto
	var titulopPro = $('.productName').html();

	// monta a url de compartilhamento do Twitter
	var link = document.getElementById('compartilharTw');
	link.setAttribute('href','http://twitter.com/share?text='+titulopPro+'&url='+url_atual+'');

	// Abre o popup e insere os dados de compartilhamento do Twitter
	$('#compartilharTw').on('click', function(e) {
		e.preventDefault();
		var	x = screen.width/2 - 500/2;
		var	y = screen.height/2 - 280/2;
		var share_link = $(this).prop('href');
		window.open(share_link, '_blank', 'toolbar=yes,scrollbars=yes,resizable=yes,top='+y+',left='+x+',width=500,height=280');
	});

	// abre o modal de compartilhamento por e-mail
	$('#compartilharEmail').click(function() {
		$('#modal-custom-share').vtexModal();
	});



	// pega o formulário de envio
	var formshare = document.getElementById('formshare');

	// função de compartilhamento por e-mail
	formshare.addEventListener('submit', function(e) {

		// impede o envio do form
		e.preventDefault();

		// pega os valores dos inputs
		var remetente = $('#remetente').val();
		var destinatario = $('#destinatario').val();
		var nomeremetente = $('#nomeremetente').val();
		var assuntoemail = $('#assuntoemail').val();
		var mensagememail = $('#mensagememail').val();
		var mensagemelink = mensagememail +'<br/>'+ url_atual;

		// concatena as variaveis no date
		var data = {
			'assunto' : assuntoemail,
			'destinatario' : destinatario,
			'mensagem' : mensagemelink,
			'nome' : nomeremetente,
			'remetente' : remetente
		};

		// faz a inserção no CRM
		CRM.ajax({
			url: CRM.formatUrl('CE', 'documents'),
			type: 'PATCH',
			data: JSON.stringify(data),
			success: function () {
				$('#formshare')[0].reset();
				$('#formshare').addClass('sucesso');
			},
			error: function (error) {
				console.info('error; ' + error);
			}
		});



	});





});