/**
 *
 * @fileOverview
 *
 */
'use strict';

Nitro.setup([], function() {

	this.init = () => {
		this.setListeners();
	};

	this.setListeners = () => {

		/* Button to toggle banner item modal */
		$('.-js-toggle-active-item').on('click', function() {
			handleActiveItem(this);
		});

		var handleActiveItem = (toggleActiveEl) => {
			const	$activeButton 	=	$(toggleActiveEl);
			const 	$itemModal		= 	$activeButton.parent();
			const	$itemSlide		=	$activeButton.parent().parent();

			$activeButton.hasClass('-is-active') ? $activeButton.removeClass('-is-active') : $activeButton.addClass('-is-active');
			$itemModal.hasClass('-is-active') ? $itemModal.removeClass('-is-active') : $itemModal.addClass('-is-active');
			$itemSlide.hasClass('-is-active') ? $itemSlide.removeClass('-is-active') : $itemSlide.addClass('-is-active');
		};
	};

	this.init();
});
