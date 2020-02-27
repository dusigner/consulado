const Utils = {
    async dataBaseFetch(userEmail) {
        try {
            return $.ajax({
                url: `/api/dataentities/WL/search?email=${userEmail}&_fields=id,productReference`,
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    'Content-type': 'application/json',
                },
                cache: false
            });
        } catch (err) {
            throw new Error('Ocorreu um erro ao favoritar esse produto :( ' + err);
        }
    },

    patchVariantFetch(listID, userEmail, arr) {
        try {
            return $.ajax({
                    headers: {
                        'Accept': 'application/vnd.vtex.ds.v10+json',
                        'Content-Type': 'application/json'
                    },
                    url: '/api/dataentities/WL/documents',
                    async: true,
                    crossDomain: true,
                    type: 'PUT',
                    data: JSON.stringify({ id: String(listID), email: userEmail, productReference: Utils.arrayFormat(arr)}),
                    cache: false
                });
        } catch (err) {
            throw new Error('Ocorreu um erro ao favoritar esse produto :( ' + err);
        }
    },

    arrayFormat(arr) {
        return String(arr).charAt(0) === ',' ? String(arr).substr(1) : String(arr);
    },

    changingEvent(elementSelector) {
        if(window.location.pathname.indexOf('/_secure/') === -1) {
            if (!elementSelector.parents('.wishlist__container').hasClass('wished')) {
                elementSelector
                    .parents('.wishlist__container')
                    .removeClass('loading')
                    .addClass('wished')
                    .find('.wishlist__button')
                    .attr('title', 'Remover dos favoritos')
                    .append('<span><strong>Adicionado</strong> aos favoritos</span>')
                    .find('span').first().remove();
            } else {
                elementSelector
                    .parents('.wishlist__container')
                    .removeClass('loading')
                    .removeClass('wished')
                    .find('.wishlist__button')
                    .attr('title', 'Adicionar aos favoritos')
                    .append('<span>Adicionar aos favoritos</span>')
                    .find('span').first().remove();
            }
        } else {
            elementSelector
            .parents('.order__favoritos').remove();
        }
    }
}

module.exports = Utils;