import 'vendors/slick';

Nitro.module('interested-shelf', function() {

	this.createTabList = shelf => {
		const tabList = shelf.find('.prateleira-tabs__tabs'),
			shelfTitle = shelf.find('.prateleira'),
			shelfObs = shelf.find('.interesses-obs');

		$.each(shelfTitle, (index, value) => {
			const title = $(value).find('h2').text().split(' - ');
			let className = '';

			tabList.append(`
				<li>
					<a href="javascript:void(0)" class="discount-item" data-index="${index}">
						<span>${title[0]}</span>
					</a>
				</li>
			`);

			shelfObs.append(`
				<span class="link-obs-mobile" data-index=${index}>${(title[2] !== undefined) ? title[2] : ''}</span>
			`);

			$(value).append(`
				<span class="link-shelf ${className}">
					<span class="link-obs-desktop">${(title[2] !== undefined) ? title[2] : ''}</span>
					<a href="/busca?fq=H:${title[1]}">Veja todos os produtos</a>
				</span>

			`);

		});
	};

	this.prepareShelf = shelf => {
		const tabElement = shelf.find('.discount-item'),
			shelves = shelf.find('.prateleira.default'),
			shelfObs = shelf.find('.link-obs-mobile');

		tabElement.on('click', function() {
			const $this = $(this);
			tabElement.removeClass('active');
			$this.addClass('active');

			shelves.find('.slick-initialized').slick('unslick');

			shelves.addClass('not-show');
			shelves.eq($this.attr('data-index')).removeClass('not-show');

			shelves.eq($this.attr('data-index')).find('ul').slick({
				arrows: true,
				dots: false,
				infinite: false,
				slidesToShow: 4,
				slidesToScroll: 3,
				responsive: [
					{
						breakpoint: 990,
						settings: {
							slidesToShow: 2.2,
							slidesToScroll: 2
						}
					},
					{
						breakpoint: 480,
						settings: {
							arrows: false,
							slidesToShow: 1.4,
							slidesToScroll: 1
						}
					}
				]
			});

			shelfObs.removeClass('showObs');
			shelfObs.eq($this.attr('data-index')).addClass('showObs');
		});

		shelves.addClass('not-show');
		shelves.first().removeClass('not-show');
		tabElement.first().addClass('active');
		shelfObs.first().addClass('showObs');
	};

	this.check = shelf => {
		let verify = (shelf.find('.prateleira.default').length > 0) ? true : false;
		return verify;
	};

	this.setIcons = shelf => {
		const tabElement = shelf.find('.discount-item');

		$.each(tabElement, function (index, value) {
			const tabText = $(value).text().toLowerCase();

			(tabText.indexOf('friday') > -1) ? $(value).parent().addClass('blackfriday') : '';
			(tabText.indexOf('40') > -1) ? $(value).parent().addClass('quarenta') : '';
			(tabText.indexOf('20') > -1) ? $(value).parent().addClass('vinte') : '';
			(tabText.indexOf('vista') > -1) ? $(value).parent().addClass('vista') : '';
			(tabText.indexOf('frete') > -1) ? $(value).parent().addClass('frete') : '';
		});

		if (tabElement.length === 5) {
			$('.blackfriday').addClass('firstItem');
			$('.frete').addClass('secondItem');
			$('.vinte, .quarenta, .vista').addClass('minorButton');
			shelf.find('.prateleira-tabs__tabs').addClass('fiveElements');
		}
	};

	this.createShelf = shelf => {
		const shelves = shelf.find('.prateleira.default');

		shelves.find('.slick-initialized').slick('unslick');

		shelves.find('ul').slick({
			adaptiveHeight: false,
			arrows: true,
			dots: false,
			infinite: false,
			slidesToShow: 4,
			slidesToScroll: 3,
			responsive: [
				{
					breakpoint: 990,
					settings: {
						slidesToShow: 2.2,
						slidesToScroll: 2
					}
				},
				{
					breakpoint: 480,
					settings: {
						arrows: false,
						slidesToShow: 1.4,
						slidesToScroll: 1
					}
				}
			]
		});
	};

	this.checkDynamicItems = shelf => {
		const tabs = shelf.find('.prateleira-tabs__tabs');
		if (tabs.find('li').length === 1) {
			tabs.addClass('hideTab');
		}
	};

	this.init = () => {
		const interestingItems = $('.vitrine-ofertas-interesses'),
			dynamicItems = $('.vitrine-ofertas-alavancas');

		// Cria e estiliza vitrine para alavancas predefinidas
		if (this.check(interestingItems)) {
			this.createTabList(interestingItems);
			this.createShelf(interestingItems);
			this.prepareShelf(interestingItems);
			this.setIcons(interestingItems);
		} else {
			interestingItems.addClass('hide');
		}

		// Cria alavanca dinamica
		if (this.check(dynamicItems)) {
			this.createTabList(dynamicItems);
			this.checkDynamicItems(dynamicItems);
			this.createShelf(dynamicItems);
			this.prepareShelf(dynamicItems);
		} else {
			dynamicItems.addClass('hide');
		}
	};

	this.init();
});