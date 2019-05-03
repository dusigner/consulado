
/**
 * click an element to GTM DataLayer
 * Place attr data-grm html element and add class js-track-gtm
 * example: class="js-track-gtm" data-gtm="Category|action|label|event"
 */
export const checkInlineDatalayers = () => {
	$('body').on('click', '.-js-track-gtm', function() {
		const gtmData = $(this).attr('data-gtm').split('|');
		parseDataLayer(gtmData);
	});
};

/**
 * Push an event to GTM DataLayer
 * @param {string} category the event category on GTM
 * @param {string} action the action event of the user on page to GTM
 * @param {string} label the label event of the event on GTM
 */
export const pushDataLayer = (category, action, label, event = 'generic') => dataLayer.push({ category, action, label, event });

const parseDataLayer = gtmData => pushDataLayer.apply(this, gtmData);
