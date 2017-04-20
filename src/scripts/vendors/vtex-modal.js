/**
 * VTEX Modal v2.2.2
 * Copyright (c) 2015 Lucas Monteverde
 * Under MIT License
 */

(function(factory) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else if (typeof exports !== 'undefined') {
		module.exports = factory(require('jquery'));
	} else {
		factory(jQuery);
	}

}(function($) {

	'use strict';

	var pluginName = 'vtexModal',
		defaults = {
			content: '',
			open: true,
			clone: false,
			static: false,
			destroy: false,
			template: '<div id="vtex-{id}" class="vtex-modal">' +
				'	<div class="modal-holder">' +
				'		<div class="modal-header">{title}<button type="button" class="close"></button></div>' +
				'		<div class="modal-content"></div>' +
				'	</div>' +
				'</div>'
		};

	function Modal(element, options) {
		this.element = element;

		this.settings = $.extend({
			id: this.element.attr('id') || 'vtex',
			title: this.element.data('title') || ''
		}, defaults, options);

		this.modal = {};
		this.content = {};

		this._defaults = defaults;
		this._name = pluginName;

		this.init();
	}

	Modal.prototype.init = function() {

		this.modal = $('#vtex-' + this.settings.id);

		if (this.modal.length === 0) {

			this.render();

			this.modal.on('click', (this.settings.destroy ? this.destroy.bind(this) : this.close.bind(this)));
			if (this.settings.open === true) {
				$(document).on('keyup', (this.settings.destroy ? this.destroy.bind(this) : this.close.bind(this)));
			}
		}

		return this.settings.open && this.open();
	};


	Modal.prototype.render = function() {
		this.modal = $(this.settings.template.render({
			id: this.settings.id,
			title: this.settings.title
		})).appendTo('body');

		this.content = this.modal.find('.modal-content')
			.append((this.settings.clone ? this.element.clone(false, false) : this.element).show());

		if (typeof this.settings.complete === 'function') {
			this.settings.complete.call(this, this.modal, this.content);
		}
	};

	Modal.prototype.open = function() {
		this.modal.fadeIn();

		if (typeof this.settings.open === 'function') {
			this.settings.open.call(this, this.modal, this.content);
		}
	};

	Modal.prototype.close = function(e) {
		e.stopPropagation();

		if (this.settings.static && $(e.target).is('.close')) {
			this.modal.fadeOut(this.settings.close);
		} else if ((!e || $(e.target).is(this.modal) || $(e.target).is('.close') || e.keyCode === 27) && !this.settings.static) {
			this.modal.fadeOut(this.settings.close);
		}
	};

	Modal.prototype.destroy = function(e) {
		e.stopPropagation();

		if (this.settings.static && $(e.target).is('.close')) {
			this.modal.fadeOut(500, function() {
				$(this).remove();
			});
		} else if ((!e || $(e.target).is(this.modal) || $(e.target).is('.close') || e.keyCode === 27) && !this.settings.static) {
			this.modal.fadeOut(500, function() {
				$(this).remove();
			});
		}
	};

	$.fn[pluginName] = function(options, data) {
		return this.each(function() {
			var _self = $.data(this, 'plugin_' + pluginName);

			if (!_self) {
				$.data(this, 'plugin_' + pluginName, new Modal($(this), options || {}));
			} else {
				var action = 'init';

				if (typeof options === 'string') { //$.vtexModal('close', {});
					action = options;
					options = data;
				} else {
					$.extend(_self.settings, options);
				}

				_self[action].apply(_self, options);
			}
		});
	};

}));
