/* global $: true, Nitro: true */
'use strict';

Nitro.module('selos', function() {


    var $holder = $('.prod-selos'),
        $selos = $('#caracteristicas .value-field.Selos');
        
    if ($selos.length === 0) {
        return;
    }

    $selos = $selos.text().split(', ');

    $selos = $.map($selos, function(v) {
        return '<p class="product-field-selo ' + $.replaceSpecialChars(v) + '">' + v + '</p>';
    }).join('');

    $holder.append($selos);

});
