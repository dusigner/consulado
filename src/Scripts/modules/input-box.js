'use strict';

Nitro.module('input-box', function () {

	// Click on toggle select
	$(window).click(function () {
		const $inputSelect = $('.input-box.select.active');
		$inputSelect.find('.input-box-dropdown-options').slideUp(400, function () { $inputSelect.removeClass('active -active'); });
	});
	$(document).on('click', '.js-input-box-select', function (e) {
		e.stopPropagation();
		const $this = $(this);
		$('.input-box.select').not($this).find('.input-box-dropdown-options').stop().slideUp(400, function () { $('.input-box.select').not($this).removeClass('active -active'); });
		$this.toggleClass('-active');
		if ($this.hasClass('-active')) {
			$this.addClass('active').find('.input-box-dropdown-options').stop().slideDown();
		}
		else {
			$this.find('.input-box-dropdown-options').stop().slideUp(400, function () { $this.removeClass('active -active'); });
		}
	});

	// Click select option
	$(document).on('click', '.input-box-dropdown-options > li', function () {
		const $this = $(this);
		let value = $this.text();

		$this.parents('.input-box-dropdown').find('.input-box-dropdown-toggle').html(value);
		$this.trigger('input-box.dropdown', [value]);
	});
});
