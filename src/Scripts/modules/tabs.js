
/**
 * Class to create a Tab Module
 *
 * @class Tab
 */
class Tab {

	/**
	 * Creates an instance of Tab.
	 * @param {String} name Name of Tab Module
	 * @memberof Tab
	 */
	constructor(name) {
		this.$tabNavItems = $(`[data-tab-name=${name}] [data-tab-nav]`);
		this.$tabContentItems = $(`[data-tab-name=${name}] [data-tab-content]`);
	}

	/**
	 * Init Tab
	 *
	 * @memberof Tab
	 */
	init() {
		this.$tabNavItems.click((e) => {
			const targetName = $(e.currentTarget).data('tab-nav'),
				$content = this.$tabContentItems.filter(`[data-tab-content=${targetName}]`),
				prevNav = this.$tabNavItems.filter('.-active').data('tab-nav'),
				$prevContent = this.$tabContentItems.filter(`[data-tab-content=${prevNav}]`);

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
