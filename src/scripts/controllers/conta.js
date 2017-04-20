'use strict';
require('modules/removeBootstrap');

Nitro.controller('conta', ['removeBootstrap'], function() {
	$('.profile-detail-display').append('<a class="trigger-modal" data-toggle="modal" href="#editar-perfil" id="edit-data-link">Editar dados</a>');
	$('.address-display-block').append('<a class="trigger-modal address-update" data-toggle="modal" href="#address-edit">Cadastrar novo endereço</a>');

	// $('.trigger-modal').click(function(e) {
	//     e.preventDefault();

	//     var self = $(this);

	//     $('body').append('<div class="modal-overlay"></div>');
	//     $(self.attr('href')).show().removeClass('hide');
	// });

	// $('.modal-overlay, .modal-header .close').click(function(e) {
	//     e.preventDefault();
	//     // alert(0);
	//     $('.modal-overlay').remove();
	//     $('.modal').addClass('hide').hide();
	// });
});

