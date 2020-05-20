export default function floatToCurrency(_float) {
	var s = _float.toString().replace(',', '').split('.'),
		decimals = s[1] || '',
		integer_array = s[0].split(''),
		formatted_array = [];

	for (var i = integer_array.length, c = 0; i != 0; i--, c++) {
		if (c % 3 == 0 && c != 0) {
			formatted_array[formatted_array.length] = '.';
		}
		formatted_array[formatted_array.length] = integer_array[i - 1];
	}

	if (decimals.length == 1) {
		decimals = decimals + '0';
	} else if (decimals.length == 0) {
		decimals = '00';
	} else if (decimals.length > 2) {
		decimals = Math.floor(parseInt(decimals, 10) / Math.pow(10, decimals.length - 2)).toString();
	}

	return '<span>R$</span> ' + formatted_array.reverse().join('') + ',' + decimals;
}
