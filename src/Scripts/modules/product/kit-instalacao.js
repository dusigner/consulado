/* global $: true, Nitro: true */
'use strict';

Nitro.module('kit-instalacao', function() {
	const self = this;
	const $selectVoltage = $('.select-voltage');
	const template = `
		<!-- Kit instalação -->
		<div class="kit-instalacao">
			<strong class="kit-instalacao__title specification">Selecione o tipo de gás</strong>
			<div class="skuList">
				<span>
					<input type="radio" name="botijao" class="kit-instalacao__input" id="botijao" value="Botijão">
					<label for="botijao" class="kit-instalacao__label">Botijão</label>

					<input type="radio" name="gas-natural" class="kit-instalacao__input" id="gas-natural" value="Gás natural">
					<label for="gas-natural" class="kit-instalacao__label">Gás natural</label>
				</span>
			</div>

			<div class="kit-instalacao-container">
				<p class="kit-instalacao__description">
					Aproveite e leve seu kit de instalação
				</p>

				<!-- Product Kit -->
				<div class="kit-product">
					<div class="kit-product__item kit-product__item-image">
						<img src="https://consul.vteximg.com.br/arquivos/kit-botijao.png" alt="">
					</div>

					<div class="kit-product__item kit-product__item-title">
						<h2>Kit de Instalação para Gás Encanado</h2>
						<span>W10866791</span>
					</div>

					<div class="kit-product__item kit-product__item-price">
						<div class="de">De R$ 139,99</div>
						<div class="por">Por R$ 136,90</div>
					</div>

					<div class="kit-product__item kit-product__item-select">
						<input type="checkbox" name="" id="kit-product-item-select-1" />
						<label for="kit-product-item-select-1"></label>
					</div>
				</div>
				<!-- /Product Kit -->

				<!-- Product Kit -->
				<div class="kit-product type-gas-natural">
					<div class="kit-product__item kit-product__item-image">
						<img src="https://consul.vteximg.com.br/arquivos/kit-botijao.png" alt="">
					</div>

					<div class="kit-product__item kit-product__item-title">
						<h2>Kit de Instalação para Gás Encanado</h2>
						<span>W10866791</span>
					</div>

					<div class="kit-product__item kit-product__item-price">
						<div class="de">De R$ 139,99</div>
						<div class="por">Por R$ 136,90</div>
					</div>

					<div class="kit-product__item kit-product__item-select">
						<input type="checkbox" name="" id="kit-product-item-select" />
						<label for="kit-product-item-select"></label>
					</div>
				</div>
				<!-- /Product Kit -->
			</div>
		</div>
		<!-- /Kit instalação -->
	`;

	this.init = () => {
		console.log('Init kit-instalacao...');

		$selectVoltage.attr('class', 'select-voltage');

		$selectVoltage.after(template);
	};


	self.init();
});
