'use strict';

(function($) {
	$.fn.whpModal = function(options) {
		var dataModal = this.data('modal'),
			objTitle = dataModal ? dataModal.title : null,
			objContent = dataModal ? '<img src="' + dataModal.image + '" alt="' + dataModal.title + '" title="' + dataModal.title + '" /><p class="modal-whp__text">' + dataModal.text + '</p>' : null,
			settings = $.extend({
				onOpen: function() {},
				onClose: function() {},
				autoClose: {
					active: false,
					time: 0
				},
				content: objContent,
				title: objTitle
			}, options),
			template = '<div class="text-center modal-whp__body">' +
					'<span class="modal-whp__close js-modal-whp-close"><a href="javascript:void(0);">X</a></span>' +
					(settings.title ? '<h3 class="modal-whp__title">'+ settings.title +'</h3>' : '') +
					(settings.content ? '<div class="modal-whp__content">' + settings.content + '</div>' : '') +
				'</div>',
			_close = function() {
				$('.modal-whp__mask')
				.removeClass('modal-whp__mask--loaded')
				.removeClass('modal-whp__mask--enter')
				.delay(500)
				.queue(function(next) {
					$(this).remove();
					next();
				});

				settings.onClose();
			};

		this.click(function(e) {
			e.preventDefault();

			$('body').append('<div class="modal-whp__mask"></div>');

			$('.modal-whp__mask').html(template)
						.delay(10)
						.queue(function(next) {
							$(this).addClass('modal-whp__mask--enter');
							next();
						})
						.delay(500)
						.queue(function(next) {
							$(this).addClass('modal-whp__mask--loaded');
							next();
						});

			$('.js-modal-whp-close').click(function(e) {
				e.preventDefault();
				_close();
			});

			if(settings.autoClose.active) {
				setTimeout(function() {
					if($('.modal-whp__mask').length > 0) {
						_close();
					}
				}, 1000 * settings.autoClose.time);
			}
		});
	};
}(jQuery));