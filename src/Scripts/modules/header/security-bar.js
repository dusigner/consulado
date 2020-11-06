'use strict';

Nitro.module('security-bar', function() {
	this.init = function () {
		const divSecurity = document.querySelectorAll('.security');

		if(divSecurity) {
			divSecurity.forEach(ds => {
				const btnClose = ds.querySelector('.security-close');

				if(btnClose) {
					btnClose.addEventListener('click', (e) => {
						e.preventDefault();
						ds.classList.add('animate__animated', 'animate__backOutRight');
						setTimeout(() => {
							ds.parentNode.removeChild(ds);
						}, 2000);
					})
				}
			});
		}
	};

	this.init();
});
