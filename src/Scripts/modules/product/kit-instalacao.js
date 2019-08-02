/* global $: true, Nitro: true */
'use strict';

Nitro.module('kit-instalacao', function() {
	const self = this;
	const $selectVoltage = $('.select-voltage');
	const template = `
		<div class="kit-instalacao">
			<strong class="kit-instalacao__title">Selecione o tipo de gás</strong>
			<div class="skuList">
				<span>
					<input type="radio" name="botijao" class="kit-instalacao__input" id="botijao" value="Botijão">
					<label for="botijao" class="kit-instalacao__label">Botijão</label>

					<input type="radio" name="gas-natural" class="kit-instalacao__input" id="gas-natural" value="Gás natural">
					<label for="gas-natural" class="kit-instalacao__label">Gás natural</label>
				</span>
			</div>
		</div>
	`;

	this.init = () => {
		console.log('Init kit-instalacao...');

		$selectVoltage.attr('class', 'select-voltage');

		$selectVoltage.after(template);
	};


	self.init();
});
