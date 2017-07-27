'use strict';

(function($) {
	$.fn.whpModal = function(options) {
		var settings = $.extend({
				onOpen: function() {},
				onClose: function() {},
				outerNav: false,
				autoClose: false,
				autoCloseTime: 5,
				content: null,
				title: null,
				aditionalClass: ''
			}, options),
			template = function(title, content, $context) {
				return '<div class="text-center modal-whp__body '+ settings.aditionalClass +'">' +
							'<span class="modal-whp__close js-modal-whp-close"><a href="javascript:void(0);">X</a></span>' +
							(title ? '<h3 class="modal-whp__title">'+ title +'</h3>' : '') +
							(content ? '<div class="modal-whp__content">' + ((typeof content === 'function') ? content.apply($context) : content) + '</div>' : '') +
						'</div>';
			},
			_close = function() {
				$('.modal-whp__mask')
				.removeClass('modal-whp__mask--loaded')
				.removeClass('modal-whp__mask--enter')
				.delay(500)
				.queue(function(next) {
					$(this).remove();
					settings.onClose();
					next();
				});
			},
			_outerNav = function(direction, $context) {
				if(!settings.outerNav) {
					return;
				}

				var toRender = (direction === 'prev') ? $context.prev() : $context.next();
			}

		this.click(function(e) {
			e.preventDefault();

			var dataModal = $(this).data('modal'),
				objContent,
				objTitle;

			if(settings.content === null) {
				objContent = dataModal
							? '<div>' + dataModal.content + '</div>'
							: $($(this).attr('href')).html();
			} else {
				objContent = settings.content;
			}

			if(settings.title === null) {
				objTitle = dataModal.title;
			} else {
				objTitle = settings.title;
			}

			if(!settings.content) {
				$.error('WhpModal Error: No content!');
				return;
			}

			$('body').append('<div class="modal-whp__mask"></div>');

			$('.modal-whp__mask').html(template(objTitle, objContent, $(this)))
						.delay(10)
						.queue(function(next) {
							$(this).addClass('modal-whp__mask--enter');
							next();
						})
						.delay(500)
						.queue(function(next) {
							$(this).addClass('modal-whp__mask--loaded');
							settings.onOpen();
							next();
						});

			$('.js-modal-whp-close').click(function(e) {
				e.preventDefault();
				_close();
			});

			if(settings.autoClose) {
				setTimeout(function() {
					if($('.modal-whp__mask').length > 0) {
						_close();
					}
				}, 1000 * settings.autoCloseTime);
			}

			$(document).keyup(function(e) {
				if (e.keyCode == 27) {
					_close();
				}
			});

		});
	};
}(jQuery));