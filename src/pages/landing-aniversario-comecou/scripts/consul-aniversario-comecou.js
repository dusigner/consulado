/* global FB:true */

'use strict';

var CRM = require('modules/store/crm');

require('modules/helpers');
require('vendors/slick');
require('vendors/jquery.validate');

//load Nitro Lib
require('vendors/nitro');

Nitro.setup(['consul-landing-aniversario'], function () {
	//////////////////////////
	$('.cont-logo a i').addClass('icon-logo-consul');
	//////////////////////////


	var self = this,
		$formNewsletter = $('#form-newsletter'),
		$inputName = $formNewsletter.find('input[type="text"]'),
		$inputEmail = $formNewsletter.find('input[type="email"]'),
		valid = false;

	this.scrollTo = function(element) {
		var section = $(element).attr('href'),
			top = $(section).offset().top;

		//abre section de produtos
		if (section === '#produtos') {
			$('#produtos .wrapper').slideDown(300);
			$('html, body').animate({ scrollTop: top - 80 }, 600);

			if ($(window).width() <= 768) {
				self.initSliderProdutos();
			}
		} else {
			$('html, body').animate({ scrollTop: top }, 600);
		}
	};

	this.initSliderProdutos = function() {
		$('#produtos .wrapper').slick({
			dots: true,
			swipe: true,
			slidesToShow: 1
		});
	};

	this.calculateTimeRemaining = function(endDate) {
		var total = Date.parse(endDate) - Date.parse(new Date()),
			seconds = Math.floor( (total/1000) % 60 ),
			minutes = Math.floor( (total/1000/60) % 60 ),
			hours = Math.floor( (total/(1000*60*60)) % 24 ),
			days = Math.floor( total/(1000*60*60*24) ),
			timeRemaining = {
				'total': total,
				'days': days,
				'hours': hours,
				'minutes': minutes,
				'seconds': seconds
			};

		return timeRemaining;
	};

	this.countdown = function() {
		var endDate = '2017-7-7',
			$countdown = $('.countdown'),
			$days = $countdown.find('.countdown-days .counter'),
			$hours = $countdown.find('.countdown-hours .counter'),
			$minutes = $countdown.find('.countdown-minutes .counter'),
			$seconds = $countdown.find('.countdown-seconds .counter'),
			timeRemaining = self.calculateTimeRemaining(endDate),
			days = timeRemaining.days,
			hours = timeRemaining.hours,
			minutes = timeRemaining.minutes,
			seconds = timeRemaining.seconds;

		$days.text(days < 10 ? '0' + days : days);
		$hours.text(hours < 10 ? '0' + hours : hours);
		$minutes.text(minutes < 10 ? '0' + minutes : minutes);
		$seconds.text(seconds < 10 ? '0' + seconds : seconds);
	};

	//clique nos links leva para section correspondente
	$('.header .container>div a:not(.share-facebook), #acoes-desktop .wrapper>div a:not(.share-facebook), #acoes-mobile .espiar').click(function(e){
		e.preventDefault();

		self.scrollTo($(this));
	});

	$('.detalhes').append('<a href="" class="btn-confira" title="Confira" target="_blank">Confira</a>');
 
	//cadastro newsletter
	$formNewsletter.submit(function(e) {
		e.preventDefault();

		$formNewsletter.find('input').on('blur', function() {
			self.validateInputs();
		});

		self.validateForm();

		return false;
	});

	this.validateInputs = function() {
		if ($inputName.filter(':blank').length >= 1) {
			$inputName.addClass('error');
		} else {
			$inputName.removeClass('error');
		}

		if ($inputEmail.filter(':blank').length >= 1) {
			$inputEmail.addClass('error');
		} else {
			$inputEmail.removeClass('error');
		}
	};

	this.validateForm = function() {
		if ($inputName.filter(':blank').length < 1 && $inputEmail.filter(':blank').length < 1) {
			valid = true;
		} else {
			self.validateInputs();
		}

		if (valid) {
			var name = $inputName.val(),
				email = $inputEmail.val();

			self.registerNewsletter(name, email);
		}
	};

	this.registerNewsletter = function(name, email) {
		var data = {};

		data.firstName = name;
		data.email = email;

		CRM.insertClient(data);
	};


	//compartilhar facebook
	$('.header .share-facebook').click(function(e) {
		e.preventDefault();

		// if(FB) {
		// 	FB.login(function(response) {
		// 			if (response.authResponse) {
		// 					FB.api('/me', function() {
		// 							FB.ui({
		// 									method: 'send',
		// 									link: 'http://loja.consul.com.br/landing/aniversario'
		// 							});
		// 					});
		// 			}
		// 	});
		// }
	});

	// //Iniciando SDK Facebook
	// window.fbAsyncInit = function () {
	// 		FB.init({
	// 				appId: store.isQA ? '183555032145633' : '178708989296904',
	// 				xfbml: true,
	// 				version: 'v2.8'
	// 		});
	// 		//FB.AppEvents.logPageView();
	// };

	// (function (d, s, id) {
	// 		var js, fjs = d.getElementsByTagName(s)[0];
	// 		if (d.getElementById(id)) { return; }
	// 		js = d.createElement(s); js.id = id;
	// 		js.src = '//connect.facebook.net/en_US/sdk.js';
	// 		fjs.parentNode.insertBefore(js, fjs);
	// }(document, 'script', 'facebook-jssdk'));

	setInterval(self.countdown, 1000);
	// self.countdown();
});