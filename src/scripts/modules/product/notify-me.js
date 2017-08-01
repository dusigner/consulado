/* global $: true, Nitro: true, skuJson: true */
'use strict';

// require('../../../templates/notify-me.html');
// require('vendors/portal-notify-me');

require('vendors/jquery.inputmask');


Nitro.module('notify-me', function() {

	var televendas = $('a[title*="Televendas"]').clone().attr('title', 'Televendas').addClass('notifyme-televendas');
	var notifyMeButton = $('.portal-notify-me-ref').find('.notifyme-button-ok');

	notifyMeButton.parent()
		.append('<a href="#relacionados" class="primary-button notifyme-button-ok scroll-to">Veja outros produtos relacionados</a>');

	notifyMeButton.val('Avise-me');
	if (typeof televendas !== 'undefined') {
		$('.notifyme-form')
			.find('p')
			.append('<br>Ou entre em contato com nosso ').append(televendas[0]);
	}

	var isAvailable = skuJson.skus.some(function(e) {
		return e.available;
	});

	if (!isAvailable) {
		var notifyMe = $('.portal-notify-me-ref').data('notifyMe');
		if (typeof notifyMe !== 'undefined') {
			notifyMe.showNM();
			$('.notifyme-skuid').attr('value', skuJson.skus[0].sku);
		}
	}

	//Adicionar campo telefone no notify-me
	$('.notifyme-client-email').after('<input class="sku-notifyme-client-phone notifyme-client-phone" placeholder="Digite seu telefone..." type="tel" name="notifymeClientPhone" id="notifymeClientPhone" style="display: inline-block;">');
	$('#notifymeClientPhone').inputmask('(99) 9999[9]-9999');


	$('.portal-notify-me-ref').on('notifyMeSubmitted.vtex', function() {
		var dataObj = {
			email: $('#notifymeClientEmail').val(),
			nome: $('#notifymeClientName').val(),
			produto: $('.productName').text(),
			telefone: $('#notifymeClientPhone').val()
		};

		$.ajax({
			url: '/api/ds/pub/documents/NT',
			type: 'POST',
			data: JSON.stringify(dataObj),
			contentType: 'application/json; charset=utf-8'
		});
	});

});
