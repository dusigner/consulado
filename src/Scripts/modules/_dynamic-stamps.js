// Nova solução de troca de selos por promoções
// A ideia é que o nome da promoção seja o mesmo
// nome da imagem, Assim não teremos problemas com cache

const dynamicStamps = (context, cssSelector) => {
	const element = $(context);
	const selector = cssSelector;

	element.find(selector).each(function(i, e) {
		const elFlag = $(e);
		const flagName = elFlag.attr('class').replace('flag', '').trim();

		updateImageStamps(elFlag, flagName);
	});
};

const updateImageStamps = (stamp, imageName) => {
	$(stamp).css({
		'background-image'    : `url(/arquivos/${imageName}.png)`,
		'background-position' : 'center center',
		'background-repeat'   : 'no-repeat'
	});
};

export default dynamicStamps;