const Eventos = {
	init: () => {
		Eventos.hoverIMGS();
		// Eventos.dotsInfo();
	},
	// Hover event troca Img do componete
	hoverIMGS: () => {
		let CooktopA =
			'https://consul.vteximg.com.br/arquivos/ids/191349-1000-1000/Consul_Cooktop_CD075AE_Imagem_3_4.jpg?v=636897174013430000';
		let CooktopB =
			'https://consul.vteximg.com.br/arquivos/ids/191348-1000-1000/Consul_Cooktop_CD075AE_Imagem_Frontal.jpg?v=636897173949000000';

		let FornoA =
			'https://whirlpoolqa.vteximg.com.br/arquivos/ids/156996-1000-1000/1.jpg?v=635348481380070000';
		let FornoB =
			'http://consulqa.vtexlocal.com.br:3000/arquivos/ids/156994-1000-1000/1.jpg?v=635348481372370000?v=635348481372370000';

		let CoifaA =
			'https://consul.vteximg.com.br/arquivos/ids/164180-1000-1000/CA060BR-coifa-consul-piramidal-60-cm-perspectiva_1650x1450.jpg?v=635767864842200000';
		let CoifaB =
			'https://consul.vteximg.com.br/arquivos/ids/164179-1000-1000/CA060BR-coifa-consul-piramidal-60-cm-frontal_1650x1450.jpg?v=635767864275830000';

		if ($(window).width() <= 768) {
			$('.box-img img').click(function() {
				switch (this.alt) {
					case 'Cooktops':
						if (this.src !== CooktopA && this.src !== CooktopB) {
							this.src = CooktopA;
						} else {
							if (this.src === CooktopA) {
								this.src = CooktopB;
							} else {
								this.src = CooktopA;
							}
						}
						break;
					case 'Forno':
						if (this.src !== FornoA && this.src !== FornoB) {
							this.src = FornoA;
						} else {
							if (this.src === FornoA) {
								this.src = FornoB;
							} else {
								this.src = FornoA;
							}
						}
						break;
					case 'Coifa':
						if (this.src !== CoifaA && this.src !== CoifaB) {
							this.src = CoifaA;
						} else {
							if (this.src === CoifaA) {
								this.src = CoifaB;
							} else {
								this.src = CoifaA;
							}
						}
						break;
					default:
						break;
				}
			});
		} else {
			$('.box-img img').hover(
				function() {
					switch (this.alt) {
						case 'Cooktops':
							this.className = 'transitioning-src';
							setTimeout(() => {
								this.src = CooktopA;
								this.className = '';
							}, 400);
							break;
						case 'Forno':
							this.className = 'transitioning-src';
							setTimeout(() => {
								this.src = this.src = FornoA;
								this.className = '';
							}, 400);
							break;
						case 'Coifa':
							this.className = 'transitioning-src';
							setTimeout(() => {
								this.src = CoifaA;
								this.className = '';
							}, 400);
							break;
						default:
							break;
					}
				},
				function() {
					switch (this.alt) {
						case 'Cooktops':
							this.src = CooktopB;
							break;
						case 'Forno':
							this.src = FornoB;
							break;
						case 'Coifa':
							this.src = CoifaB;
							break;
						default:
							break;
					}
				}
			);
		}
	}
	// dotsInfo: () => {
	// 	let h1 = $('.box_texto h1');
	// 	let p = $('.box_texto p');

	// 	let strH1Cooktop = 'Facilidade para a sua cozinha';
	// 	let strPCooktop = 'Fogões de mesa que valorizam o ambiente, para você que não quer complicação na hora de cozinhar.';

	// 	let strH1forno = 'Preparos com mais facilidade';
	// 	let strPforno = 'Não é preciso se abaixar para acompanhar a receita no forno de embutir. Opções de forno elétrico e à gás.';

	// 	let strH1Coifa = 'Livre de odores';
	// 	let strPCoifa = 'A solução de Linha de Embutir conta com coifas de parede que filtram o ar sujo e devolvem limpinho para o ambiente.';

	// 	$('.box_img .plus').click(function() {
	// 		switch (this.classList[1]) {
	// 			case 'cooktop':
	// 					h1.text(strH1Cooktop);
	// 					p.text(strPCooktop);
	// 				break;
	// 			case 'coifa':
	// 					h1.text(strH1Coifa);
	// 					p.text(strPCoifa);
	// 				break;
	// 			case 'forno':
	// 					h1.text(strH1forno);
	// 					p.text(strPforno);
	// 				break;

	// 			default:
	// 				break;
	// 		}
	// 	})
	// }
};

export default Eventos;
