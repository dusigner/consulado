/* global VERSION: true, Nitro: true */

'use strict';

require('modules/helpers');

require('vendors/slick');

if (VERSION) {

    console.info('%c %c %c Jussi | %s Build Version: %s %c %c ', 'background:#dfdab0;padding:2px 0;', 'background:#666; padding:2px 0;', 'background:#222; color:#bada55;padding:2px 0;', (window.jsnomeLoja || '').replace(/\d/, '').capitalize(), VERSION, 'background:#666;padding:2px 0;', 'background:#dfdab0;padding:2px 0;');

    window._trackJs = window._trackJs || {};

    window._trackJs.version = VERSION;
}

//load Nitro Lib
require('vendors/nitro');

Nitro.setup([], function() {

    $('#info .row>div').slick({
        infinite: true,
        slidesToShow: 2,
        slidesToScroll: 1
    });


});
