/* global $: true, Nitro: true, ScrollMagic: true, TweenMax: true, TimelineMax: true  */
'use strict';

var animation_Sections = function () {
	// Init ScrollMagic
	var controller = new ScrollMagic.Controller();

	new ScrollMagic.Scene({
		triggerElement: '.sb-intro',
		duration: '80%',
		triggerHook: 0.7,
	}).setClassToggle('.sb-intro', 'fade-in').addTo(controller);

	new ScrollMagic.Scene({
		triggerElement: '.sb-video',
		duration: '100%',
		triggerHook: 0.8,
	}).setClassToggle('.sb-video', 'fade-in').addTo(controller);

	new ScrollMagic.Scene({
		triggerElement: '.sb-dimensoes',
		duration: '100%',
		triggerHook: 0.8
		// reverse: false
	}).setClassToggle('.sb-dimensoes', 'fade-in').addTo(controller);

	new ScrollMagic.Scene({
		triggerElement: '.sb-vitrine',
		triggerHook: 0.8,
		reverse: false
	}).setClassToggle('.sb-vitrine', 'fade-in').addTo(controller);
};

var animation_Intro = function() {
	// Intro Animations Start
	TweenMax.from('.sb-intro .col-4:nth-of-type(2)', 1, {
		top: 20,
		delay: 0.25
	});
	TweenMax.to('.sb-intro .col-4:nth-of-type(2)', 1, {
		opacity: 1,
		delay: 0.25
	});

	TweenMax.from('.sb-intro .sb-intro_info .campanha-ofds', 1, {
		top: 20,
		delay: 0.5
	});
	TweenMax.to('.sb-intro .sb-intro_info .campanha-ofds', 1, {
		opacity: 1,
		delay: 0.5
	});

	TweenMax.from('.sb-intro .sb-intro_info h3', 1, {
		top: 20,
		delay: 0.75
	});
	TweenMax.to('.sb-intro .sb-intro_info h3', 1, {
		opacity: 1,
		delay: 0.75
	});

	TweenMax.from('.sb-intro .sb-intro_info p', 1, {
		top: 20,
		delay: 1
	});
	TweenMax.to('.sb-intro .sb-intro_info p', 1, {
		opacity: 1,
		delay: 1
	});

	TweenMax.from('.sb-intro .sb-intro_info h4', 1, {
		top: 20,
		delay: 1
	});
	TweenMax.to('.sb-intro .sb-intro_info h4', 1, {
		opacity: 1,
		delay: 1
	});

	TweenMax.from('.sb-intro .sb-intro_products .sb-intro_title h1', 1, {
		top: 20,
		delay: 1.25
	});
	TweenMax.to('.sb-intro .sb-intro_products .sb-intro_title h1', 1, {
		opacity: 1,
		delay: 1.25
	});

	TweenMax.from('.sb-intro .sb-intro_products .sb-intro_app', 1, {
		top: 20,
		delay: 1.5
	});
	TweenMax.to('.sb-intro .sb-intro_products .sb-intro_app', 1, {
		opacity: 1,
		delay: 1.5
	});

	TweenMax.from('.sb-intro .sb-intro_products .sb-intro-product-price', 1, {
		top: 20,
		delay: 1.75
	});
	TweenMax.to('.sb-intro .sb-intro_products .sb-intro-product-price', 1, {
		opacity: 1,
		delay: 1.75
	});

	TweenMax.from('.sb-intro .sb-intro_products .sb-intro_select-sku', 1, {
		top: 20,
		delay: 2
	});
	TweenMax.to('.sb-intro .sb-intro_products .sb-intro_select-sku', 1, {
		opacity: 1,
		delay: 2
	});

	TweenMax.from('.sb-intro .sb-intro_products .sb-intro-buttom-buy', 1, {
		top: 20,
		delay: 2.25
	});
	TweenMax.to('.sb-intro .sb-intro_products .sb-intro-buttom-buy', 1, {
		opacity: 1,
		delay: 2.25
	});

	TweenMax.from('.sb-intro .sb-intro_products .sb-intro-pre-venda-info', 1, {
		top: 20,
		delay: 2.55
	});
	TweenMax.to('.sb-intro .sb-intro_products .sb-intro-pre-venda-info', 1, {
		opacity: 1,
		delay: 2.55
	});

	TweenMax.to('.sb-intro .sb-intro_ilustra', 1, {
		backgroundImage: 'url(/arquivos/imageSteel-smartBeer-03-budweiser.png)',
		delay: 0.25,
		// ease:Power2.easeInOut
	});
	TweenMax.to('.sb-intro .sb-intro_ilustra', 1, {
		backgroundImage: 'url(/arquivos/imageSteel-smartBeer-01-Carbono.png)',
		delay: 1.25,
		// ease:Power2.easeInOut
	});
	TweenMax.to('.sb-intro .sb-intro_ilustra', 1, {
		backgroundImage: 'url(/arquivos/imageSteel-smartBeer-02-Cubo.png)',
		delay: 2.25,
		// ease:Power2.easeInOut
	});
	// Intro Animations End
};

var animation_App = function () {

	// var wrapperWidth = $('.sb-app .wrapper').width(),
	// 	wrapperHeight = $('.sb-app .wrapper').height(),

	//section = $('.sb-app'),
	var	section1Height = $('.sb-app .wrapper').height(),

		mockup_mobile = $('.mockup-mobile'),
		app_smartbeer = $('.sb-app .col-5'),
		sb_app_steep1 = $('.sb-app-steep1'),
		sb_app_steep2 = $('.sb-app-steep2'),
		as_02_01 = $('.as-02-01'),
		as_02_02 = $('.as-02-02'),
		as_02_03 = $('.as-02-03'),
		as_02_04 = $('.as-02-04'),
		sb_app_steep3 = $('.sb-app-steep3'),
		as_03_01 = $('.as-03-01'),
		as_03_02 = $('.as-03-02'),
		as_03_03 = $('.as-03-03'),
		sb_app_steep4 = $('.sb-app-steep4'),
		as_04_01 = $('.as-04-01');

	// SCROLLMAGIC INIT
	var controller2 = new ScrollMagic.Controller();

	// GSAP PART: Timeline
	var t2_animation = new TimelineMax();
	t2_animation
		// APP STEEP #01
		.to(sb_app_steep1, 0.5, {
			autoAlpha: 0
		})
		// APP STEEP #02
		.to(sb_app_steep2, 0.5, {
			autoAlpha: 1
		})
		.to(as_02_01, 0.5, {
			autoAlpha: 1
		})
		.to(as_02_02, 0.5, {
			autoAlpha: 1
		})
		.to(as_02_03, 0.5, {
			autoAlpha: 1
		})
		.to(as_02_04, 0.5, {
			autoAlpha: 1
		})
		.to(sb_app_steep2, 0.5, {
			autoAlpha: 0
		})

		// APP STEEP #03
		.to(sb_app_steep3, 0.5, {
			autoAlpha: 1
		})
		.to(as_03_01, 0.5, {
			autoAlpha: 1
		})
		.to(as_03_02, 0.5, {
			autoAlpha: 1
		})
		.to(as_03_03, 0.5, {
			autoAlpha: 1
		})
		.to(sb_app_steep3, 0.5, {
			autoAlpha: 0
		})

		// APP STEEP #04
		.to(sb_app_steep4, 0.5, {
			autoAlpha: 1
		})
		.to(as_04_01, 0.5, {
			autoAlpha: 1
		})
		.to(as_04_01, 0.5, {
			autoAlpha: 0
		})

		//End animation
		.to(app_smartbeer, 0.5, {
			autoAlpha: 0
		})
		.to(app_smartbeer, 0, {
			x: 500
		})

		.to(mockup_mobile, 0.5, {
			right: 400
		})
		.to(app_smartbeer, 0.5, {
			autoAlpha: 1,
			left: 500
		});

	// SCROLLMAGIC SCENE 2
	new ScrollMagic.Scene({
		triggerElement: '.sb-app',
		duration: section1Height * 7,
		triggerHook: 0.1
	})
		.setPin('.sb-app .wrapper')
		.setTween(t2_animation)
		// .addIndicators({name: '1'}) // add indicators (requires plugin)
		.addTo(controller2);
};

var animation_Features = function () {

	// var wrapperWidth = $('.sb-features .wrapper').width(),
	// 	wrapperHeight = $('.sb-features .wrapper').height(),

	// section = $('.sb-features'),
	var section1Height = $('.sb-features .wrapper').height(),


		sb_features_steep1 = $('.sb-features-steep1'),
		sb_f_massage = $('.sb-f-massage'),
		f_01_01 = $('.f-01-01'),
		f_01_02 = $('.f-01-02'),
		f_01_03 = $('.f-01-03'),
		f_01_04 = $('.f-01-04'),
		sb_features_steep2 = $('.sb-features-steep2'),
		f_02_01 = $('.f-02-01'),
		f_02_02 = $('.f-02-02'),

		sb_features_steep3 = $('.sb-features-steep3'),
		f_03_01 = $('.f-03-01'),
		f_03_02 = $('.f-03-02'),
		f_03_03 = $('.f-03-03'),
		f_03_04 = $('.f-03-04'),

		sb_features_steep4 = $('.sb-features-steep4'),
		// aberta = $('.sb-features-steep4 .cervejeira.aberta'),
		longnecks = $('.sb-features-steep4 .cervejeira.longnecks'),
		garrafas = $('.sb-features-steep4 .cervejeira.garrafas'),
		latas = $('.sb-features-steep4 .cervejeira.latas'),
		f_04_01 = $('.f-04-01');

	// SCROLLMAGIC INIT
	var controller3 = new ScrollMagic.Controller();

	// GSAP PART: Timeline
	var t3_animation = new TimelineMax();
	t3_animation
		// APP STEEP #01
		// .to(sb_features_steep1, 0.5, {autoAlpha: 1 })

		.to(sb_f_massage, 0.5, {
			autoAlpha: 1
		})
		.to(f_01_01, 0.5, {
			autoAlpha: 1
		})
		.to(f_01_02, 0.5, {
			autoAlpha: 1
		})
		.to(f_01_03, 0.5, {
			autoAlpha: 1
		})
		.to(f_01_04, 0.5, {
			autoAlpha: 1
		})
		.to(sb_f_massage, 0.5, {
			autoAlpha: 0
		})
		.to(sb_features_steep1, 0.5, {
			autoAlpha: 0
		})

		// APP STEEP #02
		.to(sb_features_steep2, 0.5, {
			autoAlpha: 1
		})
		.to(f_02_01, 0.5, {
			autoAlpha: 1
		})
		.to(f_02_02, 0.5, {
			autoAlpha: 1
		})
		.to(sb_features_steep2, 0.5, {
			autoAlpha: 0
		})

		// APP STEEP #03
		.to(sb_features_steep3, 0.5, {
			autoAlpha: 1
		})
		.to(f_03_01, 0.5, {
			autoAlpha: 1
		})
		.to(f_03_02, 0.5, {
			autoAlpha: 1
		})
		.to(f_03_03, 0.5, {
			autoAlpha: 1
		})
		.to(f_03_04, 0.5, {
			autoAlpha: 1
		})
		.to(sb_features_steep3, 0.5, {
			autoAlpha: 0
		})

		// APP STEEP #04
		.to(sb_features_steep4, 0.5, {
			autoAlpha: 1
		})
		.to(f_04_01, 0.5, {
			autoAlpha: 1
		})

		//End animation
		.to(longnecks, 0.5, {
			autoAlpha: 0
		})
		.to(garrafas, 0.5, {
			autoAlpha: 1
		})
		.to(garrafas, 0.5, {
			autoAlpha: 0
		})
		.to(latas, 0.5, {
			autoAlpha: 1
		});

	// SCROLLMAGIC SCENE 3
	new ScrollMagic.Scene({
		triggerElement: '.sb-features',
		duration: section1Height * 5,
		triggerHook: 0.1
	})
		.setPin('.sb-features .wrapper')
		.setTween(t3_animation)
		// .addIndicators({name: "1"}) // add indicators (requires plugin)
		.addTo(controller3);
};

$('document').ready(function () {

	var screenWidth = $(window).width();
	if (screenWidth >= '1120') {
		animation_Sections();
		animation_Intro();
		animation_App();
		animation_Features();
	}
});

// If resize
// $(window).resize(function () {
//     $("body").scrollTop(0);
// });