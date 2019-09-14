const Eventos = {
	init: () => {
		Eventos.hoverIMGS();
		Eventos.dotsInfo();
	},
	// Hover event troca Img do componete
	hoverIMGS: () => {
		let CooktopA =
			'https://consul.vteximg.com.br/arquivos/ids/191348-1000-1000/Consul_Cooktop_CD075AE_Imagem_Frontal.jpg';
		let CooktopB =
			'https://consul.vteximg.com.br/arquivos/ids/191349-1000-1000/Consul_Cooktop_CD075AE_Imagem_3_4.jpg';

		let FornoA =
			'https://consul.vteximg.com.br/arquivos/ids/193582-1000-1000/Consul_Forno_COB84AR_Imagem_Frontal_4.jpg';
		let FornoB = '/arquivos/embutir_forno02.png';

		let CoifaA =
			'https://consul.vteximg.com.br/arquivos/ids/164180-1000-1000/CA060BR-coifa-consul-piramidal-60-cm-perspectiva_1650x1450.jpg?v=635767864842200000';
		let CoifaB =
			'https://consul.vteximg.com.br/arquivos/ids/164179-1000-1000/CA060BR-coifa-consul-piramidal-60-cm-frontal_1650x1450.jpg?v=635767864275830000';

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
		let h1 = $('.box_texto h1');
		let p = $('.box_texto p');
		let box = $('.box_img');
		let box_pai = $('.embutidos-header');
		let back = $('.back');
		let img = $('.mascara');
		let plus = $('.plus');
		let buttonA = $('.embutidos-header a');

		let strH1Padrao = 'Uma cozinha planejada para o seu dia a dia';
		let strPPadrao =
			'Com a Linha de Embutir Consul, você tem uma cozinha mais bonita, moderna e que se adapta à sua decoração';

		let strH1Cooktop = 'Facilidade para a sua cozinha';
		let strPCooktop =
			'Fogões de mesa que valorizam o ambiente, para você que não quer complicação na hora de cozinhar.';

		let strH1forno = 'Preparos com mais facilidade';
		let strPforno =
			'Não é preciso se abaixar para acompanhar a receita no forno de embutir. Opções de forno elétrico e à gás.';

		let strH1Coifa = 'Livre de odores';
		let strPCoifa =
			'A solução de Linha de Embutir conta com coifas de parede que filtram o ar sujo e devolvem limpinho para o ambiente.';

		//Plus Button
		$('.box_img .plus').click(function() {
			switch (this.classList[1]) {
				case 'Cooktops':
					img.addClass('transitioning-src');
					plus.addClass('transitioning-src');
					back.addClass('transitioning-src');
					setTimeout(function() {
						img.removeClass('transitioning-src');
						plus.removeClass('transitioning-src');
						back.removeClass('transitioning-src');
						h1.text(strH1Cooktop);
						p.text(strPCooktop);
						buttonA.attr('href', '/eletrodomesticos/cooktop');
						buttonA.addClass('Cooktops');
						buttonA.text('Ver mais sobre Cooktops');
						back.addClass('Cooktops');
						box.removeClass('inicial');
						box.addClass('one');
						box_pai.addClass('one');
					}, 400);
					break;
				case 'Coifas/Depuradores':
					img.addClass('transitioning-src');
					plus.addClass('transitioning-src');
					back.addClass('transitioning-src');
					setTimeout(function() {
						img.removeClass('transitioning-src');
						plus.removeClass('transitioning-src');
						back.removeClass('transitioning-src');
						h1.text(strH1Coifa);
						p.text(strPCoifa);
						buttonA.attr(
							'href',
							'/eletrodomesticos/coifa-e-depurador'
						);
						buttonA.addClass('Coifas');
						buttonA.text('Ver mais sobre Coifas');
						back.addClass('Coifas');
						box.removeClass('inicial');
						box.addClass('two');
						box_pai.addClass('two');
					}, 400);

					break;
				case 'Fornos-Embutidos':
					img.addClass('transitioning-src');
					plus.addClass('transitioning-src');
					back.addClass('transitioning-src');
					setTimeout(function() {
						img.removeClass('transitioning-src');
						plus.removeClass('transitioning-src');
						back.removeClass('transitioning-src');
						h1.text(strH1forno);
						p.text(strPforno);
						buttonA.attr(
							'href',
							'/eletrodomesticos/forno/forno-de-embutir'
						);
						buttonA.addClass('Fornos-Embutidos');
						buttonA.text('Ver mais sobre Fornos');
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
			// box_texto.children('a').remove();
			buttonA.removeClass('Cooktops');
			buttonA.removeClass('Coifas');
			buttonA.removeClass('Fornos-Embutidos');
			buttonA.attr('href', '#');
			box_pai.removeClass('one');
			box_pai.removeClass('two');
			box_pai.removeClass('tree');
			setTimeout(function() {
				back.removeClass('Fornos-Embutidos');
				back.removeClass('Coifas');
				back.removeClass('Cooktops');
			}, 500);
		});
	}
};

export default Eventos;
