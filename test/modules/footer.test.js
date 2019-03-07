/* global fixture: true, expect: true, beforeAll: true */
'use strict';

import 'vendors/jquery.debounce';
import 'modules/footer.js';

/*
 * Unit tests for src/Scripts/modules/footer.js
 */

describe('Footer Module', () => {

	let $selectors,
		footerModule;

	beforeAll(() => {
		fixture.setBase('src/01 - HTML Templates/Sub Templates');
	});

	// inject the HTML fixture for the tests
	beforeEach(() => {
		fixture.load('0-consul-footer.html');

		$selectors = {
			$window: $(window),
			$htmlBody: $('html, body'),
			$toTop: $('.bt-gototop')
		};

		footerModule = window.Nitro.module('footer');
	});

	// remove the html fixture from the DOM
	afterEach(() => {
		document.body.style.height = 'auto';
		window.scrollTo(0, 0);
		fixture.cleanup();
		footerModule = $selectors = null;
	});

	it('should show arrow "go to top" when hit 561px on window scroll', done => {

		document.body.style.height = '10000px';
		window.scrollTo(0, 561);

		setTimeout(() => {

			const arrowHasHide = $selectors.$toTop
				.hasClass('hide');

			expect(arrowHasHide).toBe(false);
			done();

		});
	});

	it('should hide arrow "go to top" when less than 561px on window scroll', done => {

		document.body.style.height = '10000px';
		window.scrollTo(0, 559);

		setTimeout(() => {

			const arrowHasHide = $selectors.$toTop
				.hasClass('hide');

			expect(arrowHasHide).toBe(true);
			done();

		});
	});

	it('should go to top when click in "bt-gototop" arrow', done => {

		document.body.style.height = '10000px';
		window.scrollTo(0, 561);
		$selectors.$toTop.trigger('click');

		setTimeout(() => {

			const scrollTopPosition = $selectors.$window
				.scrollTop();

			expect(scrollTopPosition).toEqual(0);
			done();

		}, 601);
	});
});
