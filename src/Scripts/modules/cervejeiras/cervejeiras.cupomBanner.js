import Clipboard from 'clipboard';
import toastr from 'vendors/toastr';

const CupomBanner = {
	/**
	 * Show a toastr alert with the coupon code
	 * @param {string} code Coupon code
	 */
	couponToastr: code => {
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
	},

	copyCupom: () => {
		const cupom = $('.cupom').text();
		$('.category-page-top-banner, .copiar').click(e => {
			e.preventDefault();

			const clipboard = new Clipboard('.category-page-top-banner, .copiar', {
				text: function() {
					return cupom;
				}
			});

			clipboard.on('success', function(e) {
				CupomBanner.couponToastr(cupom);
				e.clearSelection();
			});
		});
	}
};

export default CupomBanner;
