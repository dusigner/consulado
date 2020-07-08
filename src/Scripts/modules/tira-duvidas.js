
$('#btn-modal').click(function(){
	$('#cover, #modal').fadeTo(200,1);
	$('html').css({"overflow": "hidden", "height": "100vh"});
  });

  $('#close, #cover').click(function(){
	$('#cover, #modal').fadeTo(200,0).hide();
	$('html').css({"overflow": "inherit", "height": "auto"});
  });
