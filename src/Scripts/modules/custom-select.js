'use strict';

const logger = require('js-pretty-logger');

Nitro.module('custom-select', function() {

	let self = this;

	/**
	 * @description Log messages into console
	 * @param {string} message the message that will be logged
	 * @param {string} [type=default] type of message. coude be default, info, danger, success and warn
	 * @example
	 * customSelect.setup({
	 *  select: '#couponFilter',
	 *	onChange(option) {
	 *	   console.log(`Select changed to: ${option.value}`);
	 *	 }
	 * });
	 * 
	 * @example
	 * customSelect.setup({
	 *   target: '#couponFilter',
	 *   options: [{text: 'Todos os produtos'}],
	 *   onChange(option) {
	 *     self.log(`Select changed to: ${option.value}`);
	 *  	self.getCouponsByCategory(option.value);
	 * 	 }
	 * });
	 */
	this.log = (message, type = 'info') => {
		logger('CustomSelect', message, { type });
	};

	/**
	 * @description Returns a list of object with options to render
	 * @param {object} $select the <select> DOM node to retrieve the options
	 */
	this.getOptions = $select => {
		let options = [];

		$('option', $select).each((index, option) => {
			options.push({
				text: option.innerText,
				...option.value && { value: option.value },
				...option.selected && { selected: true },
				...option.innerText && { text: option.innerText }
			});
		});

		return options;
	};

	/**
	 * @description Initialize a new custom select
	 * @param {object} config The config to render the custom select
	 * @param {string} config.select The query selector of the select node
	 * @param {function} [config.onChange] A function to execute when the selected item is changed. Returns {value, text}
	 */
	this.setup = config => {
		self.log('Initialized');
		if (typeof config !== 'object' || (!config && (!config.select && !config.target))) {
			self.log('Could no find the specified selector', 'danger');
			return;
		} else if (config.select) {
			self.renderFromSelect(config);
		} else if (config.target) {
			self.renderFromOptions(config);
		}
	};

	/**
	 * @description Bind actions to the custom select
	 * @param {object} $customSelect The jQuery object with the custom select
	 * @param {function} [onChange] A function to execute when the selected item is changed. Returns {value, text}
	 * @param {$select} [$select] The original <select> DOM node
	 */
	this.bindActions = ($customSelect, onChange, $select = null) => {
		$customSelect.click(event => {
			const $target = $(event.target);
			const $currentTarget = $(event.currentTarget);

			if ($target.hasClass('custom-select__link')) {
				const value = $target.data('value');
				const text = $target.text();

				$('.custom-select__text', $customSelect).text(text);

				if ($select) {
					$select.val(value);
				}

				$('.-selected', $customSelect).removeClass('-selected');
				$($target).parent().addClass('-selected');

				if (typeof onChange === 'function') {
					try {
						onChange({text, value});
					} catch (e) {
						self.log(e.message, 'danger');
						console.trace('custom-select');
					}
				}
			}
			$currentTarget.toggleClass('-open');
		});

		return $customSelect;
	};

	this.renderComponent = config => {
		const options = config.options;
		const id = config.id;
		const className = config.className;
		let selected = options.find(option => option.selected);

		if (!selected) {
			options[0].selected = true;
			selected = options[0];
		}

		return $(`<div ${id ? 'id="'+ id +'" ' : ''}class="custom-select${(className ? ' ' + className: '')}">
			<div class="custom-select__selected">
				<span class="custom-select__text">${selected.text}</span>
				<span class="custom-select__caret"></span>
			</div>
			<ul class="custom-select__list">
				${options.map(option => `
				<li class="custom-select__item${(option.selected ? ' -selected' : '')}">
					<a href="#" class="custom-select__link" data-value="${option.value ? option.value : ''}">${option.text}</a>
				</li>
				`).join('')}
			</ul>
		</div>`);
	};

	this.renderFromOptions = config => {
		const {id, className, options, target, appendType} = config;
		const $customSelect = self.renderComponent({id, className, options});

		$(target)[(appendType === 'preppend' ? 'prepend' : 'append')](self.bindActions($customSelect, config.onChange));
		self.log('Rendered from options', 'success');

	};

	/**
	 * @description Initialize a new custom select
	 * @param {object} options The options to render the custom select
	 * @param {string} options.select The query selector of the select node
	 * @param {function} [options.onChange] A function to execute when the selected item is changed. Returns {value, text}
	 */
	this.renderFromSelect = config => {
		const $select = $(config.select);
		const options = self.getOptions($select);
		const className = $select.attr('class');
		const id = $select.attr('id');

		const $customSelect = self.renderComponent({id, className, options});

		$select.after(self.bindActions($customSelect, config.onChange, $select));
		$select.hide();
		self.log('Rendered from <select> tag', 'success');
	};

});