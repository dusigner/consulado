'use strict';

require('vendors/slick');
require('vendors/vtex-modal');

var styleModal = function(){
	//Modal video
	$('#btn-modal-video').on('click', function () {
		$('#modal-video').vtexModal();
		$('#vtex-modal-video iframe').attr('src', 'https://www.youtube.com/embed/fb-87TkTkfk?rel=0&amp;showinfo=0');
	});
	$(window).on('closeVtexModal', function() {
		$('#vtex-modal-video iframe').removeAttr('src');
	});
	
	$('#btn-modal-html').on('click', function () {
		$('#modal-html').vtexModal();
	});

};

$(document).ready(function(){
	//menu mobile
	$('.wy-nav-top').on('click', function(){
		$('.wy-nav-side').toggleClass('shift');
		$('.wy-nav-content-wrap').toggleClass('shift');
	});
	styleModal();

});