/* global $: true, Nitro: true */

Nitro.module('gallery', function(){

	'use strict';
	
	var $thumbs = $('.thumbs a'),
		$gallery = $('<ul />');
	
	var newThumbs = $.map($thumbs, function(item){
		var self = $(item);
		return '<li><img src="' + $.resizeImage( self.attr('rel'), 580, 580 ) + '" alt="' + self.find('img').attr('title') +'" width="580" height="580" />';
	}).join('');
	
	//console.log('$newThumbs', $newThumbs);
	
	$('.apresentacao').replaceWith( $gallery.append( $(newThumbs) )  );
	
	$gallery.slick({
		infinite: true,
		arrows: false,
		dots: true,
		slidesToShow: 1
	});
	
	
});