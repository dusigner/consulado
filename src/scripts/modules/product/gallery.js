require('vendors/mfp');

Nitro.module('gallery', function(){

	'use strict';

	var $thumbs = $('.thumbs a'),
		$gallery = $('<ul class="gallery" />'),
		$galleryThumbs = $('<ul class="galleryThumbs" />'),
		$video = $('#video');

	var newImages = $.map($thumbs, function(item){
		var self = $(item);
		return '<li><a href="' + $.resizeImage( self.attr('rel'), 1000, 1000 ) + '" class="popup-zoom"><img src="' + $.resizeImage( self.attr('rel'), 420, 420 ) + '" alt="' + self.find('img').attr('title') +'" width="420" height="420" /></a></li>';
	}).join('');

	var newThumbs = $.map($thumbs, function(item){
		var self = $(item);
		return '<li><a href="#" class="thumb"><img src="' + $.resizeImage( self.attr('rel'), 56, 56 ) + '" alt="' + self.find('img').attr('title') +'" width="56" height="56" /></a></li>';
	}).join('');

	if( !$video.is(':empty') ){
		newImages += '<li class="anchor" ><a href="#video" ><img src="' + $.resizeImage( '/arquivos/cc-video-icon.jpg', 56, 56 ) + '" alt="Vídeo" width="56" height="56" /></a></li>';
		newThumbs += '<li><a href="#video" class="thumb anchor"><img src="' + $.resizeImage( '/arquivos/cc-video-icon.jpg', 56, 56 ) + '" alt="Vídeo" width="56" height="56" /></a></li>';
	}


	$('.apresentacao').replaceWith( $gallery.append( $(newImages) ));
	$gallery.after($galleryThumbs.append( $(newThumbs) ));

	$gallery.slick({
		slidesToShow: 1,
		arrows: false,
		asNavFor: '.galleryThumbs',
		draggable: false,
		lazyLoad: 'ondemand',
		responsive: [
			{
				breakpoint: 992,
				settings: {
					draggable: true,
					arrows: true
				}
			}
		]
	});


	$galleryThumbs.slick({
		slidesToShow: 4,
		draggable: true,
		asNavFor: '.gallery',
		focusOnSelect: true,
		vertical: true,
		responsive: [
			{
				breakpoint: 992,
				settings: {
					arrows: false,
					vertical: false
				}
			}
		]
	});

	$(window).load(function(){
		if($gallery.width() === 0){
			$gallery.slick('refresh');
		}
	});


	if($(newThumbs).length <= 4){
		$gallery.on('beforeChange', function(event, slick, currentSlide, nextSlide){
			console.log(nextSlide, $galleryThumbs.find('.slick-slide'));
			$galleryThumbs.find('.slick-slide').removeClass('slick-current');
			$galleryThumbs.find('.slick-slide' + '[data-slick-index='+ nextSlide +']').addClass('slick-current');
		});
	}

	$('.thumb.anchor, .slick-slide.anchor a').click(function(e){
		e.preventDefault();

		var anchor = $(this).attr('href');

		$('html, body').animate({
			scrollTop: $(anchor).offset().top - 51
		}, 700);
	});

	// ZOOM MAGNIFIC POP UP
	if($(window).width() > 1024) {
		$('.slick-slide:not(.slick-cloned) .popup-zoom').magnificPopup({
			type: 'image',
			closeOnContentClick: true,
			disableOn: 1024,
			mainClass: 'mfp-no-margins mfp-with-zoom',
			image: {
				verticalFit: true
			},
			gallery: {
				enabled: true,
				navigateByImgClick: false
			},
			zoom: {
				enabled: true,
				duration: 500,
				easing: 'ease-in-out'
			},
			callbacks: {
				change: function() {
					$gallery.slick('slickGoTo', this.currItem.index);
				}
			}
		});
	}else{
		$('.popup-zoom').click(function(e) {
			e.preventDefault();
		});
	}

});