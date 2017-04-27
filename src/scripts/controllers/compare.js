/* global $:true, Nitro: true */
'use strict';

Nitro.controller('compare', function() {


	var removeArr = ['Manual do Produto', 'Voltagem', 'Mais Informações', 'Garantia do Fornecedor (mês)', 'Classificação Energética 220v', 'Classificação Energética 110v', 'Guia Rápido', 'Informações para Instalação'];

	$('.atributos').each(function(i, e) {
		var text = $(e).find('th').text();
		if ($.inArray(text, removeArr) > -1) {
			$(e).remove();
		}
	});

	$('tr.atributos th').filter(':contains(Features), :contains(In the Box), :contains(Especifications), :contains(Specifications)')
		.parent().remove();

	var text = $('tr[class*="atributos Módulo 1"]')[1];
	if (text) {
		$(text).css('visibility', 'visible')
			.show()
			.find('th')
			.text('Descritivo');
	}

	if ($(window).width() <= 768) {
		$('.corpo-comparacao thead>tr.remover').siblings('tr').find('th:first-child').insertBefore($('.corpo-comparacao thead>tr.remover'));
		$('.corpo-comparacao thead').children('th').html('Produtos Selecionados');
	}

});
