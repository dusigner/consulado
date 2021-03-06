/*! dustjs-helpers - v1.4.0
 * https://github.com/linkedin/dustjs-helpers
 * Copyright (c) 2014 Aleksander Williams; Released under the MIT License */
'use strict';

$.extend(dust.filters, {
	capitalizeSequence: function (str) {
		return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
			return index === 0 ? letter.toUpperCase() : letter.toLowerCase();
		}).replace(/\s+/g, '');
	},

	formatDateAndHour: function (value) {
		var d = (value) ? new Date(value) : new Date(),
			month = d.getUTCMonth() + 1,
			day = d.getUTCDate(),
			hours = d.getUTCHours(),
			minutes = d.getUTCMinutes();

		return (day < 10 ? '0' : '') + day + '/' +
			(month < 10 ? '0' : '') + month + ' - ' +
			(hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes;
	},

	formatDate: function (value) {
		var d = (value) ? new Date(value) : new Date(),
			month = d.getUTCMonth() + 1,
			day = d.getUTCDate();

		return (day < 10 ? '0' : '') + day + '/' +
			(month < 10 ? '0' : '') + month;
	},

	formatDateAndYear: function (value) {
		var d = (value) ? new Date(value) : new Date(),
			month = d.getUTCMonth() + 1,
			day = d.getUTCDate(),
			year = d.getFullYear();

		return (day < 10 ? '0' : '') + day + '/' + (month < 10 ? '0' : '') + month + '/' + (year < 10 ? '0' : '') + year;
	},


	formatPhone: function (value) {
		value = value.replace(/D/g, '');
		value = value.replace(/^(\d\d)(\d)/g, '($1) $2');
		value = value.replace(/(\d{5})(\d)/, '$1-$2');

		return value;
	},

	formatDocument: value => value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4'),
	formatMovimentationValue: value => value.replace('-', ''),
	formatValue: value => window.defaultStoreCurrency + ' ' + _.formatCurrency(value),
	intAsCurrency: value => _.intAsCurrency(value),
	formatCurrency: value => _.formatCurrency(parseFloat(value)),
	notificationShortTitle: value => value.substr(0, 80),
	sanitize: value => $.replaceSpecialChars(value).toLowerCase(),
	parseInt: value => parseInt(value),
	tolowercase: value => value.toLowerCase()
});
(function (dust) {

	//using the built in logging method of dust when accessible
	var _log = dust.log ? function (mssg) {
		dust.log(mssg, "INFO");
	} : function () { };

	function isSelect(context) {
		var value = context.current();
		return typeof value === "object" && value.isSelect === true;
	}

	// Utility method : toString() equivalent for functions
	function jsonFilter(key, value) {
		if (typeof value === "function") {
			//to make sure all environments format functions the same way
			return value.toString()
				//remove all leading and trailing whitespace
				.replace(/(^\s+|\s+$)/mg, '')
				//remove new line characters
				.replace(/\n/mg, '')
				//replace , and 0 or more spaces with ", "
				.replace(/,\s*/mg, ', ')
				//insert space between ){
				.replace(/\)\{/mg, ') {');
		}
		return value;
	}

	// Utility method: to invoke the given filter operation such as eq/gt etc
	function filter(chunk, context, bodies, params, filterOp) {
		params = params || {};
		var body = bodies.block,
			actualKey,
			expectedValue,
			filterOpType = params.filterOpType || '';
		// when @eq, @lt etc are used as standalone helpers, key is required and hence check for defined
		if (typeof params.key !== "undefined") {
			actualKey = dust.helpers.tap(params.key, chunk, context);
		} else if (isSelect(context)) {
			actualKey = context.current().selectKey;
			//	supports only one of the blocks in the select to be selected
			if (context.current().isResolved) {
				filterOp = function () {
					return false;
				};
			}
		} else {
			_log("No key specified for filter in:" + filterOpType + " helper ");
			return chunk;
		}
		expectedValue = dust.helpers.tap(params.value, chunk, context);
		// coerce both the actualKey and expectedValue to the same type for equality and non-equality compares
		if (filterOp(coerce(expectedValue, params.type, context), coerce(actualKey, params.type, context))) {
			if (isSelect(context)) {
				context.current().isResolved = true;
			}
			// we want helpers without bodies to fail gracefully so check it first
			if (body) {
				return chunk.render(body, context);
			} else {
				_log("No key specified for filter in:" + filterOpType + " helper ");
				return chunk;
			}
		} else if (bodies['else']) {
			return chunk.render(bodies['else'], context);
		}
		return chunk;
	}

	function coerce(value, type, context) {
		if (value) {
			switch (type || typeof (value)) {
				case 'number':
					return +value;
				case 'string':
					return String(value);
				case 'boolean':
					{
						value = (value === 'false' ? false : value);
						return Boolean(value);
					}
				case 'date':
					return new Date(value);
				case 'context':
					return context.get(value);
			}
		}

		return value;
	}

	var helpers = {

		// Utility helping to resolve dust references in the given chunk
		// uses the Chunk.render method to resolve value
		/*
 Reference resolution rules:
 if value exists in JSON:
		"" or '' will evaluate to false, boolean false, null, or undefined will evaluate to false,
		numeric 0 evaluates to true, so does, string "0", string "null", string "undefined" and string "false".
		Also note that empty array -> [] is evaluated to false and empty object -> {} and non-empty object are evaluated to true
		The type of the return value is string ( since we concatenate to support interpolated references

 if value does not exist in JSON and the input is a single reference: {x}
 dust render emits empty string, and we then return false

 if values does not exist in JSON and the input is interpolated references : {x} < {y}
 dust render emits <	and we return the partial output

		*/
		"tap": function (input, chunk, context) {
			// return given input if there is no dust reference to resolve
			// dust compiles a string/reference such as {foo} to a function
			if (typeof input !== "function") {
				return input;
			}

			var dustBodyOutput = '',
				returnValue;

			//use chunk render to evaluate output. For simple functions result will be returned from render call,
			//for dust body functions result will be output via callback function
			returnValue = chunk.tap(function (data) {
				dustBodyOutput += data;
				return '';
			}).render(input, context);

			chunk.untap();

			//assume it's a simple function call if return result is not a chunk
			if (returnValue.constructor !== chunk.constructor) {
				//use returnValue as a result of tap
				return returnValue;
			} else if (dustBodyOutput === '') {
				return false;
			} else {
				return dustBodyOutput;
			}
		},

		"sep": function (chunk, context, bodies) {
			var body = bodies.block;
			if (context.stack.index === context.stack.of - 1) {
				return chunk;
			}
			if (body) {
				return bodies.block(chunk, context);
			} else {
				return chunk;
			}
		},

		"idx": function (chunk, context, bodies) {
			var body = bodies.block;
			if (body) {
				return bodies.block(chunk, context.push(context.stack.index));
			} else {
				return chunk;
			}
		},

		/**
 if helper for complex evaluation complex logic expressions.
 Note : #1 if helper fails gracefully when there is no body block nor else block
				#2 Undefined values and false values in the JSON need to be handled specially with .length check
 for e.g @if cond=" '{a}'.length && '{b}'.length" is advised when there are chances of the a and b been
 undefined or false in the context
				#3 Use only when the default ? and ^ dust operators and the select fall short in addressing the given logic,
 since eval executes in the global scope
				#4 All dust references are default escaped as they are resolved, hence eval will block malicious scripts in the context
 Be mindful of evaluating a expression that is passed through the unescape filter -> |s
 @param cond, either a string literal value or a dust reference
					a string literal value, is enclosed in double quotes, e.g. cond="2>3"
					a dust reference is also enclosed in double quotes, e.g. cond="'{val}'' > 3"
		cond argument should evaluate to a valid javascript expression
 **/

		"if": function (chunk, context, bodies, params) {
			var body = bodies.block,
				skip = bodies['else'];
			if (params && params.cond) {
				var cond = params.cond;
				cond = dust.helpers.tap(cond, chunk, context);
				// eval expressions with given dust references
				if (eval(cond)) {
					if (body) {
						return chunk.render(bodies.block, context);
					} else {
						_log("Missing body block in the if helper!");
						return chunk;
					}
				}
				if (skip) {
					return chunk.render(bodies['else'], context);
				}
			}
			// no condition
			else {
				_log("No condition given in the if helper!");
			}
			return chunk;
		},

		/**
 eq helper compares the given key is same as the expected value
 It can be used standalone or in conjunction with select for multiple branching
 @param key,	The actual key to be compared ( optional when helper used in conjunction with select)
					either a string literal value or a dust reference
					a string literal value, is enclosed in double quotes, e.g. key="foo"
					a dust reference may or may not be enclosed in double quotes, e.g. key="{val}" and key=val are both valid
 @param value, The expected value to compare to, when helper is used standalone or in conjunction with select
 @param type (optional), supported types are	number, boolean, string, date, context, defaults to string
 Note : use type="number" when comparing numeric
 **/
		"eq": function (chunk, context, bodies, params) {
			if (params) {
				params.filterOpType = "eq";
				return filter(chunk, context, bodies, params, function (expected, actual) {
					return actual === expected;
				});
			}
			return chunk;
		},

		/**
		 * size helper prints the size of the given key
		 * Note : size helper is self closing and does not support bodies
		 * @param key, the element whose size is returned
		 */
		"size": function (chunk, context, bodies, params) {
			var key, value = 0,
				nr, k;
			params = params || {};
			key = params.key;
			if (!key || key === true) { //undefined, null, "", 0
				value = 0;
			} else if (dust.isArray(key)) { //array
				value = key.length;
			} else if (!isNaN(parseFloat(key)) && isFinite(key)) { //numeric values
				value = key;
			} else if (typeof key === "object") { //object test
				//objects, null and array all have typeof ojbect...
				//null and array are already tested so typeof is sufficient http://jsperf.com/isobject-tests
				nr = 0;
				for (k in key) {
					if (Object.hasOwnProperty.call(key, k)) {
						nr++;
					}
				}
				value = nr;
			} else {
				value = (key + '').length; //any other value (strings etc.)
			}
			return chunk.write(value);
		}


	};

	for (var key in helpers) {
		dust.helpers[key] = helpers[key];
	}

	if (typeof exports !== 'undefined') {
		module.exports = dust;
	}

})(typeof exports !== 'undefined' ? require('dustjs-linkedin') : dust);

dust.helpers.neq = function (chunk, context, bodies, params) {
	var location = params.key,
		value = params.value,
		body = bodies.block;

	if (location !== value) {
		chunk.render(body, context);
	}

	return chunk;
};

dust.helpers.equalzero = function (chunk, context, bodies, params) {
	let location = params.key,
		value = params.value,
		body = bodies.block;

	if (location == 0) {
		chunk.render('Igual a zero');
	} else {
		chunk.render(body, context);
	}

	return chunk;
};
