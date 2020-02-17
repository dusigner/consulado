import cacheSelector from './cache-selector.js';
import { pushDataLayer } from './../_datalayer-inline.js';

const El = cacheSelector.utils, { $document, wishButton, wishContainer, Wished } = El;

const wishTags = {
    init() {
        wishTags.startEvents();
    },

    startEvents() {
        $document.on('click', wishButton, ({currentTarget}) => {
            const $element = $(currentTarget),
            productID = $element.attr('data-idproduto');

            pushDataLayer(
                '[SQUAD] Meus Favoritos',
                !$element.parents(wishContainer).hasClass(Wished) ?
                    'Favoritado - Vitrine Categoria' :
                    'Desfavoritado - Vitrine Categoria',
                productID,
                'generic'
            );
        });
    }
}

export default wishTags;