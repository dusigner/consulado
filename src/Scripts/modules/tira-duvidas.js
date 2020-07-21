const { $body } = require("./orders/order.modal.gae");



$('#btn-modal').click(function(){
	$('#cover, #modal').fadeTo(200,1);
	$('html').css({"overflow": "hidden", "height": "100vh"});
  });

  $('#close, #cover').click(function(){
	$('#cover, #modal').fadeTo(200,0).hide();
	$('html').css({"overflow": "inherit", "height": "auto"});
  });

 $(".pergunta h2").click(function() {

	$("h2").removeClass("active");
	$(this).addClass("active");

	var target = $(this).next('div.resposta');
	$("div.resposta:visible").not(target).slideUp();
	target.slideToggle();
});


$(".toggle").click(function() {
	$(".toggle").removeClass("active");
	$(this).addClass("active");
	var target = $(this).next('ul.content');
	$("ul.content:visible").not(target).hide("fast");
	target.show("fast");
});

if ($('body').width() < 768){
	$('.btn-voltar').hide();
	$(".toggle").click(function() {
		$('.btn-voltar').show();
		$('.btn-voltar, .title-question').click(function() {
			$('.content').hide();
		});
	});
}

