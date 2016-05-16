/*Propriedade iProspect Brasil
Cliente: WHP - Tag padrão
Data criacao: 27/06/2012
*/

'use strict';
var _gaq = _gaq || [];
	_gaq.push(['_setAccount', 'UA-11625025-1']);
	_gaq.push(['_setDomainName', '.consul.com.br']);
	_gaq.push(['_trackPageview']);

(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

(function($){var days=24*60*60,hours=60*60,minutes=60;$.fn.countdown=function(prop){var options=$.extend({callback:function(){},timestamp:0},prop);var left,d,h,m,s,positions;init(this,options);positions=this.find(".position");(function tick(){left=Math.floor((options.timestamp-new Date)/1E3);if(left<0)left=0;d=Math.floor(left/days);updateDuo(0,1,d);left-=d*days;h=Math.floor(left/hours);updateDuo(2,3,h);left-=h*hours;m=Math.floor(left/minutes);updateDuo(4,5,m);left-=m*minutes;s=left;updateDuo(6,7,s);options.callback(d,h,m,s);setTimeout(tick,1E3)})();function updateDuo(minor,major,value){switchDigit(positions.eq(minor),Math.floor(value/10)%10);switchDigit(positions.eq(major),value%10)}return this};function init(elem,options){elem.addClass("countdownHolder");$.each(["Days","Hours","Minutes","Seconds"],function(i){var html='<span class="count count'+this+'"><span class="position">'+'<span class="digit static">0</span>'+"</span>"+'<span class="position">'+'<span class="digit static">0</span>'+"</span> </span>";$("#countdown").append(html);if(this!="Seconds")elem.append('<span class="countDiv countDiv'+i+'"></span>')})}function switchDigit(position,number){var digit=position.find(".digit");if(digit.is(":animated"))return false;if(position.data("digit")==number)return false;position.data("digit",number);var replacement=$("<span>",{"class":"digit",css:{top:"-2.1em",opacity:0},html:number});digit.before(replacement).removeClass("static").animate({top:"2.5em",opacity:0},"fast",function(){digit.remove()});replacement.delay(100).animate({top:0,opacity:1},"fast",function(){replacement.addClass("static")})}})(jQuery);

(function(h){var g={init:function(a){this.data("jqv")&&null!=this.data("jqv")||(a=g._saveOptions(this,a),h(document).on("click",".formError",function(){h(this).fadeOut(150,function(){h(this).closest(".formError").remove()})}));return this},attach:function(a){a=a?g._saveOptions(this,a):this.data("jqv");a.validateAttribute=this.find("[data-validation-engine*=validate]").length?"data-validation-engine":"class";a.binded&&(this.on(a.validationEventTrigger,"["+a.validateAttribute+"*=validate]:not([type=checkbox]):not([type=radio]):not(.datepicker)",g._onFieldEvent),this.on("click","["+a.validateAttribute+"*=validate][type=checkbox],["+a.validateAttribute+"*=validate][type=radio]",g._onFieldEvent),this.on(a.validationEventTrigger,"["+a.validateAttribute+"*=validate][class*=datepicker]",{delay:300},g._onFieldEvent));a.autoPositionUpdate&&h(window).bind("resize",{noAnimation:!0,formElem:this},g.updatePromptsPosition);this.on("click","a[data-validation-engine-skip], a[class*='validate-skip'], button[data-validation-engine-skip], button[class*='validate-skip'], input[data-validation-engine-skip], input[class*='validate-skip']",g._submitButtonClick);this.removeData("jqv_submitButton");this.on("submit",g._onSubmitEvent);return this},detach:function(){var a=this.data("jqv");this.off(a.validationEventTrigger,"["+a.validateAttribute+"*=validate]:not([type=checkbox]):not([type=radio]):not(.datepicker)",g._onFieldEvent);this.off("click","["+a.validateAttribute+"*=validate][type=checkbox],["+a.validateAttribute+"*=validate][type=radio]",g._onFieldEvent);this.off(a.validationEventTrigger,"["+a.validateAttribute+"*=validate][class*=datepicker]",g._onFieldEvent);this.off("submit",g._onSubmitEvent);this.removeData("jqv");this.off("click","a[data-validation-engine-skip], a[class*='validate-skip'], button[data-validation-engine-skip], button[class*='validate-skip'], input[data-validation-engine-skip], input[class*='validate-skip']",g._submitButtonClick);this.removeData("jqv_submitButton");a.autoPositionUpdate&&h(window).off("resize",g.updatePromptsPosition);return this},validate:function(a){var b=h(this),d=null,c;if(b.is("form")||b.hasClass("validationEngineContainer")){if(b.hasClass("validating"))return!1;b.addClass("validating");c=a?g._saveOptions(b,a):b.data("jqv");d=g._validateFields(this);setTimeout(function(){b.removeClass("validating")},100);if(d&&c.onSuccess)c.onSuccess();else if(!d&&c.onFailure)c.onFailure()}else if(b.is("form")||b.hasClass("validationEngineContainer"))b.removeClass("validating");else{var f=b.closest("form, .validationEngineContainer");c=f.data("jqv")?f.data("jqv"):h.validationEngine.defaults;d=g._validateField(b,c)}return c.onValidationComplete?!!c.onValidationComplete(f,d):d},updatePromptsPosition:function(a){if(a&&this==window)var b=a.data.formElem,d=a.data.noAnimation;else b=h(this.closest("form, .validationEngineContainer"));var c=b.data("jqv");c||(c=g._saveOptions(b,c));b.find("["+c.validateAttribute+"*=validate]").not(":disabled").each(function(){var a=h(this);c.prettySelect&&a.is(":hidden")&&(a=b.find("#"+c.usePrefix+a.attr("id")+c.useSuffix));var e=g._getPrompt(a),m=h(e).find(".formErrorContent").html();e&&g._updatePrompt(a,h(e),m,void 0,!1,c,d)});return this},showPrompt:function(a,b,d,c){var f=this.closest("form, .validationEngineContainer").data("jqv");f||(f=g._saveOptions(this,f));d&&(f.promptPosition=d);f.showArrow=1==c;g._showPrompt(this,a,b,!1,f);return this},hide:function(){var a=h(this).closest("form, .validationEngineContainer"),b=a.data("jqv");b||(b=g._saveOptions(a,b));a=b&&b.fadeDuration?b.fadeDuration:.3;b=h(this).is("form")||h(this).hasClass("validationEngineContainer")?"parentForm"+g._getClassName(h(this).attr("id")):g._getClassName(h(this).attr("id"))+"formError";h("."+b).fadeTo(a,0,function(){h(this).closest(".formError").remove()});return this},hideAll:function(){var a=this.data("jqv"),a=a?a.fadeDuration:300;h(".formError").fadeTo(a,0,function(){h(this).closest(".formError").remove()});return this},_onFieldEvent:function(a){var b=h(this),d=b.closest("form, .validationEngineContainer"),c=d.data("jqv");c||(c=g._saveOptions(d,c));c.eventTrigger="field";1==c.notEmpty?0<b.val().length&&window.setTimeout(function(){g._validateField(b,c)},a.data?a.data.delay:0):window.setTimeout(function(){g._validateField(b,c)},a.data?a.data.delay:0)},_onSubmitEvent:function(){var a=h(this),b=a.data("jqv");if(a.data("jqv_submitButton")){var d=h("#"+a.data("jqv_submitButton"));if(d&&0<d.length&&(d.hasClass("validate-skip")||"true"==d.attr("data-validation-engine-skip")))return!0}b.eventTrigger="submit";return(d=g._validateFields(a))&&b.ajaxFormValidation?(g._validateFormWithAjax(a,b),!1):b.onValidationComplete?!!b.onValidationComplete(a,d):d},_checkAjaxStatus:function(a){var b=!0;h.each(a.ajaxValidCache,function(a,c){if(!c)return b=!1});return b},_checkAjaxFieldStatus:function(a,b){return 1==b.ajaxValidCache[a]},_validateFields:function(a){var b=a.data("jqv"),d=!1;a.trigger("jqv.form.validating");var c=null;a.find("["+b.validateAttribute+"*=validate]").not(":disabled").each(function(){var e=h(this),f=[];if(0>h.inArray(e.attr("name"),f)){(d|=g._validateField(e,b))&&null==c&&(e.is(":hidden")&&b.prettySelect?c=e=a.find("#"+b.usePrefix+g._jqSelector(e.attr("id"))+b.useSuffix):(e.data("jqv-prompt-at")instanceof jQuery?e=e.data("jqv-prompt-at"):e.data("jqv-prompt-at")&&(e=h(e.data("jqv-prompt-at"))),c=e));if(b.doNotShowAllErrosOnSubmit)return!1;f.push(e.attr("name"));if(1==b.showOneMessage&&d)return!1}});a.trigger("jqv.form.result",[d]);if(d){if(b.scroll){var f=c.offset().top,e=c.offset().left,m=b.promptPosition;"string"==typeof m&&-1!=m.indexOf(":")&&(m=m.substring(0,m.indexOf(":")));"bottomRight"!=m&&"bottomLeft"!=m&&(m=g._getPrompt(c))&&(f=m.offset().top);b.scrollOffset&&(f-=b.scrollOffset);if(b.isOverflown){m=h(b.overflownDIV);if(!m.length)return!1;e=m.scrollTop();m=-parseInt(m.offset().top);f+=e+m-5;h(b.overflownDIV).filter(":not(:animated)").animate({scrollTop:f},1100,function(){b.focusFirstField&&c.focus()})}else h("html, body").animate({scrollTop:f},1100,function(){b.focusFirstField&&c.focus()}),h("html, body").animate({scrollLeft:e},1100)}else b.focusFirstField&&c.focus();return!1}return!0},_validateFormWithAjax:function(a,b){var d=a.serialize(),c=b.ajaxFormValidationMethod?b.ajaxFormValidationMethod:"GET",f=b.ajaxFormValidationURL?b.ajaxFormValidationURL:a.attr("action"),e=b.dataType?b.dataType:"json";h.ajax({type:c,url:f,cache:!1,dataType:e,data:d,form:a,methods:g,options:b,beforeSend:function(){return b.onBeforeAjaxFormValidation(a,b)},error:function(a,c){if(b.onFailure)b.onFailure(a,c);else g._ajaxError(a,c)},success:function(c){if("json"==e&&!0!==c){for(var d=!1,f=0;f<c.length;f++){var p=c[f],l=h(h("#"+p[0])[0]);if(1==l.length){var k=p[2];1==p[1]?""!=k&&k?(b.allrules[k]&&(p=b.allrules[k].alertTextOk)&&(k=p),b.showPrompts&&g._showPrompt(l,k,"pass",!1,b,!0)):g._closePrompt(l):(d|=1,b.allrules[k]&&(p=b.allrules[k].alertText)&&(k=p),b.showPrompts&&g._showPrompt(l,k,"",!1,b,!0))}}b.onAjaxFormComplete(!d,a,c,b)}else b.onAjaxFormComplete(!0,a,c,b)}})},_validateField:function(a,b,d){a.attr("id")||(a.attr("id","form-validation-field-"+h.validationEngine.fieldIdCounter),++h.validationEngine.fieldIdCounter);if(a.hasClass(b.ignoreFieldsWithClass)||!b.validateNonVisibleFields&&(a.is(":hidden")&&!b.prettySelect||a.parent().is(":hidden")))return!1;var c=a.attr(b.validateAttribute),c=/validate\[(.*)\]/.exec(c);if(!c)return!1;var f=c[1],e=f.split(/\[|,|\]/),c=a.attr("name"),m="",r="",q=!1,p=!1;b.isError=!1;b.showArrow=!0;0<b.maxErrorsPerField&&(p=!0);for(var l=h(a.closest("form, .validationEngineContainer")),k=0;k<e.length;k++)e[k]=e[k].replace(" ",""),""===e[k]&&delete e[k];for(var t=k=0;k<e.length;k++){if(p&&t>=b.maxErrorsPerField){q||(d=h.inArray("required",e),q=-1!=d&&d>=k);break}var n=void 0;switch(e[k]){case "required":q=!0;n=g._getErrorMessage(l,a,e[k],e,k,b,g._required);break;case "custom":n=g._getErrorMessage(l,a,e[k],e,k,b,g._custom);break;case "groupRequired":var s="["+b.validateAttribute+"*="+e[k+1]+"]",n=l.find(s).eq(0);n[0]!=a[0]&&(g._validateField(n,b,d),b.showArrow=!0);(n=g._getErrorMessage(l,a,e[k],e,k,b,g._groupRequired))&&(q=!0);b.showArrow=!1;break;case "ajax":(n=g._ajax(a,e,k,b))&&(r="load");break;case "minSize":n=g._getErrorMessage(l,a,e[k],e,k,b,g._minSize);break;case "maxSize":n=g._getErrorMessage(l,a,e[k],e,k,b,g._maxSize);break;case "min":n=g._getErrorMessage(l,a,e[k],e,k,b,g._min);break;case "max":n=g._getErrorMessage(l,a,e[k],e,k,b,g._max);break;case "past":n=g._getErrorMessage(l,a,e[k],e,k,b,g._past);break;case "future":n=g._getErrorMessage(l,a,e[k],e,k,b,g._future);break;case "dateRange":s="["+b.validateAttribute+"*="+e[k+1]+"]";b.firstOfGroup=l.find(s).eq(0);b.secondOfGroup=l.find(s).eq(1);if(b.firstOfGroup[0].value||b.secondOfGroup[0].value)n=g._getErrorMessage(l,a,e[k],e,k,b,g._dateRange);n&&(q=!0);b.showArrow=!1;break;case "dateTimeRange":s="["+b.validateAttribute+"*="+e[k+1]+"]";b.firstOfGroup=l.find(s).eq(0);b.secondOfGroup=l.find(s).eq(1);if(b.firstOfGroup[0].value||b.secondOfGroup[0].value)n=g._getErrorMessage(l,a,e[k],e,k,b,g._dateTimeRange);n&&(q=!0);b.showArrow=!1;break;case "maxCheckbox":a=h(l.find("input[name='"+c+"']"));n=g._getErrorMessage(l,a,e[k],e,k,b,g._maxCheckbox);break;case "minCheckbox":a=h(l.find("input[name='"+c+"']"));n=g._getErrorMessage(l,a,e[k],e,k,b,g._minCheckbox);break;case "equals":n=g._getErrorMessage(l,a,e[k],e,k,b,g._equals);break;case "funcCall":n=g._getErrorMessage(l,a,e[k],e,k,b,g._funcCall);break;case "creditCard":n=g._getErrorMessage(l,a,e[k],e,k,b,g._creditCard);break;case "condRequired":n=g._getErrorMessage(l,a,e[k],e,k,b,g._condRequired);void 0!==n&&(q=!0);break;case "funcCallRequired":n=g._getErrorMessage(l,a,e[k],e,k,b,g._funcCallRequired),void 0!==n&&(q=!0)}s=!1;if("object"==typeof n)switch(n.status){case "_break":s=!0;break;case "_error":n=n.message;break;case "_error_no_prompt":return!0}0==k&&0==f.indexOf("funcCallRequired")&&void 0!==n&&(m+=n+"<br/>",b.isError=!0,t++,s=!0);if(s)break;"string"==typeof n&&(m+=n+"<br/>",b.isError=!0,t++)}!q&&!a.val()&&1>a.val().length&&0>h.inArray("equals",e)&&(b.isError=!1);d=a.prop("type");e=a.data("promptPosition")||b.promptPosition;("radio"==d||"checkbox"==d)&&1<l.find("input[name='"+c+"']").size()&&(a="inline"===e?h(l.find("input[name='"+c+"'][type!=hidden]:last")):h(l.find("input[name='"+c+"'][type!=hidden]:first")),b.showArrow=b.showArrowOnRadioAndCheckbox);a.is(":hidden")&&b.prettySelect&&(a=l.find("#"+b.usePrefix+g._jqSelector(a.attr("id"))+b.useSuffix));b.isError&&b.showPrompts?g._showPrompt(a,m,r,!1,b):g._closePrompt(a);a.trigger("jqv.field.result",[a,b.isError,m]);c=h.inArray(a[0],b.InvalidFields);-1==c?b.isError&&b.InvalidFields.push(a[0]):b.isError||b.InvalidFields.splice(c,1);g._handleStatusCssClasses(a,b);if(b.isError&&b.onFieldFailure)b.onFieldFailure(a);if(!b.isError&&b.onFieldSuccess)b.onFieldSuccess(a);return b.isError},_handleStatusCssClasses:function(a,b){b.addSuccessCssClassToField&&a.removeClass(b.addSuccessCssClassToField);b.addFailureCssClassToField&&a.removeClass(b.addFailureCssClassToField);b.addSuccessCssClassToField&&!b.isError&&a.addClass(b.addSuccessCssClassToField);b.addFailureCssClassToField&&b.isError&&a.addClass(b.addFailureCssClassToField)},_getErrorMessage:function(a,b,d,c,f,e,m){var r=jQuery.inArray(d,c);if("custom"===d||"funcCall"===d||"funcCallRequired"===d)d=d+"["+c[r+1]+"]",delete c[r];var r=d,q=(b.attr("data-validation-engine")?b.attr("data-validation-engine"):b.attr("class")).split(" ");a="future"==d||"past"==d||"maxCheckbox"==d||"minCheckbox"==d?m(a,b,c,f,e):m(b,c,f,e);void 0!=a&&(b=g._getCustomErrorMessage(h(b),q,r,e))&&(a=b);return a},_getCustomErrorMessage:function(a,b,d,c){var f=!1,f=/^custom\[.*\]$/.test(d)?g._validityProp.custom:g._validityProp[d];if(void 0!=f&&(f=a.attr("data-errormessage-"+f),void 0!=f))return f;f=a.attr("data-errormessage");if(void 0!=f)return f;a="#"+a.attr("id");if("undefined"!=typeof c.custom_error_messages[a]&&"undefined"!=typeof c.custom_error_messages[a][d])f=c.custom_error_messages[a][d].message;else if(0<b.length)for(a=0;a<b.length&&0<b.length;a++){var e="."+b[a];if("undefined"!=typeof c.custom_error_messages[e]&&"undefined"!=typeof c.custom_error_messages[e][d]){f=c.custom_error_messages[e][d].message;break}}f||"undefined"==typeof c.custom_error_messages[d]||"undefined"==typeof c.custom_error_messages[d].message||(f=c.custom_error_messages[d].message);return f},_validityProp:{required:"value-missing",custom:"custom-error",groupRequired:"value-missing",ajax:"custom-error",minSize:"range-underflow",maxSize:"range-overflow",min:"range-underflow",max:"range-overflow",past:"type-mismatch",future:"type-mismatch",dateRange:"type-mismatch",dateTimeRange:"type-mismatch",maxCheckbox:"range-overflow",minCheckbox:"range-underflow",equals:"pattern-mismatch",funcCall:"custom-error",funcCallRequired:"custom-error",creditCard:"pattern-mismatch",condRequired:"value-missing"},_required:function(a,b,d,c,f){switch(a.prop("type")){case "radio":case "checkbox":if(f){if(!a.prop("checked"))return c.allrules[b[d]].alertTextCheckboxMultiple;break}f=a.closest("form, .validationEngineContainer");a=a.attr("name");if(0==f.find("input[name='"+a+"']:checked").size())return 1==f.find("input[name='"+a+"']:visible").size()?c.allrules[b[d]].alertTextCheckboxe:c.allrules[b[d]].alertTextCheckboxMultiple;break;default:f=h.trim(a.val());var e=h.trim(a.attr("data-validation-placeholder"));a=h.trim(a.attr("placeholder"));if(!f||e&&f==e||a&&f==a)return c.allrules[b[d]].alertText}},_groupRequired:function(a,b,d,c){var f="["+c.validateAttribute+"*="+b[d+1]+"]",e=!1;a.closest("form, .validationEngineContainer").find(f).each(function(){if(!g._required(h(this),b,d,c))return e=!0,!1});if(!e)return c.allrules[b[d]].alertText},_custom:function(a,b,d,c){var f=b[d+1],e=c.allrules[f];if(e)if(e.regex)if(b=e.regex,!b)alert("jqv:custom regex not found - "+f);else{if(!(new RegExp(b)).test(a.val()))return c.allrules[f].alertText}else if(e.func)if(e=e.func,"function"!==typeof e)alert("jqv:custom parameter 'function' is no function - "+f);else{if(!e(a,b,d,c))return c.allrules[f].alertText}else alert("jqv:custom type not allowed "+f);else alert("jqv:custom rule not found - "+f)},_funcCall:function(a,b,d,c){var f=b[d+1];if(-1<f.indexOf(".")){for(var f=f.split("."),e=window;f.length;)e=e[f.shift()];f=e}else f=window[f]||c.customFunctions[f];if("function"==typeof f)return f(a,b,d,c)},_funcCallRequired:function(a,b,d,c){return g._funcCall(a,b,d,c)},_equals:function(a,b,d,c){b=b[d+1];if(a.val()!=h("#"+b).val())return c.allrules.equals.alertText},_maxSize:function(a,b,d,c){b=b[d+1];if(a.val().length>b)return a=c.allrules.maxSize,a.alertText+b+a.alertText2},_minSize:function(a,b,d,c){b=b[d+1];if(a.val().length<b)return a=c.allrules.minSize,a.alertText+b+a.alertText2},_min:function(a,b,d,c){b=parseFloat(b[d+1]);if(parseFloat(a.val())<b)return a=c.allrules.min,a.alertText2?a.alertText+b+a.alertText2:a.alertText+b},_max:function(a,b,d,c){b=parseFloat(b[d+1]);if(parseFloat(a.val())>b)return a=c.allrules.max,a.alertText2?a.alertText+b+a.alertText2:a.alertText+b},_past:function(a,b,d,c,f){d=d[c+1];a=h(a.find("*[name='"+d.replace(/^#+/,"")+"']"));if("now"==d.toLowerCase())a=new Date;else if(void 0!=a.val()){if(a.is(":disabled"))return;a=g._parseDate(a.val())}else a=g._parseDate(d);if(g._parseDate(b.val())>a)return b=f.allrules.past,b.alertText2?b.alertText+g._dateToString(a)+b.alertText2:b.alertText+g._dateToString(a)},_future:function(a,b,d,c,f){d=d[c+1];a=h(a.find("*[name='"+d.replace(/^#+/,"")+"']"));if("now"==d.toLowerCase())a=new Date;else if(void 0!=a.val()){if(a.is(":disabled"))return;a=g._parseDate(a.val())}else a=g._parseDate(d);if(g._parseDate(b.val())<a)return b=f.allrules.future,b.alertText2?b.alertText+g._dateToString(a)+b.alertText2:b.alertText+g._dateToString(a)},_isDate:function(a){return(new RegExp(/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$|^(?:(?:(?:0?[13578]|1[02])(\/|-)31)|(?:(?:0?[1,3-9]|1[0-2])(\/|-)(?:29|30)))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(?:(?:0?[1-9]|1[0-2])(\/|-)(?:0?[1-9]|1\d|2[0-8]))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(0?2(\/|-)29)(\/|-)(?:(?:0[48]00|[13579][26]00|[2468][048]00)|(?:\d\d)?(?:0[48]|[2468][048]|[13579][26]))$/)).test(a)},_isDateTime:function(a){return(new RegExp(/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])\s+(1[012]|0?[1-9]){1}:(0?[1-5]|[0-6][0-9]){1}:(0?[0-6]|[0-6][0-9]){1}\s+(am|pm|AM|PM){1}$|^(?:(?:(?:0?[13578]|1[02])(\/|-)31)|(?:(?:0?[1,3-9]|1[0-2])(\/|-)(?:29|30)))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^((1[012]|0?[1-9]){1}\/(0?[1-9]|[12][0-9]|3[01]){1}\/\d{2,4}\s+(1[012]|0?[1-9]){1}:(0?[1-5]|[0-6][0-9]){1}:(0?[0-6]|[0-6][0-9]){1}\s+(am|pm|AM|PM){1})$/)).test(a)},_dateCompare:function(a,b){return new Date(a.toString())<new Date(b.toString())},_dateRange:function(a,b,d,c){if(!c.firstOfGroup[0].value&&c.secondOfGroup[0].value||c.firstOfGroup[0].value&&!c.secondOfGroup[0].value||!g._isDate(c.firstOfGroup[0].value)||!g._isDate(c.secondOfGroup[0].value)||!g._dateCompare(c.firstOfGroup[0].value,c.secondOfGroup[0].value))return c.allrules[b[d]].alertText+c.allrules[b[d]].alertText2},_dateTimeRange:function(a,b,d,c){if(!c.firstOfGroup[0].value&&c.secondOfGroup[0].value||c.firstOfGroup[0].value&&!c.secondOfGroup[0].value||!g._isDateTime(c.firstOfGroup[0].value)||!g._isDateTime(c.secondOfGroup[0].value)||!g._dateCompare(c.firstOfGroup[0].value,c.secondOfGroup[0].value))return c.allrules[b[d]].alertText+c.allrules[b[d]].alertText2},_maxCheckbox:function(a,b,d,c,f){d=d[c+1];b=b.attr("name");if(a.find("input[name='"+b+"']:checked").size()>d)return f.showArrow=!1,f.allrules.maxCheckbox.alertText2?f.allrules.maxCheckbox.alertText+" "+d+" "+f.allrules.maxCheckbox.alertText2:f.allrules.maxCheckbox.alertText},_minCheckbox:function(a,b,d,c,f){d=d[c+1];b=b.attr("name");if(a.find("input[name='"+b+"']:checked").size()<d)return f.showArrow=!1,f.allrules.minCheckbox.alertText+" "+d+" "+f.allrules.minCheckbox.alertText2},_creditCard:function(a,b,d,c){d=!1;a=a.val().replace(/ +/g,"").replace(/-+/g,"");var f=a.length;if(14<=f&&16>=f&&0<parseInt(a)){b=0;d=f-1;var f=1,e,g=new String;do e=parseInt(a.charAt(d)),g+=0==f++%2?2*e:e;while(0<=--d);for(d=0;d<g.length;d++)b+=parseInt(g.charAt(d));d=0==b%10}if(!d)return c.allrules.creditCard.alertText},_ajax:function(a,b,d,c){var f=c.allrules[b[d+1]];d=f.extraData;var e=f.extraDataDynamic;b={fieldId:a.attr("id"),fieldValue:a.val()};if("object"===typeof d)h.extend(b,d);else if("string"===typeof d){var m=d.split("&");for(d=0;d<m.length;d++){var r=m[d].split("=");r[0]&&r[0]&&(b[r[0]]=r[1])}}if(e)for(e=String(e).split(","),d=0;d<e.length;d++)m=e[d],h(m).length&&(r=a.closest("form, .validationEngineContainer").find(m).val(),m.replace("#",""),escape(r),b[m.replace("#","")]=r);"field"==c.eventTrigger&&delete c.ajaxValidCache[a.attr("id")];if(!c.isError&&!g._checkAjaxFieldStatus(a.attr("id"),c))return h.ajax({type:c.ajaxFormValidationMethod,url:f.url,cache:!1,dataType:"json",data:b,field:a,rule:f,methods:g,options:c,beforeSend:function(){},error:function(a,b){if(c.onFailure)c.onFailure(a,b);else g._ajaxError(a,b)},success:function(b){var d=b[0],e=h("#"+d).eq(0);if(1==e.length){var k=b[2];b[1]?(c.ajaxValidCache[d]=!0,k?c.allrules[k]&&(b=c.allrules[k].alertTextOk)&&(k=b):k=f.alertTextOk,c.showPrompts&&(k?g._showPrompt(e,k,"pass",!0,c):g._closePrompt(e)),"submit"==c.eventTrigger&&a.closest("form").submit()):(c.ajaxValidCache[d]=!1,c.isError=!0,k?c.allrules[k]&&(b=c.allrules[k].alertText)&&(k=b):k=f.alertText,c.showPrompts&&g._showPrompt(e,k,"",!0,c))}e.trigger("jqv.field.result",[e,c.isError,k])}}),f.alertTextLoad},_ajaxError:function(a,b){0==a.status&&null==b?alert("The page is not served from a server! ajax call failed"):"undefined"!=typeof console&&console.log("Ajax error: "+a.status+" "+b)},_dateToString:function(a){return a.getFullYear()+"-"+(a.getMonth()+1)+"-"+a.getDate()},_parseDate:function(a){var b=a.split("-");b==a&&(b=a.split("/"));return b==a?(b=a.split("."),new Date(b[2],b[1]-1,b[0])):new Date(b[0],b[1]-1,b[2])},_showPrompt:function(a,b,d,c,f,e){a.data("jqv-prompt-at")instanceof jQuery?a=a.data("jqv-prompt-at"):a.data("jqv-prompt-at")&&(a=h(a.data("jqv-prompt-at")));var m=g._getPrompt(a);e&&(m=!1);h.trim(b)&&(m?g._updatePrompt(a,m,b,d,c,f):g._buildPrompt(a,b,d,c,f))},_buildPrompt:function(a,b,d,c,f){var e=h("<div>");e.addClass(g._getClassName(a.attr("id"))+"formError");e.addClass("parentForm"+g._getClassName(a.closest("form, .validationEngineContainer").attr("id")));e.addClass("formError");switch(d){case "pass":e.addClass("greenPopup");break;case "load":e.addClass("blackPopup")}c&&e.addClass("ajaxed");h("<div>").addClass("formErrorContent").html(b).appendTo(e);b=a.data("promptPosition")||f.promptPosition;if(f.showArrow)switch(d=h("<div>").addClass("formErrorArrow"),"string"==typeof b&&(c=b.indexOf(":"),-1!=c&&(b=b.substring(0,c))),b){case "bottomLeft":case "bottomRight":e.find(".formErrorContent").before(d);d.addClass("formErrorArrowBottom").html('<div class="line1">\x3c!-- --\x3e</div><div class="line2">\x3c!-- --\x3e</div><div class="line3">\x3c!-- --\x3e</div><div class="line4">\x3c!-- --\x3e</div><div class="line5">\x3c!-- --\x3e</div><div class="line6">\x3c!-- --\x3e</div><div class="line7">\x3c!-- --\x3e</div><div class="line8">\x3c!-- --\x3e</div><div class="line9">\x3c!-- --\x3e</div><div class="line10">\x3c!-- --\x3e</div>');break;case "topLeft":case "topRight":d.html('<div class="line10">\x3c!-- --\x3e</div><div class="line9">\x3c!-- --\x3e</div><div class="line8">\x3c!-- --\x3e</div><div class="line7">\x3c!-- --\x3e</div><div class="line6">\x3c!-- --\x3e</div><div class="line5">\x3c!-- --\x3e</div><div class="line4">\x3c!-- --\x3e</div><div class="line3">\x3c!-- --\x3e</div><div class="line2">\x3c!-- --\x3e</div><div class="line1">\x3c!-- --\x3e</div>'),e.append(d)}f.addPromptClass&&e.addClass(f.addPromptClass);d=a.attr("data-required-class");void 0!==d?e.addClass(d):f.prettySelect&&h("#"+a.attr("id")).next().is("select")&&(d=h("#"+a.attr("id").substr(f.usePrefix.length).substring(f.useSuffix.length)).attr("data-required-class"),void 0!==d&&e.addClass(d));e.css({opacity:0});"inline"===b?(e.addClass("inline"),"undefined"!==typeof a.attr("data-prompt-target")&&0<h("#"+a.attr("data-prompt-target")).length?e.appendTo(h("#"+a.attr("data-prompt-target"))):a.after(e)):a.before(e);c=g._calculatePosition(a,e,f);e.css({position:"inline"===b?"relative":"absolute",top:c.callerTopPosition,left:c.callerleftPosition,marginTop:c.marginTopSize,opacity:0}).data("callerField",a);f.autoHidePrompt&&setTimeout(function(){e.animate({opacity:0},function(){e.closest(".formError").remove()})},f.autoHideDelay);return e.animate({opacity:.87})},_updatePrompt:function(a,b,d,c,f,e,h){b&&("undefined"!==typeof c&&("pass"==c?b.addClass("greenPopup"):b.removeClass("greenPopup"),"load"==c?b.addClass("blackPopup"):b.removeClass("blackPopup")),f?b.addClass("ajaxed"):b.removeClass("ajaxed"),b.find(".formErrorContent").html(d),a=g._calculatePosition(a,b,e),a={top:a.callerTopPosition,left:a.callerleftPosition,marginTop:a.marginTopSize,opacity:.87},h?b.css(a):b.animate(a))},_closePrompt:function(a){var b=g._getPrompt(a);b&&b.fadeTo("fast",0,function(){b.closest(".formError").remove()})},closePrompt:function(a){return g._closePrompt(a)},_getPrompt:function(a){var b=h(a).closest("form, .validationEngineContainer").attr("id");a=g._getClassName(a.attr("id"))+"formError";if(b=h("."+g._escapeExpression(a)+".parentForm"+g._getClassName(b))[0])return h(b)},_escapeExpression:function(a){return a.replace(/([#;&,\.\+\*\~':"\!\^$\[\]\(\)=>\|])/g,"\\$1")},isRTL:function(a){var b=h(document),d=h("body");a=a&&a.hasClass("rtl")||a&&"rtl"===(a.attr("dir")||"").toLowerCase()||b.hasClass("rtl")||"rtl"===(b.attr("dir")||"").toLowerCase()||d.hasClass("rtl")||"rtl"===(d.attr("dir")||"").toLowerCase();return Boolean(a)},_calculatePosition:function(a,b,d){var c,f,e,g=a.width(),h=a.position().left,q=a.position().top;a.height();e=b.height();c=f=0;e=-e;d=a.data("promptPosition")||d.promptPosition;var p="",l="",k=l=0;"string"==typeof d&&-1!=d.indexOf(":")&&(p=d.substring(d.indexOf(":")+1),d=d.substring(0,d.indexOf(":")),-1!=p.indexOf(",")&&(l=p.substring(p.indexOf(",")+1),p=p.substring(0,p.indexOf(",")),k=parseInt(l),isNaN(k)&&(k=0)),l=parseInt(p),isNaN(p));switch(d){default:case "topRight":f+=h+g-27;c+=q;break;case "topLeft":c+=q;f+=h;break;case "centerRight":c=q+4;e=0;f=h+a.outerWidth(!0)+5;break;case "centerLeft":f=h-(b.width()+2);c=q+4;e=0;break;case "bottomLeft":c=q+a.height()+5;e=0;f=h;break;case "bottomRight":f=h+g-27;c=q+a.height()+5;e=0;break;case "inline":e=c=f=0}return{callerTopPosition:c+k+"px",callerleftPosition:f+l+"px",marginTopSize:e+"px"}},_saveOptions:function(a,b){if(h.validationEngineLanguage)var d=h.validationEngineLanguage.allRules;else h.error("jQuery.validationEngine rules are not loaded, plz add localization files to the page");h.validationEngine.defaults.allrules=d;d=h.extend(!0,{},h.validationEngine.defaults,b);a.data("jqv",d);return d},_getClassName:function(a){if(a)return a.replace(/:/g,"_").replace(/\./g,"_")},_jqSelector:function(a){return a.replace(/([;&,\.\+\*\~':"\!\^#$%@\[\]\(\)=>\|])/g,"\\$1")},_condRequired:function(a,b,d,c){var f;for(d+=1;d<b.length;d++)if(f=jQuery("#"+b[d]).first(),f.length&&void 0==g._required(f,["required"],0,c,!0))return g._required(a,["required"],0,c)},_submitButtonClick:function(a){a=h(this);a.closest("form, .validationEngineContainer").data("jqv_submitButton",a.attr("id"))}};h.fn.validationEngine=function(a){var b=h(this);if(!b[0])return b;if("string"==typeof a&&"_"!=a.charAt(0)&&g[a])return"showPrompt"!=a&&"hide"!=a&&"hideAll"!=a&&g.init.apply(b),g[a].apply(b,Array.prototype.slice.call(arguments,1));if("object"!=typeof a&&a)h.error("Method "+a+" does not exist in jQuery.validationEngine");else return g.init.apply(b,arguments),g.attach.apply(b)};h.validationEngine={fieldIdCounter:0,defaults:{validationEventTrigger:"blur",scroll:!0,focusFirstField:!0,showPrompts:!0,validateNonVisibleFields:!1,ignoreFieldsWithClass:"ignoreMe",promptPosition:"topRight",bindMethod:"bind",inlineAjax:!1,ajaxFormValidation:!1,ajaxFormValidationURL:!1,ajaxFormValidationMethod:"get",onAjaxFormComplete:h.noop,onBeforeAjaxFormValidation:h.noop,onValidationComplete:!1,doNotShowAllErrosOnSubmit:!1,custom_error_messages:{},binded:!0,notEmpty:!1,showArrow:!0,showArrowOnRadioAndCheckbox:!1,isError:!1,maxErrorsPerField:!1,ajaxValidCache:{},autoPositionUpdate:!1,InvalidFields:[],onFieldSuccess:!1,onFieldFailure:!1,onSuccess:!1,onFailure:!1,validateAttribute:"class",addSuccessCssClassToField:"",addFailureCssClassToField:"",autoHidePrompt:!1,autoHideDelay:1E4,fadeDuration:300,prettySelect:!1,addPromptClass:"",usePrefix:"",useSuffix:"",showOneMessage:!1}};h(function(){h.validationEngine.defaults.promptPosition=g.isRTL()?"topLeft":"topRight"})})(jQuery);

/* Limita quantidade de caracteres */
(function($) {
	$.fn.extend( {
		limit: function(limit,element) {
			var interval;
			var self = $(this);

			$(this).focus(function(){
				interval = window.setInterval(substring,100);
			});

			$(this).blur(function(){
				clearInterval(interval);
				substring();
			});

			function substring(){
				var length = $(self).val().replace(/(\r\n|\n|\r|\s+|\\)/gm,' ').length;
				var count;
				if (element) {
					count = (limit-length<=0)?'0':limit-length;
				}

				$(element).html("Ainda faltam "+ count +" caracteres");

				if (length > limit) {
					$(self).val($(self).val().substring(0,limit));
				}
			}

			substring();

		}
	});
})(jQuery);

// usage: log('inside coolFunc', this, arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function f(){ log.history = log.history || []; log.history.push(arguments); if(this.console) { var args = arguments, newarr; args.callee = args.callee.caller; newarr = [].slice.call(args); if (typeof console.log === 'object') log.apply.call(console.log, console, newarr); else console.log.apply(console, newarr);}};

// make it safe to use console.log always
(function(a){function b(){}for(var c="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),d;!!(d=c.pop());){a[d]=a[d]||b;}})
(function(){try{console.log();return window.console;}catch(a){return (window.console={});}}());

// place any jQuery/helper plugins in here, instead of separate, slower script files.

/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 *
 * Open source under the BSD License.
 *
 * Copyright Â© 2008 George McGinley Smith
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the author nor the names of contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *	COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *	EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *	GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *	NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend(jQuery.easing, {
	def: 'easeOutQuad',
	swing: function(x, t, b, c, d) {
		//alert(jQuery.easing.default);
		return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
	},
	easeInQuad: function(x, t, b, c, d) {
		return c * (t /= d) * t + b;
	},
	easeOutQuad: function(x, t, b, c, d) {
		return -c * (t /= d) * (t - 2) + b;
	},
	easeInOutQuad: function(x, t, b, c, d) {
		if ((t /= d / 2) < 1) return c / 2 * t * t + b;
		return -c / 2 * ((--t) * (t - 2) - 1) + b;
	},
	easeInCubic: function(x, t, b, c, d) {
		return c * (t /= d) * t * t + b;
	},
	easeOutCubic: function(x, t, b, c, d) {
		return c * ((t = t / d - 1) * t * t + 1) + b;
	},
	easeInOutCubic: function(x, t, b, c, d) {
		if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
		return c / 2 * ((t -= 2) * t * t + 2) + b;
	},
	easeInQuart: function(x, t, b, c, d) {
		return c * (t /= d) * t * t * t + b;
	},
	easeOutQuart: function(x, t, b, c, d) {
		return -c * ((t = t / d - 1) * t * t * t - 1) + b;
	},
	easeInOutQuart: function(x, t, b, c, d) {
		if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
		return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
	},
	easeInQuint: function(x, t, b, c, d) {
		return c * (t /= d) * t * t * t * t + b;
	},
	easeOutQuint: function(x, t, b, c, d) {
		return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
	},
	easeInOutQuint: function(x, t, b, c, d) {
		if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
		return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
	},
	easeInSine: function(x, t, b, c, d) {
		return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
	},
	easeOutSine: function(x, t, b, c, d) {
		return c * Math.sin(t / d * (Math.PI / 2)) + b;
	},
	easeInOutSine: function(x, t, b, c, d) {
		return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
	},
	easeInExpo: function(x, t, b, c, d) {
		return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
	},
	easeOutExpo: function(x, t, b, c, d) {
		return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
	},
	easeInOutExpo: function(x, t, b, c, d) {
		if (t == 0) return b;
		if (t == d) return b + c;
		if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
		return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function(x, t, b, c, d) {
		return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
	},
	easeOutCirc: function(x, t, b, c, d) {
		return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
	},
	easeInOutCirc: function(x, t, b, c, d) {
		if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
		return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
	},
	easeInElastic: function(x, t, b, c, d) {
		var s = 1.70158;
		var p = 0;
		var a = c;
		if (t == 0) return b;
		if ((t /= d) == 1) return b + c;
		if (!p) p = d * .3;
		if (a < Math.abs(c)) {
			a = c;
			var s = p / 4;
		} else var s = p / (2 * Math.PI) * Math.asin(c / a);
		return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
	},
	easeOutElastic: function(x, t, b, c, d) {
		var s = 1.70158;
		var p = 0;
		var a = c;
		if (t == 0) return b;
		if ((t /= d) == 1) return b + c;
		if (!p) p = d * .3;
		if (a < Math.abs(c)) {
			a = c;
			var s = p / 4;
		} else var s = p / (2 * Math.PI) * Math.asin(c / a);
		return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
	},
	easeInOutElastic: function(x, t, b, c, d) {
		var s = 1.70158;
		var p = 0;
		var a = c;
		if (t == 0) return b;
		if ((t /= d / 2) == 2) return b + c;
		if (!p) p = d * (.3 * 1.5);
		if (a < Math.abs(c)) {
			a = c;
			var s = p / 4;
		} else var s = p / (2 * Math.PI) * Math.asin(c / a);
		if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
		return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
	},
	easeInBack: function(x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c * (t /= d) * t * ((s + 1) * t - s) + b;
	},
	easeOutBack: function(x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
	},
	easeInOutBack: function(x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
		return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
	},
	easeInBounce: function(x, t, b, c, d) {
		return c - jQuery.easing.easeOutBounce(x, d - t, 0, c, d) + b;
	},
	easeOutBounce: function(x, t, b, c, d) {
		if ((t /= d) < (1 / 2.75)) {
			return c * (7.5625 * t * t) + b;
		} else if (t < (2 / 2.75)) {
			return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
		} else if (t < (2.5 / 2.75)) {
			return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
		} else {
			return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
		}
	},
	easeInOutBounce: function(x, t, b, c, d) {
		if (t < d / 2) return jQuery.easing.easeInBounce(x, t * 2, 0, c, d) * .5 + b;
		return jQuery.easing.easeOutBounce(x, t * 2 - d, 0, c, d) * .5 + c * .5 + b;
	}
});

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 *
 * Open source under the BSD License.
 *
 * Copyright Â© 2001 Robert Penner
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the author nor the names of contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *	COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *	EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *	GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *	NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */


/*! http://mths.be/placeholder v2.0.7 by @mathias */
;
(function(window, document, $) {

	var isInputSupported = 'placeholder' in document.createElement('input'),
		isTextareaSupported = 'placeholder' in document.createElement('textarea'),
		prototype = $.fn,
		valHooks = $.valHooks,
		hooks, placeholder;

	if (isInputSupported && isTextareaSupported) {

		placeholder = prototype.placeholder = function() {
			return this;
		};

		placeholder.input = placeholder.textarea = true;

	} else {

		placeholder = prototype.placeholder = function() {
			var $this = this;
			$this.filter((isInputSupported ? 'textarea' : ':input') + '[placeholder]').not('.placeholder').bind({
				'focus.placeholder': clearPlaceholder,
				'blur.placeholder': setPlaceholder
			}).data('placeholder-enabled', true).trigger('blur.placeholder');
			return $this;
		};

		placeholder.input = isInputSupported;
		placeholder.textarea = isTextareaSupported;

		hooks = {
			'get': function(element) {
				var $element = $(element);
				return $element.data('placeholder-enabled') && $element.hasClass('placeholder') ? '' : element.value;
			},
			'set': function(element, value) {
				var $element = $(element);
				if (!$element.data('placeholder-enabled')) {
					return element.value = value;
				}
				if (value == '') {
					element.value = value;
					// Issue #56: Setting the placeholder causes problems if the element continues to have focus.
					if (element != document.activeElement) {
						// We can't use `triggerHandler` here because of dummy text/password inputs :(
						setPlaceholder.call(element);
					}
				} else if ($element.hasClass('placeholder')) {
					clearPlaceholder.call(element, true, value) || (element.value = value);
				} else {
					element.value = value;
				}
				// `set` can not return `undefined`; see http://jsapi.info/jquery/1.7.1/val#L2363
				return $element;
			}
		};

		isInputSupported || (valHooks.input = hooks);
		isTextareaSupported || (valHooks.textarea = hooks);

		$(function() {
			// Look for forms
			$(document).delegate('form', 'submit.placeholder', function() {
				// Clear the placeholder values so they don't get submitted
				var $inputs = $('.placeholder', this).each(clearPlaceholder);
				setTimeout(function() {
					$inputs.each(setPlaceholder);
				}, 10);
			});
		});

		// Clear placeholder values upon page reload
		$(window).bind('beforeunload.placeholder', function() {
			$('.placeholder').each(function() {
				this.value = '';
			});
		});

	}

	function args(elem) {
		// Return an object of element attributes
		var newAttrs = {},
			rinlinejQuery = /^jQuery\d+$/;
		$.each(elem.attributes, function(i, attr) {
			if (attr.specified && !rinlinejQuery.test(attr.name)) {
				newAttrs[attr.name] = attr.value;
			}
		});
		return newAttrs;
	}

	function clearPlaceholder(event, value) {
		var input = this,
			$input = $(input);
		if (input.value == $input.attr('placeholder') && $input.hasClass('placeholder')) {
			if ($input.data('placeholder-password')) {
				$input = $input.hide().next().show().attr('id', $input.removeAttr('id').data('placeholder-id'));
				// If `clearPlaceholder` was called from `$.valHooks.input.set`
				if (event === true) {
					return $input[0].value = value;
				}
				$input.focus();
			} else {
				input.value = '';
				$input.removeClass('placeholder');
				input == document.activeElement && input.select();
			}
		}
	}

	function setPlaceholder() {
		var $replacement, input = this,
			$input = $(input),
			$origInput = $input,
			id = this.id;
		if (input.value == '') {
			if (input.type == 'password') {
				if (!$input.data('placeholder-textinput')) {
					try {
						$replacement = $input.clone().attr({
							'type': 'text'
						});
					} catch (e) {
						$replacement = $('<input>').attr($.extend(args(this), {
							'type': 'text'
						}));
					}
					$replacement.removeAttr('name').data({
						'placeholder-password': true,
						'placeholder-id': id
					}).bind('focus.placeholder', clearPlaceholder);
					$input.data({
						'placeholder-textinput': $replacement,
						'placeholder-id': id
					}).before($replacement);
				}
				$input = $input.removeAttr('id').hide().prev().attr('id', id).show();
				// Note: `$input[0] != input` now!
			}
			$input.addClass('placeholder');
			$input[0].value = $input.attr('placeholder');
		} else {
			$input.removeClass('placeholder');
		}
	}

}(this, document, jQuery));


/*
	Masked Input plugin for jQuery
	Copyright (c) 2007-2011 Josh Bush (digitalbush.com)
	Licensed under the MIT license (http://digitalbush.com/projects/masked-input-plugin/#license)
	Version: 1.3
*/
(function(a) {
	var b = (a.browser.msie ? "paste" : "input") + ".mask",
		c = window.orientation != undefined;
	a.mask = {
		definitions: {
			9: "[0-9]",
			a: "[A-Za-z]",
			"*": "[A-Za-z0-9]"
		},
		dataName: "rawMaskFn"
	}, a.fn.extend({
		caret: function(a, b) {
			if (this.length != 0) {
				if (typeof a == "number") {
					b = typeof b == "number" ? b : a;
					return this.each(function() {
						if (this.setSelectionRange) this.setSelectionRange(a, b);
						else if (this.createTextRange) {
							var c = this.createTextRange();
							c.collapse(!0), c.moveEnd("character", b), c.moveStart("character", a), c.select()
						}
					})
				}
				if (this[0].setSelectionRange) a = this[0].selectionStart, b = this[0].selectionEnd;
				else if (document.selection && document.selection.createRange) {
					var c = document.selection.createRange();
					a = 0 - c.duplicate().moveStart("character", -1e5), b = a + c.text.length
				}
				return {
					begin: a,
					end: b
				}
			}
		},
		unmask: function() {
			return this.trigger("unmask")
		},
		mask: function(d, e) {
			if (!d && this.length > 0) {
				var f = a(this[0]);
				return f.data(a.mask.dataName)()
			}
			e = a.extend({
				placeholder: "_",
				completed: null
			}, e);
			var g = a.mask.definitions,
				h = [],
				i = d.length,
				j = null,
				k = d.length;
			a.each(d.split(""), function(a, b) {
				b == "?" ? (k--, i = a) : g[b] ? (h.push(new RegExp(g[b])), j == null && (j = h.length - 1)) : h.push(null)
			});
			return this.trigger("unmask").each(function() {
				function v(a) {
					var b = f.val(),
						c = -1;
					for (var d = 0, g = 0; d < k; d++) if (h[d]) {
						l[d] = e.placeholder;
						while (g++ < b.length) {
							var m = b.charAt(g - 1);
							if (h[d].test(m)) {
								l[d] = m, c = d;
								break
							}
						}
						if (g > b.length) break
					} else l[d] == b.charAt(g) && d != i && (g++, c = d);
					if (!a && c + 1 < i) f.val(""), t(0, k);
					else if (a || c + 1 >= i) u(), a || f.val(f.val().substring(0, c + 1));
					return i ? d : j
				}
				function u() {
					return f.val(l.join("")).val()
				}
				function t(a, b) {
					for (var c = a; c < b && c < k; c++) h[c] && (l[c] = e.placeholder)
				}
				function s(a) {
					var b = a.which,
						c = f.caret();
					if (a.ctrlKey || a.altKey || a.metaKey || b < 32) return !0;
					if (b) {
						c.end - c.begin != 0 && (t(c.begin, c.end), p(c.begin, c.end - 1));
						var d = n(c.begin - 1);
						if (d < k) {
							var g = String.fromCharCode(b);
							if (h[d].test(g)) {
								q(d), l[d] = g, u();
								var i = n(d);
								f.caret(i), e.completed && i >= k && e.completed.call(f)
							}
						}
						return !1
					}
				}
				function r(a) {
					var b = a.which;
					if (b == 8 || b == 46 || c && b == 127) {
						var d = f.caret(),
							e = d.begin,
							g = d.end;
						g - e == 0 && (e = b != 46 ? o(e) : g = n(e - 1), g = b == 46 ? n(g) : g), t(e, g), p(e, g - 1);
						return !1
					}
					if (b == 27) {
						f.val(m), f.caret(0, v());
						return !1
					}
				}
				function q(a) {
					for (var b = a, c = e.placeholder; b < k; b++) if (h[b]) {
						var d = n(b),
							f = l[b];
						l[b] = c;
						if (d < k && h[d].test(f)) c = f;
						else break
					}
				}
				function p(a, b) {
					if (!(a < 0)) {
						for (var c = a, d = n(b); c < k; c++) if (h[c]) {
							if (d < k && h[c].test(l[d])) l[c] = l[d], l[d] = e.placeholder;
							else break;
							d = n(d)
						}
						u(), f.caret(Math.max(j, a))
					}
				}
				function o(a) {
					while (--a >= 0 && !h[a]);
					return a
				}
				function n(a) {
					while (++a <= k && !h[a]);
					return a
				}
				var f = a(this),
					l = a.map(d.split(""), function(a, b) {
						if (a != "?") return g[a] ? e.placeholder : a
					}),
					m = f.val();
				f.data(a.mask.dataName, function() {
					return a.map(l, function(a, b) {
						return h[b] && a != e.placeholder ? a : null
					}).join("")
				}), f.attr("readonly") || f.one("unmask", function() {
					f.unbind(".mask").removeData(a.mask.dataName)
				}).bind("focus.mask", function() {
					m = f.val();
					var b = v();
					u();
					var c = function() {
							b == d.length ? f.caret(0, b) : f.caret(b)
						};
					(a.browser.msie ? c : function() {
						setTimeout(c, 0)
					})()
				}).bind("blur.mask", function() {
					v(), f.val() != m && f.change()
				}).bind("keydown.mask", r).bind("keypress.mask", s).bind(b, function() {
					setTimeout(function() {
						f.caret(v(!0))
					}, 0)
				}), v()
			})
		}
	})
})(jQuery);



(function($) {
	$.fn.validationEngineLanguage = function() {};
	$.validationEngineLanguage = {
		newLang: function() {
			$.validationEngineLanguage.allRules =	 {"required":{				 // Add your regex rules here, you can take telephone as an example
					"regex":"none",
						"alertText":"* Campo obrigatório",
						"alertTextCheckboxMultiple":"* Selecione uma opção",
						"alertTextCheckboxe":"* Campo obrigatório"},
					"length":{
						"regex":"none",
						"alertText":"*Entre ",
						"alertText2":" e ",
						"alertText3": " carateres permitidos"},
					"maxCheckbox":{
						"regex":"none",
						"alertText":"* Foi atingido o máximo número de escolhas"},
					"minCheckbox":{
						"regex":"none",
						"alertText":"* Selecione ",
						"alertText2":" opções"},
					"equals":{
						"regex":"none",
						"alertText":"* Os campos não correspondem"},
					"phone":{
						// credit: jquery.h5validate.js / orefalo
						"regex": /^([\+][0-9]{1,3}[ \.\-])?([\(]{1}[0-9]{2,6}[\)])?([0-9 \.\-\/]{3,20})((x|ext|extension)[ ]?[0-9]{1,4})?$/,
						"alertText":"* Número de telefone inválido"},
					"email":{
						// Shamelessly lifted from Scott Gonzalez via the Bassistance Validation plugin http://projects.scottsplayground.com/email_address_validation/
						"regex": /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/,
						"alertText":"* Endereço de email inválido"},
					"integer":{
						"regex": /^[\-\+]?\d+$/,
						"alertText":"* Não é um número inteiro"},
					"number":{
						// Number, including positive, negative, and floating decimal. Credit: bassistance
						"regex": /^[\-\+]?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)$/,
						"alertText":"* Não é um número decimal"},
					"date":{
						// Date in ISO format. Credit: bassistance
												 "regex":/^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/,
												 "alertText":"* Data inválida, o formato deve de ser AAAA-MM-DD"},

										"ipv4":{
											"regex": /^([1-9][0-9]{0,2})+\.([1-9][0-9]{0,2})+\.([1-9][0-9]{0,2})+\.([1-9][0-9]{0,2})+$/,
											"alertText":"* Número IP inválido"},
										"url":{
											"regex":/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/,
											"alertText":"* URL inválido"},
					"onlyNumber":{
						"regex":/^[0-9\ ]+$/,
						"alertText":"* Só é permitido números"},
					"noSpecialCharacters":{
						"regex":/^[0-9a-zA-Z]+$/,
						"alertText":"* Não são permitidos carateres especiais"},
					"ajaxUser":{
						"file":"validateUser.php",
						"extraData":"name=eric",
						"alertTextOk":"* Nome de utilizador disponível",
						"alertTextLoad":"* Em carregamento, aguarde...",
						"alertText":"* Nome de utilizador não disponível"},
					"ajaxName":{
						"file":"validateUser.php",
						"alertText":"* Nome não disponível",
						"alertTextOk":"* Nome disponível",
						"alertTextLoad":"* Em carregamento, aguarde..."},
					"onlyLetter":{
						"regex":/^[a-zA-Z\ \']+$/,
						"alertText":"* Só são permitidas letras"},
					"validate2fields":{
							"nname":"validate2fields",
							"alertText":"* Deve inserir o primeiro e último nome"}
					}

		}
	}
})(jQuery);

$(document).ready(function() {
	$.validationEngineLanguage.newLang()
});

/*
 * FancyBox - jQuery Plugin
 * Simple and fancy lightbox alternative
 *
 * Examples and documentation at: http://fancybox.net
 *
 * Copyright (c) 2008 - 2010 Janis Skarnelis
 * That said, it is hardly a one-person project. Many people have submitted bugs, code, and offered their advice freely. Their support is greatly appreciated.
 *
 * Version: 1.3.4 (11/11/2010)
 * Requires: jQuery v1.3+
 *
 * Dual licensed under the MIT and GPL licenses:
 *	 http://www.opensource.org/licenses/mit-license.php
 *	 http://www.gnu.org/licenses/gpl.html
 */

;(function(b){var m,t,u,f,D,j,E,n,z,A,q=0,e={},o=[],p=0,d={},l=[],G=null,v=new Image,J=/\.(jpg|gif|png|bmp|jpeg)(.*)?$/i,W=/[^\.]\.(swf)\s*$/i,K,L=1,y=0,s="",r,i,h=false,B=b.extend(b("<div/>")[0],{prop:0}),M=b.browser.msie&&b.browser.version<7&&!window.XMLHttpRequest,N=function(){t.hide();v.onerror=v.onload=null;G&&G.abort();m.empty()},O=function(){if(false===e.onError(o,q,e)){t.hide();h=false}else{e.titleShow=false;e.width="auto";e.height="auto";m.html('<p id="fancybox-error">The requested content cannot be loaded.<br />Please try again later.</p>');F()}},I=function(){var a=o[q],c,g,k,C,P,w;N();e=b.extend({},b.fn.fancybox.defaults,typeof b(a).data("fancybox")=="undefined"?e:b(a).data("fancybox"));w=e.onStart(o,q,e);if(w===false)h=false;else{if(typeof w=="object")e=b.extend(e,w);k=e.title||(a.nodeName?b(a).attr("title"):a.title)||"";if(a.nodeName&&!e.orig)e.orig=b(a).children("img:first").length?b(a).children("img:first"):b(a);if(k===""&&e.orig&&e.titleFromAlt)k=e.orig.attr("alt");c=e.href||(a.nodeName?b(a).attr("href"):a.href)||null;if(/^(?:javascript)/i.test(c)||c=="#")c=null;if(e.type){g=e.type;if(!c)c=e.content}else if(e.content)g="html";else if(c)g=c.match(J)?"image":c.match(W)?"swf":b(a).hasClass("iframe")?"iframe":c.indexOf("#")===0?"inline":"ajax";if(g){if(g=="inline"){a=c.substr(c.indexOf("#"));g=b(a).length>0?"inline":"ajax"}e.type=g;e.href=c;e.title=k;if(e.autoDimensions)if(e.type=="html"||e.type=="inline"||e.type=="ajax"){e.width="auto";e.height="auto"}else e.autoDimensions=false;if(e.modal){e.overlayShow=true;e.hideOnOverlayClick=false;e.hideOnContentClick=false;e.enableEscapeButton=false;e.showCloseButton=false}e.padding=parseInt(e.padding,10);e.margin=parseInt(e.margin,10);m.css("padding",e.padding+e.margin);b(".fancybox-inline-tmp").unbind("fancybox-cancel").bind("fancybox-change",function(){b(this).replaceWith(j.children())});switch(g){case "html":m.html(e.content);F();break;case "inline":if(b(a).parent().is("#fancybox-content")===true){h=false;break}b('<div class="fancybox-inline-tmp" />').hide().insertBefore(b(a)).bind("fancybox-cleanup",function(){b(this).replaceWith(j.children())}).bind("fancybox-cancel",function(){b(this).replaceWith(m.children())});b(a).appendTo(m);F();break;case "image":h=false;b.fancybox.showActivity();v=new Image;v.onerror=function(){O()};v.onload=function(){h=true;v.onerror=v.onload=null;e.width=v.width;e.height=v.height;b("<img />").attr({id:"fancybox-img",src:v.src,alt:e.title}).appendTo(m);Q()};v.src=c;break;case "swf":e.scrolling="no";C='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="'+e.width+'" height="'+e.height+'"><param name="movie" value="'+c+'"></param>';P="";b.each(e.swf,function(x,H){C+='<param name="'+x+'" value="'+H+'"></param>';P+=" "+x+'="'+H+'"'});C+='<embed src="'+c+'" type="application/x-shockwave-flash" width="'+e.width+'" height="'+e.height+'"'+P+"></embed></object>";m.html(C);F();break;case "ajax":h=false;b.fancybox.showActivity();e.ajax.win=e.ajax.success;G=b.ajax(b.extend({},e.ajax,{url:c,data:e.ajax.data||{},error:function(x){x.status>0&&O()},success:function(x,H,R){if((typeof R=="object"?R:G).status==200){if(typeof e.ajax.win=="function"){w=e.ajax.win(c,x,H,R);if(w===false){t.hide();return}else if(typeof w=="string"||typeof w=="object")x=w}m.html(x);F()}}}));break;case "iframe":Q()}}else O()}},F=function(){var a=e.width,c=e.height;a=a.toString().indexOf("%")>-1?parseInt((b(window).width()-e.margin*2)*parseFloat(a)/100,10)+"px":a=="auto"?"auto":a+"px";c=c.toString().indexOf("%")>-1?parseInt((b(window).height()-e.margin*2)*parseFloat(c)/100,10)+"px":c=="auto"?"auto":c+"px";m.wrapInner('<div style="width:'+a+";height:"+c+";overflow: "+(e.scrolling=="auto"?"auto":e.scrolling=="yes"?"scroll":"hidden")+';position:relative;"></div>');e.width=m.width();e.height=m.height();Q()},Q=function(){var a,c;t.hide();if(f.is(":visible")&&false===d.onCleanup(l,p,d)){b.event.trigger("fancybox-cancel");h=false}else{h=true;b(j.add(u)).unbind();b(window).unbind("resize.fb scroll.fb");b(document).unbind("keydown.fb");f.is(":visible")&&d.titlePosition!=="outside"&&f.css("height",f.height());l=o;p=q;d=e;if(d.overlayShow){u.css({"background-color":d.overlayColor,opacity:d.overlayOpacity,cursor:d.hideOnOverlayClick?"pointer":"auto",height:b(document).height()});if(!u.is(":visible")){M&&b("select:not(#fancybox-tmp select)").filter(function(){return this.style.visibility!=="hidden"}).css({visibility:"hidden"}).one("fancybox-cleanup",function(){this.style.visibility="inherit"});u.show()}}else u.hide();i=X();s=d.title||"";y=0;n.empty().removeAttr("style").removeClass();if(d.titleShow!==false){if(b.isFunction(d.titleFormat))a=d.titleFormat(s,l,p,d);else a=s&&s.length?d.titlePosition=="float"?'<table id="fancybox-title-float-wrap" cellpadding="0" cellspacing="0"><tr><td id="fancybox-title-float-left"></td><td id="fancybox-title-float-main">'+s+'</td><td id="fancybox-title-float-right"></td></tr></table>':'<div id="fancybox-title-'+d.titlePosition+'">'+s+"</div>":false;s=a;if(!(!s||s==="")){n.addClass("fancybox-title-"+d.titlePosition).html(s).appendTo("body").show();switch(d.titlePosition){case "inside":n.css({width:i.width-d.padding*2,marginLeft:d.padding,marginRight:d.padding});y=n.outerHeight(true);n.appendTo(D);i.height+=y;break;case "over":n.css({marginLeft:d.padding,width:i.width-d.padding*2,bottom:d.padding}).appendTo(D);break;case "float":n.css("left",parseInt((n.width()-i.width-40)/2,10)*-1).appendTo(f);break;default:n.css({width:i.width-d.padding*2,paddingLeft:d.padding,paddingRight:d.padding}).appendTo(f)}}}n.hide();if(f.is(":visible")){b(E.add(z).add(A)).hide();a=f.position();r={top:a.top,left:a.left,width:f.width(),height:f.height()};c=r.width==i.width&&r.height==i.height;j.fadeTo(d.changeFade,0.3,function(){var g=function(){j.html(m.contents()).fadeTo(d.changeFade,1,S)};b.event.trigger("fancybox-change");j.empty().removeAttr("filter").css({"border-width":d.padding,width:i.width-d.padding*2,height:e.autoDimensions?"auto":i.height-y-d.padding*2});if(c)g();else{B.prop=0;b(B).animate({prop:1},{duration:d.changeSpeed,easing:d.easingChange,step:T,complete:g})}})}else{f.removeAttr("style");j.css("border-width",d.padding);if(d.transitionIn=="elastic"){r=V();j.html(m.contents());f.show();if(d.opacity)i.opacity=0;B.prop=0;b(B).animate({prop:1},{duration:d.speedIn,easing:d.easingIn,step:T,complete:S})}else{d.titlePosition=="inside"&&y>0&&n.show();j.css({width:i.width-d.padding*2,height:e.autoDimensions?"auto":i.height-y-d.padding*2}).html(m.contents());f.css(i).fadeIn(d.transitionIn=="none"?0:d.speedIn,S)}}}},Y=function(){if(d.enableEscapeButton||d.enableKeyboardNav)b(document).bind("keydown.fb",function(a){if(a.keyCode==27&&d.enableEscapeButton){a.preventDefault();b.fancybox.close()}else if((a.keyCode==37||a.keyCode==39)&&d.enableKeyboardNav&&a.target.tagName!=="INPUT"&&a.target.tagName!=="TEXTAREA"&&a.target.tagName!=="SELECT"){a.preventDefault();b.fancybox[a.keyCode==37?"prev":"next"]()}});if(d.showNavArrows){if(d.cyclic&&l.length>1||p!==0)z.show();if(d.cyclic&&l.length>1||p!=l.length-1)A.show()}else{z.hide();A.hide()}},S=function(){if(!b.support.opacity){j.get(0).style.removeAttribute("filter");f.get(0).style.removeAttribute("filter")}e.autoDimensions&&j.css("height","auto");f.css("height","auto");s&&s.length&&n.show();d.showCloseButton&&E.show();Y();d.hideOnContentClick&&j.bind("click",b.fancybox.close);d.hideOnOverlayClick&&u.bind("click",b.fancybox.close);b(window).bind("resize.fb",b.fancybox.resize);d.centerOnScroll&&b(window).bind("scroll.fb",b.fancybox.center);if(d.type=="iframe")b('<iframe id="fancybox-frame" name="fancybox-frame'+(new Date).getTime()+'" frameborder="0" hspace="0" '+(b.browser.msie?'allowtransparency="true""':"")+' scrolling="'+e.scrolling+'" src="'+d.href+'"></iframe>').appendTo(j);f.show();h=false;b.fancybox.center();d.onComplete(l,p,d);var a,c;if(l.length-1>p){a=l[p+1].href;if(typeof a!=="undefined"&&a.match(J)){c=new Image;c.src=a}}if(p>0){a=l[p-1].href;if(typeof a!=="undefined"&&a.match(J)){c=new Image;c.src=a}}},T=function(a){var c={width:parseInt(r.width+(i.width-r.width)*a,10),height:parseInt(r.height+(i.height-r.height)*a,10),top:parseInt(r.top+(i.top-r.top)*a,10),left:parseInt(r.left+(i.left-r.left)*a,10)};if(typeof i.opacity!=="undefined")c.opacity=a<0.5?0.5:a;f.css(c);j.css({width:c.width-d.padding*2,height:c.height-y*a-d.padding*2})},U=function(){return[b(window).width()-d.margin*2,b(window).height()-d.margin*2,b(document).scrollLeft()+d.margin,b(document).scrollTop()+d.margin]},X=function(){var a=U(),c={},g=d.autoScale,k=d.padding*2;c.width=d.width.toString().indexOf("%")>-1?parseInt(a[0]*parseFloat(d.width)/100,10):d.width+k;c.height=d.height.toString().indexOf("%")>-1?parseInt(a[1]*parseFloat(d.height)/100,10):d.height+k;if(g&&(c.width>a[0]||c.height>a[1]))if(e.type=="image"||e.type=="swf"){g=d.width/d.height;if(c.width>a[0]){c.width=a[0];c.height=parseInt((c.width-k)/g+k,10)}if(c.height>a[1]){c.height=a[1];c.width=parseInt((c.height-k)*g+k,10)}}else{c.width=Math.min(c.width,a[0]);c.height=Math.min(c.height,a[1])}c.top=parseInt(Math.max(a[3]-20,a[3]+(a[1]-c.height-40)*0.5),10);c.left=parseInt(Math.max(a[2]-20,a[2]+(a[0]-c.width-40)*0.5),10);return c},V=function(){var a=e.orig?b(e.orig):false,c={};if(a&&a.length){c=a.offset();c.top+=parseInt(a.css("paddingTop"),10)||0;c.left+=parseInt(a.css("paddingLeft"),10)||0;c.top+=parseInt(a.css("border-top-width"),10)||0;c.left+=parseInt(a.css("border-left-width"),10)||0;c.width=a.width();c.height=a.height();c={width:c.width+d.padding*2,height:c.height+d.padding*2,top:c.top-d.padding-20,left:c.left-d.padding-20}}else{a=U();c={width:d.padding*2,height:d.padding*2,top:parseInt(a[3]+a[1]*0.5,10),left:parseInt(a[2]+a[0]*0.5,10)}}return c},Z=function(){if(t.is(":visible")){b("div",t).css("top",L*-40+"px");L=(L+1)%12}else clearInterval(K)};b.fn.fancybox=function(a){if(!b(this).length)return this;b(this).data("fancybox",b.extend({},a,b.metadata?b(this).metadata():{})).unbind("click.fb").bind("click.fb",function(c){c.preventDefault();if(!h){h=true;b(this).blur();o=[];q=0;c=b(this).attr("rel")||"";if(!c||c==""||c==="nofollow")o.push(this);else{o=b("a[rel="+c+"], area[rel="+c+"]");q=o.index(this)}I()}});return this};b.fancybox=function(a,c){var g;if(!h){h=true;g=typeof c!=="undefined"?c:{};o=[];q=parseInt(g.index,10)||0;if(b.isArray(a)){for(var k=0,C=a.length;k<C;k++)if(typeof a[k]=="object")b(a[k]).data("fancybox",b.extend({},g,a[k]));else a[k]=b({}).data("fancybox",b.extend({content:a[k]},g));o=jQuery.merge(o,a)}else{if(typeof a=="object")b(a).data("fancybox",b.extend({},g,a));else a=b({}).data("fancybox",b.extend({content:a},g));o.push(a)}if(q>o.length||q<0)q=0;I()}};b.fancybox.showActivity=function(){clearInterval(K);t.show();K=setInterval(Z,66)};b.fancybox.hideActivity=function(){t.hide()};b.fancybox.next=function(){return b.fancybox.pos(p+1)};b.fancybox.prev=function(){return b.fancybox.pos(p-1)};b.fancybox.pos=function(a){if(!h){a=parseInt(a);o=l;if(a>-1&&a<l.length){q=a;I()}else if(d.cyclic&&l.length>1){q=a>=l.length?0:l.length-1;I()}}};b.fancybox.cancel=function(){if(!h){h=true;b.event.trigger("fancybox-cancel");N();e.onCancel(o,q,e);h=false}};b.fancybox.close=function(){function a(){u.fadeOut("fast");n.empty().hide();f.hide();b.event.trigger("fancybox-cleanup");j.empty();d.onClosed(l,p,d);l=e=[];p=q=0;d=e={};h=false}if(!(h||f.is(":hidden"))){h=true;if(d&&false===d.onCleanup(l,p,d))h=false;else{N();b(E.add(z).add(A)).hide();b(j.add(u)).unbind();b(window).unbind("resize.fb scroll.fb");b(document).unbind("keydown.fb");j.find("iframe").attr("src",M&&/^https/i.test(window.location.href||"")?"javascript:void(false)":"about:blank");d.titlePosition!=="inside"&&n.empty();f.stop();if(d.transitionOut=="elastic"){r=V();var c=f.position();i={top:c.top,left:c.left,width:f.width(),height:f.height()};if(d.opacity)i.opacity=1;n.empty().hide();B.prop=1;b(B).animate({prop:0},{duration:d.speedOut,easing:d.easingOut,step:T,complete:a})}else f.fadeOut(d.transitionOut=="none"?0:d.speedOut,a)}}};b.fancybox.resize=function(){u.is(":visible")&&u.css("height",b(document).height());b.fancybox.center(true)};b.fancybox.center=function(a){var c,g;if(!h){g=a===true?1:0;c=U();!g&&(f.width()>c[0]||f.height()>c[1])||f.stop().animate({top:parseInt(Math.max(c[3]-20,c[3]+(c[1]-j.height()-40)*0.5-d.padding)),left:parseInt(Math.max(c[2]-20,c[2]+(c[0]-j.width()-40)*0.5-d.padding))},typeof a=="number"?a:200)}};b.fancybox.init=function(){if(!b("#fancybox-wrap").length){b("body").append(m=b('<div id="fancybox-tmp"></div>'),t=b('<div id="fancybox-loading"><div></div></div>'),u=b('<div id="fancybox-overlay"></div>'),f=b('<div id="fancybox-wrap"></div>'));D=b('<div id="fancybox-outer"></div>').append('<div class="fancybox-bg" id="fancybox-bg-n"></div><div class="fancybox-bg" id="fancybox-bg-ne"></div><div class="fancybox-bg" id="fancybox-bg-e"></div><div class="fancybox-bg" id="fancybox-bg-se"></div><div class="fancybox-bg" id="fancybox-bg-s"></div><div class="fancybox-bg" id="fancybox-bg-sw"></div><div class="fancybox-bg" id="fancybox-bg-w"></div><div class="fancybox-bg" id="fancybox-bg-nw"></div>').appendTo(f);D.append(j=b('<div id="fancybox-content"></div>'),E=b('<a id="fancybox-close"></a>'),n=b('<div id="fancybox-title"></div>'),z=b('<a href="javascript:;" id="fancybox-left"><span class="fancy-ico" id="fancybox-left-ico"></span></a>'),A=b('<a href="javascript:;" id="fancybox-right"><span class="fancy-ico" id="fancybox-right-ico"></span></a>'));E.click(b.fancybox.close);t.click(b.fancybox.cancel);z.click(function(a){a.preventDefault();b.fancybox.prev()});A.click(function(a){a.preventDefault();b.fancybox.next()});b.fn.mousewheel&&f.bind("mousewheel.fb",function(a,c){if(h)a.preventDefault();else if(b(a.target).get(0).clientHeight==0||b(a.target).get(0).scrollHeight===b(a.target).get(0).clientHeight){a.preventDefault();b.fancybox[c>0?"prev":"next"]()}});b.support.opacity||f.addClass("fancybox-ie");if(M){t.addClass("fancybox-ie6");f.addClass("fancybox-ie6");b('<iframe id="fancybox-hide-sel-frame" src="'+(/^https/i.test(window.location.href||"")?"javascript:void(false)":"about:blank")+'" scrolling="no" border="0" frameborder="0" tabindex="-1"></iframe>').prependTo(D)}}};b.fn.fancybox.defaults={padding:10,margin:40,opacity:false,modal:false,cyclic:false,scrolling:"auto",width:560,height:340,autoScale:true,autoDimensions:true,centerOnScroll:false,ajax:{},swf:{wmode:"transparent"},hideOnOverlayClick:true,hideOnContentClick:false,overlayShow:true,overlayOpacity:0.7,overlayColor:"#777",titleShow:true,titlePosition:"float",titleFormat:null,titleFromAlt:false,transitionIn:"fade",transitionOut:"fade",speedIn:300,speedOut:300,changeSpeed:300,changeFade:"fast",easingIn:"swing",easingOut:"swing",showCloseButton:true,showNavArrows:true,enableEscapeButton:true,enableKeyboardNav:true,onStart:function(){},onCancel:function(){},onComplete:function(){},onCleanup:function(){},onClosed:function(){},onError:function(){}};b(document).ready(function(){b.fancybox.init()})})(jQuery);

/* http://keith-wood.name/countdown.html
	 Countdown for jQuery v1.6.3.
	 Written by Keith Wood (kbwood{at}iinet.com.au) January 2008.
	 Available under the MIT (https://github.com/jquery/jquery/blob/master/MIT-LICENSE.txt) license.
	 Please attribute the author if you use it. */

/* Display a countdown timer.
	 Attach it with options like:
	 $('div selector').countdown(
			 {until: new Date(2009, 1 - 1, 1, 0, 0, 0), onExpiry: happyNewYear}); */

(function($) { // Hide scope, no $ conflict

/* Countdown manager. */
function Countdown() {
	this.regional = []; // Available regional settings, indexed by language code
	this.regional[''] = { // Default regional settings
		// The display texts for the counters
		labels: ['Anos', 'Meses', 'Semanas', 'Dias', 'Horas', 'Minutos', 'Segundos'],
		// The display texts for the counters if only one
		labels1: ['Ano', 'Mês', 'Semana', 'Dia', 'Hora', 'Minuto', 'Segundo'],
		compactLabels: ['y', 'm', 'w', 'd'], // The compact texts for the counters
		whichLabels: null, // Function to determine which labels to use
		digits: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], // The digits to display
		timeSeparator: ':', // Separator for time periods
		isRTL: false // True for right-to-left languages, false for left-to-right
	};
	this._defaults = {
		until: null, // new Date(year, mth - 1, day, hr, min, sec) - date/time to count down to
			// or numeric for seconds offset, or string for unit offset(s):
			// 'Y' years, 'O' months, 'W' weeks, 'D' days, 'H' hours, 'M' minutes, 'S' seconds
		since: null, // new Date(year, mth - 1, day, hr, min, sec) - date/time to count up from
			// or numeric for seconds offset, or string for unit offset(s):
			// 'Y' years, 'O' months, 'W' weeks, 'D' days, 'H' hours, 'M' minutes, 'S' seconds
		timezone: null, // The timezone (hours or minutes from GMT) for the target times,
			// or null for client local
		serverSync: null, // A function to retrieve the current server time for synchronisation
		format: 'dHMS', // Format for display - upper case for always, lower case only if non-zero,
			// 'Y' years, 'O' months, 'W' weeks, 'D' days, 'H' hours, 'M' minutes, 'S' seconds
		layout: '', // Build your own layout for the countdown
		compact: false, // True to display in a compact format, false for an expanded one
		significant: 0, // The number of periods with values to show, zero for all
		description: '', // The description displayed for the countdown
		expiryUrl: '', // A URL to load upon expiry, replacing the current page
		expiryText: '', // Text to display upon expiry, replacing the countdown
		alwaysExpire: false, // True to trigger onExpiry even if never counted down
		onExpiry: null, // Callback when the countdown expires -
			// receives no parameters and 'this' is the containing division
		onTick: null, // Callback when the countdown is updated -
			// receives int[7] being the breakdown by period (based on format)
			// and 'this' is the containing division
		tickInterval: 1 // Interval (seconds) between onTick callbacks
	};
	$.extend(this._defaults, this.regional['']);
	this._serverSyncs = [];
	var now = (typeof Date.now == 'function' ? Date.now :
		function() { return new Date().getTime(); });
	var perfAvail = (window.performance && typeof window.performance.now == 'function');
	// Shared timer for all countdowns
	function timerCallBack(timestamp) {
		var drawStart = (timestamp < 1e12 ? // New HTML5 high resolution timer
			(perfAvail ? (performance.now() + performance.timing.navigationStart) : now()) :
			// Integer milliseconds since unix epoch
			timestamp || now());
		if (drawStart - animationStartTime >= 1000) {
			plugin._updateTargets();
			animationStartTime = drawStart;
		}
		requestAnimationFrame(timerCallBack);
	}
	var requestAnimationFrame = window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame || window.msRequestAnimationFrame || null;
		// This is when we expect a fall-back to setInterval as it's much more fluid
	var animationStartTime = 0;
	if (!requestAnimationFrame || $.noRequestAnimationFrame) {
		$.noRequestAnimationFrame = null;
		setInterval(function() { plugin._updateTargets(); }, 980); // Fall back to good old setInterval
	}
	else {
		animationStartTime = window.animationStartTime ||
			window.webkitAnimationStartTime || window.mozAnimationStartTime ||
			window.oAnimationStartTime || window.msAnimationStartTime || now();
		requestAnimationFrame(timerCallBack);
	}
}

var Y = 0; // Years
var O = 1; // Months
var W = 2; // Weeks
var D = 3; // Days
var H = 4; // Hours
var M = 5; // Minutes
var S = 6; // Seconds

$.extend(Countdown.prototype, {
	/* Class name added to elements to indicate already configured with countdown. */
	markerClassName: 'hasCountdown',
	/* Name of the data property for instance settings. */
	propertyName: 'countdown',

	/* Class name for the right-to-left marker. */
	_rtlClass: 'countdown_rtl',
	/* Class name for the countdown section marker. */
	_sectionClass: 'countdown_section',
	/* Class name for the period amount marker. */
	_amountClass: 'countdown_amount',
	/* Class name for the countdown row marker. */
	_rowClass: 'countdown_row',
	/* Class name for the holding countdown marker. */
	_holdingClass: 'countdown_holding',
	/* Class name for the showing countdown marker. */
	_showClass: 'countdown_show',
	/* Class name for the description marker. */
	_descrClass: 'countdown_descr',

	/* List of currently active countdown targets. */
	_timerTargets: [],

	/* Override the default settings for all instances of the countdown widget.
		 @param	options	(object) the new settings to use as defaults */
	setDefaults: function(options) {
		this._resetExtraLabels(this._defaults, options);
		$.extend(this._defaults, options || {});
	},

	/* Convert a date/time to UTC.
		 @param	tz		 (number) the hour or minute offset from GMT, e.g. +9, -360
		 @param	year	 (Date) the date/time in that timezone or
										(number) the year in that timezone
		 @param	month	(number, optional) the month (0 - 11) (omit if year is a Date)
		 @param	day		(number, optional) the day (omit if year is a Date)
		 @param	hours	(number, optional) the hour (omit if year is a Date)
		 @param	mins	 (number, optional) the minute (omit if year is a Date)
		 @param	secs	 (number, optional) the second (omit if year is a Date)
		 @param	ms		 (number, optional) the millisecond (omit if year is a Date)
		 @return	(Date) the equivalent UTC date/time */
	UTCDate: function(tz, year, month, day, hours, mins, secs, ms) {
		if (typeof year == 'object' && year.constructor == Date) {
			ms = year.getMilliseconds();
			secs = year.getSeconds();
			mins = year.getMinutes();
			hours = year.getHours();
			day = year.getDate();
			month = year.getMonth();
			year = year.getFullYear();
		}

		var d = new Date();
		d.setUTCFullYear(year);
		d.setUTCDate(1);
		d.setUTCMonth(month || 0);
		d.setUTCDate(day || 1);
		d.setUTCHours(hours || 0);
		d.setUTCMinutes((mins || 0) - (Math.abs(tz) < 30 ? tz * 60 : tz));
		d.setUTCSeconds(secs || 0);
		d.setUTCMilliseconds(ms || 0);
		return d;
	},

	/* Convert a set of periods into seconds.
		 Averaged for months and years.
		 @param	periods	(number[7]) the periods per year/month/week/day/hour/minute/second
		 @return	(number) the corresponding number of seconds */
	periodsToSeconds: function(periods) {
		return periods[0] * 31557600 + periods[1] * 2629800 + periods[2] * 604800 +
			periods[3] * 86400 + periods[4] * 3600 + periods[5] * 60 + periods[6];
	},

	/* Attach the countdown widget to a div.
		 @param	target	 (element) the containing division
		 @param	options	(object) the initial settings for the countdown */
	_attachPlugin: function(target, options) {
		target = $(target);
		if (target.hasClass(this.markerClassName)) {
			return;
		}
		var inst = {options: $.extend({}, this._defaults), _periods: [0, 0, 0, 0, 0, 0, 0]};
		target.addClass(this.markerClassName).data(this.propertyName, inst);
		this._optionPlugin(target, options);
	},

	/* Add a target to the list of active ones.
		 @param	target	(element) the countdown target */
	_addTarget: function(target) {
		if (!this._hasTarget(target)) {
			this._timerTargets.push(target);
		}
	},

	/* See if a target is in the list of active ones.
		 @param	target	(element) the countdown target
		 @return	(boolean) true if present, false if not */
	_hasTarget: function(target) {
		return ($.inArray(target, this._timerTargets) > -1);
	},

	/* Remove a target from the list of active ones.
		 @param	target	(element) the countdown target */
	_removeTarget: function(target) {
		this._timerTargets = $.map(this._timerTargets,
			function(value) { return (value == target ? null : value); }); // delete entry
	},

	/* Update each active timer target. */
	_updateTargets: function() {
		for (var i = this._timerTargets.length - 1; i >= 0; i--) {
			this._updateCountdown(this._timerTargets[i]);
		}
	},

	/* Reconfigure the settings for a countdown div.
		 @param	target	 (element) the control to affect
		 @param	options	(object) the new options for this instance or
											(string) an individual property name
		 @param	value		(any) the individual property value (omit if options
											is an object or to retrieve the value of a setting)
		 @return	(any) if retrieving a value */
	_optionPlugin: function(target, options, value) {
		target = $(target);
		var inst = target.data(this.propertyName);
		if (!options || (typeof options == 'string' && value == null)) { // Get option
			var name = options;
			options = (inst || {}).options;
			return (options && name ? options[name] : options);
		}

		if (!target.hasClass(this.markerClassName)) {
			return;
		}
		options = options || {};
		if (typeof options == 'string') {
			var name = options;
			options = {};
			options[name] = value;
		}
		if (options.layout) {
			options.layout = options.layout.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
		}
		this._resetExtraLabels(inst.options, options);
		var timezoneChanged = (inst.options.timezone != options.timezone);
		$.extend(inst.options, options);
		this._adjustSettings(target, inst,
			options.until != null || options.since != null || timezoneChanged);
		var now = new Date();
		if ((inst._since && inst._since < now) || (inst._until && inst._until > now)) {
			this._addTarget(target[0]);
		}
		this._updateCountdown(target, inst);
	},

	/* Redisplay the countdown with an updated display.
		 @param	target	(jQuery) the containing division
		 @param	inst		(object) the current settings for this instance */
	_updateCountdown: function(target, inst) {
		var $target = $(target);
		inst = inst || $target.data(this.propertyName);
		if (!inst) {
			return;
		}
		$target.html(this._generateHTML(inst)).toggleClass(this._rtlClass, inst.options.isRTL);
		if ($.isFunction(inst.options.onTick)) {
			var periods = inst._hold != 'lap' ? inst._periods :
				this._calculatePeriods(inst, inst._show, inst.options.significant, new Date());
			if (inst.options.tickInterval == 1 ||
					this.periodsToSeconds(periods) % inst.options.tickInterval == 0) {
				inst.options.onTick.apply(target, [periods]);
			}
		}
		var expired = inst._hold != 'pause' &&
			(inst._since ? inst._now.getTime() < inst._since.getTime() :
			inst._now.getTime() >= inst._until.getTime());
		if (expired && !inst._expiring) {
			inst._expiring = true;
			if (this._hasTarget(target) || inst.options.alwaysExpire) {
				this._removeTarget(target);
				if ($.isFunction(inst.options.onExpiry)) {
					inst.options.onExpiry.apply(target, []);
				}
				if (inst.options.expiryText) {
					var layout = inst.options.layout;
					inst.options.layout = inst.options.expiryText;
					this._updateCountdown(target, inst);
					inst.options.layout = layout;
				}
				if (inst.options.expiryUrl) {
					window.location = inst.options.expiryUrl;
				}
			}
			inst._expiring = false;
		}
		else if (inst._hold == 'pause') {
			this._removeTarget(target);
		}
		$target.data(this.propertyName, inst);
	},

	/* Reset any extra labelsn and compactLabelsn entries if changing labels.
		 @param	base		 (object) the options to be updated
		 @param	options	(object) the new option values */
	_resetExtraLabels: function(base, options) {
		var changingLabels = false;
		for (var n in options) {
			if (n != 'whichLabels' && n.match(/[Ll]abels/)) {
				changingLabels = true;
				break;
			}
		}
		if (changingLabels) {
			for (var n in base) { // Remove custom numbered labels
				if (n.match(/[Ll]abels[02-9]|compactLabels1/)) {
					base[n] = null;
				}
			}
		}
	},

	/* Calculate interal settings for an instance.
		 @param	target	(element) the containing division
		 @param	inst		(object) the current settings for this instance
		 @param	recalc	(boolean) true if until or since are set */
	_adjustSettings: function(target, inst, recalc) {
		var now;
		var serverOffset = 0;
		var serverEntry = null;
		for (var i = 0; i < this._serverSyncs.length; i++) {
			if (this._serverSyncs[i][0] == inst.options.serverSync) {
				serverEntry = this._serverSyncs[i][1];
				break;
			}
		}
		if (serverEntry != null) {
			serverOffset = (inst.options.serverSync ? serverEntry : 0);
			now = new Date();
		}
		else {
			var serverResult = ($.isFunction(inst.options.serverSync) ?
				inst.options.serverSync.apply(target, []) : null);
			now = new Date();
			serverOffset = (serverResult ? now.getTime() - serverResult.getTime() : 0);
			this._serverSyncs.push([inst.options.serverSync, serverOffset]);
		}
		var timezone = inst.options.timezone;
		timezone = (timezone == null ? -now.getTimezoneOffset() : timezone);
		if (recalc || (!recalc && inst._until == null && inst._since == null)) {
			inst._since = inst.options.since;
			if (inst._since != null) {
				inst._since = this.UTCDate(timezone, this._determineTime(inst._since, null));
				if (inst._since && serverOffset) {
					inst._since.setMilliseconds(inst._since.getMilliseconds() + serverOffset);
				}
			}
			inst._until = this.UTCDate(timezone, this._determineTime(inst.options.until, now));
			if (serverOffset) {
				inst._until.setMilliseconds(inst._until.getMilliseconds() + serverOffset);
			}
		}
		inst._show = this._determineShow(inst);
	},

	/* Remove the countdown widget from a div.
		 @param	target	(element) the containing division */
	_destroyPlugin: function(target) {
		target = $(target);
		if (!target.hasClass(this.markerClassName)) {
			return;
		}
		this._removeTarget(target[0]);
		target.removeClass(this.markerClassName).empty().removeData(this.propertyName);
	},

	/* Pause a countdown widget at the current time.
		 Stop it running but remember and display the current time.
		 @param	target	(element) the containing division */
	_pausePlugin: function(target) {
		this._hold(target, 'pause');
	},

	/* Pause a countdown widget at the current time.
		 Stop the display but keep the countdown running.
		 @param	target	(element) the containing division */
	_lapPlugin: function(target) {
		this._hold(target, 'lap');
	},

	/* Resume a paused countdown widget.
		 @param	target	(element) the containing division */
	_resumePlugin: function(target) {
		this._hold(target, null);
	},

	/* Pause or resume a countdown widget.
		 @param	target	(element) the containing division
		 @param	hold		(string) the new hold setting */
	_hold: function(target, hold) {
		var inst = $.data(target, this.propertyName);
		if (inst) {
			if (inst._hold == 'pause' && !hold) {
				inst._periods = inst._savePeriods;
				var sign = (inst._since ? '-' : '+');
				inst[inst._since ? '_since' : '_until'] =
					this._determineTime(sign + inst._periods[0] + 'y' +
						sign + inst._periods[1] + 'o' + sign + inst._periods[2] + 'w' +
						sign + inst._periods[3] + 'd' + sign + inst._periods[4] + 'h' +
						sign + inst._periods[5] + 'm' + sign + inst._periods[6] + 's');
				this._addTarget(target);
			}
			inst._hold = hold;
			inst._savePeriods = (hold == 'pause' ? inst._periods : null);
			$.data(target, this.propertyName, inst);
			this._updateCountdown(target, inst);
		}
	},

	/* Return the current time periods.
		 @param	target	(element) the containing division
		 @return	(number[7]) the current periods for the countdown */
	_getTimesPlugin: function(target) {
		var inst = $.data(target, this.propertyName);
		return (!inst ? null : (inst._hold == 'pause' ? inst._savePeriods : (!inst._hold ? inst._periods :
			this._calculatePeriods(inst, inst._show, inst.options.significant, new Date()))));
	},

	/* A time may be specified as an exact value or a relative one.
		 @param	setting			(string or number or Date) - the date/time value
													as a relative or absolute value
		 @param	defaultTime	(Date) the date/time to use if no other is supplied
		 @return	(Date) the corresponding date/time */
	_determineTime: function(setting, defaultTime) {
		var offsetNumeric = function(offset) { // e.g. +300, -2
			var time = new Date();
			time.setTime(time.getTime() + offset * 1000);
			return time;
		};
		var offsetString = function(offset) { // e.g. '+2d', '-4w', '+3h +30m'
			offset = offset.toLowerCase();
			var time = new Date();
			var year = time.getFullYear();
			var month = time.getMonth();
			var day = time.getDate();
			var hour = time.getHours();
			var minute = time.getMinutes();
			var second = time.getSeconds();
			var pattern = /([+-]?[0-9]+)\s*(s|m|h|d|w|o|y)?/g;
			var matches = pattern.exec(offset);
			while (matches) {
				switch (matches[2] || 's') {
					case 's': second += parseInt(matches[1], 10); break;
					case 'm': minute += parseInt(matches[1], 10); break;
					case 'h': hour += parseInt(matches[1], 10); break;
					case 'd': day += parseInt(matches[1], 10); break;
					case 'w': day += parseInt(matches[1], 10) * 7; break;
					case 'o':
						month += parseInt(matches[1], 10);
						day = Math.min(day, plugin._getDaysInMonth(year, month));
						break;
					case 'y':
						year += parseInt(matches[1], 10);
						day = Math.min(day, plugin._getDaysInMonth(year, month));
						break;
				}
				matches = pattern.exec(offset);
			}
			return new Date(year, month, day, hour, minute, second, 0);
		};
		var time = (setting == null ? defaultTime :
			(typeof setting == 'string' ? offsetString(setting) :
			(typeof setting == 'number' ? offsetNumeric(setting) : setting)));
		if (time) time.setMilliseconds(0);
		return time;
	},

	/* Determine the number of days in a month.
		 @param	year	 (number) the year
		 @param	month	(number) the month
		 @return	(number) the days in that month */
	_getDaysInMonth: function(year, month) {
		return 32 - new Date(year, month, 32).getDate();
	},

	/* Determine which set of labels should be used for an amount.
		 @param	num	(number) the amount to be displayed
		 @return	(number) the set of labels to be used for this amount */
	_normalLabels: function(num) {
		return num;
	},

	/* Generate the HTML to display the countdown widget.
		 @param	inst	(object) the current settings for this instance
		 @return	(string) the new HTML for the countdown display */
	_generateHTML: function(inst) {
		var self = this;
		// Determine what to show
		inst._periods = (inst._hold ? inst._periods :
			this._calculatePeriods(inst, inst._show, inst.options.significant, new Date()));
		// Show all 'asNeeded' after first non-zero value
		var shownNonZero = false;
		var showCount = 0;
		var sigCount = inst.options.significant;
		var show = $.extend({}, inst._show);
		for (var period = Y; period <= S; period++) {
			shownNonZero |= (inst._show[period] == '?' && inst._periods[period] > 0);
			show[period] = (inst._show[period] == '?' && !shownNonZero ? null : inst._show[period]);
			showCount += (show[period] ? 1 : 0);
			sigCount -= (inst._periods[period] > 0 ? 1 : 0);
		}
		var showSignificant = [false, false, false, false, false, false, false];
		for (var period = S; period >= Y; period--) { // Determine significant periods
			if (inst._show[period]) {
				if (inst._periods[period]) {
					showSignificant[period] = true;
				}
				else {
					showSignificant[period] = sigCount > 0;
					sigCount--;
				}
			}
		}
		var labels = (inst.options.compact ? inst.options.compactLabels : inst.options.labels);
		var whichLabels = inst.options.whichLabels || this._normalLabels;
		var showCompact = function(period) {
			var labelsNum = inst.options['compactLabels' + whichLabels(inst._periods[period])];
			return (show[period] ? self._translateDigits(inst, inst._periods[period]) +
				(labelsNum ? labelsNum[period] : labels[period]) + ' ' : '');
		};
		var showFull = function(period) {
			var labelsNum = inst.options['labels' + whichLabels(inst._periods[period])];
			return ((!inst.options.significant && show[period]) ||
				(inst.options.significant && showSignificant[period]) ?
				'<span class="' + plugin._sectionClass + '">' +
				'<span class="' + plugin._amountClass + '">' +
				( (self._translateDigits(inst, inst._periods[period]) <= 9) ? ('0' + self._translateDigits(inst, inst._periods[period])) :	self._translateDigits(inst, inst._periods[period]) ) + '</span>' +
				 '</span>' : '');
		};
		return (inst.options.layout ? this._buildLayout(inst, show, inst.options.layout,
			inst.options.compact, inst.options.significant, showSignificant) :
			((inst.options.compact ? // Compact version
			'<span class="' + this._rowClass + ' ' + this._amountClass +
			(inst._hold ? ' ' + this._holdingClass : '') + '">' +
			showCompact(Y) + showCompact(O) + showCompact(W) + showCompact(D) +
			(show[H] ? this._minDigits(inst, inst._periods[H], 2) : '') +
			(show[M] ? (show[H] ? inst.options.timeSeparator : '') +
			this._minDigits(inst, inst._periods[M], 2) : '') +
			(show[S] ? (show[H] || show[M] ? inst.options.timeSeparator : '') +
			this._minDigits(inst, inst._periods[S], 2) : '') :
			// Full version
			'<span class="' + this._rowClass + ' ' + this._showClass + (inst.options.significant || showCount) +
			(inst._hold ? ' ' + this._holdingClass : '') + '">' +
			showFull(Y) + showFull(O) + showFull(W) + showFull(D) +
			showFull(H) + showFull(M) + showFull(S)) + '</span>' +
			(inst.options.description ? '<span class="' + this._rowClass + ' ' + this._descrClass + '">' +
			inst.options.description + '</span>' : '')));
	},

	/* Construct a custom layout.
		 @param	inst						 (object) the current settings for this instance
		 @param	show						 (string[7]) flags indicating which periods are requested
		 @param	layout					 (string) the customised layout
		 @param	compact					(boolean) true if using compact labels
		 @param	significant			(number) the number of periods with values to show, zero for all
		 @param	showSignificant	(boolean[7]) other periods to show for significance
		 @return	(string) the custom HTML */
	_buildLayout: function(inst, show, layout, compact, significant, showSignificant) {
		var labels = inst.options[compact ? 'compactLabels' : 'labels'];
		var whichLabels = inst.options.whichLabels || this._normalLabels;
		var labelFor = function(index) {
			return (inst.options[(compact ? 'compactLabels' : 'labels') +
				whichLabels(inst._periods[index])] || labels)[index];
		};
		var digit = function(value, position) {
			return inst.options.digits[Math.floor(value / position) % 10];
		};
		var subs = {desc: inst.options.description, sep: inst.options.timeSeparator,
			yl: labelFor(Y), yn: this._minDigits(inst, inst._periods[Y], 1),
			ynn: this._minDigits(inst, inst._periods[Y], 2),
			ynnn: this._minDigits(inst, inst._periods[Y], 3), y1: digit(inst._periods[Y], 1),
			y10: digit(inst._periods[Y], 10), y100: digit(inst._periods[Y], 100),
			y1000: digit(inst._periods[Y], 1000),
			ol: labelFor(O), on: this._minDigits(inst, inst._periods[O], 1),
			onn: this._minDigits(inst, inst._periods[O], 2),
			onnn: this._minDigits(inst, inst._periods[O], 3), o1: digit(inst._periods[O], 1),
			o10: digit(inst._periods[O], 10), o100: digit(inst._periods[O], 100),
			o1000: digit(inst._periods[O], 1000),
			wl: labelFor(W), wn: this._minDigits(inst, inst._periods[W], 1),
			wnn: this._minDigits(inst, inst._periods[W], 2),
			wnnn: this._minDigits(inst, inst._periods[W], 3), w1: digit(inst._periods[W], 1),
			w10: digit(inst._periods[W], 10), w100: digit(inst._periods[W], 100),
			w1000: digit(inst._periods[W], 1000),
			dl: labelFor(D), dn: this._minDigits(inst, inst._periods[D], 1),
			dnn: this._minDigits(inst, inst._periods[D], 2),
			dnnn: this._minDigits(inst, inst._periods[D], 3), d1: digit(inst._periods[D], 1),
			d10: digit(inst._periods[D], 10), d100: digit(inst._periods[D], 100),
			d1000: digit(inst._periods[D], 1000),
			hl: labelFor(H), hn: this._minDigits(inst, inst._periods[H], 1),
			hnn: this._minDigits(inst, inst._periods[H], 2),
			hnnn: this._minDigits(inst, inst._periods[H], 3), h1: digit(inst._periods[H], 1),
			h10: digit(inst._periods[H], 10), h100: digit(inst._periods[H], 100),
			h1000: digit(inst._periods[H], 1000),
			ml: labelFor(M), mn: this._minDigits(inst, inst._periods[M], 1),
			mnn: this._minDigits(inst, inst._periods[M], 2),
			mnnn: this._minDigits(inst, inst._periods[M], 3), m1: digit(inst._periods[M], 1),
			m10: digit(inst._periods[M], 10), m100: digit(inst._periods[M], 100),
			m1000: digit(inst._periods[M], 1000),
			sl: labelFor(S), sn: this._minDigits(inst, inst._periods[S], 1),
			snn: this._minDigits(inst, inst._periods[S], 2),
			snnn: this._minDigits(inst, inst._periods[S], 3), s1: digit(inst._periods[S], 1),
			s10: digit(inst._periods[S], 10), s100: digit(inst._periods[S], 100),
			s1000: digit(inst._periods[S], 1000)};
		var html = layout;
		// Replace period containers: {p<}...{p>}
		for (var i = Y; i <= S; i++) {
			var period = 'yowdhms'.charAt(i);
			var re = new RegExp('\\{' + period + '<\\}([\\s\\S]*)\\{' + period + '>\\}', 'g');
			html = html.replace(re, ((!significant && show[i]) ||
				(significant && showSignificant[i]) ? '$1' : ''));
		}
		// Replace period values: {pn}
		$.each(subs, function(n, v) {
			var re = new RegExp('\\{' + n + '\\}', 'g');
			html = html.replace(re, v);
		});
		return html;
	},

	/* Ensure a numeric value has at least n digits for display.
		 @param	inst	 (object) the current settings for this instance
		 @param	value	(number) the value to display
		 @param	len		(number) the minimum length
		 @return	(string) the display text */
	_minDigits: function(inst, value, len) {
		value = '' + value;
		if (value.length >= len) {
			return this._translateDigits(inst, value);
		}
		value = '0000000000' + value;
		return this._translateDigits(inst, value.substr(value.length - len));
	},

	/* Translate digits into other representations.
		 @param	inst	 (object) the current settings for this instance
		 @param	value	(string) the text to translate
		 @return	(string) the translated text */
	_translateDigits: function(inst, value) {
		return ('' + value).replace(/[0-9]/g, function(digit) {
				return inst.options.digits[digit];
			});
	},

	/* Translate the format into flags for each period.
		 @param	inst	(object) the current settings for this instance
		 @return	(string[7]) flags indicating which periods are requested (?) or
							required (!) by year, month, week, day, hour, minute, second */
	_determineShow: function(inst) {
		var format = inst.options.format;
		var show = [];
		show[Y] = (format.match('y') ? '?' : (format.match('Y') ? '!' : null));
		show[O] = (format.match('o') ? '?' : (format.match('O') ? '!' : null));
		show[W] = (format.match('w') ? '?' : (format.match('W') ? '!' : null));
		show[D] = (format.match('d') ? '?' : (format.match('D') ? '!' : null));
		show[H] = (format.match('h') ? '?' : (format.match('H') ? '!' : null));
		show[M] = (format.match('m') ? '?' : (format.match('M') ? '!' : null));
		show[S] = (format.match('s') ? '?' : (format.match('S') ? '!' : null));
		return show;
	},

	/* Calculate the requested periods between now and the target time.
		 @param	inst				 (object) the current settings for this instance
		 @param	show				 (string[7]) flags indicating which periods are requested/required
		 @param	significant	(number) the number of periods with values to show, zero for all
		 @param	now					(Date) the current date and time
		 @return	(number[7]) the current time periods (always positive)
							by year, month, week, day, hour, minute, second */
	_calculatePeriods: function(inst, show, significant, now) {
		// Find endpoints
		inst._now = now;
		inst._now.setMilliseconds(0);
		var until = new Date(inst._now.getTime());
		if (inst._since) {
			if (now.getTime() < inst._since.getTime()) {
				inst._now = now = until;
			}
			else {
				now = inst._since;
			}
		}
		else {
			until.setTime(inst._until.getTime());
			if (now.getTime() > inst._until.getTime()) {
				inst._now = now = until;
			}
		}
		// Calculate differences by period
		var periods = [0, 0, 0, 0, 0, 0, 0];
		if (show[Y] || show[O]) {
			// Treat end of months as the same
			var lastNow = plugin._getDaysInMonth(now.getFullYear(), now.getMonth());
			var lastUntil = plugin._getDaysInMonth(until.getFullYear(), until.getMonth());
			var sameDay = (until.getDate() == now.getDate() ||
				(until.getDate() >= Math.min(lastNow, lastUntil) &&
				now.getDate() >= Math.min(lastNow, lastUntil)));
			var getSecs = function(date) {
				return (date.getHours() * 60 + date.getMinutes()) * 60 + date.getSeconds();
			};
			var months = Math.max(0,
				(until.getFullYear() - now.getFullYear()) * 12 + until.getMonth() - now.getMonth() +
				((until.getDate() < now.getDate() && !sameDay) ||
				(sameDay && getSecs(until) < getSecs(now)) ? -1 : 0));
			periods[Y] = (show[Y] ? Math.floor(months / 12) : 0);
			periods[O] = (show[O] ? months - periods[Y] * 12 : 0);
			// Adjust for months difference and end of month if necessary
			now = new Date(now.getTime());
			var wasLastDay = (now.getDate() == lastNow);
			var lastDay = plugin._getDaysInMonth(now.getFullYear() + periods[Y],
				now.getMonth() + periods[O]);
			if (now.getDate() > lastDay) {
				now.setDate(lastDay);
			}
			now.setFullYear(now.getFullYear() + periods[Y]);
			now.setMonth(now.getMonth() + periods[O]);
			if (wasLastDay) {
				now.setDate(lastDay);
			}
		}
		var diff = Math.floor((until.getTime() - now.getTime()) / 1000);
		var extractPeriod = function(period, numSecs) {
			periods[period] = (show[period] ? Math.floor(diff / numSecs) : 0);
			diff -= periods[period] * numSecs;
		};
		extractPeriod(W, 604800);
		extractPeriod(D, 86400);
		extractPeriod(H, 3600);
		extractPeriod(M, 60);
		extractPeriod(S, 1);
		if (diff > 0 && !inst._since) { // Round up if left overs
			var multiplier = [1, 12, 4.3482, 7, 24, 60, 60];
			var lastShown = S;
			var max = 1;
			for (var period = S; period >= Y; period--) {
				if (show[period]) {
					if (periods[lastShown] >= max) {
						periods[lastShown] = 0;
						diff = 1;
					}
					if (diff > 0) {
						periods[period]++;
						diff = 0;
						lastShown = period;
						max = 1;
					}
				}
				max *= multiplier[period];
			}
		}
		if (significant) { // Zero out insignificant periods
			for (var period = Y; period <= S; period++) {
				if (significant && periods[period]) {
					significant--;
				}
				else if (!significant) {
					periods[period] = 0;
				}
			}
		}
		return periods;
	}
});

// The list of commands that return values and don't permit chaining
var getters = ['getTimes'];

/* Determine whether a command is a getter and doesn't permit chaining.
	 @param	command		(string, optional) the command to run
	 @param	otherArgs	([], optional) any other arguments for the command
	 @return	true if the command is a getter, false if not */
function isNotChained(command, otherArgs) {
	if (command == 'option' && (otherArgs.length == 0 ||
			(otherArgs.length == 1 && typeof otherArgs[0] == 'string'))) {
		return true;
	}
	return $.inArray(command, getters) > -1;
}

/* Process the countdown functionality for a jQuery selection.
	 @param	options	(object) the new settings to use for these instances (optional) or
										(string) the command to run (optional)
	 @return	(jQuery) for chaining further calls or
						(any) getter value */
$.fn.countdown = function(options) {
	var otherArgs = Array.prototype.slice.call(arguments, 1);
	if (isNotChained(options, otherArgs)) {
		return plugin['_' + options + 'Plugin'].
			apply(plugin, [this[0]].concat(otherArgs));
	}
	return this.each(function() {
		if (typeof options == 'string') {
			if (!plugin['_' + options + 'Plugin']) {
				throw 'Unknown command: ' + options;
			}
			plugin['_' + options + 'Plugin'].
				apply(plugin, [this].concat(otherArgs));
		}
		else {
			plugin._attachPlugin(this, options || {});
		}
	});
};

/* Initialise the countdown functionality. */
var plugin = $.countdown = new Countdown(); // Singleton instance

})(jQuery);


$(function () {

	var CRM = require('modules/store/crm');

	$('input[type="text"], input[type="email"], textarea').on('focus', function () {
		if ($(this).val().length > 0) {
			$(this).siblings('span').css('color', '#736c6b');
		} else {
			$(this).siblings('span').css('color', '#fff');
		}
	});

	$('input, textarea').placeholder();

	var end = Date.parse('November 23, 2014');
	var newYear = false;

	$('#countdown').countdown({
		timestamp: end
	});

	$('#txt-tel').mask('(99) 9999-9999?9').blur(function(event) {
		var target, phone, element;
		target = (event.currentTarget) ? event.currentTarget : event.srcElement;

		phone = target ? target.value.replace(/\D/g, '') : '';
		element = $(target);

		element.unmask();
		if(phone.length > 10) {
			element.mask('(99) 99999-999?9');
		} else {
			element.mask('(99) 9999-9999?9');
		}
	});

	$('#txt-cpf').mask('999.999.999-99');
	$('#txt-data-nasc').mask('99/99/9999');

	$('.form-cadastro').validationEngine('attach', {scroll: false});

	$('.form-cadastro').on('submit', function(e){
		e.preventDefault();

		var self = $(this),
			data = self.serializeArray() || [];

		data.push( {name: 'ORIGEM_BF2014', value: getParameterByName('utm_source')} );

		var fullName = $('#txt-nome').val();
		if(fullName) {
			var splitedName = fullName.split(' '),
			firstName = splitedName[0],
			lastName  = splitedName.slice(1, splitedName.length).join(' ');

			data.push( { name: 'firstName', value: firstName } );
			data.push( { name: 'lastName', value: lastName } );
		}

		var inputs = {};
		$.map(data, function (x) {
			if (!x.value || x.value === '') return;
			inputs[x.name] = x.value;
		});

		console.log('inputs',inputs);

		data = inputs;

		if( self.validationEngine('validate') ) {

			CRM.insertClient(data)
					.then(function () {
						dataLayer.push({event: 'submissao', action: 'Cadastro', label: $('input[type="email"]').val(), category: 'Formulário'});
						$('input[type="text"], input[type="email"], textarea').val('');
						$( '#modal-success').vtexModal();
					})
					.fail(function () {
					});
		}
	});

	var getParameterByName = function(name, string) {
		name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
		var regex = new RegExp('(?:[\\?&]|^)' + name + '=([^&#]*)'),
			results = regex.exec(string || window.location.search || '');
		return results == null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
	};

	/*$('#termos').fancybox({
		maxWidth : '500px'
	});*/

	var austDay = new Date(2015, 10, 29);
	$('#defaultCountdown').countdown({until: austDay, format: 'dHM'});
});






require('vendors/slick');
require('vendors/vtex-modal');

$(document).ready(function(){
	var $slider = $('.slide .prateleira ul').not('.product-field ul'),
		pageUrl = window.location.href;

	var setupSlider = function(){

		$slider.slick({
			infinite: true,
			slidesToShow: 1,
			slidesToScroll: 1
		});

	};

	setupSlider();

	$('#termos').click(function(){
		$( '#modal-termos').vtexModal();
	});

	if(pageUrl.indexOf('#modal-termos') !== -1){
		$( '#modal-termos').vtexModal();
	}

	$('.section04 .anchor a').click(function(e) {
		e.preventDefault();

		$('.section04 .questions div, .section04 .anchor a').removeClass('active');
		$('.section04 .questions div' + $(this).attr('href')).add($(this)).addClass('active');
	});
});
