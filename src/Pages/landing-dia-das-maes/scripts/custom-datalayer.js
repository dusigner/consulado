/*
*
*
*
*/
import { pushDataLayer } from 'modules/_datalayer-inline';

Nitro.module('custom-datalayer', function() {

	this.init = () => {
		this.jeitinhoSection();

		console.log('oi');

	};

	this.jeitinhoSection = () => {
		$('#seu-jeitinho .tab button').on('click', function() {
			pushDataLayer(`Categoria ${$(this).text()}`, 'Clique na categoria', 'Ver conteúdo do botão');
		});

		$('#seu-jeitinho .box-produto').on('click', function(e) {
			e.preventDefault();

			const currentCategory = $('#seu-jeitinho .tab button.-active').text(),
				$this 	= $(this),
				nome 	= $this.find('.image').attr('title'),
				idProd 	= $this.attr('data-idproduto'),
				index	= $this.parent('li').index();

			pushDataLayer(`Categoria ${currentCategory}`, 'Clique comprar produto', `${nome} + ${idProd} + Posicao ${index}`);
		});
	};

	this.init();
});
