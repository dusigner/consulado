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
				let current =
					'/arquivos/' + this.src.split('/')[4].split('?')[0];
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
					buttonA.attr( 'href', '/eletrodomesticos/cooktop' );
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
					buttonA.attr( 'href', '/eletrodomesticos/coifa-e-depurador' );
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
					buttonA.attr( 'href', '/eletrodomesticos/forno/forno-de-embutir' );
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
		//Carregamento
		let totalPor = 0;
		let valPor = 0;
		let totalDe = 0;
		let valDe = 0;
		let money = 0;
		let valMoney = 0;
		//Set SKU
		let skus = [];
		for (let i = 0; i < $('.combos-prateleira').length; i++) {
			skus.push({ cart: true, id: 666, sku: 666 });
		}
		$.map($('.combos-prateleira'), (data, index) => {
			skus[index].id = data.dataset.idproduto;
			getSkuByIdProduct(data.dataset.idproduto, index);
		});

		//Functions Custom
		function getSkuByIdProduct(productId, index) {
			var urlOrigin = window.origin || window.location.origin,
				apiUrl =
					urlOrigin +
					'/api/catalog_system/pub/products/search?fq=productId:' +
					productId;
			$.ajax({
				url: apiUrl,
				type: 'GET'
			})
				.then(function(data) {
					if (data[0].items.length <= 1) {
						skus[index].sku = data[0].items[0].itemId;
					} else {
						skus[index].sku = data[0].items.filter(x =>
							x.name.includes('110V')
						)[0].itemId;
					}
				})
				.fail(function(data) {
					return data;
				});
		}

		function formatReal(int) {
			var tmp = int + '';
			tmp = tmp.replace(/([0-9]{2})$/g, ',$1');
			if (tmp.length > 6)
				tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, '.$1,$2');
			return tmp;
		}

		function getMoney(str) {
			return parseInt(str.replace(/[\D]+/g, ''));
		}

		function setLink() {
			let linkSkus = '/checkout/cart/add?sc=3&redirect=true&';
			skus.map(n => {
				if (n.cart === true) {
					linkSkus += `sku=${n.sku}&qty=1&seller=1&`;
				}
			});

			if (linkSkus === '/checkout/cart/add?sc=3&redirect=true&') {
				$('.go').attr('href', linkSkus);
				$('.go').addClass('disable');
			} else {
				$('.go').attr('href', linkSkus);
				$('.go').removeClass('disable');
			}
		}
		function setStatusLinks(idProduto, operador) {
			skus.map(v => {
				if (v.id.toString() === idProduto) {
					v.cart = operador;
				}
			});
		}
		function checkAvista(totalPor,money) {
			if (getMoney(totalPor) !== money) {
				$('li .money-final').text(`À vista por R$ ${formatReal(money)}`);
			} else if(getMoney(totalPor) === money) {
				$('li .money-final').text('');
			}
		}
		//Valida se tem 3 produtos na vitrine
		if (skus.length >= 3) {
			//SetPirce on HTML
			$.map( $('.vitrine-comprejunto article .de .val'), x => totalDe += getMoney(x.textContent) );
			$.map( $('.vitrine-comprejunto article .por .val'), x => {totalPor += getMoney(x.textContent)} );
			$.map( $('.vitrine-comprejunto article .discount-boleto strong'), x => money += getMoney(x.textContent) );
			totalDe = formatReal(totalDe);
			totalPor = formatReal(totalPor);
			$('li .de-final').text(`De: R$ ${totalDe}`);
			$('li .por-final').text(`Por: R$ ${totalPor}`);
			checkAvista(totalPor,money);

			//Copia o elemento de fora e joga para dentro da vitrine;
			$('.vitrine-total').clone().appendTo('.vitrine-comprejunto .vitrine ul');
			$('.vitrine-comprejunto .vitrine ul .vitrine-total').removeClass('vitrine-total');
			$('.vitrine-total').remove();

			//Set Link on Button
			setTimeout(() => setLink(), 3000);

			//Action Add and Remove
			$('.remove-item').click(x => {
				x.currentTarget.classList = 'remove-item';
				x.currentTarget.nextElementSibling.classList = 'add-item active';
				//Price
				valDe = getMoney( x.currentTarget.nextElementSibling.nextElementSibling.children[2].innerText );
				valPor = getMoney( x.currentTarget.nextElementSibling.nextElementSibling.children[3].innerText );
				valMoney = getMoney( x.currentTarget.nextElementSibling.nextElementSibling.children[4].children[0].innerText );

				//Format and calculator price
				totalDe = formatReal(getMoney(totalDe) - valDe);
				totalPor = formatReal(getMoney(totalPor) - valPor);
				money = money - valMoney;

				//Set Price on HTML
				$('.de-final').text(`De: R$ ${totalDe}`);
				$('.por-final').text(`Por: R$ ${totalPor}`);
				checkAvista(totalPor,money);

				x.currentTarget.parentElement.classList.add('removido');
				//Set Link on Button
				setStatusLinks( x.currentTarget.parentElement.dataset.idproduto, false );
				setLink();
			});
			$('.add-item').click(x => {
				x.currentTarget.classList = 'add-item';
				x.currentTarget.previousElementSibling.classList = 'remove-item active';
				//Price
				valDe = getMoney( x.currentTarget.nextElementSibling.children[2].innerText );
				valPor = getMoney( x.currentTarget.nextElementSibling.children[3].innerText );
				valMoney = getMoney( x.currentTarget.nextElementSibling.children[4].children[0].innerText );

				//Format and calculator price
				totalDe = formatReal(getMoney(totalDe) + valDe);
				totalPor = formatReal(getMoney(totalPor) + valPor);
				money = money + valMoney;

				//Set Price on HTML
				$('.de-final').text(`De: R$ ${totalDe}`);
				$('.por-final').text(`Por: R$ ${totalPor}`);
				checkAvista(totalPor,money);

				x.currentTarget.parentElement.classList.remove('removido');
				//Set Link on Button
				setStatusLinks( x.currentTarget.parentElement.dataset.idproduto,true );
				setLink();
			});
		} else {
			$('.vitrine-comprejunto').addClass('hide');
		}
	}
};

export default Eventos;
