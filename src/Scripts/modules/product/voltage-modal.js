/* global $: true, Nitro: true */
'use strict';

Nitro.module('voltage-modal', function() {
	var self = this;
	this.init = () => {
		this.voltageSelectorModal();
	}

	// MODAL DE SELETOR DE VOLTAGEM NO BOTÃO DE COMPRE
	this.voltageSelectorModal = () => {
		if (skuJson.dimensions.length !== 0){
			if(skuJson.dimensionsMap.Voltagem[0] !== 'Sem Voltagem') {
				$('body').append(`
					<div class="voltageModalWindow">
					</div>
				`);

				let selectVoltageModal = $('#modal-sku').clone();
				let voltageModal = $('.voltageModalWindow');

				$(voltageModal).append(selectVoltageModal);

				$('.voltageModalWindow #modal-sku').append(`
					<div class="closeModal">
						<svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000 svg">
							<path fill-rule="evenodd" clip-rule="evenodd" d="M14.7257 0.27539C14.813 0.362464 14.8823 0.465904 14.9295 0.579786C14.9768 0.693669 15.0011 0.815755 15.0011 0.939052C15.0011 1.06235 14.9768 1.18444 14.9295 1.29832C14.8823 1.4122 14.813 1.51564 14.7257 1.60272L1.60247 14.726C1.42645 14.902 1.18773 15.0009 0.938805 15.0009C0.689883 15.0009 0.451156 14.902 0.275142 14.726C0.0991277 14.55 0.000244142 14.3112 0.000244141 14.0623C0.000244139 13.8134 0.0991277 13.5747 0.275142 13.3987L13.3984 0.27539C13.4855 0.188095 13.5889 0.118836 13.7028 0.0715801C13.8167 0.0243242 13.9388 0 14.0621 0C14.1854 0 14.3075 0.0243242 14.4213 0.0715801C14.5352 0.118836 14.6387 0.188095 14.7257 0.27539Z" fill="#736C6B"/>
							<path fill-rule="evenodd" clip-rule="evenodd" d="M0.27539 0.27539C0.188095 0.362464 0.118836 0.465904 0.0715801 0.579786C0.0243242 0.693669 0 0.815755 0 0.939052C0 1.06235 0.0243242 1.18444 0.0715801 1.29832C0.118836 1.4122 0.188095 1.51564 0.27539 1.60272L13.3987 14.726C13.5747 14.902 13.8134 15.0009 14.0623 15.0009C14.3112 15.0009 14.55 14.902 14.726 14.726C14.902 14.55 15.0009 14.3112 15.0009 14.0623C15.0009 13.8134 14.902 13.5747 14.726 13.3987L1.60272 0.27539C1.51564 0.188095 1.4122 0.118836 1.29832 0.0715801C1.18444 0.0243242 1.06235 0 0.939052 0C0.815755 0 0.693669 0.0243242 0.579786 0.0715801C0.465904 0.118836 0.362464 0.188095 0.27539 0.27539Z" fill="#736C6B"/>
						</svg>
					</div>
				`);

				$('#BuyButton .buy-button').click(function(e){
					e.preventDefault();

					voltageModal.addClass('voltageSelectorIsOpen');
				});

				$('.cont-prod-details-nav .buy-button').click(function(e){
					e.preventDefault();

					voltageModal.addClass('voltageSelectorIsOpen');
				});

				$('.product-info-bar__buy .buy-button').click(function(e){
					e.preventDefault();

					voltageModal.addClass('voltageSelectorIsOpen');
				});

				$('.closeModal').click(function(){
					$(voltageModal).removeClass('voltageSelectorIsOpen');
				})

				$(voltageModal).click(function(e) {
					if (e.target == this) {
						$(voltageModal).removeClass('voltageSelectorIsOpen');
					};
				});



				$('#modal-sku .button .buy-button').css('cursor', 'not-allowed').attr('onclick', 'return false');

				$('input[data-dimension=Voltagem]').on('click', function(){
					var selectedVoltage = $(this).val();

					$('.title-check-voltage p').text('');
					$('.title-check-voltage p').text(selectedVoltage);

					setTimeout(function(){
						$('#modal-sku .button a.buy-button').css('cursor', 'pointer').removeAttr('onclick');
					}, 1000);

				});
			}
		}
	};

	// MODAL DE SELETOR DE VOLTAGEM NO BOTÃO DE COMPRE
	this.init();
})
