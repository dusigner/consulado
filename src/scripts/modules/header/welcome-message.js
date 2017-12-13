'use strict';

Nitro.module('welcome-message', function () {
	//Modificar mensagem de welcome
	$(window).load(function () {
		var welcomeMessage = $('.account p.welcome, .header-account p.welcome');

		//verifica se é PJ para trocar o nome que aparece na msg de welcome
		if (store.isCorp) {
			//trata se não tiver nome da empresa pra colocar o e-mail
			if (store.userData.corporateName === null) {
				welcomeMessage.show().html('Olá <span class="email">' + store.userData.email + '</span>!');
			} else {
				welcomeMessage.show().text('Olá ' + store.userData.corporateName + '!');
			}
		}
	});
});
