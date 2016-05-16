
'use strict';

$('.box-gae-arrow').on('click', function() {
	var anchor = $(this).data('anchor');
	$('html, body').animate({
	   scrollTop: $('#'+anchor).offset().top
	}, 'slow');
});