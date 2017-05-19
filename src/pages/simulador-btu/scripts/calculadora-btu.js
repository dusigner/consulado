 /* eslint-disable */
 /* global Nitro: true, $: true */

'use strict';

jQuery( function () {
	var etapa = new Etapa(),
		config = new Config();
	// TODO:
	// Slicks devem ser desmontados/montados ao virar o Ipad
	// Etapa 3, mostrar as fotos sobrepostas de acordo os dados coletados
	// calculo dos BTU's
	// Função que adiciona uma classe do data-animation antes de mudar de etapa

	/* Etapas da animação
		etapa 1--- Ambientação
			etapa 1 --- Intro ( inicia Slide )
			etapa 1.1 --- Descobrir Moradia
			etapa 1.2 --- Descobrir Comodo
		etapa 2 --- Ambiente (detalhes do comodo)
			etapa 2.1 --- Descobrir tamanho do comodo
			etapa 2.2 --- Descobrir exposição ao Sol
			etapa 2.3 --- Descobrir qtd janelas
			etapa 2.4 --- Descobrir se tem Cortinas
			etapa 2.5 --- Descobrir qtd de pessoas
			etapa 2.6 --- Descobrir qtd de aparelhos elétricos
			etapa 2.7 --- Descobrir Lâmpadas
			Etapa 2.8 --- LOADING ( necessário ? )
		etapa 3 --- Resultado */
	// Construtores
	if ( config.dispositivo() == 'desktop' ) {

		var targetNodes 		= jQuery('.moradia, .comodo');
		var MutationObserver    = window.MutationObserver || window.WebKitMutationObserver;
		var myObserver          = new MutationObserver (mutationHandler);
		var obsConfig           = { attributes: true };

		//--- Add a target node to the observer. Can only add one node at a time.
		targetNodes.each ( function () {
			myObserver.observe (this, obsConfig);
		} );

		function mutationHandler (mutationRecords) {
			mutationRecords.forEach ( function (mutation) {
				if (typeof mutation.removedNodes == "object") {
					var jq = jQuery(mutation.target);
					if (jq.hasClass('ativo')){
						setTimeout(function(){ jq.find('.slide').addClass('hover'); }, 2500);
					} else {
						jq.find('.slide').removeClass('hover');
					}
				}
			} );
		}
	}
	// iniciando a calculadora
	etapa.iniciar();

	// Controles dos inputs numéricos
	jQuery( '.btn-conta' ).on( 'click', function () {
		// pai
		var _fieldset = jQuery( this ).parents( 'fieldset' );
		// input
		var _input = jQuery( 'input[type="text"]', _fieldset ).first();
		// botão menos
		var _menos = jQuery( '.-menos', _fieldset );
		// botão mais
		var _mais = jQuery( '.-mais', _fieldset );
		// de quanto em quanto pular
		var _step = parseFloat( '0' + _input.data( 'step' ) ); if ( !_step ) _step = 1;
		// aumentar ou diminuir?
		if ( jQuery( this ).hasClass( '-menos' ) ) _step *= -1;
		// colocar um texto (unidade de medida) depois do número
		var _suffix = _input.data( 'suffix' );
		// mínimo
		var _min = _input.data( 'min' ); if ( !_min ) _min = 0;
		// máximo
		var _max = _input.data( 'max' );
		// botão seguinte
		var _btn_seg = _fieldset.siblings( '.navegacao' ).find( '.btn-seg' );
		// habilita botão menos
		_menos.attr( 'disabled', false );
		// habilita botão mais
		_mais.attr( 'disabled', false );
		// valor atual
		var _valor = _input.val();
		// arranca sufixo
		if ( _suffix ) _valor = _valor.replace( _suffix, '' );
		// transforma em número
		_valor = parseFloat( '0' + _valor );
		// calcula o novo valor (aumentando ou diminuindo o valor atual)
		var _novo_valor = _valor + _step;
		// se for menos que o mínimo
		if ( _novo_valor <= _min ) {
			// deixa o mínimo
			_novo_valor = _min;
			// desabilita botão menos
			_menos.attr( 'disabled', 'disabled' );
		}
		// se houver máximo, e for mais que o máximo
		if ( ( _max !== null ) && ( _novo_valor >= _max ) ) {
			// deixa o máximo
			_novo_valor = _max;
			// desabilita botão mais
			_mais.attr( 'disabled', 'disabled' );
		}
		// atribui novo valor e concatena o sufixo, se houver
		_input.val( _novo_valor + ( _suffix ? _suffix : '' ) );
		// verifica se os campos obrigatorios estão preenchidos
		if ( config.verifica_obrigatorios() ) {
			_btn_seg.removeClass( 'disabled' );
		} else {
			_btn_seg.addClass( 'disabled' );
		}
		// mostra/esconde os itens relacionados
		if ( _input.data( 'controle' ) ) {
			config.controle_itens( _input.attr( 'name' ), _novo_valor, 'numerico' );
		}
		return false;
	} );


	// Clicks e Eventos
	jQuery( '.introducao .btn-init, .btn-seg, .ambiente .-periodo fieldset button' ).on( 'click', function(){
		if( !jQuery( this ).hasClass( 'disabled' ) && (! jQuery( 'body' ).hasClass( 'animando' ) ) ){
			if ( jQuery( this ).hasClass( 'btn-ult' ) ) {
				// pegando o resultado - valor do btu indicado
				var resultado = config.calular_produto();
				// setando o valor indicado na caixinha roxa
				config.set_resultado_btu( resultado.btu );
				// construindo link para os produtos indicados
				config.constroi_link( resultado );
			}

			if ( jQuery( this ).hasClass( 'btn-init' ) ) {
				jQuery( '.ambientacao .introducao' ).on( 'animationend', function() {
					jQuery( 'body' ).removeClass( 'animando' );
				} );
				jQuery( 'body' ).addClass( 'animando' );
			}
			etapa.seguinte();
		}
	} );

	// click no botão "anterior"
	jQuery( '.btn-ant' ).on( 'click', function() {
		if( !jQuery( this ).hasClass( 'disabled' ) && (! jQuery( 'body' ).hasClass( 'animando' ) ) ){
			etapa.anterior();
		}
	} );

	// Click em Recomeçar
	jQuery( 'button.recomecar' ).on( 'click', function() {
		// limpando os radios
		jQuery( '[type="radio"]' ).each( function() {
			this.checked = false;
		} );
		// limpando os texts
		jQuery( '[type="text"]' ).each( function() {
			this.value = "";
		} );
		// retornando as classes de verificacao dos botões "pŕoximo"
		jQuery( '.btn-seg.btn-required' ).addClass( 'disabled' );
		// voltando para etapa inicial
		etapa.reiniciar();
	} );

	// Click nos botões que não tem valores
	jQuery( '.btn-no-input' ).on( 'click', function() {
		// Guardando o valor do botao em um input hidden
		jQuery( this ).siblings( 'input[type="hidden"]' ).val( jQuery( this ).attr( 'id' ) );
	} );

	// Iniciando Slicks ( only mobile )
	if( config.dispositivo() == 'tablet' || ( config.dispositivo() == 'mobile' ) ){
		var carousel_moradia = jQuery( '.moradia .carousel' ),
			carousel_comodo = jQuery( '.comodo .carousel' );

		carousel_moradia.slick( {
			slidesToShow: 1,
			slidesToScroll: 1,
			arrows: false,
			dots: true,
			centerMode: true,
			focusOnSelect: true,
			centerPadding: 0,
			infinite: false,
		} );

		carousel_comodo.slick( {
			slidesToShow: 1,
			slidesToScroll: 1,
			arrows: false,
			dots: true,
			centerMode: true,
			focusOnSelect: true,
			centerPadding: 0
		} );
	}

	// Fazendo os inputs radios acompanhar os slides no mobile
	jQuery( '[type="radio"]' ).on( 'change', function () {
		// testa se é mobile
		var input = jQuery( this ),
			conteudo = input.parents( '.sub-section' ),
			carrossel = conteudo.find( '.palco.slick-initialized' ),
			btn_seg = conteudo.find( '.btn-seg' ),
			index = input.data( 'index' );
		if ( config.dispositivo() == 'mobile' || config.dispositivo() == 'tablet' ) {
			if ( carrossel.length ) {
				// alterando para o slide selecionado
				carrossel.slick( 'slickGoTo', index );
			}
		}
		if ( config.verifica_obrigatorios() ) {
			btn_seg.removeClass( 'disabled' );

		} else {
			btn_seg.addClass( 'disabled' );
		}
		// controle dos itens na tela
		if ( input.data( 'controle' ) ) {
			config.controle_itens( input.attr( 'name' ), input.val(), 'radio' );
		}

		if ( input.attr( 'name' ) == 'comodo' ) {
			jQuery( '.ambiente .palco .bedroom, .ambiente .palco .dinner-room, .ambiente .palco .office' ).removeClass( 'ativo' );
			jQuery( '#palco-' + input.attr( 'id' ) ).addClass( 'ativo' );
		}
	} );

	// marcar os radios ao trocar os slides
	jQuery( '.ambientacao .palco' ).each( function() {
		if ( config.dispositivo() == 'mobile' || config.dispositivo() == 'tablet' ) {
			var carrossel = jQuery( this ),
				inputs = carrossel.siblings( '.conteudo' ).find( '[type="radio"]' );
			// depois que trocou de slide
			carrossel.on( 'afterChange', function( ev,slick, currentSlide ) {
				// marca o slide
				inputs.filter( function() {
					return jQuery( this ).data( 'index' ) == currentSlide;
				} )[0].click();
			} );
		}
	} );

	// click nas imagens das etapas
	jQuery( '.slide' ).on( 'click', function() {
		if ( config.dispositivo() == 'desktop' ) {
			if ( ! jQuery( 'body' ).hasClass( 'animando' ) ) {
				// id do input
				var input_id = jQuery( this ).data( 'input' );
				jQuery( '#' + input_id ).click();
				if ( jQuery( this ).hasClass( 'has-palco' ) ) {
					jQuery( '.ambiente .palco .bedroom, .ambiente .palco .dinner-room, .ambiente .palco .office' ).removeClass( 'ativo' );
					jQuery( '#palco-' + input_id ).addClass( 'ativo' );
				}
				etapa.seguinte();
			}
		}
	} );

	// controlando as animações
	jQuery( '.has-animation' ).on( 'animationstart', function() {
		jQuery( 'body' ).addClass( 'animando' );
	} );

	jQuery( '.has-animation' ).on( 'animationend', function() {
		jQuery( 'body' ).removeClass( 'animando' );
	} );

	// controlando as animações do mobile
	if ( config.dispositivo() == 'mobile' ) {
		jQuery( '.has-animation-mobile' ).on( 'animationstart', function() {
			jQuery( 'body' ).addClass( 'animando' );
		} );
		jQuery( '.has-animation-mobile' ).on( 'animationend', function() {
			jQuery( 'body' ).removeClass( 'animando' );
		} );
	}

	// Resultado

	// Lightbox only mobile
	if( config.dispositivo() == 'mobile' ) {
		jQuery( '.lightbox ').on( 'click', function() {
			jQuery( this ).parent().find( '.descricao-modelo' ).removeClass( '-hidden' );
			jQuery( '.overlay' ).removeClass( '-hidden' );
			return( false );
		});
		jQuery( '.descricao-modelo .fechar' ).on( 'click', function() {
			jQuery( this ).parent().addClass( '-hidden' );
			jQuery( '.overlay' ).addClass( '-hidden' );
			return( false );
		});
		jQuery( '.overlay' ).on( 'click', function() {
			jQuery( '.overlay' ).addClass( '-hidden' );
			jQuery( '.descricao-modelo:not(.-hidden) ').addClass( '-hidden' );
		});
	}
	else{
		jQuery( '.lightbox ').on( 'click', function() { return false; } );
	}


} );

// Funções genéricas
// Muda de Etapa
function Etapa(){
	// Proxima Etapa
	this.seguinte = function(){
		var etapa = jQuery( 'section.ativo' );
		ir_para( 'seguinte', etapa );
	};
	// Etapa anterior
	this.anterior = function(){
		var etapa = jQuery( 'section.ativo' );
		ir_para( 'anterior', etapa );
	};
	// Adiciona ativo na primeira etapa
	this.iniciar = function(){
		var primeira = jQuery( 'section' ).first();
		primeira.addClass( 'ativo' );
		if( primeira.find( '.sub-section' ).length > 0 ){
			primeira.find( '.sub-section' ).first().addClass( 'ativo' );
		}
	};
	this.reiniciar = function(){
		jQuery( '.ativo, .backward, .reverse, .forward' )
		.removeClass( 'ativo' )
		.removeClass( 'backward' )
		.removeClass( 'reverse' )
		.removeClass( 'forward' );
		jQuery( '.introducao, .ambientacao, .ambiente .sub-section:first' ).addClass( 'ativo' );
	};

	// Function que navega nas etapas
	function ir_para( direcao, seletor ){
		if( ( seletor.find( '.sub-section' ).length > 0 ) ){
			// Se for pai de uma sub-section
			// percorre a subsection ao invez da section pai
			seletor = seletor.find( '.sub-section.ativo' );
			ir_para( direcao, seletor );
		}else {
			// remove as classes de controle de animação
			jQuery( '.forward, .backward ,.reverse' ).removeClass( 'forward' ).removeClass( 'backward' ).removeClass( 'reverse' );
			if( direcao == 'seguinte' ){
				if( seletor.hasClass( 'sub-section' ) && ( seletor.next().length == 0 ) ){
					// se for o último item avança para a proxima section
					seletor = seletor.parents( 'section' );
				}
				seletor.addClass( 'forward' ).removeClass( 'ativo' ).next().addClass( 'ativo' );

				if ($('.resultado').hasClass('ativo')) {

					$('.page-calculadora-btu__container').addClass('is--active');
				}

			}else if( direcao == 'anterior' ){
				// 1- verificamos se existe um palco antes
				// caso tenha, voltamos para a section anterior
				// 2 - caso não tenha palco, verificamos
				// se é o primeiro item da sub-section
				// se for, voltamos para a section anterior
				if( seletor.prev().not( '.palco' ).length == 0 ||
					( seletor.hasClass( 'sub-section' ) && ( seletor.prev().length == 0 ) ) ){
					seletor = seletor.parents( 'section' );
				}
				seletor.addClass( 'backward' ).removeClass( 'ativo' ).prev().addClass( 'ativo reverse' );

			}
		}
	}
};

function Config () {
	this.dispositivo = function () {
		var tela = jQuery( window ).width();
		return tela < 768 ? 'mobile' : ( tela < 1025 ? 'tablet' : 'desktop' );
	}
	this.verifica_obrigatorios = function () {
		// verifica se todos os requireds da tela está preenchido ou com valor
		var verificado = true,
			secao_ativa = jQuery( 'section.ativo .sub-section.ativo' ).length ? jQuery( 'section.ativo .sub-section.ativo' ) : jQuery( 'section.ativo' ),
			tipo = secao_ativa.find( '[data-required="required"]' ).length ? secao_ativa.find( '[data-required="required"]' ).data( 'type' ) : secao_ativa.data( 'type' );
		if ( tipo == 'numerico' ) {
			secao_ativa.find( 'input[type="text"]' ).each( function() {
				var valor = jQuery( this ).val(),
					unidade = jQuery( this ).data( 'suffix' );
				valor = parseFloat( valor.replace( unidade, '' ) );
				if ( ! valor ) verificado = false;
			} );
		} else if ( tipo == 'radio' ) {
			// verificando se tem algum input marcado - feito desse jeito por causa do Safari (novo IE6)
			var checkeds = secao_ativa.find( '[type="radio"]' ).filter( function() {
				return this.checked;
			} );
			if ( ! checkeds.length ) verificado = false;
		}

		return verificado;
	}
	this.calular_produto = function () {
		var result = {},
			nome,
			valor,
			sufixo,
			input,
			guardar,
			util = {},
			calorias = {},
			btu = 0,
			retorno;
		jQuery( 'input' ).each( function() {
			input = jQuery( this );
			guardar = input.attr( 'type' ) == 'radio' && ( input[0].checked );
			guardar = guardar || input.attr( 'type' ) == 'text';
			guardar = guardar || input.attr( 'type' ) == 'hidden';
			if ( guardar ) {
				nome = jQuery( this ).attr( 'name' );
				valor = jQuery( this ).val();
				if ( jQuery( this ).data( 'suffix' ) ) {
					sufixo = jQuery( this ).data( 'suffix' );
					valor = parseFloat( valor.replace( sufixo, '' ) );
				}
				result[nome] = valor;
			}
		} );
		// valores úteis
		util[ 'area' ] = result.comprimento * result.largura;
		// calculando calorias
		calorias[ 'lamp-n' ] = result[ 'lampada-normal' ] * 150; // 150J / Lâmpada normal
		calorias[ 'lamp-f' ] = result[ 'lampada-fluorescente' ] * 32.5 // 32.5 J /Lâmpada fluorescente
		calorias[ 'pc' ] = result.computador * 100 * 0.86; // 100 kcal/ Computador (1kcal = 0.86J)
		calorias[ 'tv' ] = result.televisor * 400 * 0.86; // 400kcal/Televisor (1kcal = 0.86J)
		calorias[ 'home-theater' ] = result[ 'home-theater' ] * 150 * 0.86; // 150kcal/Home Teather(1kcal = 0.86J)
		calorias[ 'out-elet' ] = result.outros * 250 * 0.86 // 250kcal/Outros (1kcal = 0.86J)
		// calcular tipo de habitação - tipo_de_teto
		util[ 'moradia' ] = result.moradia == 'predio' ? 26 : ( result.moradia == 'casa' ) ? 63 : 128 ;
		calorias[ 'tipo_teto' ] = util.moradia * util.area;
		calorias[ 'extra' ] = 20 * util.area;
		// calcular o tipo de ambiente
		util[ 'ambiente' ] = result.comodo == 'quarto' ? 75 : 150;
		calorias[ 'qtd_pessoas' ] = result.pessoas * util.ambiente;
		// calulcar janelas
		if ( result.periodo == 'manha' ) {
			util[ 'jcortinas' ] = result.cortinas ? 260 : 170;
		} else if ( result.periodo == 'tarde' ) {
			util[ 'jcortinas' ] = result.cortinas ? 440 : 300;
		} else {
			util[ 'jcortinas' ] = 0;
		}
		calorias[ 'janelas' ] = result.janelas * util.jcortinas;
		for ( var item in calorias ) {
			btu += 4 * calorias[ item ]; // btus = calorias * 4;
		}
		// verificar qual produto recomendar
		if ( btu <= 8000 ) {
			btu = 7000;
		} else if ( btu <= 10000 ) {
			btu = 10000;
		} else if ( btu <= 14000 ) {
			btu = 12000;
		} else if ( btu <= 19500 ) {
			btu = 18000;
		} else if ( btu <= 22000 ) {
			btu = 21000;
		} else {
			btu = 30000;
		}
		retorno = {
			'btu': btu,
			'respostas' : result,
			'calorias': calorias,
			'utils': util
		};
		return retorno;
	}
	// função para setar a quantidade de btu no resultado
	this.set_resultado_btu = function( btu ) {
		jQuery( '#btu' ).text( btu );
	}
	// função para controlar a visibilidade dos itens
	this.controle_itens = function( id, valor, tipo ) {
		// removendo todos os ativos
		jQuery( '.palco .ativo .' + id ).removeClass( 'ativo' );
		// marcando ativo os itens que são menores que o valor
		if ( tipo == 'numerico' ) {
			jQuery( '.palco .ativo .' + id ).filter( ':lt( ' + valor + ' )' ).addClass( 'ativo' );
		} else if ( tipo == 'radio' && ( valor == '1' ) ) {
			if ( id == 'cortinas' ) {
				jQuery( '.palco .ativo .' + id ).addClass( 'ativo' );
			}
		}
	}
	// função que constrói os links dos produtos
	this.constroi_link = function ( resultado ) {
		var links = {
			'7000': {
				'split': '/categoria/ar-condicionados-split/#07-000-btu-split',
				'janela': '/categoria/ar-condicionados-janela/#07-500-btu',
				//'portatil': '/categoria/ar-condicionados-portatil/',
			},
			'10000': {
				'split': '/categoria/ar-condicionados-split/#09-000-btu-split',
				'janela': '/categoria/ar-condicionados-janela/#10-000-btu',
				//'portatil': '/categoria/ar-condicionados-portatil/',
			},
			'12000': {
				'split': '/categoria/ar-condicionados-split/#12-000-btu-split',
				'janela': '/categoria/ar-condicionados-janela/#12-000-btu',
				'portatil': '/categoria/ar-condicionados-portatil/',
			},
			'18000': {
				'split': '/categoria/ar-condicionados-split/#18-000-btu-split',
				'janela': '/categoria/ar-condicionados-janela/#18-000-btu',
				//'portatil': '/categoria/ar-condicionados-portatil/',
			},
			'21000': {
				'split': '/categoria/ar-condicionados-split/#22-000-btu-split',
				'janela': '/categoria/ar-condicionados-janela/#21-000-btu',
				//'portatil': '/categoria/ar-condicionados-portatil/',
			},
			'30000': {
				//'split': '/categoria/ar-condicionados-split/#22-000-btu-split',
				'janela': '/categoria/ar-condicionados-janela/#27-000-btu',
				//'portatil': '/categoria/ar-condicionados-portatil/',
			},
		};

		jQuery( '.resultado .box-modelos .modelo' ).each( function() {
			var modelo = jQuery( this ),
				nome_modelo = modelo.hasClass( 'split' ) ? 'split' : ( modelo.hasClass( 'janela' ) ? 'janela' : 'portatil' );
			if ( ( resultado.btu in links ) && ( nome_modelo in links[ resultado.btu ] ) ) {
				modelo.find( 'a.comprar' ).attr( 'href', links[ resultado.btu ][ nome_modelo ] );
			} else {
				modelo.hide();
			}
		} );
	}
}
