// Forms
$('.launch-form').on('submit', function (e) {
    e.preventDefault();

    const feedback = $('.feedback-msg');
    const feedbackSuccess = $('.feedback-msg-success');

    const inputs = $(this).find('.form-input')

    //get param skuId in Url
    const getParams = (name, href) => {

        if (!name) return false;

        href = href || window.location.href;
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");

        const regexS = "[\\?&]" + name + "=([^&#]*)";
        const regex = new RegExp(regexS);
        const results = regex.exec(href);

        if (results == null)
            return "";
        else
            return decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    //return skuId in url
    const getSkuJson = () => {
        const url = $('.buy-button-ref').attr('href')
        return getParams('sku', url)
    }

    const email = $(this).find('#email');

    const body = {
        email: email.val(),
        produto: getSkuJson(),
        pagina: 'Página de Produto'
    };

    // Validações
    if (body.email == '') {
        email.focus();
        feedback.css('display', 'block')
    } else {
        const data = JSON.stringify(body);

        $.ajax({
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/vnd.vtex.ds.v10+json'
            },
            type: 'POST',
            url: '/api/dataentities/TS/documents', //Entidade no masterdata que armazena os Lead capturados no Formulário
            data: data,
            success: function (res) {
                email.val('');
                inputs.remove()
                feedback.css('display', 'none')
                feedbackSuccess.css('display', 'block')
            }
        });
    }
});
