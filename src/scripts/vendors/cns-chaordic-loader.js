//Insert loader.js
(function insertLoader()
{ var script = document.createElement('script'); script.setAttribute('data-module', 'vtex'); script.setAttribute('data-apikey', 'consul'); script.setAttribute('data-initialize', 'false'); script.setAttribute('async', 'async'); script.setAttribute('defer', 'defer'); script.src='//static.chaordicsystems.com/static/loader.js'; document.getElementsByTagName('head')[0].appendChild(script); }
)();
//END: Insert loader.js
//Insert autocomplete plugin
function insertAutocomplete() {
var script = document.createElement('script');
script.setAttribute('async', 'async');
script.src='//scripts.neemu.com/consul/neemu_plugin.js';
document.getElementsByTagName('head')[0].appendChild(script);
//Remove default autocomplete
var autocomplete = document.getElementById('autocomplete-search');
if (autocomplete)
{ autocomplete.parentNode.removeChild(autocomplete); }
}
//END: Insert autocomplete plugin

//Redirect search form
(function redirectSearchForm() {
var maxRetries = 30;

(function tryRedirect() {
var form = document.body.querySelector('[action="/busca/"]');
var input = form && form.querySelector('input[name="ft"]');

maxRetries--;

if (input) {
//Insert autocomplete
if (!/vtexcommercestable/.test(window.location.href)) { insertAutocomplete(); }

form.action = 'http://busca.consul.com.br/busca';
input.name = 'q';

if (/vtexcommercestable/.test(window.location.hostname)) { var hiddenInput = document.createElement('input'); hiddenInput.type = 'hidden'; hiddenInput.name = 'vtexcommercestable'; hiddenInput.value = 1; //Insert hiddenInput form.insertBefore(hiddenInput, form.firstChild); }

if (/vtexcommercestable/.test(window.location.href)) { var copy = form.cloneNode(true); form.parentNode.replaceChild(copy, form); }

} else if (maxRetries > 0) { setTimeout(tryRedirect, 100); }
})();
})();
//END: Redirect search form