module.exports = {
	extends: [
		'eslint:recommended',
		'plugin:import/errors',
		'plugin:import/warnings',
		'prettier'
	],
	env: {
		es6: true,
		browser: true,
		node: true,
		jquery: true,
		mocha: true
	},
	parser: 'babel-eslint',
	parserOptions: {
		ecmaVersion: 7,
		sourceType: 'module',
		ecmaFeatures: {
			modules: true,
		}
	},
	globals: {
		_: true,
		_jussi: true,
		skuJson: true,
		$: true,
		dataLayer: true,
		define: true,
		dust: true,
		Nitro: true,
		store: true,
		vtxctx: true,
		vtexjs: true,
		userData: true,
		store: true,
		storeLogin: true,
		localStore: true
	},
	rules: {
		'prettier/prettier': [
			"warn", {
				'singleQuote': true,
				//'parser': 'flow'
				'printWidth': 120
			}
		] ,
		eqeqeq: ['error', 'smart'],
		'no-console': [
			1,
			{
				allow: ['assert', 'info', 'error']
			}
		],
		'no-debugger': 1,
		'no-undef': [
			'error',
			{
				typeof: true
			}
		],
		'no-mixed-spaces-and-tabs': 1,
		'no-var': 0,
		'no-unresolved': 0,
		// quotes: [
		// 	'warn',
		// 	'single',
		// 	{
		// 		allowTemplateLiterals: true,
		// 		avoidEscape: true
		// 	}

		// ],
		indent: ['warn', 'tab'],
		//semi: ['error', 'always'],
		'no-trailing-spaces': 0,
		'eol-last': 0,
		'no-unused-vars': 1,
		'no-underscore-dangle': 0,
		'no-alert': 1,
		'no-lone-blocks': 0,
		'jsx-quotes': ['warn', 'prefer-single'],
		'import/no-unresolved': 0
	},
	plugins: [
		'prettier'
	]
};
