'use strict';
require('vendors/slick');
console.clear();
console.log('asasasas');
// VARS
var $containerSelect = $('.select-category'),
	$selectLi = $('.select-category ul li'),
	$valueSelected = $('.select-category > span'),
	$inputCategory = $('input.category'),
	$iconPlay = $('.icon-play'),
	$btnVideo = $('.slick-dots li'),
	$iframePlay = $('.play-movie iframe'),
	$formRegister = $('.form-register');

$containerSelect.click(function(){
	$(this).toggleClass('active');
});

// SELECT CATEGORY
$selectLi.click(function(){
	$valueSelected.text($(this).text());
	$inputCategory.val($(this).text());
});

// monta slick dos vídeos
$('.tbs-videos').slick({
	arrows: false,
	dots: true,
	infinite: true,
	slidesToShow: 1,
	slidesToScroll: 1,
	fade: true
});

// Da Play nos Vídeos
$iconPlay.click(function(){
	$(this).siblings('img').css('display','none');
	$(this).siblings('.embed-responsive').addClass('visible');	
	$(this).siblings('.embed-responsive').find('iframe')[0].src += '&autoplay=1';	
	$(this).css('display', 'none');
});

// Resetar os Vídoes
$btnVideo.click(function(){	
	$iframePlay.each(function(){		
		var $srcIframe = $(this)[0].src;
		if($srcIframe.indexOf('&autoplay=1') !== -1){			
			var $newSrc = $(this)[0].src.replace('&autoplay=1', ' ');
			$(this)[0].src = $newSrc;			
			$(this).parents('.embed-responsive').siblings('img').css('display','block');
			$(this).parent('.embed-responsive').removeClass('visible');
			$iconPlay.css('display','block');
		}
	});
});


$formRegister.submit(function(e){
	e.preventDefault();
	var $inputName = $('.name').val(),
		$inputEmail = $('.email').val(),
		$inputcategoryD = $('.category').val();
		if($inputName !== 'Nome' && $inputEmail !== 'Email' && $inputcategoryD !== 'Category'){
			console.log('foi liso');
		}else{
			$(this).addClass('error');
		}
});





// $('#modal-quickview').vtexModal();