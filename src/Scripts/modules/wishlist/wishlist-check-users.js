'use strict';

Nitro.module('favourite-user-not-logged', function() {

	this.init = function() {
		this.checkIfUserIsLogged();
    };

    this.checkIfUserIsLogged = () =>{

        window.onload = function(){
            vtexjs.checkout.getOrderForm()
            .done(function(orderForm) {
                var checkUser = orderForm.loggedIn;

                    if(!checkUser) {
                        $('.wishlist__button-pdp').on('click', function(){
                            localStorage.setItem("wishlist", skuJson.productId);
                        });
                    } else {
                        if(localStorage.getItem('wishlist') && !$('#wishlist-product').hasClass('wished')) {
                            console.log('Product Id = ', localStorage.getItem('wishlist'));

                            setTimeout(function(){
                                $(".wishlist__container").find(".wishlist__button-pdp").click();
                            }, 1500);
                        }
                        localStorage.removeItem('wishlist');
                    }
            });
        }

    }

	this.init();
});
