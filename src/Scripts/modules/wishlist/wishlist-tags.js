import cacheSelector from './cache-selector.js';
import { pushDataLayer } from './../_datalayer-inline.js';

const El = cacheSelector.utils, { $document, wishButton, wishButtonPDP, wishContainer, Wished, tabsMenu, sharedButton, productAnchor, productAnchorShared } = El;

const wishTags = {

	init() {
		wishTags.startEvents();
	},

	startEvents() {
		$document.on('click', wishButton, ({ currentTarget }) => {
			const $element = $(currentTarget);
			let	productID = $element.parents('.box-produto').find('.product_field_770 ul li').text();

			if(productID === '') {
				productID = $element.parents('.box-produto').data('idproduto');
			}

			if (window.location.href.indexOf('_secure/minhaconta') === -1) {
				pushDataLayer(
					'[SQUAD] Meus Favoritos',
					!$element.parents(wishContainer).hasClass(Wished) ?
						'Favoritado - Vitrine Categoria' :
						'Desfavoritado - Vitrine Categoria',
					productID,
					'generic'
				);
			} else {
				pushDataLayer(
					'[SQUAD] Meus Favoritos',
					'Minha Conta - Pag Favoritos',
					'Remover da Lista',
					'generic'
				);
			}
		});

		$document.on('click', tabsMenu, ({ currentTarget }) => {
			const $element = $(currentTarget),
				tabName = $element.text();

			pushDataLayer(
				'[SQUAD] Meus Favoritos',
				'Menu - Minha Conta',
				tabName,
				'generic'
			);
		});

		$document.on('click', sharedButton, () => {
			pushDataLayer(
				'[SQUAD] Meus Favoritos',
				'Minha Conta - Pag Favoritos',
				'Compartilhe sua Lista',
				'generic'
			);
		});

		$document.on('click', productAnchor, () => {
			pushDataLayer(
				'[SQUAD] Meus Favoritos',
				'Minha Conta - Pag Favoritos',
				'Clicar no produto',
				'generic'
			);
		});

		$document.on('click', productAnchorShared, () => {
			pushDataLayer(
				'[SQUAD] Meus Favoritos',
				'Pag Lista de Favoritos',
				'Clicar no produto',
				'generic'
			);
		});

		$document.on('click', wishButtonPDP, ({currentTarget}) => {
			let productID = $(currentTarget).data('idproduto');

			if (window.location.href.indexOf('_secure/minhaconta') === -1) {
				pushDataLayer(
					`PDP_vitrine_superior`,
					`clique`,
					`favoritar`,
					`generic`
				);
			} else {
				pushDataLayer(
					`PDP_vitrine_superior`,
					`clique`,
					`desfavoritar`,
					`generic`
				);
			}
		});
	}
}

export default wishTags;
