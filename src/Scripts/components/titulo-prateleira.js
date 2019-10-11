'use strict';

(function(){
	const $shelfElTitle = $('.vitrines h2');
	let shelfTitle = '';

	const titleShelf = {};

	titleShelf.init = () => {

		$.each($shelfElTitle, (idx, item) => {
			const self = $(item);
			shelfTitle = titleShelf.getTitleText(self);
			shelfTitle = titleShelf.splitWords(shelfTitle);
			shelfTitle = titleShelf.changeWords(shelfTitle);
			shelfTitle = titleShelf.joinWords(shelfTitle);

			titleShelf.updateTitleShelf(self, shelfTitle);
		});
	};

	titleShelf.getTitleText = ($el) => $el.text();

	titleShelf.splitWords = (text) => text.match(/[A-Za-záàâãéèêíïóôõöúçñü]+\b/gmi);

	titleShelf.changeWords = (arrWords, arrLength = (arrWords.length / 2)) => {
		return arrWords.map((word, idx) => {
			if (idx >= Math.ceil(arrLength)) {
				return `<span>${word}</span>`;
			}

			return word;
		});
	};

	titleShelf.joinWords = (arrWords) => arrWords.join(' ');

	titleShelf.updateTitleShelf = ($el, text) => {
		$el.addClass('shelf-pre-title');
		$el.html(`${text}`);
	};

	titleShelf.init();
})();