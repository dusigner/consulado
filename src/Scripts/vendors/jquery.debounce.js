/**
 * Debounce and throttle function's decorator plugin 1.0.5
 *
 * Copyright (c) 2009 Filatov Dmitry (alpha@zforms.ru)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 */

// ;(function($) {

// 	$.extend({

// 		debounce: function(fn, timeout, invokeAsap, ctx) {

// 			if (arguments.length == 3 && typeof invokeAsap != 'boolean') {
// 				ctx = invokeAsap;
// 				invokeAsap = false;
// 			}

// 			var timer;

// 			return function() {

// 				var args = arguments;
// 				ctx = ctx || this;

// 				invokeAsap && !timer && fn.apply(ctx, args);

// 				clearTimeout(timer);

// 				timer = setTimeout(function() {
// 					!invokeAsap && fn.apply(ctx, args);
// 					timer = null;
// 				}, timeout);

// 			};

// 		},

// 		throttle: function(fn, timeout, ctx) {

// 			var timer, args, needInvoke;

// 			return function() {

// 				args = arguments;
// 				needInvoke = true;
// 				ctx = ctx || this;

// 				if (!timer) {
// 					(function() {
// 						if (needInvoke) {
// 							fn.apply(ctx, args);
// 							needInvoke = false;
// 							timer = setTimeout(arguments.callee, timeout);
// 						} else {
// 							timer = null;
// 						}
// 					})();
// 				}

// 			};

// 		}

// 	});

// })(jQuery);

/**
 * Debounce and throttle helper function's
 *
 * https://remysharp.com/2010/07/21/throttling-function-calls
 *
 * Examples:
 * $('input.username').keypress(debounce(function (event) {
 *   // do the Ajax request
 * }, 250));
 * 
 * $('body').on('mousemove', throttle(function (event) {
 *   console.log('tick');
 * }, 1000));
 *
 */

;(function($) {

	$.extend({

		debounce: function(fn, delay) {
			var timer = null;
			return function () {
				var context = this, args = arguments;
				clearTimeout(timer);
				timer = setTimeout(function () {
					fn.apply(context, args);
				}, delay);
			};
		},

		throttle: function(fn, threshhold, scope) {
			threshhold || (threshhold = 250);
			var last,
			deferTimer;
			return function () {
				var context = scope || this;
				var now = +new Date,
				args = arguments;
				if (last && now < last + threshhold) {
					// hold on to it
					clearTimeout(deferTimer);
					deferTimer = setTimeout(function () {
						last = now;
						fn.apply(context, args);
					}, threshhold);
				} else {
					last = now;
					fn.apply(context, args);
				}
			};
		}
	});
})(jQuery);