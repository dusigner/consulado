/* global $: true, Nitro: true */
'use strict';

require('modules/newsletter');

Nitro.module('footer', function() {


    var $window = $(window),
        $footer = $('footer'),
        accordionBtn = $('.accordion .title'),
        accordionBox = accordionBtn.parent(),
        $duvidasList = $('.duvidas'),
        $duvidasAct = $('.duvidas li.accordion > a'),
        $btnNewsletter = $('.call-newsletter'),
        $servicos = $('.servicos'),
        $toTop = $('.bt-gototop');

    // ACCORDION MENU FOOTER MOBILE
    accordionBtn.on('click', function(e) {
        if ($window.width() > 767) {
            return true;
        }

        e.preventDefault();

        var self = $(this);

        if (self.parent().hasClass('open')) {
            accordionBox.removeClass('open');
            self.next().stop(true, true).slideUp();
        } else {
            self.parent().addClass('open');
            self.next().stop(true, true).slideDown();
        }
    });

    // ACCORDION DÚVIDAS FOOTER
    $duvidasAct.on('click', function(e) {
        e.preventDefault();

        var self = $(this),
            parent = self.parent();

        if (parent.hasClass('active')) {
            parent.removeClass('active');
            self.next().stop(true, true).slideUp();
        } else {
            $duvidasList.find('li').removeClass('active');
            $duvidasList.find('p').stop(true, true).slideUp();
            parent.addClass('active');
            self.next().stop(true, true).slideDown();
        }
    });


    //BACK TO TOP
    var reachBottom = 0;

    $window.scroll(function() {
        if ($window.scrollTop() >= 560) {
            $toTop.removeClass('hide');
            reachBottom = ($footer.offset().top - $window.scrollTop()) - $window.height() - 80;
            if (reachBottom < 0) {
                $toTop.css('bottom', 10 + Math.abs(reachBottom));
            } else {
                $toTop.css('bottom', 10);
            }
        } else {
            $toTop.addClass('hide');
        }
    }).scroll();

    $toTop.click(function(e) {
        e.preventDefault();
        $('header').toScroll();
    });


    $btnNewsletter.click(function(e) {
        e.preventDefault();

        $footer.toScroll();
    });

    $window.scroll($.throttle(function() {

        if ($window.scrollTop() >= 560 && $window.scrollTop() + $window.height() <= $footer.offset().top) {
            $btnNewsletter.addClass('newsletter-show');
        } else {
            $btnNewsletter.removeClass('newsletter-show');
        }

    }, 250)).scroll();


    //boxes atendimento -servicos
    if ($window.width() <= 768) {
        $servicos.find('.box:not(.box-chat)').click(function(e){
            e.preventDefault();

            var link = $(this).find('a.primary-button').attr('href');

            window.location.href = link;
        });
    }

});
