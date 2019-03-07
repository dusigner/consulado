/* global $: true, Nitro: true, dust: true */

'use strict';

require('Dust/video.html');

Nitro.module('video', function() {

	//NEW RELEASE VIDEO MODULE
	var self = this,
		$holder = $('#video'),
		$video = $('#caracteristicas h4.Video-Lancamento + table .value-field'),
		thumbnail = $video.filter('[class*="Thumbnail"]').text(),
		data;

	if ($video.length > 0) {
		data = {
			id: $video.filter('[class*="ID"]').text(),
			title: $video.filter('[class*="Titulo"]').text(),
			thumb: thumbnail ? $.getImagePath(thumbnail) : false
		};

		this.click = function(e) {
			e.preventDefault();

			data.iframe = true;

			self.render();

			return false;
		};

		this.render = function() {

			dust.render('video', data, function(err, out) {
				if (err) {
					throw new Error('Specifications Dust error: ' + err);
				}

				$holder.html(out).show();

				$holder.find('a').click(self.click);
			});

		};

		this.render();
		$(document).trigger('nav', 'video');
	}

});
