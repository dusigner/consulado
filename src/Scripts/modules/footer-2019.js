/* global $: true, Nitro: true */
'use strict';

Nitro.module('footer-2019', function() {
	const $window = $(window);
	const $canaisAtendimentoTtitle = $('.canais-atendimento__title');
	const $openMobileNewsletter = $('.open-mobile-newsletter');
	const $leadNewsletter = $('.lead-newsletter');
	const $footer = $('footer');
	const $toTop = $('.bt-gototop');

	const footer = {};

	footer.init = () => {
		footer.toogleAtendimento();
		footer.toogleNewsletterMobile();
		footer.animateScrollTop();
		footer.tageamento();
	};

	footer.toogleAtendimento = () => {
		$canaisAtendimentoTtitle.click(function() {
			$(this)
				.parent()
				.toggleClass('is--active');
		});
	};

	footer.toogleNewsletterMobile = () => {
		$openMobileNewsletter.click(function() {
			$leadNewsletter.toggleClass('is--mobile-active');

			if ($leadNewsletter.hasClass('success')) {
				setTimeout(() => {
					$leadNewsletter.removeClass('success');
				}, 700);
			}
		});
	};

	//BACK TO TOP
	footer.animateScrollTop = () => {
		var reachBottom = 0;

		$window
			.scroll(function() {
				if ($window.scrollTop() >= 560) {
					$toTop.removeClass('hide');
					reachBottom = $footer.offset().top - $window.scrollTop() - $window.height() - 80;
					if (reachBottom < 0) {
						$toTop.css('bottom', 10 + Math.abs(reachBottom));
					} else {
						$toTop.css('bottom', 10);
					}
				} else {
					$toTop.addClass('hide');
				}
			})
			.scroll();

		$toTop.click(function() {
			$('html, body').animate({ scrollTop: 0 }, 600);
		});
	};

	// # Tagueamento
	footer.tageamento = () => {
		// Footer
		const $footer = $('.footer-2019');

		// Atendimento Consul
		$footer.find('a[title="Acessar chat"]').click(function() {
			dataLayer.push({
				event: 'visualTrackingClick',
				category: 'Atendimento loja consul',
				action: 'Ajuda online',
				label: 'Acessar chat'
			});
		});

		$footer.find('a[title="Acompanhar pedido"]').click(function() {
			dataLayer.push({
				event: 'visualTrackingClick',
				category: 'Atendimento loja consul',
				action: 'Ajuda online',
				label: 'Acompanhar pedido'
			});
		});

		$footer.find('a[title="Fazer solicitação"]').click(function() {
			dataLayer.push({
				event: 'visualTrackingClick',
				category: 'Atendimento loja consul',
				action: 'Meus Pedidos ',
				label: 'Fazer solicitação '
			});
		});

		// Acesse ajuda online
		$footer.find('a[title="Acesse a Ajuda Online"]').click(function() {
			dataLayer.push({
				event: 'visualTrackingClick',
				category: 'Footer',
				action: 'Canais de atendimento',
				label: 'Acesse a Ajuda Online'
			});
		});

		// Envie sua mensagem
		$footer.find('a[title="Envie sua mensagem"]').click(function() {
			dataLayer.push({
				event: 'visualTrackingClick',
				category: 'Footer',
				action: 'Canais de atendimento',
				label: 'Envie sua mensagem'
			});
		});

		// vendas corporativas
		$footer.find('a[title="Vendas Corporativas"]').click(function() {
			dataLayer.push({
				event: 'visualTrackingClick',
				category: 'Footer',
				action: 'Vendas Coorporativas',
				label: 'Veja mais'
			});
		});

		// Dúvidas mais frequentes
		$footer.find('a[title="Tenho direito a me arrepender da compra?"]').click(function() {
			dataLayer.push({
				event: 'visualTrackingClick',
				category: 'Footer',
				action: 'Dúvidas mais frequentes',
				label: 'Tenho direito a me arrepender da compra?'
			});
		});

		$footer.find('a[title="Como acompanho a entrega dos meus produtos?"]').click(function() {
			dataLayer.push({
				event: 'visualTrackingClick',
				category: 'Footer',
				action: 'Dúvidas mais frequentes',
				label: 'Como acompanho a entrega dos meus produtos?'
			});
		});

		$footer.find('a[title="Como funciona o Seguro Garantia Estendida Original?"]').click(function() {
			dataLayer.push({
				event: 'visualTrackingClick',
				category: 'Footer',
				action: 'Dúvidas mais frequentes',
				label: 'Como funciona o Seguro Garantia Estendida Original?'
			});
		});

		// Ver todas as dúvidas
		$footer.find('a[title="Ver todas as dúvidas"]').click(function() {
			dataLayer.push({
				event: 'visualTrackingClick',
				category: 'Footer',
				action: 'Dúvidas mais frequentes',
				label: 'ver todas as dúvidas'
			});
		});

		// Termos e política de privacidade
		$footer.find('a[title="Política de privacidade"]').click(function() {
			dataLayer.push({
				event: 'visualTrackingClick',
				category: 'Footer',
				action: 'Termos e Politicas de Privacidade',
				label: 'Política de privacidade'
			});
		});

		$footer.find('a[title="Termos de Uso"]').click(function() {
			dataLayer.push({
				event: 'visualTrackingClick',
				category: 'Footer',
				action: 'Termos e Politicas de Privacidade',
				label: 'Termos de Uso'
			});
		});
	};

	footer.init();
});
