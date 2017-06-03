module.exports = function ($selector) {
	$selector.not('.highlight-voltage--active').each(function () {
		var $self = $(this),
			selfText = $self.text(),
			match = new RegExp('(110V|220V|BIVOLT)', 'g');

		if ( match.test(selfText) ) {
			var wrapText = selfText.split(match),
				finalHTML = wrapText[0] + '<strong class="highlight-voltage">' + wrapText[1] + '</strong>';

			$self.addClass('highlight-voltage--active').html(finalHTML);
		}
	});
};