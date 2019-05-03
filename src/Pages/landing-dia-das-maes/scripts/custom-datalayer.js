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

		$('#seu-jeitinho .box-produto').on('click', function() {
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

		$('body')
			.on('click', '#seu-jeitinho .slick-prev', function() {
				const currentCategory = $('#seu-jeitinho .tab button.-active').text();

				pushDataLayer(
					`Categoria ${currentCategory}`,
					'Clique seta esquerda',
					`Ver produtos para esquerda`
				);
			})
			.on('click', '#seu-jeitinho .slick-next', function() {
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

		$('#descontos .box-produto').on('click', function() {
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

		$('body')
			.on('click', '#descontos .slick-prev', function() {
				const currentCategory = $('#descontos .btn-tab.-active').text();

				pushDataLayer(
					`Categoria ${currentCategory}`,
					'Clique seta esquerda',
					`Ver produtos para esquerda`
				);
			})
			.on('click', '#descontos .slick-next', function() {
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
