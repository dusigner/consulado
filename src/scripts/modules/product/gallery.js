require('vendors/mfp');
Nitro.module('gallery', function(){

	'use strict';

	var $thumbs = $('.thumbs a'),
		$gallery = $('<ul class="gallery" />'),
		$galleryThumbs = $('<ul class="galleryThumbs" />'),
		$video = $('#caracteristicas h4.Video + table .value-field');

	var newImages = $.map($thumbs, function(item){
		var self = $(item);
		return '<li><a href="' + $.resizeImage( self.attr('rel'), 1000, 1000 ) + '" class="popup-zoom"><img src="' + $.resizeImage( self.attr('rel'), 420, 420 ) + '" alt="' + self.find('img').attr('title') +'" width="420" height="420" /></a></li>';
	});

	var newThumbs = $.map($thumbs, function(item){
		var self = $(item);
		return '<li><a href="javascript:void(0);" class="thumb"><img src="' + $.resizeImage( self.attr('rel'), 56, 56 ) + '" alt="' + self.find('img').attr('title') +'" width="56" height="56" /></a></li>';
	});

	if( $video.length !== 0 ){

		var videoId = $video.filter('[class*="ID"]').text(),
			thumbnail = $video.filter('[class*="Thumbnail"]').text(),
			thumb = thumbnail ? $.getImagePath( thumbnail ) : 'https://i.ytimg.com/vi/'+ videoId +'/hqdefault.jpg';

		newImages.splice(3, 0, '<li><a href="//www.youtube-nocookie.com/embed/' + videoId + '?rel=0&wmode=transparent&controls=0&showinfo=0&autoplay=1" class="popup-zoom mfp-iframe"><img class="image cover" width="420" height="420" src="' + thumb + '" /></a></li>');
		newThumbs.splice(3, 0, '<li><a href="javascript:void(0);" class="thumb"><img src="' + $.resizeImage( '/arquivos/cns-video-icon.jpg', 56, 56 ) + '" alt="Vídeo" width="56" height="56" /></a></li>');

	}

	newImages = newImages.join('');
	newThumbs = newThumbs.join('');



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


	//ZOOM MAGNIFIC POP UP
	//if($(window).width() > 1024) {
		$('.slick-slide:not(.slick-cloned) .popup-zoom').magnificPopup({
			type: 'image',
			closeOnContentClick: true,
			//disableOn: 1024,
			mainClass: 'mfp-no-margins mfp-with-zoom',
			image: {
				verticalFit: true
			},
			iframe: {
				markup: '<div class="mfp-iframe-scaler" style="width:100%; height:100%">'+
				            '<div class="mfp-close"></div>'+
				            '<iframe class="mfp-iframe" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen width="100%" height="100%"></iframe>'+
				          '</div>'
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

		/*$('.slick-slide.video:not(.slick-cloned) .popup-zoom').magnificPopup({
			items: [
				{
					src: 'http://vimeo.com/123123',
					type: 'iframe'
				}
			]
		});*/
	/*}else{
		$('.popup-zoom').click(function(e) {
			e.preventDefault();
		});
	}*/

});