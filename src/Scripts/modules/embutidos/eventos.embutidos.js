const Eventos = {
	init: () => {
		Eventos.hoverIMGS();
		Eventos.dotsInfo();
	},
	// Hover event troca Img do componete
	hoverIMGS: () => {
		let CooktopA = 'https://consul.vteximg.com.br/arquivos/ids/191349-1000-1000/Consul_Cooktop_CD075AE_Imagem_3_4.jpg?v=636897174013430000';
		let CooktopB = 'https://consul.vteximg.com.br/arquivos/ids/191348-1000-1000/Consul_Cooktop_CD075AE_Imagem_Frontal.jpg?v=636897173949000000';

		let FornoA = 'https://whirlpoolqa.vteximg.com.br/arquivos/ids/156996-1000-1000/1.jpg?v=635348481380070000';
		let FornoB = 'http://consulqa.vtexlocal.com.br:3000/arquivos/ids/156994-1000-1000/1.jpg?v=635348481372370000?v=635348481372370000';

		let CoifaA = 'https://consul.vteximg.com.br/arquivos/ids/164180-1000-1000/CA060BR-coifa-consul-piramidal-60-cm-perspectiva_1650x1450.jpg?v=635767864842200000';
		let CoifaB = 'https://consul.vteximg.com.br/arquivos/ids/164179-1000-1000/CA060BR-coifa-consul-piramidal-60-cm-frontal_1650x1450.jpg?v=635767864275830000';

		//Quando for mobile
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
			//Quando for Desktop
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
	},
	dotsInfo: () => {
		let box_texto = $('.box_texto');
		let h1 = $('.box_texto h1');
		let p = $('.box_texto p');
		let box = $('.box_img');
		let box_pai = $('.embutidos-header');
		let back = $('.back');
		let img = $('.mascara');
		let plus = $('.plus');

		let strH1Padrao = 'Uma cozinha que se encaixa no seu dia-a-dia';
		let strPPadrao = 'Com a solução embutida, você economiza tempo ao se livrar dos eternos cantos engordurados.';

		let strH1Cooktop = 'Facilidade para a sua cozinha';
		let strPCooktop = 'Fogões de mesa que valorizam o ambiente, para você que não quer complicação na hora de cozinhar.';

		let strH1forno = 'Preparos com mais facilidade';
		let strPforno = 'Não é preciso se abaixar para acompanhar a receita no forno de embutir. Opções de forno elétrico e à gás.';

		let strH1Coifa = 'Livre de odores';
		let strPCoifa = 'A solução de Linha de Embutir conta com coifas de parede que filtram o ar sujo e devolvem limpinho para o ambiente.';

			//Plus Button
		$('.box_img .plus').click(function() {
			switch (this.classList[1]) {
				case 'cooktop':
					//<Animação>
					img.addClass('transitioning-src');
					plus.addClass('transitioning-src');
					back.addClass('transitioning-src');
					setTimeout(function() {
						img.removeClass('transitioning-src');
						plus.removeClass('transitioning-src');
						back.removeClass('transitioning-src');
					//</Animação>
						h1.text(strH1Cooktop);
						p.text(strPCooktop);
						box_texto.append(
							'<a href="/eletrodomesticos/cooktop" class="btn-primary-button Cooktops">Ver mais sobre Cooktop</a>'
						);
						back.addClass('Cooktops');
						box.removeClass('inicial');
						box.addClass('one');
						box_pai.addClass('one');
					}, 400);
					break;
				case 'coifa':
					//<Animação>
					img.addClass('transitioning-src');
					plus.addClass('transitioning-src');
					back.addClass('transitioning-src');
					setTimeout(function() {
						img.removeClass('transitioning-src');
						plus.removeClass('transitioning-src');
						back.removeClass('transitioning-src');
					//</Animação>
						h1.text(strH1Coifa);
						p.text(strPCoifa);
						box_texto.append(
							'<a href="/eletrodomesticos/coifa-e-depurador" class="btn-primary-button Coifas">Ver mais sobre Coifas</a>'
						);
						back.addClass('Coifas');
						box.removeClass('inicial');
						box.addClass('two');
						box_pai.addClass('two');
					}, 400);

					break;
				case 'forno':
					//<Animação>
					img.addClass('transitioning-src');
					plus.addClass('transitioning-src');
					back.addClass('transitioning-src');
					setTimeout(function() {
						img.removeClass('transitioning-src');
						plus.removeClass('transitioning-src');
						back.removeClass('transitioning-src');
					//</Animação>
						h1.text(strH1forno);
						p.text(strPforno);
						box_texto.append(
							'<a href="/eletrodomesticos/forno/forno-de-embutir" class="btn-primary-button Fornos-Embutidos">Ver mais sobre Fornos</a>'
						);
						back.addClass('Fornos-Embutidos');
						box.removeClass('inicial');
						box.addClass('tree');
						box_pai.addClass('tree');
					}, 400);
					break;
				default:
					break;
			}
		});

		//Seta Back
		$('.box_img .back').click(function() {
			h1.text(strH1Padrao);
			p.text(strPPadrao);
			box.removeClass('one');
			box.removeClass('two');
			box.removeClass('tree');
			box.addClass('inicial');
			box_texto.children('a').remove();
			box_pai.removeClass('one');
			box_pai.removeClass('two');
			box_pai.removeClass('tree');
			back.removeClass('Fornos-Embutidos');
			back.removeClass('Coifas');
			back.removeClass('Cooktops');
		});
	}
};

export default Eventos;
