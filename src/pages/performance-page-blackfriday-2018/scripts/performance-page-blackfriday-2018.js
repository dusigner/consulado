/**
 *
 * @fileOverview This is a performance page to show new components that will be used on Brastemp Black Friday 2018
 *
 */
'use strict';

import 'vendors/nitro';

import './modules/tabs';
import './modules/shelfs';

Nitro.setup(['tabs', 'shelfs'], function() {});
