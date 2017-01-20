'use strict';
require('vendors/jquery.inputmask');

var CRM = require('modules/store/crm');


Nitro.controller('landing-gae-2016', [], function () {
    
    var Index = {

        init: function (){
            Index.serviceForm();
            Index.accordion();
        },

        accordion: function (){
            $('.accordion-title').on('click', function (e){
                e.preventDefault();

                $(this).next().toggleClass('open');
                $(this).toggleClass('open');
            });
        },

        emailValidation: function (email){
            var rx = /^[\w-]+(\.[\w-]+)*@([a-z0-9-]+(\.[a-z0-9-]+)*?\.[a-z]{2,6}|(\d{1,3}\.){3}\d{1,3})(:\d{4})?$/;

            return rx.test(email);
        },

        transformForminObj: function(obj){
            var fsplit = obj.split('&');
            var ssplit = {};

            var i = 0;
            var t = fsplit.length;

            for(i; i<t; i++){
                var splited = fsplit[i].replace('%40', '@').replace( new RegExp('\\+','gm'), ' ').split('=');
                ssplit[splited[0]] = splited[1];
            }
            console.log(ssplit);
            return ssplit;
        },

        serviceForm: function (){

            var inputs = $('input[type="text"]');

            $('#telefone-gae').inputmask('(99) 9999[9]-9999');

            $('#form-gae-2016').on('submit', function (e){
                e.preventDefault();

                var email = $('#email-gae').val(); 
                var nome = $('#nome-gae').val(); 
                var horario = $('#horario-gae').val(); 
                $('.error_p').remove();
                $(inputs).addClass('erro');
                $('.form-gae-content-2016').append('<p class="error_p">nao os campos corretamente</p>');
                if( Index.emailValidation(email) && nome !== '' ){
                    $(inputs).removeClass('erro');
                    $('.error_p').remove();
                    $('.form-gae-content-2016 .error_p').hide();
                    console.log('foi');

                    var data = $('#form-gae-2016').serialize();

                    console.log(data);

                    var obj = Index.transformForminObj(data);

                    CRM.insertClientGE(obj).done(function (response){
                        console.log(response);
                        $('.form-gae-content-2016').append('<p class="sucesso">Seus dados foram encaminhados com sucesso. Em breve entraremos em contato com você.</p>');
                        setTimeout(function(){
                            $('.form-gae-content-2016 .sucesso').hide();
                        }, 10000);
                        $('#nome-gae').val('');
                        $('#email-gae').val('');
                        $('#horario-gae').val('');
                        $('#telefone-gae').val('');

                    }).fail(function (error){
                        console.log(error);
                    });


                }

            });
        }
    };


    Index.init();
});
