/**
 *
 * Não me orgulho nem um pouco do que está escrito daqui para baixo, fiz na correria com cliente no cangote, sem saber nem a tecnologia, nem a tecnologia, em um futuro refatorar tudo isso.
 *
 */
'use strict';

Nitro.controller('Rastreio', [], function() {
	var self = this;

	this.init = () => {
		this.getUrlParam();
	};

	this.titlePage = (msg) => {
		$('.id-success .info-client').prepend(msg);
	}

	this.errorPage = (msg) => {
		let html = `
			<div class='id-fail'>
				${msg}
			</div>
		`;
		$('.container.tracking_loading').addClass('load');
		$('.info-client').remove();
		$('.info-pedido').remove();
		$('.container.tracking_loading').prepend(html);
	};

	this.getUrlParam = () => {
		let url = document.URL.split('?');
		console.log("NE Q FOI!!");

		if(url[1]){
			let marketplace = url[1].split('=')[0],
				order = url[1].split('=')[1],
				marketplaceName = marketplace.replace('_',' ').toLowerCase();

			let html = `
				<h1>Rastreamento de pedidos</h1>
				<p>Acompanhe seus pedidos do <b>${marketplaceName}</b></p>
			`;
			self.titlePage(html);

			if(marketplace && order){
				self.getData('consulqa' , order);
			}
		}else{
			let html = `
				<h1>Desculpa, algo errado aconteceu...</h1>
				<p>O seu pedido não foi encontrado.</p>
			`;
			self.errorPage(html);
		}
	};

	this.getData = (store, order) => {

		$.ajax({
			url: `http://${store}.myvtex.com/_v/public/graphql/v1`,
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify({
				query: `
					query{
						getQuery(id: "${order}"){
							orderId
							creationDate
							statusDescription
							clientProfileData{
								firstName
								lastName
								email
								phone
							}
							shippingData{
								address{
									street
									neighborhood
								}
								logisticsInfo{
									shippingEstimateDate
								}
							}
							items{
								refId
								imageUrl
								name
							}
							packageAttachment{
								packages{
								  courierStatus{
									finished
									data{
									  lastChange
									  city
									  state
									  description
									}
								  }
								}
							}
						}
					}
				`
			}),
			success: function(data){

				if(data.data.getQuery){
					self.renderData(data.data.getQuery);
					$('.container').addClass('load');
				}else{
					let html = `
						<h1>Desculpa, algo errado aconteceu...</h1>
						<p>O seu pedido <b>Mercado Livre</b> não foi encontrado.</p>
					`;
					self.errorPage(html);
				}
			}
		});
	};

	this.renderData = data => {
		let client 		= data.clientProfileData,
			items 		= data.items,
			shipping 	= data.shippingData.address;

		let mail = client.email,
			mailHost = mail.split('@')[1],
			mailAdrressSplit = mail.split('@')[0],
			mailAdrressHidden = mailAdrressSplit[1] + mailAdrressSplit[2] + mailAdrressSplit[3] + mailAdrressSplit[4];

		let phone = client.phone.split('').splice(-4, 4);

		let street = shipping.street.split(' ')[0] + ' ' +shipping.street.split(' ')[1];

		let neighborhood = shipping.neighborhood.split('')[1] + shipping.neighborhood.split('')[2] + shipping.neighborhood.split('')[3];

		let createOrderSplit = data.creationDate.split('T'),
			createOrder = createOrderSplit[0].split('-')[2] + '/' + createOrderSplit[0].split('-')[1] + '/' + createOrderSplit[0].split('-')[0];

		let createTime = data.creationDate.split('T')[1].split('.')[0].split(':')[0] + ':' + data.creationDate.split('T')[1].split('.')[0].split(':')[1];

		let shippingEstimateDateSplit = (data.shippingData.logisticsInfo[0].shippingEstimateDate) ? data.shippingData.logisticsInfo[0].shippingEstimateDate.split('T')[0].split('-') : "",
			shippingEstimateDate = shippingEstimateDateSplit[2] + '/' + shippingEstimateDateSplit[1] + '/' + shippingEstimateDateSplit[0];

		let statusOrder = 0;
		let packageAttachment

		if (data.packageAttachment.packages[0] != null){
			packageAttachment = data.packageAttachment.packages[0].courierStatus.finished;
		} else {
			packageAttachment = 'false';
		}



		switch (data.statusDescription) {
			case "Pedido Confirmado":
				statusOrder = 1;
				break;
			case "Pagamento Pendente":
				statusOrder = 1;
				break;
			case "Cancelado":
				statusOrder = 2;
				break;
			case "Preparando Entrega":
				statusOrder = 4;
				break;
			case "Aguardando autorização para despachar":
				statusOrder = 4;
				break;
			case "Faturado":
				statusOrder = 5;
				break;
		}

		let deliveryDateSplit = '',
			deliveryDate = '';


		if(packageAttachment !== "false"){
			statusOrder = 6;

			let html = `<div class='info-truck'>
							<h2>Status de rastreio</h2>
							<div class='table-head'>
								<p class='data'>Data e hora</p>
								<p>Descrição</p>
							</div>
					`;

			deliveryDateSplit += data.packageAttachment.packages[0].courierStatus.data[0].lastChange.split('T'),
			deliveryDate += deliveryDateSplit.split(',')[0].split('-')[2] + '/' + deliveryDateSplit.split(',')[0].split('-')[1] + '/' + deliveryDateSplit.split(',')[0].split('-')[0];

			for (let index = 0; index < data.packageAttachment.packages[0].courierStatus.data.length; index++) {

				let dataDeliverySplit = data.packageAttachment.packages[0].courierStatus.data[index].lastChange.split('T'),
					dataDelivery = dataDeliverySplit[0].split('-')[2] + '/' + dataDeliverySplit[0].split('-')[1] + '/' + dataDeliverySplit[0].split('-')[0] + ' ' + dataDeliverySplit[1].split('.')[0];

				html += `
						<div class='table-info'>
							<p class='data'>${dataDelivery}</p>
							<p>${data.packageAttachment.packages[0].courierStatus.data[index].description}</p>
						</div>
				`;

			}

			html += '</div> <br/> <br />';
			$('.info-pedido').after(html);
		}

		let status = `
			<div class='status_position statu1'>
				<span></span>
				<div class='info-status-pedido'>
					<h3>Pedido Confirmado</h3>
					<p class='date'></p>
					<p class='time'></p>
				</div>
			</div>
			<div class='status_position statu2'>
				<span></span>
				<div class='info-status-pedido'>
					<h3>Aguardando pagamento</h3>
					<p class='date'></p>
					<p class='time'></p>
				</div>
			</div>
			<div class='status_position statu3'>
				<span></span>
				<div class='info-status-pedido'>
					<h3>Nota fiscal emitida</h3>
					<p class='date'></p>
					<p class='time'></p>
				</div>
			</div>
			<div class='status_position statu4'>
				<span></span>
				<div class='info-status-pedido'>
					<h3>Preparando pedido</h3>
					<p class='date'></p>
					<p class='time'></p>
				</div>
			</div>
			<div class='status_position statu5'>
				<span></span>
				<div class='info-status-pedido'>
					<h3>Enviado à transportadora</h3>
					<p class='date'></p>
					<p class='time'></p>
				</div>
			</div>
			<div class='status_position statu6'>
				<span></span>
				<div class='info-status-pedido'>
					<h3>Entrega até</h3>
					<p class='date'</p>
				</div>
			</div>
		`;

		let product = '';

		for (let i = 0; i < items.length; i++) {

			product = `
				<div class='col-8'>
					<div class='img-product'>
						<img src='${items[i].imageUrl}' />
					</div>
					<div class='product-name'>
						<p>${items[i].name}</p>
					</div>
				</div>
				<div class='col-4 align-right'>
					<div class='volts-product'>
						<p>${items[i].name.split(' ').pop()}</p>
					</div>
					<div class='cod-product'>
						<p>${items[i].refId}</p>
					</div>
				</div>
			`;
		}

		$('.tracking_email').html(' ' + mailAdrressHidden + '****@' + mailHost);
		$('.tracking_phone').html(' (**) ****-'+phone[0]+phone[1]+phone[2]+phone[3]);
		$('.tracking_street').html(' ' +street + ' ********');
		$('.tracking_neighborhood').html(' *'+ neighborhood + '***');
		$('.tracking_orderId').html(' ' + data.orderId);
		$('.tracking_orderCreate').html(' ' + createOrder);
		$('.statu').append(status);
		$('.info-product').html(product);
		$('.statu1 .time').html(createTime + 'h');
		$('.statu1 .date').html(' ' + createOrder);
		$('.statu6 h3').html((statusOrder === 6) ? 'Foi entregue em' : 'Entrega até');
		$('.statu6 .date').html(' ' + (statusOrder === 6) ? deliveryDate :shippingEstimateDate);

		if(statusOrder !== 2){
			for (let i = 0; i < statusOrder; i++) {
				$('.status_position').eq(i).find('span').addClass('checked');
			}
		}

		if(statusOrder === 2){
			for (let i = 0; i < 1; i++) {
				$('.status_position').eq(i).find('span').addClass('checked');
				$('.status_position.statu2').find('span').addClass('failed');
				$('.status_position.statu2').find('h3').html('Pedido Cancelado');
			}
		}
	};
	this.init();
});