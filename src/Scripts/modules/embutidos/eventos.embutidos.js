const Eventos = {
	init: () => {
		Eventos.hoverIMGS();
		Eventos.dotsInfo();
	},
	// Hover event troca Img do componete
	hoverIMGS: () => {
		let CooktopA = '/arquivos/embutir_cooktop01.jpg';
		let CooktopB = '/arquivos/embutir_cooktop02.jpg';

		let FornoA = '/arquivos/embutir_forno01.jpg';
		let FornoB = '/arquivos/embutir_forno02.jpg';

		let CoifaA = '/arquivos/embutir_coifa01.jpg';
		let CoifaB = '/arquivos/embutir_coifa02.jpg';

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
		let imgMascara = $('.mascara img');

		let strH1Padrao = 'Uma cozinha planejada para o seu dia a dia';
		let strPPadrao =
			'Com a Linha de Embutir Consul, você tem uma cozinha mais bonita, moderna e que se adapta à sua decoração';

		let strH1Cooktop = 'Facilidade para a sua cozinha';
		let strPCooktop =
			'Fogões de mesa que valorizam o ambiente, para você que não quer complicação na hora de cozinhar';

		let strH1forno = 'Preparos com mais facilidade';
		let strPforno =
			'Alie conforto e organização dentro da sua cozinha: o eletrodoméstico se adapta à sua decoração, e não o contrário';

		let strH1Coifa = 'Livre de odores';
		let strPCoifa =
			'Dê o toque final de beleza à sua cozinha e mantenha o ar livre de odores desagradáveis, além de limpar a gordura do cozimento';

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
						imgMascara.attr(
							'src',
							'/arquivos/embutir_zoom_cooktop.jpg'
						);
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
						imgMascara.attr(
							'src',
							'/arquivos/embutir_zoom_coifa.jpg'
						);
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
						imgMascara.attr(
							'src',
							'/arquivos/embutir_zoom_forno.jpg'
						);
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
			imgMascara.attr('src', '/arquivos/embutir_ambientada1.png');
		});
	}
};

export default Eventos;
