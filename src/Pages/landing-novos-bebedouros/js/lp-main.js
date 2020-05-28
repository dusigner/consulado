$(document).ready(function () {
	var featureOptionSelection = $('.feature-option-select');
	var featureContentOptionSelection = $('.feature-option');

	$('.feature-option-select').on('click', function () {
		OptionFeatureMenuSelected($(this));

		// select slider
		var optionId = $(this).data('feature-option');
		if ($(window).width() < 1024) {
			$('#features-box__slider').slick('slickGoTo', optionId - 1);
		}

		// scroll element to be visible (mobile);
		centerOptionFeatureSelected($(this));
	});

	function centerOptionFeatureSelected(active) {
		var featuresBoxContainer = $('.features-box__options');
		var activeWidth = active.width() / 2; // get active width center
		var pos = active.position().left + activeWidth;
		var elpos = featuresBoxContainer.scrollLeft(); // get current scroll position
		var elW = featuresBoxContainer.width(); //get div width
		pos = pos + elpos - elW / 2; // for center position if you want adjust then change this
		featuresBoxContainer.animate({ scrollLeft: pos }, 500);
	}

	function OptionFeatureMenuSelected(option) {
		var optionId = option.data('feature-option');
		cleanFeatureOptionSelection();
		option.addClass('active');
		selectContentOption(optionId);
	}

	function cleanFeatureOptionSelection() {
		featureOptionSelection.each(function () {
			$(this).removeClass('active');
		});
	}

	function selectContentOption(optionId) {
		featureContentOptionSelection.each(function () {
			$(this).removeClass('active');

			if ($(this).data('option-content') == optionId) {
				$(this).addClass('active');
			}
		});
	}

	// Read more
	$('.custom-product-info').on('click', function () {
		$(this).addClass('show-more');
	});

	// Form Gela Fácil
	$('#open--gela-facil').on('click', function () {
		$('#launch-gela-facil__form').toggleClass('active');
	});

	// Form Gela Mais
	$('#open--gela-mais').on('click', function () {
		$('#launch-gela-mais__form').toggleClass('active');
	});

	// Close Gela Fácil
	$('#close-gela-facil').on('click', function () {
		$('#launch-gela-facil__form').toggleClass('active');
	});

	// Close Gela Mais
	$('#close-gela-mais').on('click', function () {
		$('#launch-gela-mais__form').toggleClass('active');
	});

	// Animation gela fácil | gela mais
	function counterAnimation(El, finishRoundOne, finishRoundTwo, finishRoundThree) {
		var counterItems = El.find('.counter-item');
		var productInfo = El.find('.info-feature--main');

		var startRoundOne = 0;
		var startRoundTwo = finishRoundOne;
		var startRoundThree = finishRoundTwo;

		var timer = window.setInterval(function () {
			if (startRoundOne < finishRoundOne) {
				counterItems.eq(startRoundOne++).addClass('full');

				if (startRoundOne === finishRoundThree) {
					productInfo.addClass('active');
				}
			} else if (startRoundTwo > finishRoundTwo) {
				counterItems.eq(startRoundTwo--).removeClass('full');
			} else if (startRoundThree <= finishRoundThree) {
				if (startRoundThree == finishRoundThree) {
					counterItems.eq(startRoundThree).addClass('indicator');
					productInfo.addClass('active');
				}
				counterItems.eq(startRoundThree++).addClass('full');
			} else {
				window.clearInterval(timer);
			}
		}, 60);
	}

	// Slick Features Box
	$('#features-box__slider').slick({
		arrows: false,
		dots: true,
	});

	// Go to slide features box
	$('#features-box__slider .slick-dots').on('click', function () {
		var slickActiveId = $(this).find('.slick-active button').text();
		var elementOptionMenuTarget = $(".features-box__options li[data-feature-option='" + slickActiveId + "']");
		OptionFeatureMenuSelected(elementOptionMenuTarget);
		centerOptionFeatureSelected(elementOptionMenuTarget);
	});
	$('#features-box__slider').on('afterChange', function (event, slick, currentSlide, nextSlide) {
		var slickActiveId = currentSlide + 1;
		var elementOptionMenuTarget = $(".features-box__options li[data-feature-option='" + slickActiveId + "']");
		OptionFeatureMenuSelected(elementOptionMenuTarget);
		centerOptionFeatureSelected(elementOptionMenuTarget);
	});

	// Slick Ambientes
	$('#ambientes__slider').slick({
		arrows: false,
		dots: true,
		slidesToShow: 1.03,
	});

	// Menu fixed on scroll
	var topNav = $('#top-navigation--lp');

	// Gela Fácil | Gela Mais
	var firstAppearanceGF = true;
	var firstAppearanceGM = true;
	var gelaFacil = $('#gela-facil');
	var gelaMais = $('#gela-mais');

	$(window).on('scroll', function (e) {
		// Nav fixed
		if ($(window).scrollTop() > 147) {
			topNav.addClass('fixed');
		} else {
			topNav.removeClass('fixed');
		}

		// Animation scrollspy
		var scroll = $(window).scrollTop();

		if ($(window).scrollTop() === 0) {
			$('#top-navigation--lp a').removeClass('active');
		}

		$('.scrollspy').each(function () {
			if ($(this).offset().top < scroll + 100) {
				$('#top-navigation--lp a').removeClass('active');

				var id = $(this).attr('id');
				$('#top-navigation--lp a[href=#' + id + ']').addClass('active');
			}
		});

		// Animation gela fácil | gela mais
		var gelaFacilEl = $('.feature-animation--gela-facil');
		var gelaMaisEl = $('.feature-animation--gela-mais');

		if (firstAppearanceGF && gelaFacil.offset().top - 200 < scroll) {
			counterAnimation(gelaFacilEl, 14, 5, 8);
			firstAppearanceGF = false;
		}

		if (firstAppearanceGM && gelaMais.offset().top - 200 < scroll) {
			counterAnimation(gelaMaisEl, 19, 15, 20);
			firstAppearanceGM = false;
		}
	});

	// Smooth Scroll
	$('a[href*=#]:not([href=#])').click(function () {
		if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') || location.hostname == this.hostname) {
			var target = $(this.hash),
				headerHeight = $('#top-navigation--lp').height(); // Get fixed header height

			target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');

			if (target.length) {
				$('html,body').animate(
					{
						scrollTop: target.offset().top - headerHeight,
					},
					500
				);
				return false;
			}
		}
	});

	// function toggle modal
	function toggleModal(currentModal) {
		$('body').toggleClass('modal-active');
		currentModal.toggleClass('active');
		$('#top-navigation--lp').toggleClass('inactive');
	}

	// Troca garrafão (desktop & mobile)
	var videoTrocaGarrafao = $('#video-troca-garrafao');
	var trocaVideoPlay = $('#troca-garrafao');
	var modalTrocaGarrafao = $('#modal-troca-garrafao');
	var closeModalTrocaGarrafao = $('#modal-troca-garrafao .close-modal');

	// Play (desk)
	trocaVideoPlay.on('click', function () {
		videoTrocaGarrafao.attr('src', videoTrocaGarrafao.attr('src') + '?autoplay=1');
		toggleModal(modalTrocaGarrafao);
	});

	// Play (mobile)
	$('#troca-garrafao-mobile').on('click', function () {
		videoTrocaGarrafao.attr('src', videoTrocaGarrafao.attr('src') + '?autoplay=1');
		toggleModal(modalTrocaGarrafao);
	});

	// Close
	closeModalTrocaGarrafao.on('click', function () {
		stopAllYoutubeVideos();
		toggleModal(modalTrocaGarrafao);
	});

	// Click Outside modal
	modalTrocaGarrafao.on('click', function (e) {
		if (e.target.className == 'modal active') {
			stopAllYoutubeVideos();
			toggleModal(modalTrocaGarrafao);
		}
	});

	// Fácil de usar
	var videoFacilUsar = $('#video-facil-de-usar');
	var facilVideoPlay = $('#facil-de-usar');
	var modalFacilUsar = $('#modal-facil-de-usar');
	var closeModalFacilUsar = $('#modal-facil-de-usar .close-modal');

	// Play
	facilVideoPlay.on('click', function () {
		console.log('=>');
		console.log(videoFacilUsar.attr('src'));
		videoFacilUsar.attr('src', videoFacilUsar.attr('src') + '?autoplay=1');
		toggleModal(modalFacilUsar);
	});

	// Play (mobile)
	$('#facil-de-usar-mobile').on('click', function () {
		videoFacilUsar.attr('src', videoFacilUsar.attr('src') + '?autoplay=1');
		toggleModal(modalFacilUsar);
	});

	// Close
	closeModalFacilUsar.on('click', function () {
		stopAllYoutubeVideos();

		var newSource = $('#video-facil-de-usar').attr('src').replace('?autoplay=1', '');
		$('#video-facil-de-usar').attr('src', newSource);

		toggleModal(modalFacilUsar);
	});

	// Click Outside modal
	modalFacilUsar.on('click', function (e) {
		if (e.target.className == 'modal active') {
			stopAllYoutubeVideos();

			var newSource = $('#video-facil-de-usar').attr('src').replace('?autoplay=1', '');
			$('#video-facil-de-usar').attr('src', newSource);

			toggleModal(modalFacilUsar);
		}
	});

	// Stops all youtube videos (class youtube-iframe)
	function stopAllYoutubeVideos() {
		$('.youtube-iframe').each(function (index) {
			var newSource = $(this).attr('src').replace('?autoplay=1', '');
			$(this).attr('src', newSource);
			return false;
		});
	}

	// Main video activation
	var videoContainer = $('#video-container');
	var mainVideoPlay = $('#video-container__play');
	var mainVideoPlayer = document.getElementById('main-video');

	var videoFrame = $('#main-video-frame');

	mainVideoPlay.on('click', function () {
		videoContainer.css('display', 'none');
		mainVideoPlayer.style.display = 'block';
		videoFrame.attr('src', videoFrame.attr('src') + '?autoplay=1');
	});

	mainVideoPlayer.addEventListener('timeupdate', function () {
		if (mainVideoPlayer.currentTime == mainVideoPlayer.duration) {
			videoContainer.css('display', 'block');
			mainVideoPlayer.style.display = 'none';
			mainVideoPlayer.currentTime = 0;
			mainVideoPlayer.pause();
		}
	});

	// Forms
	$('.launch-form').on('submit', function (e) {
		e.preventDefault();
		var feedback = $('.feedback-msg');
		var agree = $(this).find('#agree').is(':checked');

		var nome = $(this).find('#nome');
		var produto = $(this).find('#produto-escolhido');
		var email = $(this).find('#email');
		var tel = $(this).find('#tel');

		var body = {
			nome: nome.val(),
			email: email.val(),
			tel: tel.val(),
			produto: produto.val(),
		};

		// Validações
		if (body.nome == '') {
			nome.focus();
			feedback.text('por favor, preencha todos os campos');
		} else if (body.email == '') {
			email.focus();
			feedback.text('por favor, preencha todos os campos');
		} else if (body.tel == '') {
			tel.focus();
			feedback.text('por favor, preencha todos os campos');
		} else if (!agree) {
			$(this).find('#agree').focus();
			feedback.text('por favor, assinale o termo abaixo');
		} else {
			// Envio:
			$.ajaxSetup({
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/vnd.vtex.ds.v10+json',
				},
			});

			$.post('/api/dataentities/LP/documents', JSON.stringify(body)).then((retorno) => {
				// Reset input values
				nome.val('');
				email.val('');
				tel.val('');
				feedback.text('Dados enviados com sucesso!');
			});
		}
	});
});
