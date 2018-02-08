'use strict';

//load Nitro Lib
require('vendors/nitro');

require('./modules/filters');
require('./modules/shelves');
require('./modules/quick-view');

Nitro.setup(['filters', 'shelves', 'quick-view'], function() {});
