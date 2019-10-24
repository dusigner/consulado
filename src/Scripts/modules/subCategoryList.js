Nitro.module('subCategoryList', function() {

	this.slickSubCategories = () => {
		var $list = $('.subcategories-list ul');

		$list.slick({
			arrows: true,
			dots: false,
			slidesToShow: 6,
			slidesToScroll: 2,
			infinite: true
		});
	};

	this.init = () => {
		this.slickSubCategories();
	};

	this.init();
});