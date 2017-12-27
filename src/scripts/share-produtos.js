window.fbAsyncInit = function() {
    FB.init({
      appId            : '176573039585667',
      autoLogAppEvents : true,
      xfbml            : true,
      version          : 'v2.10'
    });
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = 'https://connect.facebook.net/pt_BR/sdk.js';
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));


   document.getElementById('shareBtn').onclick = function() {		
		FB.ui({
		  method: 'share_open_graph',
		  action_type: 'og.likes',
		  action_properties: JSON.stringify({
			object: url_atual,
		  })
		}, function(response){});
    };
    
    var url_atual = window.location.href;
    var titulopPro = $('.productName').html();
	var link = document.getElementById('compartilharTw');
  	link.setAttribute('href', 'http://twitter.com/share?text='+ titulopPro +'&url='+url_atual+'');

	$('#compartilharTw').on('click', function(e) {
        e.preventDefault();
        var share_link = $(this).prop('href');
		window.open(share_link, '_blank', 'toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=500,height=280');
  	});