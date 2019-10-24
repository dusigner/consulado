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

	this.setClickFunction = () => {
		const tabList = $('.categories-list li a'),
			subCategoryList = $('.subcategories-list ul');

		tabList.on('click', function() {
			tabList.removeClass('active');
			$(this).addClass('active');
			subCategoryList.removeClass('showSubCategory')
			$(`.subcategories-list ul[data-category=${$(this).attr('data-category')}]`).addClass('showSubCategory');
		});
	};

	this.init = () => {
		this.slickSubCategories();
		this.setClickFunction();
	};

	this.init();
});