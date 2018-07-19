/* global $: true, Nitro: true, dust: true, dust: true, _: true, vtexjs:true */

'use strict';

Nitro.module('upselldataLayer', function() {
	console.log('❤1');

	self.setup = function() {
		console.log('❤');
		//Tagueamento datalayer
		$('.btn-interessado-upgrade').click(function() {			
			//Tagueamento datalayer
			dataLayer.push({
				event: 'visualTracking',
				category: 'de um Upgrade',
				action: 'barra',
				label: 'Estou interessado'
			});
		});
	
		//Tagueamento dataLayer
		$('.icon-open-upgrade').click(function(){
			if( $(this).hasClass('voltar') ){
				dataLayer.push({
					event: 'visualTracking',
					category: 'ver produto anterior',
					action: 'icon',
					label: 'click'
				});
			}else{
				dataLayer.push({
					event: 'visualTracking',
					category: 'de um Upgrade',
					action: 'icon',
					label: 'click'
				});
			}			
		});
	
		//Tagueamento dataLayer
		$('.close-fixed').click(function(){
			dataLayer.push({
				event: 'visualTracking',
				category: 'de um Upgrade',
				action: 'barra',
				label: 'Sair'
			});
		});
	
		//Tagueamento dataLayer
		$('.aceitarounao a').click(function(){
			var action = $(this).text();
			dataLayer.push({
				event: 'visualTracking',
				category: 'de um Upgrade',
				action: 'Modal',
				label: action
			});
		});
	
		//Tagueamento dataLayer
		$('.aceitarounao a').click(function(){
			var action = $(this).text();
			dataLayer.push({
				event: 'visualTracking',
				category: 'de um Upgrade',
				action: 'Modal',
				label: action
			});
		});
	
		//Tagueamento datalayer
		$('.vtex-modal[id*=vtex-modal-produto-] .modal-header .close').click(function(){	
			dataLayer.push({
				event: 'visualTracking',
				category: 'de um Upgrade',
				action: 'Modal',
				label: 'Sair'
			});
		});		
	
		//Tagueamento datalayer
		$('.btn-interessado-downgrade').click(function(){	
			dataLayer.push({
				event: 'visualTracking',
				category: 'ver produto anterior',
				action: 'barra',
				label: 'Ver produto novamente'
			});
		});	
	};
});	
