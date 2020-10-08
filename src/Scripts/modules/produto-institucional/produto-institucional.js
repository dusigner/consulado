			var self = this,
			$reference = $('.reference'),
			$productSku = $('.productSku');

		//TROCA DE NOMES PRODUCT / SKUREF
		$(document)
			.on('skuSelected.vtex', function () {
				$reference.addClass('hide');
				$productSku.removeClass('hide');
			})
			.on('skuUnselected.vtex', function () {
				$productSku.addClass('hide');
				$reference.removeClass('hide');
			});

		$(document).ajaxComplete(function (e, xhr, settings) {
			if (/outrasformasparcelamento/.test(settings.url)) {
				self.valoresParcelas();
			}
		});

		$('input:radio').click(function () {
			$('#showVoltage').text($(this).val());
		}); // Mostra a a voltagem selecionada

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

if ( skuJson.available === true ) {
		$('.secure').show();
		$('body').addClass('produto-disponivel');
	} else {
		if ( !$('body').hasClass('product-outline') ) {
			$('body').addClass('produto-indisponivel');
			$('.calc-frete').hide();
			$('.secure').hide();
			$('.cta-containers').hide();
			$('.prod-more-info').hide();
		}
	}

//Opções de parcelamento
self.valoresParcelas = function () {
	var $valoresParcelas = $('.valores-parcelas'),
		$showParcelas = $valoresParcelas.find('.titulo-parcelamento'),
		$opcoesParcelamento = $valoresParcelas.find('.other-payment-method-ul'),
		installmentQuantity = skuJson.skus[0].installments;

	if (installmentQuantity === 1) {
		$('.formas-pagamento-container').css('display', 'none');
	}

	//title parcelas
	$(".titulo-parcelamento").html("Veja todas as formas de parcelamento");

	$opcoesParcelamento.find('li').each(function () {
		var $numeroParcelas = $(this).find('span:first-child'),
			numeroParcelas = $numeroParcelas.text().split('X')[0],
			$valorParcela = $(this).find('strong'),
			valorParcela = parseFloat(
				$valorParcela
					.text()
					.replace('.', '')
					.replace(',', '.')
					.split('R$')[1]
			),
			text = $numeroParcelas.text().replace('de', ''),
			precoTotal = parseFloat(numeroParcelas * valorParcela).toFixed(2);

		$(this).append(
			'<span class="valor-total">Total: R$ ' + precoTotal.toString().replace('.', ',') + '</span>'
		);
		$numeroParcelas.text(text);
		$valorParcela.text('de ' + $valorParcela.text());
	});

	// Exibe as opções de parcelamento
	$showParcelas.click(function () {
		$(this).parents('.formas-pagamento-container').toggleClass('is--active');
	});


	$('.select-voltage .select.skuList label').click(function () {
		$valoresParcelas.find('>p').slideUp();
		$opcoesParcelamento.slideUp();
	});
};

self.valoresParcelas();



//Cep
const $document = $(document),
	$cepInput = '#calculoFrete .prefixo input';
	$document.on('change', $cepInput, ({ currentTarget }) => {
	const $element = $(currentTarget);
		$element.val() ? $element.parent().addClass('has--cep') : $element.parent().removeClass('has--cep');
	});
	$(".cep-busca a").html("Não sabe o CEP?").attr("href","Não sabe o CEP?");

//setup modal
	$('a[data-modal]').on('click', ({ currentTarget }) => {
		const $element = $(currentTarget);
		$('#modal-' + $element.data('modal')).vtexModal();
	});
	$('.close-modal').on('click', () => $('#vtex-modal-tipo-entrega.vtex-modal').trigger('click'));
