'use strict';
require('vendors/Uri');

Nitro.module('chatHome', function () {
	var self = this;

	this.init = function() {
		self.chatHome();
	};

	this.chatHome = function(){

		function createChatElement() {
			var div = document.createElement('div');
			div.id = 'rightNowChat';
			div.classList.toggle('-open');

			var divContent = document.createElement('div');
			divContent.id = 'rnChatContent';

			var span = document.createElement('span');
			span.classList.toggle('bar');
			span.innerHTML = 'AJUDA ONLINE';
			span.onclick = minimizeMaximize;

			var spanMinimize = document.createElement('span');
			spanMinimize.classList.toggle('minimize');
			spanMinimize.innerHTML = '<svg width="16" height="16" viewBox="0 0 1792 1792"><path d="m 287.88817,1152.333 c -26.39865,0 -49.02607,-9.4281 -67.88225,-28.2842 -18.85618,-18.8562 -28.28427,-41.4836 -28.28427,-67.8823 l 0,-192.33302 c 0,-26.39865 9.42809,-49.02607 28.28427,-67.88225 18.85618,-18.85618 41.4836,-28.28427 67.88225,-28.28427 l 1216.22363,0 c 26.3987,0 49.0261,9.42809 67.8823,28.28427 18.8562,18.85618 28.2843,41.4836 28.2843,67.88225 l 0,192.33302 c 0,26.3987 -9.4281,49.0261 -28.2843,67.8823 -18.8562,18.8561 -41.4836,28.2842 -67.8823,28.2842 z" /></svg>';

			var spanClose = document.createElement('span');
			spanClose.classList.toggle('close');
			spanClose.setAttribute('id', 'btn-close-chat');
			spanClose.innerHTML = '<svg width="16" height="16" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1490 1322q0 40-28 68l-136 136q-28 28-68 28t-68-28l-294-294-294 294q-28 28-68 28t-68-28l-136-136q-28-28-28-68t28-68l294-294-294-294q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294 294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68l-294 294 294 294q28 28 28 68z"></path></svg>';
			spanClose.onclick = function (e) {
				closeFlyout(e, this);
			};

			var title = document.createElement('p');
			title.innerHTML = 'Qual assunto iremos tratar?';

			var button1 = document.createElement('a'),
				button2 = button1.cloneNode(true),
				button3 = button1.cloneNode(true),
				button4 = button1.cloneNode(true);
			button1.href = '#';

			button1.innerHTML = 'Ajuda para comprar produtos';
			button2.innerHTML = 'Ajuda com um pedido realizado';
			button3.innerHTML = 'Instalação/Reparo de produto';
			button4.innerHTML = 'Comprar peças';


			button1.onclick = chat;
			button2.onclick = redirect;
			button3.onclick = redirect;
			button4.onclick = redirectPecas;

			span.appendChild(spanMinimize);
			span.appendChild(spanClose);
			divContent.appendChild(title);
			divContent.appendChild(button4);
			divContent.appendChild(button1);
			divContent.appendChild(button2);
			divContent.appendChild(button3);
			div.appendChild(span);
			div.appendChild(divContent);

			return div;
		}

		// var btn = $('.box-chat, .box-chat .primary-button, #footer-duvidas .col-6 div .row:nth-child(1) a.sub-title');
		var btn = $('.js-open-chat-online');

		for (var i = 0; i < btn.length; i++) {
			btn[i].onclick = btnClick;
		}

		function btnClick(e) {
			e.preventDefault();
			var flyoutDOM = document.querySelector('#rightNowChat');
			var activeChatDOM = document.querySelector('#onlineSupportFlyout');

			if (!flyoutDOM && (typeof chatOpen !== 'undefined' && (!chatOpen || chatOpen.closed) ) ) {
				if (activeChatDOM){
					activeChatDOM.remove();
				}
				document.body.appendChild(createChatElement());
				return;
			}else{
				if ( chatOpen ){
					chatOpen.focus();
				}
			}
			if (flyoutDOM && flyoutDOM.className.split('-open').length < 2) {
				flyoutDOM.querySelector('.minimize').click();
			}
		}

		function chat(e) {
			e.preventDefault();
			var url = 'https://' + __site + '.custhelp.com/app/chat/chat_launch?content=1&loja=1&msg=1';
			var chat = window.open(url, 'Ajuda_online','height=600,width=350');
			this.parentElement.parentElement.querySelector('.close').click();
			console.info(chat);

		}

		function redirect(e) {
			e.preventDefault();

			var dimmer = document.createElement('div');
			dimmer.classList.toggle('dimmer');

			var modal = document.createElement('div');
			modal.innerHTML = '<p style="font-family:consul,Helvetica Neue,Helvetica,Arial,sans-serif">Você será direcionado para o Portal de Atendimento Consul.</p> <p style="font-family:consul,Helvetica Neue,Helvetica,Arial,sans-serif">Por favor, aguarde... (<span class="counter">5</span>)</p>';

			var content = document.querySelector('#rnChatContent');
			dimmer.appendChild(modal);
			content.appendChild(dimmer);

			var counter = modal.querySelector('.counter');
			var i = parseInt(counter.innerHTML);
			var interval = window.setInterval(function () {
				if (i === 0) {
					clearInterval(interval);
					document.getElementById('btn-close-chat').click();
					window.location = 'https://consul.custhelp.com/app/atendimento';
					return false;
				}
				i--;
				counter.innerHTML = i;
			}, 1000);

		}

		function redirectPecas(e) {
			e.preventDefault();

			var dimmer = document.createElement('div');
			dimmer.classList.toggle('dimmer');

			var modal = document.createElement('div');
			modal.innerHTML = '<p style="font-family:consul,Helvetica Neue,Helvetica,Arial,sans-serif">Você será direcionado para o Portal de Atendimento Consul.</p> <p style="font-family:consul,Helvetica Neue,Helvetica,Arial,sans-serif">Por favor, aguarde... (<span class="counter">5</span>)</p>';

			var content = document.querySelector('#rnChatContent');
			dimmer.appendChild(modal);
			content.appendChild(dimmer);

			var counter = modal.querySelector('.counter');
			var i = parseInt(counter.innerHTML);
			var interval = window.setInterval(function () {
				if (i === 0) {
					clearInterval(interval);
					document.getElementById('btn-close-chat').click();
					window.location = 'http://consul.custhelp.com/app/chat/chat_launch?c=4741,4742,4745,4790&s=others-2';
					return false;
				}
				i--;
				counter.innerHTML = i;
			}, 1000);

		}

		function minimizeMaximize() {
			var chat = this.parentNode;
			var bar = this;
			var content = this.nextSibling;

			if (chat.classList.toggle('-open')) {
				chat.style.height = 'auto';
				content.style.display = 'flex';
			} else {
				chat.style.height = bar.offsetHeight.toString() + 'px';
				content.style.display = 'none';
			}
		}

		function closeFlyout(e, self) {
			e.stopPropagation();
			var flyout = self.parentNode.parentNode;
			flyout.remove();
		}

		$('body').on('click', '#rnChatContent a', function(){
			var textlink = $(this).text();
			dataLayer.push({
				event: 'generic-event-trigger',
				category: 'Módulo Ajuda',
				action: 'Click',
				label: textlink
			});
		});
	};

	var __site = 'consul';
	var chatOpen = false;


	self.init();
});
