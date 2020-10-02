$('.container-cards').slick({
    dots: false,
    infinite: false,
    speed: 300,
    arrows: false,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [{
        breakpoint: 375,
        settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true,
            dots: true
        }
    }]
});

	this.init = () => {
		this.caracteristicas();
	};

	this.caracteristicas = () => {
		$('.caracteristicas-lp').append(`<h1 id='caracteristicas-nome'></h1>
		<p id='caracteristicas-preco-de'></p>
		<p id='caracteristicas-preco-para'></p>
		<p id='caracteristicas-comprar'></p>`);

		fetch('/api/catalog_system/pub/products/search/geladeira-consul-frost-free-duplex-397-litros-evox-com-freezer-embaixo-cre44ak/p')
			.then(response =>  response.json())
			.then(result => {
				$("#caracteristicas-nome").html(result[0].items[0].nameComplete);
				$("#caracteristicas-preco-de").html(result[0].items[0].sellers[0].commertialOffer.ListPrice);
				$("#caracteristicas-preco-para").html(result[0].items[0].sellers[0].commertialOffer.Price);
				const link = result[0].items[0].sellers[0].addToCartLink;
				$("#caracteristicas-comprar").attr('href',`${link}`);
				})
			.catch(function(error) {
				console.log('Error: ' + error.message);
			});

		}
	this.init();

