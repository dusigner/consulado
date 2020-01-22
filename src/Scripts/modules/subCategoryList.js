Nitro.module('subCategoryList', function() {

	this.slickSubCategories = () => {
		var $list = $('.subcategories-list ul');

		$list.slick({
			arrows: true,
			dots: false,
			infinite: false,
			slidesToShow: 6,
			slidesToScroll: 2,
			responsive: [
				{
					breakpoint: 1000,
					settings: {
						slidesToShow: 5,
						slidesToScroll: 2,
						swipeToSlide: true,
						infinite: false
					}
				},
				{
					breakpoint: 768,
					settings: {
						slidesToShow: 5.5,
						slidesToScroll: 2,
						centerPadding: '50px',
						infinite: false,
						swipeToSlide: true,
						arrows: false
					}
				},
				{
					breakpoint: 500,
					settings: {
						slidesToShow: 3.5,
						slidesToScroll: 2,
						infinite: false,
						centerPadding: '50px',
						swipeToSlide: true,
						arrows: false
					}
				},
				{
					breakpoint: 375,
					settings: {
						slidesToShow: 3.1,
						slidesToScroll: 2,
						centerPadding: '10px',
						infinite: false,
						swipeToSlide: true,
						arrows: false
					}
				}
			]
		});
	};

	this.setClickFunction = () => {
		const tabList = $('.categories-list li a'),
			subCategoryList = $('.subcategories-list div');

		tabList.on('click', function() {
			tabList.removeClass('active');
			$(this).addClass('active');
			subCategoryList.removeClass('showSubCategory')
			$(`.subcategories-list div[data-category=${$(this).attr('data-category')}]`).addClass('showSubCategory');
		});
	};

	this.init = () => {
		this.slickSubCategories();
		this.setClickFunction();
	};

	this.init();
});
