'use strict';

Nitro.module('welcome-message', function () {
	console.log('uhuuuuu');
	//Modificar mensagem de welcome
	$(window).load(function () {
		var welcomeMessage = $('.account p.welcome, .header-account p.welcome');

		//trocar mensagem de welcome
		if (store.isCorp) { //verifica se é PJ para trocar pelo nome da empresa
			//trata se não tiver nome da empresa pra colocar o e-mail
			if (store.userData.corporateName === null) {
				welcomeMessage.html('Olá <span class="email">' + store.userData.email + '</span>!');
			} else {
				welcomeMessage.text('Olá ' + store.userData.corporateName + '!');
			}
		}
	});
});
