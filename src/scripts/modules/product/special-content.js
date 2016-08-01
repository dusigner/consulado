/* global $: true, Nitro: true, dust:true */

require('../../../templates/special-content.html');

Nitro.module('special-content', function() {

    'use strict';

    var $content = $('td.Conteudo-Especial').text();


    if ($content) {
        var content = $content.split(',');
        console.log('tem', content);
        /*$('<section id="conteudo-especial"><iframe src="'+content[0]+'"/></section>').insertBefore('#especificacoes');

        var $iframe = $('#conteudo-especial iframe');*/

        content = {
            specialContent: {
                url: content[0],
                maxWidth: content[1],
                height: content[2]
            }
        };

        /*$iframe.css({
            'width': '100%',
        	'max-width': $content[1],
        	'height': $content[2]
        });*/

        dust.render('special-content', content, function(err, out) {
            if (err) {
                throw new Error('Special Content Dust error: ' + err);
            }

            $(out).insertBefore('#especificacoes');

        });

    }
});
