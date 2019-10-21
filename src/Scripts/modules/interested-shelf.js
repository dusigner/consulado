Nitro.module('interested-shelf', function() {
	const $allShelves = $('.vitrines-interesses'),
		$shelfButton = $('.discount-item');

	this.prepareShelf = () => {
		$(`.vitrines-interesses:not([data-value=${$('.discount-item.active').attr('data-value')}])`).addClass('not-show');
	};

	this.activateShelf = () => {
		$shelfButton.on('click', function() {
			$shelfButton.removeClass('active');
			$allShelves.addClass('not-show');
			$(this).addClass('active');
			$(`.vitrines-interesses[data-value=${$(this).attr('data-value')}]`).removeClass('not-show');
		});
	};

	this.init = () => {
		this.activateShelf();
		this.prepareShelf();
	};

	this.init();
});