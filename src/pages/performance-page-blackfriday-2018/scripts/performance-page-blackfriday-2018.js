/**
 *
 * @fileOverview This is a performance page to show new components that will be used on Consul Black Friday 2018
 *
 */
'use strict';

import 'vendors/nitro';

import './modules/tabs';
import './modules/shelfs';
import './modules/counter';

Nitro.setup(['tabs', 'shelfs', 'counter'], function() {});
