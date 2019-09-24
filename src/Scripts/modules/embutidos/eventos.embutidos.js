const Eventos = {
	init: () => {
		Eventos.hoverIMGS();
		Eventos.dotsInfo();
		Eventos.compreJunto();
	},
	// Hover event troca Img do componete
	hoverIMGS: () => {
		let CooktopInicial = '/arquivos/embutir_cooktop01.jpg';
		let CooktopSecundaria = '/arquivos/embutir_cooktop02.jpg';

		let FornoInicial = '/arquivos/embutir_forno01.jpg';
		let FornoSecundaria = '/arquivos/embutir_forno02.jpg';

		let CoifaInicial = '/arquivos/embutir_coifa01.jpg';
		let CoifaSecundaria = '/arquivos/embutir_coifa02.jpg';

		//Quando for mobile
		if ($(window).width() <= 768) {
			$('.box-img img').click(function() {
				let current = '/arquivos/' + this.src.split('/')[4].split('?')[0];
				switch (this.alt) {
				case 'Cooktops':
					if (current === CooktopInicial) {
						this.src = CooktopSecundaria;
					} else {
						this.src = CooktopInicial;
					}
					break;
				case 'Forno':
					if (current === FornoInicial) {
						this.src = FornoSecundaria;
					} else {
						this.src = FornoInicial;
					}

					break;
				case 'Coifa':
					if (current === CoifaInicial) {
						this.src = CoifaSecundaria;
					} else {
						this.src = CoifaInicial;
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
							this.src = CooktopSecundaria;
							this.className = '';
						}, 400);
						break;
					case 'Forno':
						this.className = 'transitioning-src';
						setTimeout(() => {
							this.src = this.src = FornoSecundaria;
							this.className = '';
						}, 400);
						break;
					case 'Coifa':
						this.className = 'transitioning-src';
						setTimeout(() => {
							this.src = CoifaSecundaria;
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
						this.src = CooktopInicial;
						break;
					case 'Forno':
						this.src = FornoInicial;
						break;
					case 'Coifa':
						this.src = CoifaInicial;
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
			imgMascara.attr('src', '/arquivos/embutir_ambientada1.jpg');
		});
	},
	compreJunto: () => {

		function formatReal( int ) {
			var tmp = int+'';
			tmp = tmp.replace(/([0-9]{2})$/g, ',$1');
			if( tmp.length > 6 )
				tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, '.$1,$2');
			return tmp;
		}

		function getMoney( str ) {
			return parseInt( str.replace(/[\D]+/g,'') );
		}

		let totalPor = 0;
		let valPor = 0;
		let totalDe = 0;
		let valDe = 0;
		//Carregamento

		$.map($('.de'),x => totalDe += getMoney(x.textContent));
		$.map($('.por'),x => totalPor += getMoney(x.textContent));
		totalPor = formatReal(totalPor);
		totalDe = formatReal(totalDe);
		$('.vitrine ul').append(`<li><h1>Comprando Junto</h1> <p class="de-final"> De: R$ ${totalDe}</p> <p class="por-final">Por: R$ ${totalPor}</p> <a class="btn-primary-button" >Ir para Carrinho</a></li>`);


		//Açoes
		$('.remove-item').click(x => {
			x.currentTarget.classList = 'remove-item';
			x.currentTarget.nextElementSibling.classList = 'add-item active';
			valPor = getMoney(x.currentTarget.nextElementSibling.nextElementSibling.children[1].childNodes[3].innerText);
			valDe = getMoney(x.currentTarget.nextElementSibling.nextElementSibling.children[1].childNodes[5].innerText);

			totalPor = getMoney(totalPor) - valPor
			totalDe = getMoney(totalDe) - valDe



		});
		$('.add-item').click(x => {
			x.currentTarget.classList = 'add-item';
			x.currentTarget.previousElementSibling.classList = 'remove-item active';
			// console.log('depois',x.currentTarget.nextElementSibling.nextElementSibling.children[1].childNodes[5]);
		});
	}
};

export default Eventos;
