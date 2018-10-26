'use strict';

Nitro.module('accordion', function () {
	const question = $('.wrapper__question');

	question.click(function() {
		const questionElem = $(this).parent();

		if (questionElem.hasClass('is-active')) {
			questionElem.removeClass('is-active');
		} else {
			question.parent().removeClass('is-active');
			questionElem.addClass('is-active');
		}
	});
});