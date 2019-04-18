class Tab {
	constructor(name) {
		this.$tabNavItems = $(`[data-tab-name=${name}] [data-tab-nav]`);
		this.$tabContentItems = $(`[data-tab-name=${name}] [data-tab-content]`);
	}

	init() {
		this.$tabNavItems.click((e) => {
			const targetName = $(e.currentTarget).data('tab-nav'),
				$content = this.$tabContentItems.filter(`[data-tab-content=${targetName}]`);

			this.$tabNavItems.removeClass('-active');
			$(e.currentTarget).addClass('-active');

			this.$tabContentItems.fadeOut(600);
			$content.delay(600).fadeIn( ()=> {
				$(window).trigger('Tab.changed', [$(e.currentTarget), $content]);
			});

		});
	}

}

export default Tab;
