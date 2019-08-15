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
	$('.slider-prod').slick({
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
});
