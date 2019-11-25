'use strict';

require('vendors/mfp');

Nitro.module('galleryv2', function() {

	this.init = () => {
		var $thumbs = $('.thumbs a'),
			$gallery = $('<ul class="gallery" />'),
			$galleryThumbs = $('<ul class="galleryThumbs" />'),
			$video = $('#caracteristicas h4.Video + table .value-field'),
			//$video = $(''),
			$size = ($(window).width() < 768) ? 76 : 75;

		var newImages = $.map($thumbs, function(item) {
			var self = $(item);
			return (`
				<li>
					<a href="${$.resizeImage(self.attr('rel'), 1000, 1000)}" class="popup-zoom">
						<img
							src="${$.resizeImage(self.attr('rel'), 420, 420)}"
							alt="${self.find('img').attr('title')}"
							width="420"
							height="420"
						 />
					</a>
				</li>
			`);
		});

		var newThumbs = $.map($thumbs, function(item) {
			var self = $(item);
			return (`
				<li>
					<a href="javascript:void(0);" class="thumb">
						<img
							src="${$.resizeImage(self.attr('rel'), 76, 76)}"
							alt="${self.find('img').attr('title')}"
							width="76"
							height="76"
						 />
					</a>
				</li>
			`);
		});

		if ($video.length !== 0) {
			var videoId = $video.filter('[class*="ID"]').text(),
				thumbnail = $video.filter('[class*="Thumbnail"]').text(),
				thumb = thumbnail ? $.getImagePath(thumbnail) : 'https://i.ytimg.com/vi/' + videoId + '/hqdefault.jpg';

			newImages.splice(
				0,
				0,
				`<li>
					<a href="//www.youtube-nocookie.com/embed/${videoId}?rel=0&wmode=transparent&controls=0&showinfo=0&autoplay=1" class="popup-zoom mfp-iframe">
						<img class="image cover" width="420" height="420" src="${thumb}" />
					</a>
				</li>`
			);

			newThumbs.splice(
				0,
				0,
				`
					<li>
						<a href="javascript:void(0);" class="thumb">
							<img src="${$.resizeImage('/arquivos/cns-video-icon.jpg', 76, 76)}" alt="Vídeo" width="76" height="76" />
						</a>
					</li>
				`
			);
		}

		let index = 0;
		let thumbTeste = [];

		newThumbs.forEach(element => {

			if(index < 9) {

				thumbTeste.push(element);
				index++;
			}
		});

		if(index >= 9) {
			thumbTeste.push(`
				<li>
					<a href="javascript:void(0);" class="thumb">
						Ver Mais + ` + (newThumbs.length - index) + `
					</a>
				</li>
				`);
		}

		newImages = newImages.join('');
		//newThumbs = newThumbs.join('');
		thumbTeste = thumbTeste.join('');

		$('.apresentacao').replaceWith($gallery.append($(newImages)));
		$gallery.after($galleryThumbs.append($(thumbTeste)));

		$gallery.slick({
			slidesToShow: 1,
			arrows: false,
			asNavFor: '.galleryThumbs',
			dots: true,
			draggable: false,
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
			slidesToShow: 5,
			slidesToScroll: 1,
			draggable: true,
			asNavFor: '.gallery',
			arrows: false,
			focusOnSelect: true,
			vertical: true,
			infinite: false,
			responsive: [
				{
					breakpoint: 992,
					settings: {
						slidesToShow: 3
					}
				}
			]
		});

		//$galleryThumbs.slick('slickAdd', '<li><a style="height:76px">Ver mais +</a></li>', 9, true);


		$(window).load(function() {
			if ($gallery.width() === 0) {
				$gallery.slick('refresh');
			}
		});

		if ($(thumbTeste).length <= 5) {
			$gallery.on('beforeChange', function(event, slick, currentSlide, nextSlide) {
				// console.log(nextSlide, $galleryThumbs.find('.slick-slide'));
				$galleryThumbs.find('.slick-slide').removeClass('slick-current');
				$galleryThumbs.find('.slick-slide' + '[data-slick-index=' + nextSlide + ']').addClass('slick-current');
			});
		}

		//ZOOM MAGNIFIC POP UP
		//if($(window).width() > 1024) {
		$('.popup-zoom').magnificPopup({
			type: 'image',
			closeOnContentClick: true,
			//disableOn: 1024,
			mainClass: 'mfp-no-margins mfp-with-zoom',
			image: {
				verticalFit: true
			},
			iframe: {
				markup:
					'<div class="mfp-iframe-scaler" style="width:100%; height:100%">' +
					'<div class="mfp-close"></div>' +
					'<iframe class="mfp-iframe" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen width="100%" height="100%"></iframe>' +
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
				},
				close: function() {
					$gallery.slick('refresh');
				}
			}
		});
		if ($(window).width() > 1024) {
			$('.popup-zoom', '.slick-slide ')
				.not('.mfp-iframe')
				.on('hover', function() {
					var url = $(this).attr('href'); //pega o link da imagem maior do lightbox
					$(this)
						.children('img')
						.not('.mfp-iframe')
						.attr('src', url); // troca a imagem para imagem maior e não perder qualidade no zoom
					$(this)
						.children('img')
						.not('.mfp-iframe')
						.css({ transform: 'scale(2)' });
					$('.prod-selos').css({ 'z-index': '00000000', opacity: '0' });
				});

			$('.popup-zoom').on('mouseout', function() {
				$(this)
					.children('img')
					.css({ transform: 'scale(1)', 'z-index': '0', transition: 'transform 0.2s' });
				$('.prod-selos').css({ 'z-index': '3', opacity: '1' });
			});

			$('.popup-zoom')
				.not('.mfp-iframe')
				.on('mousemove', function(e) {
					//$(this).css('width', '1000px !important');
					$(this)
						.children('img')
						.css({
							'transform-origin':
								((e.pageX - $(this).offset().left) / $(this).width()) * 100 +
								'% ' +
								((e.pageY - $(this).offset().top) / $(this).height()) * 100 +
								'%'
						});
				});
		}

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



		$(window).resize(function() {
			const widthPage = $(window).width();

			if (widthPage < 960) {
				$('.thumb img').attr('height', '56px').attr('width', '56px');
			} else {
				$('.thumb img').attr('height', '75px').attr('width', '75px');
			}
		});
	};
});
