/* global $: true, Nitro: true */
'use strict';

Nitro.module('product-nav', function() {
	var $window = $(window),
		$afterProd = $('.after-prod'),
		nav = $('.prod-details-nav'),
		navItems = nav.find('.item a'),
		navStart = $afterProd.find('section:visible:first'),
		sections = navItems.map(function() {
			var item = $($(this).attr('href'));
			if (item.length) {
				return item;
			}
		}),
		navHeight = nav.outerHeight();

	var scrollEvent = $.throttle(function() {
		var top = $window.scrollTop();

		if (top >= navStart.offset().top) {
			nav.addClass('pinned').css('top', 0);
		} else {
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
		navStart = $afterProd.find('section:visible:first');
		scrollEvent();
		navItems
			.filter('a[href="#' + nav + '"]')
			.parent()
			.removeClass('hide');
	});

	$window.scroll(scrollEvent).scroll();

	$(document).on('click', '.scroll-to', function(e) {
		e.preventDefault();

		navItems.removeClass('active-nav');

		$(this)
			.addClass('active-nav')
			.scrollTo(null, -navHeight + 1);
	});

	$window.load(function() {
		//Ajuste especificacoes tecnicas - modelos compativeis
		$('#especificacoes .specs h4').each(function() {
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
		const $productImage = $('.prod-galeria ul li img').attr('src').replace(/55-55/gm, '80-80'),
			$productName = $('.productName').text(),
			$productReference = $('.productReference').text();

		$('.product-infos .box-image > img').attr('src', $productImage);
		$('.product-infos .box-infos > p').text($productName);
		$('.product-infos .box-infos > span').text($productReference);
	}
	setInfos();

});
