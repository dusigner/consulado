/* global store:true, FB:true */

'use strict';

require('modules/helpers');

//load Nitro Lib
require('vendors/nitro');

require('expose?store!modules/store/store');

// require('modules/product/facebook-share');



Nitro.setup([], function () {

    var url_atual = window.location.href;
    $('a.comprar').attr('href', url_atual);

// Função scrollar para o topo da calculadora
function scroll_to_calc(){
    var target = jQuery('.corpoCalculadora'),
        position = ( target.offset().top ) - ( jQuery( '.product-menu' ).outerHeight() );
    jQuery('html, body').animate({
        scrollTop: position
    }, 800);
}
 
     $('.action-inicio').click(function() {
        $('.iniciar').addClass('ativo');
        $('.play').addClass('desativado');
        $('#qtdlotes').addClass('ativo');

        // Ajustando posicao da tela
        scroll_to_calc();
    });


    jQuery( '.action--next-ativo' ).on( 'click', function() {
        var dias = jQuery( 'input[name^="dia-"]:checked' ).length,
            lotes = jQuery( '#range' ).val(),
            resultado;
        if ( dias && lotes ) resultado = calcular_economia( dias, lotes );
        if ( resultado ) {
            $('.corpocehckbox').addClass('ativo');
            $('#comoseparar').addClass('ativo');

            scroll_to_calc();
        }else{
            $('.msg-erro').removeClass('hidden');
        }
    
    
        return false;
    } );

    var p = document.getElementById('range'),
    res1 = document.getElementById('diasrange');
    
    p.addEventListener('input', function () {
        res1.innerHTML = p.value + '<span>x</span>';
    }, false);   
    
    
    
    jQuery( '.action--next.calcular' ).on( 'click', function() {
        var dias = jQuery( 'input[name^="dia-"]:checked' ).length,
            lotes = jQuery( '#range' ).val(),
            resultado;
        if ( dias && lotes ) resultado = calcular_economia( dias, lotes );
        if ( resultado ) {
            jQuery( '.corporesultado .--economia-valor' ).text( resultado.valor.toLocaleString('pt-BR') );
            jQuery( '.corporesultado .--economia-agua' ).text( resultado.agua.toLocaleString( 'pt-BR' ) );
            jQuery( '.corporesultado .--economia-sabao' ).text( resultado.sabao.toLocaleString( 'pt-BR' ) );
            jQuery( '.corporesultado .--economia-galoes' ).text( ( Math.round( resultado.agua / 50 ) / 10 ).toLocaleString( 'pt-BR' ) );
            $('.perguntas').addClass('desativado');
            $('.corporesultado').addClass('ativo');
            $('.iniciar').addClass('final');
            $('.refazer').addClass('ativo');
            $('.msg-erro').addClass('hidden');

            scroll_to_calc();
        }
    
    
        return false;
    } );



function calcular_economia( dias, lotes ) {
    var racional_economia = {'1':{'1':[67.86,5720,2.04],'2':[135.72,11440,4.08],'3':[203.58,17160,6.12],'4':[271.44,22880,8.15],'5':[339.30,28600,10.19],'6':[407.16,34320,12.23],'7':[475.02,40040,14.27]},'2':{'1':[135.72,11440,4.08],'2':[271.44,22880,8.15],'3':[407.16,34320,12.23],'4':[542.88,45760,16.31],'5':[678.60,57200,20.38],'6':[814.32,68640,24.46],'7':[950.05,80080,28.54]},'3':{'1':[203.58,17160,6.12],'2':[407.16,34320,12.23],'3':[610.74,51480,18.35],'4':[814.32,68640,24.46],'5':[1017.91,85800,30.58],'6':[1221.49,102960,36.69],'7':[1425.07,120120,42.81]},'4':{'1':[271.44,22880,8.15],'2':[542.88,45760,16.31],'3':[814.32,68640,24.46],'4':[1085.77,91520,32.61],'5':[1357.21,114400,40.77],'6':[1628.65,137280,48.92],'7':[1900.09,160160,57.08]},'5':{'1':[339.30,28600,10.19],'2':[678.60,57200,20.38],'3':[1017.91,85800,30.58],'4':[1357.21,114400,40.77],'5':[1696.51,143000,50.96],'6':[2035.81,171600,61.15],'7':[2375.11,200200,71.34]},'6':{'1':[407.16,34320,12.23],'2':[814.32,68640,24.46],'3':[1221.49,102960,36.69],'4':[1628.65,137280,48.92],'5':[2035.81,171600,61.15],'6':[2442.97,205920,73.38],'7':[2850.14,240240,85.61]},'7':{'1':[475.02,40040,14.27],'2':[950.05,80080,28.54],'3':[1425.07,120120,42.81],'4':[1900.09,160160,57.08],'5':[2375.11,200200,71.34],'6':[2850.14,240240,85.61],'7':[3325.16,280280,99.88]}},
        valor = 0,
        sabao = 0,
        agua = 0,
        opcao;
    if ( lotes in racional_economia[ dias ] ) {
        valor += parseInt( racional_economia[ dias ][ lotes ][0] * 100, 10 );
        sabao += parseInt( racional_economia[ dias ][ lotes ][2] * 100, 10 );
        agua += parseInt( racional_economia[ dias ][ lotes ][1], 10 );
    }
    return { 'agua': agua, 'sabao': ( sabao/100 ), 'valor': ( valor/100 ) };
}

$('.reniciar').click(function() {

    $('.iniciar').removeClass('final').removeClass('ativo');
    $('.play').removeClass('desativado');
    $('.perguntas').removeClass('desativado');
    $('.corporesultado').removeClass('ativo');
    $('.refazer').removeClass('ativo'); 
    $('#qtdlotes').removeClass('ativo');
    $('#comoseparar').removeClass('ativo'); 
    $('.corpocehckbox').removeClass('ativo'); 
    // desmarcando tudo
    var inputs = $('input[name^="dia-"]');
    
      inputs.attr('checked', false);
      inputs.prop('checked', false);

    scroll_to_calc();

}); 

    
    } );
