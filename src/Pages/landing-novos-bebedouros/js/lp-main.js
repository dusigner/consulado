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
	function counterAnimation(
		El,
		finishRoundOne,
		finishRoundTwo,
		finishRoundThree
	) {
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
		dots: true
	});

	// Go to slide features box
	$('#features-box__slider .slick-dots').on('click', function () {
		var slickActiveId = $(this)
			.find('.slick-active button')
			.text();
		var elementOptionMenuTarget = $(
			".features-box__options li[data-feature-option='" +
			slickActiveId +
			"']"
		);
		OptionFeatureMenuSelected(elementOptionMenuTarget);
		centerOptionFeatureSelected(elementOptionMenuTarget);
	});
	$('#features-box__slider').on('afterChange', function (
		event,
		slick,
		currentSlide,
		nextSlide
	) {
		var slickActiveId = currentSlide + 1;
		var elementOptionMenuTarget = $(
			".features-box__options li[data-feature-option='" +
			slickActiveId +
			"']"
		);
		OptionFeatureMenuSelected(elementOptionMenuTarget);
		centerOptionFeatureSelected(elementOptionMenuTarget);
	});

	// Slick Ambientes
	$('#ambientes__slider').slick({
		arrows: false,
		dots: true,
		slidesToShow: 1.03
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

	// Check if element is on the screen
	$.fn.isOnScreen = function (x, y) {
		if (x == null || typeof x == 'undefined') x = 1;
		if (y == null || typeof y == 'undefined') y = 1;

		var win = $(window);

		var viewport = {
			top: win.scrollTop(),
			left: win.scrollLeft()
		};
		viewport.right = viewport.left + win.width();
		viewport.bottom = viewport.top + win.height();

		var height = this.outerHeight();
		var width = this.outerWidth();

		if (!width || !height) {
			return false;
		}

		var bounds = this.offset();
		bounds.right = bounds.left + width;
		bounds.bottom = bounds.top + height;

		var visible = !(
			viewport.right < bounds.left ||
			viewport.left > bounds.right ||
			viewport.bottom < bounds.top ||
			viewport.top > bounds.bottom
		);

		if (!visible) {
			return false;
		}

		var deltas = {
			top: Math.min(1, (bounds.bottom - viewport.top) / height),
			bottom: Math.min(1, (viewport.bottom - bounds.top) / height),
			left: Math.min(1, (bounds.right - viewport.left) / width),
			right: Math.min(1, (viewport.right - bounds.left) / width)
		};

		return (
			deltas.left * deltas.right >= x && deltas.top * deltas.bottom >= y
		);
	};

	// Smooth Scroll
	$('a[href*=#]:not([href=#])').click(function () {
		if (
			location.pathname.replace(/^\//, '') ==
			this.pathname.replace(/^\//, '') ||
			location.hostname == this.hostname
		) {
			var target = $(this.hash),
				headerHeight = $('#top-navigation--lp').height(); // Get fixed header height

			target = target.length
				? target
				: $('[name=' + this.hash.slice(1) + ']');

			if (target.length) {
				$('html,body').animate(
					{
						scrollTop: target.offset().top - headerHeight
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
		videoTrocaGarrafao.attr(
			'src',
			videoTrocaGarrafao.attr('src') + '?autoplay=1'
		);
		toggleModal(modalTrocaGarrafao);
	});

	// Play (mobile)
	$('#troca-garrafao-mobile').on('click', function () {
		videoTrocaGarrafao.attr(
			'src',
			videoTrocaGarrafao.attr('src') + '?autoplay=1'
		);
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

		var newSource = $('#video-facil-de-usar')
			.attr('src')
			.replace('?autoplay=1', '');
		$('#video-facil-de-usar').attr('src', newSource);

		toggleModal(modalFacilUsar);
	});

	// Click Outside modal
	modalFacilUsar.on('click', function (e) {
		if (e.target.className == 'modal active') {
			stopAllYoutubeVideos();

			var newSource = $('#video-facil-de-usar')
				.attr('src')
				.replace('?autoplay=1', '');
			$('#video-facil-de-usar').attr('src', newSource);

			toggleModal(modalFacilUsar);
		}
	});

	// Stops all youtube videos (class youtube-iframe)
	function stopAllYoutubeVideos() {
		$('.youtube-iframe').each(function (index) {
			var newSource = $(this)
				.attr('src')
				.replace('?autoplay=1', '');
			$(this).attr('src', newSource);
			return false;
		});
	}

	// Main video activation
	var videoContainer = $('#video-container');
	var mainVideoPlay = $('#video-container__play');
	var mainVideoPlayer = $('#main-video');

	var videoFrame = $('#main-video-frame');

	mainVideoPlay.on('click', function () {
		videoContainer.css('display', 'none');
		mainVideoPlayer.css('display', 'block');
	});

	// Forms
	$('.launch-form').on('submit', function (e) {
		e.preventDefault();
		var feedback = $('.feedback-msg');
		var agree = $(this)
			.find('#agree')
			.is(':checked');

		var nome = $(this).find('#nome');
		var produto = $(this).find('#produto-escolhido');
		var email = $(this).find('#email');
		var tel = $(this).find('#tel');

		var body = {
			nome: nome.val(),
			email: email.val(),
			tel: tel.val(),
			produto: produto.val()
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
			$(this)
				.find('#agree')
				.focus();
			feedback.text('por favor, assinale o termo abaixo');
		} else {
			var data = JSON.stringify(body);

			$.ajax({
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/vnd.vtex.ds.v10+json'
				},
				type: 'POST',
				url: '/api/dataentities/PB/documents',
				data: data,
				success: function (res) {
					nome.val('');
					email.val('');
					tel.val('');
					feedback.text('Dados enviados com sucesso!');
				}
			});
		}
	});

	gelaFacilLoadInfo();

	function gelaFacilLoadInfo() {
		$.ajax({
			headers: {
				'Access-Control-Allow-Origin': '*'
			},
			type: 'GET',
			url:
				'/api/catalog_system/pub/products/search/bebedouro-consul-gela-facil-cjk40ab/p',
			success: function (res) {
				var Price = res[0].items[0].sellers[0].commertialOffer.Price;
				var ListPrice =
					res[0].items[0].sellers[0].commertialOffer.ListPrice;
				var BestPrice = ListPrice > Price ? Price : ListPrice;

				if (Price == BestPrice) {
					$('#gela-facil-list-price').css('display', 'none');
				}

				$('#gela-facil-list-price').text(
					'R$ ' +
					parseFloat(Price)
						.toFixed(2)
						.replace('.', ',')
				);
				$('#gela-facil-best-price').text(
					'R$ ' +
					parseFloat(BestPrice)
						.toFixed(2)
						.replace('.', ',')
				);

				var InstallMents =
					res[0].items[0].sellers[0].commertialOffer.Installments;

				var arrayIndex = 0;
				var largeNumberOfInstallments = 0;

				for (var i = 0; i < InstallMents.length; i++) {
					if (
						InstallMents[i].NumberOfInstallments >
						largeNumberOfInstallments
					) {
						largeNumberOfInstallments =
							InstallMents[i].NumberOfInstallments;
						arrayIndex = i;
					}
				}

				var semJuros =
					parseInt(InstallMents[arrayIndex].InterestRate) == 0
						? 'sem juros'
						: '';
				var installmentsText =
					'Em até <span class="vezes">' +
					InstallMents[arrayIndex].NumberOfInstallments +
					'x</span> <span class="val">R$ ' +
					parseFloat(InstallMents[arrayIndex].Value)
						.toFixed(2)
						.replace('.', ',') +
					'</span> ' +
					semJuros;
				$('#gela-facil-adicional').html(installmentsText);
			}
		});
	}

	gelaMaisLoadInfo();

	function gelaMaisLoadInfo() {
		$.ajax({
			headers: {
				"Access-Control-Allow-Origin": "*"
			},
			type: "GET",
			url:
				"/api/catalog_system/pub/products/search/bebedouro-consul-gela-mais-cjd42ab/p",
			success: function (res) {
				var Price = res[0].items[0].sellers[0].commertialOffer.Price;
				var ListPrice =
					res[0].items[0].sellers[0].commertialOffer.ListPrice;
				var BestPrice = ListPrice > Price ? Price : ListPrice;

				if (Price == BestPrice) {
					$("#gela-mais-list-price").css("display", "none");
				}

				$("#gela-mais-list-price").text(
					"R$ " +
					parseFloat(Price)
						.toFixed(2)
						.replace(".", ",")
				);
				$("#gela-mais-best-price").text(
					"R$ " +
					parseFloat(BestPrice)
						.toFixed(2)
						.replace(".", ",")
				);

				var InstallMents =
					res[0].items[0].sellers[0].commertialOffer.Installments;

				var arrayIndex = 0;
				var largeNumberOfInstallments = 0;

				for (var i = 0; i < InstallMents.length; i++) {
					if (
						InstallMents[i].NumberOfInstallments >
						largeNumberOfInstallments
					) {
						largeNumberOfInstallments =
							InstallMents[i].NumberOfInstallments;
						arrayIndex = i;
					}
				}

				var semJuros =
					parseInt(InstallMents[arrayIndex].InterestRate) == 0
						? "sem juros"
						: "";
				var installmentsText =
					'Em até <span class="vezes">' +
					InstallMents[arrayIndex].NumberOfInstallments +
					'x</span> <span class="val">R$ ' +
					parseFloat(InstallMents[arrayIndex].Value)
						.toFixed(2)
						.replace(".", ",") +
					"</span> " +
					semJuros;
				$("#gela-mais-adicional").html(installmentsText);
			}
		});
	}

	function removeAcento(text) {
		text = text.toLowerCase();
		text = text.replace(new RegExp('[ÁÀÂÃ]', 'gi'), 'a');
		text = text.replace(new RegExp('[ÉÈÊ]', 'gi'), 'e');
		text = text.replace(new RegExp('[ÍÌÎ]', 'gi'), 'i');
		text = text.replace(new RegExp('[ÓÒÔÕ]', 'gi'), 'o');
		text = text.replace(new RegExp('[ÚÙÛ]', 'gi'), 'u');
		text = text.replace(new RegExp('[Ç]', 'gi'), 'c');
		return text;
	}

	// Tags DataLayer
	// Tag 1
	$('#top-navigation--lp li a').on('click', function () {
		var opcaoClicada = removeAcento(
			$(this)
				.text()
				.replaceAll(' ', '_')
		);

		dataLayer.push({
			event: 'generic',
			category: 'lp_bebedouros',
			action: 'clique_menu_superior',
			label: opcaoClicada
		});
	});

	// Tag 2
	$('#top-navigation--lp .cta').on('click', function () {
		dataLayer.push({
			event: 'generic',
			category: 'lp_bebedouros',
			action: 'eu_quero',
			label: 'menu_superior'
		});
	});

	// Tag 3
	$('.intro-info .cta').on('click', function () {
		dataLayer.push({
			event: 'generic',
			category: 'lp_bebedouros',
			action: 'saiba_mais',
			label: 'banner_superior'
		});
	});

	// Tag 4
	$('.features .features-box__options li').on('click', function () {
		var opcaoClicada = removeAcento(
			$(this)
				.find('.feature-option-select__title')
				.text()
				.replaceAll(' ', '_')
		);

		dataLayer.push({
			event: 'generic',
			category: 'lp_bebedouros',
			action: 'clique_features_e_beneficios',
			label: $.trim(opcaoClicada)
		});
	});

	// Tag 5
	var firstAppearanceFeature = true;
	var intervalFeatures = null;

	$(window).on('scroll', function () {
		setTimeout(function () {
			// Features
			if (firstAppearanceFeature && $('#features').isOnScreen(1, 0.5)) {
				var counter = 0;

				intervalFeatures = setInterval(function () {
					counter++;
					if (counter >= 12) {
						clearInterval(intervalFeatures);
						return;
					} else {
						if (counter == 1 && $('#features').isOnScreen(1, 0.5)) {
							dataLayer.push({
								event: 'generic',
								category: 'lp_bebedouros',
								action: 'viability_features_e_beneficios',
								label: '1s'
							});
						} else if (
							counter == 4 &&
							$('#features').isOnScreen(1, 0.5)
						) {
							dataLayer.push({
								event: 'generic',
								category: 'lp_bebedouros',
								action: 'viability_features_e_beneficios',
								label: '4s'
							});
						} else if (
							counter == 10 &&
							$('#features').isOnScreen(1, 0.5)
						) {
							dataLayer.push({
								event: 'generic',
								category: 'lp_bebedouros',
								action: 'viability_features_e_beneficios',
								label: '10s'
							});
						}
					}
				}, 1000);

				firstAppearanceFeature = false;
			}

			if ($('#features')[0].getBoundingClientRect().bottom < 0) {
				clearInterval(intervalFeatures);
			}
		}, 500);
	});

	// Tag 6
	$('#troca-garrafao, #facil-de-usar').on('click', function () {
		var opcaoClicada = removeAcento(
			$(this)
				.parent()
				.find('.main-title')
				.text()
				.replaceAll(' ', '_')
		);

		dataLayer.push({
			event: 'generic',
			category: 'lp_bebedouros',
			action: 'veja_em_acao',
			label: $.trim(opcaoClicada)
		});
	});

	// Tag 7
	$('#features .features-anchor').on('click', function () {
		dataLayer.push({
			event: 'generic',
			category: 'lp_bebedouros',
			action: 'clique_veja_mais',
			label: 'descubra_qual_o_melhor_produto_para_voce'
		});
	});

	// Tag 8
	var firstAppearanceGelaFacil = true;
	var intervalGelaFacil = null;

	$(window).on('scroll', function () {
		setTimeout(function () {
			// Features
			if (
				firstAppearanceGelaFacil &&
				$('#gela-facil').isOnScreen(1, 0.5)
			) {
				var counter = 0;

				intervalGelaFacil = setInterval(function () {
					counter++;
					if (counter >= 12) {
						clearInterval(intervalGelaFacil);
						return;
					} else {
						if (
							counter == 1 &&
							$('#gela-facil').isOnScreen(1, 0.5)
						) {
							dataLayer.push({
								event: 'generic',
								category: 'lp_bebedouros',
								action: 'viability_gela_facil',
								label: '1s'
							});
						} else if (
							counter == 4 &&
							$('#gela-facil').isOnScreen(1, 0.5)
						) {
							dataLayer.push({
								event: 'generic',
								category: 'lp_bebedouros',
								action: 'viability_gela_facil',
								label: '4s'
							});
						} else if (
							counter == 10 &&
							$('#gela-facil').isOnScreen(1, 0.5)
						) {
							dataLayer.push({
								event: 'generic',
								category: 'lp_bebedouros',
								action: 'viability_gela_facil',
								label: '10s'
							});
						}
					}
				}, 1000);

				firstAppearanceGelaFacil = false;
			}

			if ($('#gela-facil')[0].getBoundingClientRect().bottom < 0) {
				clearInterval(intervalGelaFacil);
			}
		}, 500);
	});

	// Tag 9
	$('#gela-facil .cta').on('click', function () {
		dataLayer.push({
			event: 'generic',
			category: 'lp_bebedouros',
			action: 'eu_quero',
			label: 'gela_facil'
		});
	});

	// Tag 10
	var firstAppearanceGelaMais = true;
	var intervalGelaMais = null;

	$(window).on('scroll', function () {
		setTimeout(function () {
			// Features
			if (firstAppearanceGelaMais && $('#gela-mais').isOnScreen(1, 0.5)) {
				var counter = 0;

				intervalGelaMais = setInterval(function () {
					counter++;
					if (counter >= 12) {
						clearInterval(intervalGelaMais);
						return;
					} else {
						if (
							counter == 1 &&
							$('#gela-mais').isOnScreen(1, 0.5)
						) {
							dataLayer.push({
								event: 'generic',
								category: 'lp_bebedouros',
								action: 'viability_gela_mais',
								label: '1s'
							});
						} else if (
							counter == 4 &&
							$('#gela-mais').isOnScreen(1, 0.5)
						) {
							dataLayer.push({
								event: 'generic',
								category: 'lp_bebedouros',
								action: 'viability_gela_mais',
								label: '4s'
							});
						} else if (
							counter == 10 &&
							$('#gela-mais').isOnScreen(1, 0.5)
						) {
							dataLayer.push({
								event: 'generic',
								category: 'lp_bebedouros',
								action: 'viability_gela_mais',
								label: '10s'
							});
						}
					}
				}, 1000);

				firstAppearanceGelaMais = false;
			}

			if ($('#gela-mais')[0].getBoundingClientRect().bottom < 0) {
				clearInterval(intervalGelaMais);
			}
		}, 500);
	});

	// Tag 11
	$('#gela-mais .cta').on('click', function () {
		dataLayer.push({
			event: 'generic',
			category: 'lp_bebedouros',
			action: 'eu_quero',
			label: 'gela_mais'
		});
	});

	// Tag 12
	var firstAppearanceAmbientes = true;
	var intervalAmbientes = null;

	$(window).on('scroll', function () {
		setTimeout(function () {
			// Features
			if (
				firstAppearanceAmbientes &&
				$('#ambientes').isOnScreen(1, 0.5)
			) {
				var counter = 0;

				intervalAmbientes = setInterval(function () {
					counter++;
					if (counter >= 12) {
						clearInterval(intervalAmbientes);
						return;
					} else {
						if (
							counter == 1 &&
							$('#ambientes').isOnScreen(1, 0.5)
						) {
							dataLayer.push({
								event: 'generic',
								category: 'lp_bebedouros',
								action:
									'viability_deixa_qualquer_ambiente_mais_bonito',
								label: '1s'
							});
						} else if (
							counter == 4 &&
							$('#ambientes').isOnScreen(1, 0.5)
						) {
							dataLayer.push({
								event: 'generic',
								category: 'lp_bebedouros',
								action:
									'viability_deixa_qualquer_ambiente_mais_bonito',
								label: '4s'
							});
						} else if (
							counter == 10 &&
							$('#ambientes').isOnScreen(1, 0.5)
						) {
							dataLayer.push({
								event: 'generic',
								category: 'lp_bebedouros',
								action:
									'viability_deixa_qualquer_ambiente_mais_bonito',
								label: '10s'
							});
						}
					}
				}, 1000);

				firstAppearanceAmbientes = false;
			}

			if ($('#ambientes')[0].getBoundingClientRect().bottom < 0) {
				clearInterval(intervalAmbientes);
			}
		}, 500);
	});

	// Tag 14
	$('#open--gela-mais').on('click', function () {
		dataLayer.push({
			event: 'generic',
			category: 'lp_bebedouros',
			action: 'eu_quero',
			label: 'gela_mais_em_breve'
		});
	});

	// Tag 16
	$('#launch-gela-mais__form .cta').on('click', function () {
		dataLayer.push({
			event: 'generic',
			category: 'lp_bebedouros',
			action: 'avise_me',
			label: 'gela_mais'
		});
	});

	// Tag 17
	$('.launch-gela--facil .cta').on('click', function () {
		dataLayer.push({
			event: 'generic',
			category: 'lp_bebedouros',
			action: 'comprar',
			label: 'gela_facil'
		});
	});

	// Tag 18 ()
	$('.launch-gela--mais .cta').on('click', function () {
		var opcaoTexto = $(this).text();

		if (opcaoTexto.toLowerCase() == 'comprar') {
			dataLayer.push({
				event: 'generic',
				category: 'lp_bebedouros',
				action: 'comprar',
				label: 'gela_mais'
			});
		}
	});
});
