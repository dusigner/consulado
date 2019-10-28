import { pushDataLayer } from 'modules/_datalayer-inline';

Nitro.module('dataLayer-vitrine-embutidos', function() {

	this.removeCombo = () => {
		$('.remove-item').click(e => {
			pushDataLayer(
				`[CB-GOC] Vitrine  ${$('.category-title').text()}`,
				'Remover combo',
				e.currentTarget.parentElement.dataset.idproduto
			);
		});
	};

	this.addCombo = () => {
		$('.add-item').click(e => {
			pushDataLayer(
				`[CB-GOC] Vitrine  ${$('.category-title').text()}`,
				'Adicionar combo',
				e.currentTarget.parentElement.dataset.idproduto
			);
		});
	};

	this.buyCombo = () => {
		$('.go').click( () => {
			pushDataLayer(
				`[CB-GOC] Vitrine  ${$('.category-title').text()}`,
				'Compre junto',
				'Cozinha completa'
			);
		});
	};

	//Esse so pega os que estão no painel da VTEX
	this.pesquisaRelacionada = () => {
		$('.relacionado-list ul li a').click(e => {
			pushDataLayer(
				`[CB-GOC] Vitrine  ${$('.category-title').text()}`,
				'Pesquisas relacionadas',
				e.currentTarget.innerText
			);
		});
	};

	this.galleryImageChange = () => {
		$('.gallery').on('beforeChange', (event, slick, currentSlide, nextSlide) => {
			pushDataLayer(
				`[CB-GOC] Vitrine  ${$('.category-title').text()}`,
				'Banner Destaque',
				`Trocar Foto ${nextSlide + 1}`
			);
		});
	};

	this.buyBanner = () => {
		$('.product-buy').click(e => {
			pushDataLayer(
				`[CB-GOC] Vitrine  ${$('.category-title').text()}`,
				'Banner',
				'Comprar'
			);
		});
	};

	this.categoriaFiltor = () => {
		$('.category-list a').click(e => {
			pushDataLayer(
				`[CB-GOC] Vitrine  ${$('.category-title').text()}`,
				'Categoria Filtro',
				e.currentTarget.innerText
			);
		});
	};

	this.filtor = () => {
		$('.multi-search-checkbox').click(e => {
			pushDataLayer(
				`[CB-GOC] Vitrine  ${$('.category-title').text()}`,
				'Filtrar',
				e.currentTarget.value
			);
		});
	};

	this.init = () => {
		this.removeCombo();
		this.addCombo();
		this.buyCombo();
		this.pesquisaRelacionada();
		this.galleryImageChange();
		this.buyBanner();
		this.categoriaFiltor();
		this.filtor();
	};
});
