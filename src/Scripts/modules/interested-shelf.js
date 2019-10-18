Nitro.module('interested-shelf', function() {

	this.prepareShelf = () => {

	};

	this.activateShelf = () => {
		let $allShelves = $('.vitrines-interesses'),
			$shelfButton = $('.discount-item');

		$shelfButton.on('click', function() {
			$shelfButton.removeClass('active');
			$allShelves.addClass('hide');
			$(this).addClass('active');
			$(`.vitrines-interesses[data-value=${$(this).attr('data-value')}]`).removeClass('hide');
		});
	};

	this.init = () => {
		this.prepareShelf();
		this.activateShelf();
	};

	this.init();
});