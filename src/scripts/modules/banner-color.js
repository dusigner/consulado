/* global $:true, MasterColor: true */

require('vendors/master-color');

module.exports = function(banner) {

    'use strict';

    if ($(window).width() < 1200) return;

    banner.find('img').each(function() {

        new MasterColor()
            .getColor(this, function(color) {

                $(this).closest('.box-banner').css({
                    backgroundColor: color
                });

            }.bind(this));
    });

};
