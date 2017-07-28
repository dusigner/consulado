'use strict';

(function($) {
	$.fn.whpModal = function(options) {
		var $this = this,
			settings = $.extend({
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
							(settings.outerNav ? '<span class="modal-whp__nav js-modal-whp-nav" data-direction="prev"><a href="javascript:void(0);">&nbsp;</a></span>' : '') +
							(settings.outerNav ? '<span class="modal-whp__nav js-modal-whp-nav" data-direction="next"><a href="javascript:void(0);">&nbsp;</a></span>' : '') +
							(title ? '<h3 class="modal-whp__title">'+ title +'</h3>' : '') +
							(content ? '<div class="modal-whp__content">' + ((typeof content === 'function') ? content.apply($context) : content) + '</div>' : '') +
						'</div>';
			},
			_close = function() {
				$this.removeClass('js-release-bullet--active');

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
			_outerNav = function(direction) {
				if(!settings.outerNav) {
					return;
				}

				var $current = $('.js-release-bullet--active'),
					$toRender = (direction === 'prev')
								? ($current.prev('.js-release-bullet').length > 0) ? $current.prev('.js-release-bullet') : $('.js-release-bullet').last()
								: ($current.next('.js-release-bullet').length > 0) ? $current.next('.js-release-bullet') : $('.js-release-bullet').first(),
					content;

				if(settings.content) {
					if ((typeof settings.content === 'function')) {
						content = settings.content.apply($toRender);
					}
				} else {
					content = ($toRender.data('modal')) ? '<div>' + $toRender.data('modal').content + '</div>' :$($toRender.data('modal').attr('href')).html();
				}

				if(!content) {
					$.error('WhpModal Error: No content!');
					return;
				}


				$('.modal-whp__content').addClass('modal-whp__content--' + direction + 'Out')
										.delay(500)
										.queue(function(next) {
											$(this).html(content)
													.addClass('modal-whp__content--' + direction + 'In');
											next();
										})
										.delay(500)
										.queue(function(next) {
											$(this).removeClass('modal-whp__content--' + direction + 'In modal-whp__content--' + direction + 'Out');
											next();
										});
				$current.removeClass('js-release-bullet--active');
				$toRender.addClass('js-release-bullet--active');
			};

		this.click(function(e) {
			e.preventDefault();

			var $self = $(this),
				dataModal = $self.data('modal'),
				objContent,
				objTitle;

			if(settings.content === null) {
				objContent = (dataModal && dataModal.content)
							? '<div>' + dataModal.content + '</div>'
							: $($self.attr('href')).html();
			} else {
				objContent = settings.content;
			}

			if(settings.title === null) {
				objTitle = dataModal.title;
			} else {
				objTitle = settings.title;
			}

			if(!objContent) {
				$.error('WhpModal Error: No content!');
				return;
			}

			if(settings.outerNav) {
				$self.addClass('js-release-bullet--active');
			}

			$('body').append('<div class="modal-whp__mask"></div>');

			$('.modal-whp__mask').html(template(objTitle, objContent, $self))
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

			$('.js-modal-whp-nav').click(function(e) {
				e.preventDefault();
				_outerNav($(this).data('direction'));
			});


			if(settings.autoClose) {
				setTimeout(function() {
					if($('.modal-whp__mask').length > 0) {
						_close();
					}
				}, 1000 * settings.autoCloseTime);
			}

			$(document).off().on('keyup', function(e) {
				console.log('⌨️⌨️', e.keyCode);
				if (e.keyCode === 27) {
					_close();
				}

				if (e.keyCode === 37) {
					_outerNav('prev');
				}

				if (e.keyCode === 39) {
					_outerNav('next');
				}
			});

		});
	};
}(jQuery));