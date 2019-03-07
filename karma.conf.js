
'use strict';

module.exports = function(config) {
	config.set({
		basePath: '',
		plugins: ['karma-chrome-launcher', 'karma-webpack', 'karma-spec-reporter', 'karma-fixture', 'karma-html2js-preprocessor', 'karma-jasmine', 'karma-jquery'],
		frameworks: ['jquery-1.8.3', 'jasmine', 'fixture'],
		files: [
			// 'build/**/*.js',
			'src/Scripts/vendors/nitro.js',
			'test/**/*.js',
			'src/**/*.html'
		],
		proxies: {
			'/arquivos/': '/build/arquivos/'
		},
		preprocessors: {
			'src/**/*.html': ['html2js'],
			'test/**/*.js': [ 'webpack' ]
		},
		webpack: {
			mode: 'development',
			externals: {
				'jquery': 'jQuery'
			},
			resolve: {
				modules: ['src/Scripts', 'node_modules']
			},
			module: {
				rules: [
					{
						test: /\.js$/,
						exclude: /node_modules\/(?!bootstrap\/).*/,
						use: {
							loader: 'babel-loader?cacheDirectory',
							options: {
								presets: ['@babel/preset-env'],
								plugins: ['@babel/plugin-proposal-object-rest-spread']
							}
						}
					},
					{
						test: /\.html$/,
						use: {
							loader: 'dust-loader'
						}
					}
				]
			},
		},
		reporters: ['spec'],
		specReporter: {
			suppressErrorSummary: false,
			suppressFailed: false,
			suppressPassed: false,
			suppressSkipped: false,
			showSpecTiming: true,
			failFast: true
		},
		port: 9876,
		colors: true,
		logLevel: config.LOG_DISABLE,
		autoWatch: false,
		browsers: ['Chrome'],
		singleRun: true
	});
};
