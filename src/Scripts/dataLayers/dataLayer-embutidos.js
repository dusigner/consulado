import { pushDataLayer } from 'modules/_datalayer-inline';

Nitro.module('dataLayer-embutidos', function() {
	this.clickNav = () => {
		$('.nav-embutidos nav a').click(e => {
			pushDataLayer(
				'[CB-GOC] Página Built-in',
				'Clique banner',
				e.currentTarget.title
			);
		});
	};

	this.hoverImgs = () => {
		var timeout = null;
		$('.box-img').hover(
			function(e) {
				timeout = setTimeout(function() {
					pushDataLayer(
						'[CB-GOC] Página Built-in',
						'Mouse hover',
						e.currentTarget.classList[1]
					);
				}, 3000);
			},
			function() {
				clearTimeout(timeout);
			}
		);
	};

	this.clickNav = () => {
		$('.box-text').hover(e => {
			pushDataLayer(
				'[CB-GOC] Página Built-in',
				'Clique banner',
				e.currentTarget.title
			);
		});
	};

	this.clickLinkA = () => {
		$('.box-text a').click(e => {
			pushDataLayer(
				'[CB-GOC] Página Built-in',
				'Clique Botão',
				e.currentTarget.classList[1]
			);
		});
	};

	this.clickVideo = () => {
		$('.cervejeiras-videos__video ').click(e => {
			pushDataLayer(
				'[CB-GOC] Página Built-in',
				'Vídeo',
				'Assistiu video built-in'
			);
		});
	};

	this.clickDotsVideo = () => {
		$('.cervejeiras-videos-thumbs__item').click(e => {
			console.log(e.currentTarget.classList[1]);
			pushDataLayer(
				'[CB-GOC] Página Built-in',
				'Vídeo',
				e.currentTarget.classList[1]
			);
		});
	};

	this.clickLinkDicas = () => {
		$('.box_descricao a').click(e => {
			// dataLayer.push({ category, action, label, event });
			pushDataLayer(
				'[CB-GOC] Página Built-in',
				'Clique Botão',
				e.currentTarget.classList[1]
			);
		});
	};

	this.init = () => {
		this.clickNav();
		this.hoverImgs();
		this.clickLinkA();
		this.clickVideo();
		this.clickDotsVideo();
		this.clickLinkDicas();
	};
});
