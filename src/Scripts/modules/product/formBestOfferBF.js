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
    const validateEmail = email => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };
    if (body.email == '') {
        email.focus();
        feedback.css('display', 'block')
    } else if (!validateEmail($('#email').val())) {
        feedback.css('display', 'block').show(500);
    } else {
        $.ajax({
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/vnd.vtex.ds.v10+json'
            },
            type: 'POST',
            url: '/api/dataentities/TS/documents',
            data: JSON.stringify(body),
            success: function (res) {
                email.val('');
                inputs.remove()
                feedback.css('display', 'none')
                feedbackSuccess.css('display', 'block')

                dataLayer.push({
                    event: 'generic',
                    category: 'black_friday_2020',
                    action: 'pdp_captação_lead',
                    label: 'click_email_cadastrado'
                });

            }
        });
    }
});
