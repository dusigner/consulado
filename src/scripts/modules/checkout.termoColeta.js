/* global $: true, Nitro: true */
'use strict';

/*jshint strict: false */
require('vendors/jquery.inputmask');
var CRM = require('modules/store/crm');

Nitro.module('checkout.termoColeta', function() {


    //var self = this;

    this.setup = function() {
        this.aceiteTermoColeta();
    };


    this.aceiteTermoColeta = function() {
        var metodoDeEntrega = $('.shipping-method .sla-name').text();
        if (metodoDeEntrega.indexOf('EcoEntrega') !== -1) {
            $('#modal-more-phones').on('hidden.bs.modal', function() {
                $('#modal-termo-coleta').modal({
                    backdrop: 'static'
                });
            });

            $('input.cepColeta').inputmask('99999-999');

            var email = $('.orderplaced-sending-email strong').text().trim(),
                idPedido = $('.myorders-list>.ordergroup').attr('id'),
                idUser,
                typeProduct,
                btnContinue = $('#modal-termo-coleta .btn');

            $('#produto-coletado').on('change', function() {
                typeProduct = $(this).val();
                if (typeProduct === '') {
                    btnContinue.attr('disabled', 'disabled');
                }
            });

            $('input.nameColeta1, input.enderecoColeta, input.cepColeta').keyup(function() {
                if ($('input.nameColeta1').val() === '' || $('input.enderecoColeta').val() === '' || $('input.cepColeta').val() === '') {
                    btnContinue.attr('disabled', 'disabled');
                } else {
                    btnContinue.removeAttr('disabled');
                }
            });

            btnContinue.on('click', function() {
                var jsonColeta = JSON.stringify({
                    'key': idPedido + ' - Tipo de Produto: ' + typeProduct,
                    'point': '1',
                    'until': ''
                });

                var responsavelColeta = 'Nome 1: ' + $('input.nameColeta1').val() +
                    ' | Nome 2: ' + $('input.nameColeta2').val();

                var enderecoColeta = $('input.enderecoColeta').val() + ' - ' + $('input.cepColeta').val();

                var data = {
                    'email': email,
                    'xColetaResponsavel': responsavelColeta,
                    'xEnderecoColeta': enderecoColeta
                };

                CRM.insertClient(data)
                    .then(function() {
                        //console.log('deu certo');
                        $.get('/api/ds/pub/documents/CL?f=id&fq=email:' + email).done(function(data) {
                            idUser = data.Documents[0].id;

                            $.ajax({
                                contentType: 'application/json',
                                type: 'PUT',
                                url: '/api/ds/pub/documents/CL/' + idUser + '/xAceiteColeta/score',
                                data: jsonColeta,
                                success: function() {
                                    //console.log('Termo de aceite para coleta de produto antigo: aceito');
                                }
                            });
                        });
                    });
                /*
                						.fail(function () {
                							console.log('deu errado');
                						});*/
            });
        }
    };
});
