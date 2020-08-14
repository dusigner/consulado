// Insert the message to display
var message = 'Este site salva seu histórico de uso. Ao continuar navegando você concorda com a';
// link redirect to privacity politics
var textpolice = 'política de privacidade';
// url of police politics
var urlPolice = 'http://whirlpool.s3.amazonaws.com/wp-content/uploads/2020/05/Politica_de_Privacidade_CONSUL.pdf'
// exclamation purple
var exclamation = '!';
// Insert number of days until the cookie expires
var cookieLife = 90; //90 days according to LGPD
// Text of buttons
var btnNo = 'Fechar';
var btnYes = 'Aceitar';
// Add banner to the top or bottom of the page
var position = true;    // Default is bottom
// To active extra feature give true
var anchor = false;    // User accept when a link is clicked
var scroll = false;    // User accept when the page is scrolled

// Event that triggers the cookie banner
document.body.addEventListener('load', checkCookie());

// This function checks if the user has already accepted the cookies
function getCookie() {
	var name = 'cookie_yes' + '=';
	var ca = document.cookie.split(';');
	for(var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) === ' ') c = c.substring(1);
		if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
	}
	return '';
}

// If cookie has not been accept, show banner
function checkCookie() {

	if (!getCookie()) {

		// Create button "Yes" with text
		var newbutton1 = document.createElement('button');
		newbutton1.setAttribute('id','yes');
		newbutton1.onclick = () => { cookieYes() };
		var textButton1 = document.createTextNode(btnYes);
		newbutton1.appendChild(textButton1);

		// Create button "More Info" with text
		var newbutton2 = document.createElement('button');
		newbutton2.setAttribute('id','no');
		newbutton2.onclick = () => { cookieNo() };
		var textButton2 = document.createTextNode(btnNo);
		newbutton2.appendChild(textButton2);

		// Create p with message
		var newdesc = document.createElement('h1');
		newdesc.setAttribute('id', 'description')
		var text = document.createTextNode(message);
		// newdesc.setAttribute('append','urlPolice()')
		newdesc.appendChild(text);

		// Create p with exclamation
		var newp = document.createElement('p');
		var textp = document.createTextNode(exclamation);
		newp.appendChild(textp);

		// Create p with exclamation
		var newlink = document.createElement('a');
		newlink.setAttribute('id','url');
		var textlink = document.createTextNode(textpolice);
		newlink.onclick = () => { showPolice() };
		newlink.appendChild(textlink);

		var info = document.createElement('div');
		info.setAttribute('id','cookie-banner-info');
		info.appendChild(newp);
		info.appendChild(newdesc);

		newdesc.appendChild(newlink);

		var options = document.createElement('div');
		options.setAttribute('id','cookie-banner-options');
		options.appendChild(newbutton1);
		options.appendChild(newbutton2);

		// Create banner
		var newdiv = document.createElement('div');
		newdiv.setAttribute('id','cookie-banner');
		newdiv.appendChild(info);
		newdiv.appendChild(options);

		if (position) {
			document.body.appendChild(newdiv);
			document.getElementById('cookie-banner').style.bottom = 0;
			document.getElementById('cookie-banner').style.position = 'fixed';
		} else {
			document.body.insertBefore(newdiv, document.body.childNodes[0]);
			document.getElementById('cookie-banner').style.top = 0;
		}

		// EXTRA FEATURES
		// Acceptance of cookie law with a click in every "a" tag
		if (anchor) {
			var a = document.getElementsByTagName('a');
			for(var i = 0; i < a.length; i++) {
				a[i].setAttribute('onclick','cookieYes()');
			}
		}
		// Acceptance of cookie law with the scroll of the page
		if (scroll) {
			document.body.setAttribute('onscroll','cookieYes()');
		}
	}
}

// Function cookieYes() that installs the cookie
function cookieYes() {
	var d = new Date();
	d.setTime(d.getTime() + (cookieLife * 24 * 60 * 60 * 1000));
	var expires = 'expires=' + d.toUTCString();
	document.cookie = 'cookie_yes=yes; ' + expires + '; path=/';
	document.getElementById('cookie-banner').style.display = 'none';
}

// Function cookieNo() that opens the cookie page
function cookieNo() {
	document.getElementById('cookie-banner').style.display = 'none';
}

// Function showPolice() just open a new tab to see polices from
function showPolice() {
	window.open(urlPolice);
}
