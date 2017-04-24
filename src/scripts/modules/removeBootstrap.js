'use strict';

Nitro.module('removeBootstrap', function() {
    // alert(0);
    var removejscssfile = function(filename, filetype) {
        var targetelement = (filetype === 'js')? 'script' : (filetype === 'css')? 'link' : 'none',
            targetattr = (filetype === 'js')? 'src' : (filetype === 'css')? 'href' : 'none',
            allsuspects = document.getElementsByTagName(targetelement);

        for (var i = allsuspects.length; i >= 0; i--) {
            if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) !== null && allsuspects[i].getAttribute(targetattr) === filename) {
                allsuspects[i].parentNode.removeChild(allsuspects[i]);
            }
        }
    };

    // removejscssfile('style.css','css');
    removejscssfile('//io.vtex.com.br/front-libs/bootstrap/2.3.2/css/bootstrap.min.css', 'css');
    removejscssfile('//io.vtex.com.br/myorders-ui/1.7.7/style/style.css', 'css');
    removejscssfile('//io.vtex.com.br/front-libs/font-awesome/3.2.1/css/font-awesome.min.css', 'css');
    // removejscssfile('http://io.vtex.com.br/front-libs/bootstrap/2.3.2/js/bootstrap.min.js', 'js');
});