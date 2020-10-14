/* global VERSION: true, Nitro: true */

'use strict';

/*
 - TODO:
 - Esse import foi colocado para reolver os problemas do IE.
 - Os problemas foram resolvidos, porém o arquivo quase dobrou de tamanho.
 - O ideal é estudar uma forma de importar somente o necessário ou rever
 - tudo o que usamos de ES6 e mudarmos para o funcionamento no IE.
*/
require('@babel/polyfill');

require('modules/helpers');

// Vendors
require('vendors/jquery.cookie');
require('vendors/jquery.inputmask');
require('vendors/jquery.debounce');
require('vendors/slick');
require('vendors/ajax.localstorage');
require('vendors/vtex-modal');
require('vendors/dust-helpers');
require('consentCookie');

if (VERSION) {
	console.info(
		'%c %c %c Jussi | %s Build Version: %s %c %c ',
		'background:#dfdab0;padding:2px 0;',
		'background:#666; padding:2px 0;',
		'background:#222; color:#bada55;padding:2px 0;',
		(window.jsnomeLoja || '').replace(/\d/, '').capitalize(),
		VERSION,
		'background:#666;padding:2px 0;',
		'background:#dfdab0;padding:2px 0;'
	);

	window._trackJs = window._trackJs || {};

	window._trackJs.version = VERSION;
}

//load Nitro Lib
require('vendors/nitro');

// Global
var URI = require('urijs');
var localStore = require('store');

window.URI = URI;
window.localStore = localStore;

require('expose-loader?store!modules/store/store');

//load modules individually
require('modules/vtex-events')();
require('modules/header');
// require('modules/footer');
require('modules/footer-2019');
require('modules/store/cluster');
require('modules/listagem/percentoff');
require('modules/descadastrar.emailCRM.js');
require('modules/store/vtex-login');
require('modules/prateleira');
require('modules/customLogin');
require('modules/isTelevendasCorp');
require('modules/store/callcenter');
require('modules/wishlist/wishlist-init');
require('modules/banner-covid');
require('modules/logoffUser');
require('dataLayers/dataLayer-new-header-menu');
require('modules/tira-duvidas');
require('dataLayers/datalayer-tira-duvidas');
require('consentCookie');
// require('dataLayers/dataLayer-menu-antigo');

const changeCallcenterLinks = () => {
	if (
		$('body').is('.neemu.listagem.busca.consul') &&
		(window.location.search.indexOf('vtexcommercestable=1') > 0 ||
			(window.getCookie &&
				window.getCookie('MTC') &&
				window.getCookie('MTC').indexOf('.vtexcommercestable.com.br') > 0))
	) {
		localStorage.removeItem('lastUrl');
		$('a[href*="//loja.consul.com.br/"]').attr('href', function() {
			return $(this)
				.attr('href')
				.replace('loja.consul.com.br', 'consul.vtexcommercestable.com.br');
		});
	}
	if (document.referrer.match('myvtex') || localStorage.lastUrl === 'myvtex') {
		localStorage.lastUrl = 'myvtex';

		$('a[href*="//loja.consul.com.br/"]').attr('href', function() {
			return $(this)
				.attr('href')
				.replace('loja.consul.com.br', 'consul.myvtex.com');
		});
		$('a[href*="//consul.vtexcommercestable.com.br/"]').attr('href', function() {
			return $(this)
				.attr('href')
				.replace('consul.vtexcommercestable.com.br', 'consul.myvtex.com');
		});
	}
};

Nitro.setup(
	[
		/*'geo', */ 'cluster',
		'percentoff',
		'wishlist-init',
		'descadastrar.emailCRM',
		'vtex-login',
		'prateleira' /*, 'login.url'*/,
		'redirect',
		'customLogin',
		'landing-gae-compra-interno',
		'chatHome',
		'isTelevendasCorp',
		'callcenter',
		'logoffUser',
		'dataLayer-new-header-menu',
		'tiraduvidas',
		'datalayer-tira-duvidas',
		'consentCookie',
		// 'dataLayer-menu-antigo'
	],
	function() {
		var path = window.location.pathname;

		if (path === '/atendimento') {
			$(location).attr('href', '//consul.custhelp.com/');
		}

		if ('serviceWorker' in navigator && window.location.origin.indexOf(':30') < 0) {
			window.addEventListener('load', function() {
				navigator.serviceWorker
					.register('/files/service-worker.js', { scope: '../' })
					.then(function(registration) {
						// Registration was successful
						console.info('ServiceWorker reegistration successful.', registration);
					})
					.catch(function(err) {
						// registration failed :(
						console.info('ServiceWorker registration failed: ', err);
					});
			});
		}

		changeCallcenterLinks();
	}
);

$(window).load(changeCallcenterLinks);

// $(window).load(function() {
// 	const loginText = $('.menu-mobile .account__icon--profile');

// 	if (loginText) {
// 		let loginData = `
// 			${loginText[0].innerHTML}
// 			<span class="logout-text"> ${loginText.parent()[0].innerText.split('Sair')[0]} </span>
// 			${loginText.siblings('em')[0].innerHTML}
// 		`;
// 		loginText.parent().html(loginData);

// 	}
// });



window.mobileCheck = function() {
	let check = false;
	(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
};

// TesteAB e-promotor home
window.showBannerPromotor = function(mobile, desk) {
	const liveChatId = '3b5663e6-26c6-4fdc-a69c-61841c3edc9f'

	window.localStorage.setItem('bannerPromotorTestAB', `${mobile},${desk}`)

	const device = window.mobileCheck() ? mobile : desk

	// Banner Home e PDC
	const containerBanner = document.querySelector('.container-epromotor')
	if(containerBanner) containerBanner.classList.add('show')

    const containerWhatsClass = window.mobileCheck() ? '.content_botoes_televendas' : '.container-whats'

    if (device === 'whats') {
		// Container PDP
		const containerWhats = document.querySelector(containerWhatsClass)
		if(containerWhats){
			console.clear()
			console.log(containerWhatsClass)
			document.querySelector(containerWhatsClass).style.display = 'block';
		}
	}

    if (device === 'liveChat') {

		// Banner HOME e PDC
		if(containerBanner){
			containerBanner.querySelector('a').addEventListener('click', e => {
				e.preventDefault();
				document.querySelector('#ib-button-messaging-icon').click()
			})
		}

		// Tempo carregamento lip live chat
		let runnedChat = false;
		let timeoutChat;

		function tryToRunChat() {
			if (!runnedChat) {
				if (window.liveChat) {
					window.liveChat('init', liveChatId)
					runnedChat = true;
				}else timeoutChat = setTimeout(tryToRunChat, 1000);
			}
		}
		tryToRunChat();
	}
}

// Controle do container do promotor e liveChat para controle via Optimize
if(document.querySelector('.container-whats')){
	document.querySelector('.container-whats').style.display = 'none';
	document.querySelector('.content_botoes_televendas').style.display = 'none';
}

let bannerPromotor = localStorage.getItem('bannerPromotorTestAB')

if(bannerPromotor) {
	const [mobile, desk] = bannerPromotor.split(',')
	window.showBannerPromotor(mobile, desk)
}
