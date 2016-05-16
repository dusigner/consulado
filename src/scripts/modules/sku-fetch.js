/* global $: true, Nitro: true */

Nitro.module('sku-fetch', function () {
	
	'use strict';
	
	var objectLowerCaseProperties = function (obj, properties){
		
		properties.forEach(function( item ){
			obj[ item.toLowerCase() ] = obj[item];
			delete obj[item];
		});
		
		return obj;
	};
	
	if( ! window.ListSkuData ) {
		window.ListSkuData = [];
	}
	
	window.skuJson.skus.forEach(function( sku ){
		
		$.get('/produto/sku/' + sku.sku).done(function(skuList) {
			
			var skuData = skuList[0];
			
			// change properties case, api comes with eg: 'Images', but vtex functions uses 'image';
			skuData = objectLowerCaseProperties(skuData, ['Id', 'IdProduct', 'Name', 'ListPrice', 'Price', 
				'Availability', 'AvailabilityMessage', 'BestInstallmentValue', 'BestInstallmentNumber', 
				'Images', 'Reference', 'NotifyMe']);
			
			//global object that vtex use in global functions
			window.ListSkuData['sku' + skuData.id] = skuData;
			
			//for anyone who want this skuData;
			$(document).trigger('skuFetch', skuData);
			
		});
		
	});
	
	//don't let vtex output infinity console.log skuData;
	window.BatchBuy_OnSkuDataReceived = $.noop();
});