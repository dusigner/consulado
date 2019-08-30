const Eventos = {

    // Seleção de cores - Conteúdo
	boxImg: $('.box-img'),

	init: () => {
		Eventos.eventos();
	},
	// Troca Img do componete
	eventos: () => {
		$('.box-img img').hover( function() {
			switch (this.alt) {
				case 'Cooktops':
						this.src = 'https://whirlpoolqa.vteximg.com.br/arquivos/ids/156814-1000-1000/1.jpg?v=635348480738770000.jpg';
					break;
				case 'Forno':
						this.src = 'https://whirlpoolqa.vteximg.com.br/arquivos/ids/156996-1000-1000/1.jpg?v=635348481380070000';
					break;
				case 'Coifa':
						this.src = 'https://whirlpoolqa.vteximg.com.br/arquivos/ids/161578-1000-1000/Consul_Coifa_CA090BR_Imagem_3_4_2_1000x1000.jpg?v=636928305562570000';
					break;
				default:
					break;
			}
		},
		function() {
			switch (this.alt) {
				case 'Cooktops':
						this.src = 'https://whirlpoolqa.vteximg.com.br/arquivos/ids/156814-1000-1000/1.jpg?v=635348480738770000.jpg';
					break;
				case 'Forno':
						this.src = 'http://consulqa.vtexlocal.com.br:3000/arquivos/ids/156994-1000-1000/1.jpg?v=635348481372370000?v=635348481372370000';
					break;
				case 'Coifa':
						this.src = 'https://whirlpoolqa.vteximg.com.br/arquivos/ids/161577-1000-1000/Consul_Coifa_CA090BR_Imagem_Frontal_1000x1000.jpg?v=636928305271570000';
					break;
				default:
					break;
			}
		})
	}
};

export default Eventos;
