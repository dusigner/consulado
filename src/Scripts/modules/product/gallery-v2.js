'use strict';

require('vendors/mfp');

Nitro.module('galleryv2', function() {

	this.init = () => {
		var $thumbs = $('.thumbs a'),
			$gallery = $('<ul class="gallery" />'),
			$galleryThumbs = $('<ul class="galleryThumbs" />'),
			$video = $('#caracteristicas h4.Video + table .value-field');
			// $size = ($(window).width() < 768) ? 76 : 75;

		var newImages = $.map($thumbs, function(item) {
			var self = $(item);
			return (`
				<li>
					<a href="${$.resizeImage(self.attr('rel'), 1000, 1000)}" class="popup-zoom">
						<img
							src="${$.resizeImage(self.attr('rel'), 620, 620)}"
							alt="${self.find('img').attr('title')}"
							width="520"
							height="520"
						 />
					</a>
				</li>
			`);
		});

		var newThumbs = $.map($thumbs, function(item) {
			var self = $(item);
			return (`
				<li>
					<a href="javascript:void(0);" class="thumb thumb-index">
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


		$.map($video, function(item) {

			var videoId = $(item).filter('[class*="ID"]').text();

			newImages.splice(
				0,
				0,
				`
					<li>
						<a href="//www.youtube-nocookie.com/embed/${videoId}?rel=0&wmode=transparent&controls=0&showinfo=0&autoplay=1" class="popup-zoom">
							<img
								src="${$.resizeImage('/arquivos/cns-icon-video-pdp.jpg', 520, 520)}"
								width="520"
								height="520"
							 />
						</a>
					</li>
				`
			);

			newThumbs.splice(
				0,
				0,
				`
					<li>
						<a href="//www.youtube-nocookie.com/embed/${videoId}?rel=0&wmode=transparent&controls=0&showinfo=0&autoplay=1" class="thumb thumb-video">
							<img src="${$.resizeImage('/arquivos/cns-icon-video-pdp.jpg', 76, 76)}" alt="Vídeo" width="76" height="76" />
						</a>
					</li>
				`
			);

		});

		let index = 0;
		let thumbTodas = [];

		newThumbs.forEach(element => {

			if(index < 10) {

				thumbTodas.push(element);
				index++;
			}
		});

		newImages = newImages.join('');
		thumbTodas = thumbTodas.join('');


		$('.apresentacao').replaceWith($gallery.append($(newImages)));
		$gallery.after($galleryThumbs.append($(thumbTodas)));

		//adicionando paginação depois na galeria do mobile
		if($(window).width() < 768) {
			var $slickElement = $('.prod-galeria');
			var $status = $( '<strong/>' ).addClass( 'pagingInfo' ).appendTo($slickElement);

			$slickElement.on('init reInit afterChange', function (event, slick, currentSlide, nextSlide) {
				var i = (currentSlide ? currentSlide : 0) + 1;
				$status.html(`<span>${i}</span> / ${slick.slideCount}`);
			});
		}
		if ($video.length !== 0) {
			var $miniVideo = $( '<a/>' ).addClass( 'thumb-video' ).attr('href', `//www.youtube-nocookie.com/embed/${$video.text()}?rel=0&wmode=transparent&controls=0&showinfo=0&autoplay=1`).appendTo($slickElement);
			$miniVideo.html('<span>vídeo</span>').addClass( 'miniVideo' );
		}
		//galeria imagem grande
		$gallery.slick({
			slidesToShow: 1,
			arrows: false,
			//focusOnSelect: true,
			asNavFor: '.galleryThumbs',
			infinite: false,
			// dots: true,
			draggable: false,
			responsive: [
				{
					breakpoint: 768,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1,
						draggable: false,
						arrows: true,
						asNavFor: false,
						dots: true,
					}
				}
			]
		});

		//galeria dos thumbs a partir de tablet
		if($(window).width() > 767) {
			$galleryThumbs.slick({
				slidesToShow: 10,
				// slidesToScroll: 1,
				//draggable: true,
				asNavFor: '.gallery',
				arrows: false,
				focusOnSelect: true,
				vertical: true,
				draggable: false,
				infinite: false
			});
		}

		//remove os vídeos da galeria principal
		for(var i = 0; i < $video.length; i++) {
			$gallery.slick('slickRemove', i);
		}

		$galleryThumbs.find('.slick-slide').removeClass('slick-current');
		$galleryThumbs.find('.slick-slide' + '[data-slick-index=' + $video.length + ']').addClass('slick-current');

		//problema de sicronização de thumb e galeria sem os vídeos
		$('.galleryThumbs .thumb').on('click', function(e) {
			e.preventDefault();
			$gallery.slick('slickGoTo', ($(this).index('a.thumb-index')));
		});

		//conta quantos slides tem e adiciona o ver mais
		if(newThumbs.length > 10) {
			const lastSlide = $('.thumb').last();

			lastSlide.parent().html(`<li >
		 		<a class="thumb-ver-mais" onclick="$('.popup-zoom').magnificPopup('open', 9);">
		 			+ ${newThumbs.length - index}
				</a>
			</li>`).unbind();
		}

		$(window).load(function() {
			if ($gallery.width() === 0) {
				$gallery.slick('refresh');
			}
		});

		if ($(thumbTodas).length <= 5) {
			$gallery.on('beforeChange', function(event, slick, currentSlide, nextSlide) {
				// console.log(nextSlide, $galleryThumbs.find('.slick-slide'));
				$galleryThumbs.find('.slick-slide').removeClass('slick-current');
				$galleryThumbs.find('.slick-slide' + '[data-slick-index=' + nextSlide + ']').addClass('slick-current');
			});
		}

		$('.thumb-video').magnificPopup({
			type: 'iframe',
			iframe: {
				markup:
					'<div class="mfp-iframe-scaler" style="width:100%; height:100%">' +
					'<div class="mfp-close"></div>' +
					'<iframe class="mfp-iframe" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen width="100%" height="100%"></iframe>' +
					'</div>'
			},
			gallery: {
				enabled: false,
				navigateByImgClick: false
			},
			callbacks: {
				close: function() {
					$galleryThumbs.find('.slick-slide').removeClass('slick-current');
					$galleryThumbs.find('.slick-slide' + '[data-slick-index=' + $video.length + ']').addClass('slick-current');
					$gallery.slick('slickGoTo', 0);
				}
			}
		});


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
					$galleryThumbs.find('.slick-slide').removeClass('slick-current');
					$galleryThumbs.find('.slick-slide' + '[data-slick-index=' + (this.currItem.index + $video.length) + ']').addClass('slick-current');
					$gallery.slick('slickGoTo', this.currItem.index);
				},
				close: function() {
					$gallery.slick('refresh');
				}
			}
		});

		if ($(window).width() > 1024) {
			$('.popup-zoom')
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
	};
});
