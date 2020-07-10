
$('#btn-modal').click(function(){
	$('#cover, #modal').fadeTo(200,1);
	$('html').css({"overflow": "hidden", "height": "100vh"});
  });

  $('#close, #cover').click(function(){
	$('#cover, #modal').fadeTo(200,0).hide();
	$('html').css({"overflow": "inherit", "height": "auto"});
  });

//   $("ul.content").hide();
  $("ul.menu-main").delegate("li.toggle", "click", function() {
      $(this).next().toggle("slideLeft").siblings(".content").hide("slideLeft");
  });
  $("li.toggle").click(function() {
	$("li.toggle").removeClass("active");
	$(this).addClass("active");
 });

  $("h2").click(function() {
	var target = $(this).next('div.resposta')
	$("div.resposta:visible").not(target).slideUp();
	target.slideToggle();

});
