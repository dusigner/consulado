// Forms
$('.launch-form').on('submit', function (e) {
    e.preventDefault();
    const feedback = $('.feedback-msg');
    // const agree = $(this)
    //     .find('#agree')
    //     .is(':checked');

    const produto = $(this).find('#produto-escolhido');
    const email = $(this).find('#email');

    const body = {
        email: email.val(),
        produto: produto.val()
    };

    // Validações
    if (body.email == '') {
        email.focus();
        feedback.text('por favor, preencha o e-mail corretamente');
    } else {
        const data = JSON.stringify(body);

        $.ajax({
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/vnd.vtex.ds.v10+json'
            },
            type: 'POST',
            url: '/api/dataentities/CL/documents',//Entidade no masterdata que armazena os Lead capturados no Formulário
            data: data,
            success: function (res) {
                email.val('');
                feedback.text('Dados enviados com sucesso!');
            }
        });
    }
});
