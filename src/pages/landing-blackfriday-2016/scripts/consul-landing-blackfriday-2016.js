'use strict';

var CRM = require('modules/store/crm');

Nitro.controller('landing-blackfriday-2016', [], function () {


    var Index = {

        init: function (){
            this.leadsConsul();
            this.initContador('Nov 25 2016');
        },

        algTimer: function (final){
            var t = Date.parse(final) - Date.parse(new Date());
            var segundos = Math.floor( (t/1000) % 60 );
            var minutos = Math.floor( (t/1000/60) % 60 );
            var horas = Math.floor( (t/(1000*60*60)) % 24 );
            var dias = Math.floor( t/(1000*60*60*24) );

            return {
                'tempo': t,
                'dias': dias,
                'horas': horas,
                'minutos': minutos,
                'segundos': segundos
            };

        },

        initContador: function (final){
            var dia = $('.dias span');
            var hora = $('.horas span');
            var minuto = $('.minutos span');
            var segundo = $('.segundos span');


            function updateClock() {
                var t = Index.algTimer(final);

                dia.html(t.dias);
                hora.html(('0' + t.horas).slice(-2));
                minuto.html(('0' + t.minutos).slice(-2));
                segundo.html(('0' + t.segundos).slice(-2));

                if(t.total <= 0) {
                    clearInterval(timeinterval);
                }
            }
            
            var timeinterval = setInterval(updateClock, 1000);
        
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
                var splited = fsplit[i].replace('%40', '@').split('=');
                ssplit[splited[0]] = splited[1];
            }

            return ssplit;
        },

        leadsConsul: function (){
            var inputs = $('input[type="text"]');

            $('#form-leads-blackfriday-2016').on('submit', function (e){
                e.preventDefault();

                var email = $('#email-bf-2016').val(); 
                var nome = $('#nome-bf-2016').val(); 

                $(inputs).addClass('erro');

                $('.content-leads').append('<p class="error_p">Preencha os campos corretamente</p>');
                if( Index.emailValidation(email) && nome !== '' ){
                    $(inputs).removeClass('erro');
                    $('.content-leads .error_p').hide();
                    
                    var data = $('#form-leads-blackfriday-2016').serialize();

                    var obj = Index.transformForminObj(data);

                    CRM.insertClient(obj).done(function (){

                        dataLayer.push({
                            'event' : 'CNS-BF-FormSuccess',
                            'email' : email
                        });


                        $('.content-leads').append('<p class="sucesso">Você foi cadastrado</p>');
                        setTimeout(function(){
                            $('.content-leads .sucesso').hide();
                        }, 5000);
                        $('#nome-bf-2016').val('');
                        $('#email-bf-2016').val('');

                    }).fail(function (){

                    });


                }

            });

        }

    };

    Index.init();

});
