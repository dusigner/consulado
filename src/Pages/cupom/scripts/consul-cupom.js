import 'vendors/nitro';
import 'vendors/slick';
import Clipboard from 'clipboard';
import toastr from 'vendors/toastr';
import {getCoupons} from 'modules/store/crm';
import DataLayer from './modules/dataLayer';
require('modules/listagem/percentoff');
require('modules/prateleira');
require('Dust/coupon/cupom-list.html');

Nitro.setup(['percentoff', 'prateleira'], function(percentoff, prateleira) {

	this.init=()=>{
		getCoupons().then(cupons=>{
			cupons.map((element) => {
				element.idCollection && this.getShelf(element.idCollection).then(shelf => {
					const dataCupom = {...element,shelf}
					this.renderCupom(dataCupom)
				})
			});
		});

		$(window).load(function(){
			const dataLayer = new DataLayer;
			dataLayer.setup();
		});
	}

	this.getShelf = (idCollection) => {
		const shelfId = $('.vitrine-desconto').data('shelf-id');
		return fetch(`/buscapagina?fq=H:${idCollection}&sl=${shelfId}&cc=12&sm=0&PS=9`).then(res => res.text())
	}

	this.renderCupom = (cupom) => {
		dust.render('cupom-list',  cupom, (err, out) => {
			if (err) {
				throw new Error('Lista de Cupons Dust error: ' + err);
			}

			$('.vitrine-desconto .container').append(out);
			this.copyCupom(cupom.coupon);
			prateleira.init();
			percentoff.init();

			this.slick();
		});
	}
	this.slick = () => {
		$('.slider:not(.slick-initialized)').slick({
			slidesToShow: 4,
			infinite: false,
			responsive: [
				{
					breakpoint: 1024,
					settings: {
						slidesToShow: 3,
						dots: true
					}
				},
				{
					breakpoint: 768,
					settings: {
						slidesToShow: 2,
						dots: true
					}
				},
				{
					breakpoint: 480,
					settings: {
						slidesToShow: 1,
						dots: true
					}
				}
			]
		});
		$('.slider-prod .prateleira ul:not(.slick-initialized)').slick({
			arrows: true,
			slidesToShow: 3,
			infinite: false,
			adaptiveHeight: true,
			responsive: [
				{
					breakpoint: 1024,
					settings: {
						slidesToShow: 3,
						dots: true
					}
				},
				{
					breakpoint: 769,
					settings: {
						slidesToShow: 2,
						centerPadding: '10px',
						dots: false
					}
				},
				{
					breakpoint: 480,
					settings: {
						slidesToShow: 1,
						dots: false
					}
				}
			]
		});
	}
	this.couponToastr = code => {
		const windowWidth = $(window).width();
		const position = windowWidth <= 320 ? 'toast-bottom-center' : 'toast-top-center';

		toastr.options = {
			closeButton: true,
			debug: false,
			newestOnTop: true,
			progressBar: false,
			positionClass: position,
			preventDuplicates: true,
			onclick: null,
			showDuration: '300',
			hideDuration: '1000',
			timeOut: '5000',
			extendedTimeOut: '1000',
			showEasing: 'swing',
			hideEasing: 'linear',
			showMethod: 'fadeIn',
			hideMethod: 'fadeOut'
		};
		toastr.info(`Código ${code} copiado`);
	}
	this.copyCupom = (cupomText) => {
		const element = `.vitrine-desconto__card-cupom-button.${cupomText}`;
		// console.log("chamou")
		$(element).click(e => {
			// console.log('Clicou')
			e.preventDefault();

			const clipboard = new Clipboard(element, {
				text: function() {
					return cupomText;
				}
			});

			clipboard.on('success', (e) => {
				this.couponToastr(cupomText);
				e.clearSelection();
			});
		});
	}

	this.init();

});
