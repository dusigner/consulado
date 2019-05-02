/*
*
*
*
*/
import { pushDataLayer } from 'modules/_datalayer-inline';

Nitro.module('custom-datalayer', function() {

	this.init = () => {
		this.jeitinhoSection();
		this.descontoSection();
	};

	this.jeitinhoSection = () => {
		$('#seu-jeitinho .tab button').on('click', function() {
			pushDataLayer(
				`Categoria ${$(this).text()}`,
				'Clique na categoria',
				'Ver conteúdo do botão'
			);
		});

		$('#seu-jeitinho .box-produto').on('click', function(e) {
			e.preventDefault();

			const currentCategory = $('#seu-jeitinho .tab button.-active').text(),
				$this 	= $(this),
				nome 	= $this.find('.image').attr('title'),
				idProd 	= $this.attr('data-idproduto'),
				index	= $this.parent('li').index();

			pushDataLayer(
				`Categoria ${currentCategory}`,
				'Clique comprar produto',
				`${nome} + ${idProd} + Posicao ${index}`
			);
		});

		$('#seu-jeitinho .slick-prev').on('click', function() {
			const currentCategory = $('#seu-jeitinho .tab button.-active').text();

			pushDataLayer(
				`Categoria ${currentCategory}`,
				'Clique seta esquerda',
				`Ver produtos para esquerda`
			);
		});

		$('#seu-jeitinho .slick-next').on('click', function() {
			const currentCategory = $('#seu-jeitinho .tab button.-active').text();

			pushDataLayer(
				`Categoria ${currentCategory}`,
				'Clique seta direita',
				`Ver produtos para direita`
			);
		});
	};

	this.descontoSection = () => {
		$('#descontos .btn-tab').on('click', function() {
			const currentCategory = $(this).text();

			pushDataLayer(
				`${currentCategory}`,
				'Clique na categoria',
				`Ver conteúdo do botão`
			);
		});

		$('#descontos .box-produto').on('click', function(e) {
			e.preventDefault();

			const currentCategory = $('#descontos .btn-tab.-active').text(),
				$this 	= $(this),
				nome 	= $this.find('.image').attr('title'),
				idProd 	= $this.attr('data-idproduto'),
				index	= $this.parent('li').index();

			pushDataLayer(
				`Categoria ${currentCategory}`,
				'Clique comprar produto',
				`${nome} + ${idProd} + Posicao ${index}`
			);
		});

		$('#descontos .slick-prev').on('click', function() {
			const currentCategory = $('#descontos .btn-tab.-active').text();

			pushDataLayer(
				`Categoria ${currentCategory}`,
				'Clique seta esquerda',
				`Ver produtos para esquerda`
			);
		});

		$('#descontos .slick-next').on('click', function() {
			console.log('oi');
			const currentCategory = $('#descontos .btn-tab.-active').text();

			pushDataLayer(
				`Categoria ${currentCategory}`,
				'Clique seta direita',
				`Ver produtos para direita`
			);
		});
	};

	this.init();
});
