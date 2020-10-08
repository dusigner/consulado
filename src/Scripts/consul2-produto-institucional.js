'use strict'
import 'dataLayers/dataLayer-produto-institucional';
import 'modules/produto-institucional/blog-facilita';
import 'modules/produto-institucional/video-bem-pensado';

Nitro.controller(
    'produto-institucional',
    [
        'dataLayer-produto-institucional',
        'slick-produto-institucional',
        'video-bem-pensado',
    ],

    function () {}
)
