'use strict';

Nitro.module('checkout.auto-fill', () => {

	var Index = {

		init: function() {
			this.saveUserInfos();
		},

        saveUserInfos: () => {
            const selectors = {
                $document    : $(document),
                $clEmail     : $('.client-email #client-email'),
                $clFirstName : $('.client-first-name #client-first-name'),
                $clLastName  : $('.client-last-name #client-last-name'),
                $clDocument  : $('.client-document #client-document'),
                $clPhone     : $('.client-phone #client-phone')
            }, { $clDocument, $clEmail, $clFirstName, $clLastName, $clPhone, $document } = selectors;

            // Setando as informações do cliente no cookie
            $document.ajaxSuccess((xhr, status, settings) => {
                if (settings.url.indexOf('/attachments/clientProfileData') !== -1) {
                    const expiryDate = new Date();
                    document.cookie = `clientInfos=clEmail${$clEmail.val()}/clFirstName=${$clFirstName.val()}/clLastName=${$clLastName.val()}/clDocument=${$clDocument.val()}/clPhone=${$clPhone.val()};${expiryDate.setMonth(expiryDate.getMonth() + 1)}`
                }
            });
        },
    }

    Index.init();
});
