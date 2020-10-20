// Forms
$('.launch-form').on('submit', function (e) {
    e.preventDefault();

    const feedback = $('.feedback-msg');
    const feedbackSuccess = $('.feedback-msg-success');

    const inputs = $(this).find('.form-input')

    const produto = $(this).find('#produto-escolhido').attr('data-idproduto');
    const email = $(this).find('#email');

    const body = {
        email: email.val(),
        produto: produto.val()
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
            url: '/api/dataentities/LC/documents', //Entidade no masterdata que armazena os Lead capturados no Formulário
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
