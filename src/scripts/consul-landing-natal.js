require('vendors/slick');
require('vendors/vtex-modal');

Nitro.controller('landing-natal', [], function() {

	'use strict';

	$(document).ready(function(){
		$('#select-categorias ul li').click(function(e) {
			e.preventDefault();

			var category = $(this).find('span').attr('data-category');
			$('.active').removeClass('active');
			$(this).addClass('active');
			$('#produtos .container').children().fadeOut(250);
			$('.' + category).fadeIn(250);
			$('.' + category).addClass('active');
		});

	});

});