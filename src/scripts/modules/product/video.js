/* global $: true, Nitro: true, dust: true */

require('../../../templates/video.html');

Nitro.module('video', function() {

    'use strict';

    var self = this,
        $holder = $('#video'),
        $video = $('#caracteristicas h4.Video + table .value-field');

    if ($video.length === 0) return;

    var thumbnail = $video.filter('[class*="Thumbnail"]').text();

    var data = {
        id: $video.filter('[class*="ID"]').text(),
        thumb: thumbnail ? $.getImagePath(thumbnail) : false
    };

    console.log('video data', data);

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

            $(document).trigger('nav', 'video');
        });

    };

    this.render();

});
