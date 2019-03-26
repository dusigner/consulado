/*!
 * Jussi Nitro - v2.0.0 @license MIT
 */

/*!
 * Jussi Nitro v2.0.0
 * Copyright (c) 2015 Lucas Monteverde
 * Under MIT License
 */

/* global jQuery: true */

(function($, window, document, undefined) {

	'use strict';

	var Nitro = window.Nitro = (function() {

		var log = false,
			controllers = {},
			modules = {};

		var loader = function() {
			['controller', 'module'].forEach(function(type) {
				$('[data-' + type + ']', document).each(function() {
					return Nitro[type] && Nitro[type].call(this, $(this).data(type));
				});
			});
		};

		var debug = function() {
			var args = Array.prototype.slice.call(arguments);
			args.unshift('%cNitro:', 'color:blue;');
			return log && console.info.apply(console, args);
		};

		return {

			setup: function(dep, func) {

				if ($.isFunction(dep)) {
					func = dep;
				}

				if (!$.isArray(dep)) {
					dep = [];
				}

				return $(function() {
					$(document).ready(function() {
						func.apply({}, dep.map(Nitro.module));
						loader();
					});
				});
			},

			controller: function(name, dep, func) {

				if ($.isFunction(dep)) {
					func = dep;
				}

				if (!$.isArray(dep)) {
					dep = [];
				}

				if (controllers[name]) {

					controllers[name].apply({}, controllers[name].dep.map(Nitro.module));

					debug('controller ' + name + ' started');

				} else if ($.isFunction(func)) {

					debug('defining controller', name);

					func.dep = dep;

					controllers[name] = func;
				}

				//return controllers;
			},

			module: function(name, dep, func) {

				if ($.isFunction(dep)) {
					func = dep;
				}

				if (!$.isArray(dep)) {
					dep = [];
				}

				if (modules[name]) {

					var m = {}; //Object.create(null);

					modules[name].apply(m, modules[name].dep.map(Nitro.module));

					debug('modules ' + name + ' started');

					return m;

				} else if ($.isFunction(func)) {
					debug('defining module', name);

					func.dep = dep;

					modules[name] = func;
				}

				//return modules[name];
			}
		};
	})();

	return Nitro;

})(jQuery, window, document);
