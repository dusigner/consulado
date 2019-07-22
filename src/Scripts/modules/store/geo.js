'use strict';

Nitro.module('geo', function() {
	var self = this,
		clientURI = '/api/ds/pub/documents/CL';

	this.init = function() {
		if (!$.cookie('geo')) {
			this.setup();
		} else {
			this.showContent();
		}
	};

	this.setup = function() {
		var url = '//usa.cloud.netacuity.com/webservice/query';
		var data = {
			u: 'eaf07ea6-78be-417a-8bbd-141fffe50ef7',
			json: 'true'
		};

		$.ajax(url, {
			data: data,
			dataType: 'json',
			success: function(result) {
				var geo = result.response;
				if (geo) {
					var edgeRegion = geo['edge-region'].toLowerCase();
					geo.region = self.region(edgeRegion);
					$.cookie('geo', JSON.stringify(result.response));
					self.showContent();
					$(window).trigger('geoUpdated', result.response);
				}
			}
		});
	};

	this.region = function(state) {
		var region = {
			am: 'norte',
			rr: 'norte',
			ap: 'norte',
			pa: 'norte',
			to: 'norte',
			ro: 'norte',
			ac: 'norte',
			ma: 'nordeste',
			pi: 'nordeste',
			ce: 'nordeste',
			rn: 'nordeste',
			pe: 'nordeste',
			pb: 'nordeste',
			se: 'nordeste',
			al: 'nordeste',
			ba: 'nordeste',
			mt: 'centro-oeste',
			ms: 'centro-oeste',
			go: 'centro-oeste',
			sp: 'sudeste',
			rj: 'sudeste',
			es: 'sudeste',
			mg: 'sudeste',
			pr: 'sul',
			rs: 'sul',
			sc: 'sul'
		};
		return region[state] ? region[state] : 'nonBrazil';
	};

	this.showContent = function() {
		var geo = $.cookie('geo');
		//geo = JSON.parse(geo);

		$('[class*=js-region]:not(.js-region-' + geo.region + ')').remove();
		$('.js-region-' + geo.region).show();
		$('body').addClass('region-' + geo.region);
		$(window).trigger('geoUpdated', geo);
	};

	$(window).on('geoUpdated', function(event, result) {
		window.vtexjs.checkout.getOrderForm().done(function(orderForm) {
			if (orderForm && orderForm.clientProfileData && orderForm.clientProfileData.email) {
				var data = {};

				data.email = orderForm.clientProfileData.email;
				data.xGeoCidade = result['edge-city'];
				data.xGeoEstado = result['edge-region'];
				data.xGeoIP = result.ip;
				data.xGeoLatitude = result['edge-latitude'];
				data.xGeoLongitude = result['edge-longitude'];
				data.xGeoPais = result['edge-country'];
				data.xGeoRegiao = result['region'];

				return $.ajax({
					url: clientURI,
					type: 'POST',
					data: JSON.stringify(data),
					contentType: 'application/json; charset=utf-8'
				});
			}
		});
	});

	this.init();
});
