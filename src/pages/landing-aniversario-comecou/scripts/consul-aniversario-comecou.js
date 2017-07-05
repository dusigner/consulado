'use strict';

var CRM = require('modules/store/crm');
var validation = require('modules/store/validation');

require('modules/helpers');
require('vendors/slick');
require('vendors/jquery.validate');

//load Nitro Lib
require('vendors/nitro');

Nitro.setup(['consul-landing-aniversario'], function () {
	var self = this,
		$formNewsletter = $('#form-newsletter');

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
		var endDate = '2017-7-16',
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

	//adicionar btn confira da prateleira
	$('.detalhes').append('<a href="" class="btn-confira" title="Confira" target="_blank">Confira</a>');

	$('.detalhes .image').each(function(index, value) {
		var linkProduto = $(this).attr('href');

		$($('.imgProdutos a').get(index)).attr('href', linkProduto);
		$($('.detalhes .btn-confira').get(index)).attr('href', linkProduto);
	});

	//slider prateleira do contador
	this.init = function() {
		this.sliderPrateleira();
	};

		this.sliderPrateleira = function() {
			if ($(window).width() <= 992) {
				$('.infoProdutos .prateleira > ul').slick({
					slidesToShow: 1,
					slidesToScroll: 1,
					arrows: true,
					dots: true,
					fade: false,
					asNavFor: '.imgProdutos'
				});
				$('.imgProdutos').slick({
					slidesToShow: 1,
					slidesToScroll: 1,
					asNavFor: '.infoProdutos .prateleira > ul',
					arrows: false,
					dots: false,
					centerMode: false,
					focusOnSelect: true
				});
			}
		};

		this.init();

	//cadastro newsletter
	$formNewsletter.submit(function(e){
		e.preventDefault();

		var $fields = $(this).find('input[type="text"], input[type="email"]'),
			$inputName = $formNewsletter.find('input[type="text"]'),
			$inputEmail = $formNewsletter.find('input[type="email"]'),
			$btnSubmit = $(this).find('input[type="submit"]');

		validation.validate($fields, $btnSubmit)
		.done(function(){
			var data = {
				firstName: $inputName.val(),
				email: $inputEmail.val(),
				isNewsletterOptIn: true
			};

			$.getJSON(CRM.clientURI, {
				f: 'id,email',
				fq: 'email:' + $inputEmail.val()
			}).done(function(res){
				if (res) {
					//exibe msg de erro
					$('#cadastro .form .error').fadeIn();
				}
			}).fail(function(res){
				if (res.status === 404) {
					CRM.insertClient(data).done(function(res){
						if (res) {
							//exibe msg de sucesso
							$formNewsletter.fadeOut();
							$('#cadastro .form .success').fadeIn();
						} else {
							//exibe msg de erro
							$('#cadastro .form .error').text('Oops! Algo deu errado. Por favor, tente novamente.');
							$('#cadastro .form .error').fadeIn();
						}
					});
				} else {
					$('#cadastro .form .error').fadeIn();
				}
			});
		});
	});


	//compartilhar facebook
	$('.share-facebook').click(function(e) {
		e.preventDefault();

		window.open('https://www.facebook.com/sharer.php?u=http://consulqa.vtexcommercestable.com.br/landing/aniversario', 'sharer', 'width=626,height=436');
	});

	setInterval(self.countdown, 1000);
	// self.countdown();
});