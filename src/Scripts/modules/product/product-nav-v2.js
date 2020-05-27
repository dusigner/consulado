/* global $: true, Nitro: true */
'use strict';

Nitro.module('product-nav', function() {
	var $window = $(window),
		nav = $('.prod-details-nav'),
		navItems = nav.find('.item a'),
		navStart = $('#BuyButton.buy-button'),
		sections = navItems.map(function() {
			var item = $($(this).attr('href'));
			if (item.length) {
				return item;
			}
		}),
		navHeight = 100;

	var scrollEvent = $.throttle(function() {
		var top = $(document).scrollTop();

		console.log('top', top);

		if (top >= $('.buy-button').offset().top + 45) {
			nav.parent().addClass('fixed-bar');
			nav.addClass('pinned').css('top', 0);
		} else {
			nav.parent().removeClass('fixed-bar');
			nav.removeClass('pinned').css('top', -70);
			navItems.removeClass('active');
		}

		var current = sections.map(function() {
			if ($(this).is(':visible') && $(this).offset().top < top + navHeight) {
				return this;
			}
		});

		navItems.removeClass('active-nav');

		current = current[current.length - 1];

		if (current && current.length > 0) {
			navItems.filter('[href="#' + current.attr('id') + '"]').addClass('active-nav');
		}
	}, 250);

	$(document).on('nav', function(e, nav) {
		navStart = $('#BuyButton.buy-button');
		scrollEvent();
		navItems
			.filter('a[href="#' + nav + '"]')
			.parent()
			.removeClass('hide');
	});

	$(document).scroll(scrollEvent).scroll();

	$('.row.anchors button').on('click', () => {
		$('html, body').animate({ scrollTop: 0 }, 1000);
	});

	$(document).on('click', '.scroll-to', function(e) {
		e.preventDefault();

		navItems.removeClass('active-nav');

		$(this)
			.addClass('active-nav')
			.scrollTo(null, -navHeight + 1);
	});

	$window.load(function() {
		//Ajuste especificacoes tecnicas - modelos compativeis
		$('#especificacoes.specs h4').each(function() {
			if ($(this).text() === 'Modelos Compatíveis') {
				$(this)
					.parent()
					.addClass('change');

				$(this)
					.siblings('p')
					.css({
						display: 'block',
						width: '100%'
					});
			}
		});
	});

	const setInfos = () => {
		const $productImage = $('.prod-galeria ul li img').attr('src').replace(/80-80/gm, '50-50'),
			$productName = $('.productName').text(),
			$productReference = $('.productReference').text();

		$('.product-infos .box-image > img').attr('src', $productImage);
		$('.product-infos .box-infos > p').text($productName);
		$('.product-infos .box-infos > span').text($productReference);
	}
	setInfos();

});
