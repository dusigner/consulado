class Tab {
	constructor(name) {
		this.$tabNavItems = $(`[data-tab-name=${name}] [data-tab-nav]`);
		this.$tabContentItems = $(`[data-tab-name=${name}] [data-tab-content]`);
	}

	init() {
		this.$tabNavItems.click((e) => {
			const targetName = $(e.currentTarget).data('tab-nav'),
				$content = this.$tabContentItems.filter(`[data-tab-content=${targetName}]`),
				$prevContent = this.$tabContentItems.filter(`[data-tab-content=${this.$tabNavItems.filter('.-active').data('tab-nav')}]`);

			this.$tabNavItems.removeClass('-active');
			$(e.currentTarget).addClass('-active');

			$(window).trigger('Tab.willChange', [$(e.currentTarget), $prevContent, $content]);
			this.$tabContentItems.fadeOut(600);
			$content.delay(600).fadeIn( ()=> {
				$(window).trigger('Tab.changed', [$(e.currentTarget), $content]);
			});

		});
	}

}

export default Tab;
