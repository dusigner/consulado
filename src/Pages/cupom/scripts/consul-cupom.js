import 'vendors/nitro';
import 'vendors/slick';

Nitro.setup([], function() {
	$('.slider').slick({
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
					slidesToShow: 3,
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
});
