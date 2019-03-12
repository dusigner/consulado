'use strict';

let pkg = require('./package.json');

const
	gulp = require('gulp'),
	$ = require('gulp-load-plugins')(),
	del = require('del'),
	webpack = require('webpack-stream'),
	bs = require('browser-sync'),
	named = require('vinyl-named'),
	path = require('path'),
	projectConfig = require('./config.js'),
	cssnano = require('cssnano'),
	cssMqpacker = require('css-mqpacker'),
	autoprefixer = require('autoprefixer'),
	flexibility = require('postcss-flexibility'),
	shell = require('shelljs'),
	fs = require('fs'),
	middlewares = require('./middlewares'),
	url = require('url'),
	secureUrl = pkg.secureUrl ? pkg.secureUrl : true,
	proxyPort = process.env.PROXY_PORT || pkg.proxyPort || 80,
	environment = $.util.env.VTEX_HOST || 'vtexcommercestable',
	accountName = $.util.env.account ? $.util.env.account : ($.util.env.qa ? 'consulqa' : pkg.accountName),
	httpPlease = require('connect-http-please'),
	serveStatic = require('serve-static'),
	proxy = require('proxy-middleware'),
	HardSourceWebpackPlugin = require('hard-source-webpack-plugin'),
	isProdEnv = () => accountName === 'consul' || accountName === 'consulempresa';

const paths = {
	scripts: 'src/scripts/**/*.js',
	webpack: 'src/scripts/*.js',
	styles: 'src/styles/**/*.scss',
	fonts: 'src/Fonts/**/*.{eot,svg,ttf,woff,woff2}',
	images: 'src/Images/**/*.{png,jpeg,jpg,gif,svg}',
	dust: 'src/scripts/Dust/**/*.html',
	pages: 'src/Pages/**/*.html',

	html: {
		templates: 'src/01 - HTML Templates/*.html',
		subTemplates: 'src/01 - HTML Templates/Sub Templates/*.html',
		shelvesTemplates: 'src/02 - Shelves Templates/*.html'
	},

	dest: {
		default: 'build/arquivos',
		files: 'build/files',
		html: {
			templates: 'build/html',
			subTemplates: 'build/html/sub',
			shelvesTemplates: 'build/shelf'
		}
	}
};

let preprocessContext = {
	context: {
		...projectConfig[accountName],
		package: {
			...pkg
		},
		DEBUG: !$.util.env.production,
	}
};

const getPath = source => {

	let newPath = [paths[source]],
		replaceSource;

	if ($.util.env.page) {

		if (source === 'webpack') {
			source = 'scripts';
		}

		replaceSource = source === 'pages' ? '' : `/${source}`;

		if ($.util.env.page) {
			if ($.util.env.page === 'ALL') {
				let pagesDir = fs.readdirSync(`${__dirname}/src/pages`);
				pagesDir = $.util.env.production ? pagesDir.filter(path => !/(base|styleguide|includes|templates|header)/.test(path)) : pagesDir;
				$.util.env.page = pagesDir.join(',');
			}

			if ($.util.env.page.indexOf(',') > 0) {
				const multiPages = $.util.env.page.split(',');

				multiPages.map(singlePage => {
					newPath.push(newPath[0].replace(new RegExp(source, 'i'), 'pages/' + singlePage + replaceSource));
				});
			} else {
				newPath.push(newPath[0].replace(new RegExp(source, 'i'), 'pages/' + $.util.env.page + replaceSource));
			}
		}

	}

	if (source === 'pages') {
		newPath.shift();
	}

	return newPath;
};

const processHTML = (sourcePath, destPath) => {
	return gulp.src(sourcePath)
		.pipe($.preprocess(preprocessContext)) //To set environment variables in-line
		.pipe(Array.isArray(destPath) ? $.multiDest(destPath) : gulp.dest(destPath));
};

gulp.task('sassLint', function () {

	return gulp.src(getPath('styles')
			.concat('!src/styles/helpers/*')
			.concat('!src/styles/libs/*'))
		.pipe($.util.env.preCommit ? $.util.noop() : $.cached('sassLinting'))
		.pipe($.sassLint({
			options: {
				'config-file': `.sass-lint${$.util.env.preCommit ? '.commit' : ''}.yml`
			}
		}))
		.pipe($.sassLint.format())
		.pipe($.util.env.preCommit ? $.sassLint.failOnError() : $.util.noop());
});

gulp.task('lint', function () {

	return gulp.src(getPath('scripts')
			.concat('!src/scripts/vendors/*.js')
			.concat('!src/scripts/modules/helpers.js'))
		.pipe($.util.env.preCommit ? $.util.noop() : $.cached('jsLinting'))
		.pipe($.eslint({
			'configFile': `.eslintrc${$.util.env.preCommit ? '.commit' : ''}.js`
		}))
		.pipe($.eslint.format())
		.pipe($.eslint.failAfterError());
});

gulp.task('pre-commit-lint', () => {

	$.util.env.preCommit = true;

	return gulp.start('sassLint', 'lint');
});

gulp.task('fonts', /*  ['icons'], */ function () {

	return gulp.src(paths.fonts)
		.pipe($.rename(function (file) {
			file.extname += '.css';
		}))
		.pipe(gulp.dest(paths.dest.default));
});

gulp.task('scripts', ['lint'], function () {

	return gulp.src(getPath('webpack'))
		.pipe($.plumber())
		.pipe(named())
		.pipe(webpack({
			output: {
				filename: '[name].min.js'
			},
			externals: {
				'jquery': 'jQuery'
			},
			resolve: {
				modules: ['src/scripts', 'node_modules'],
				alias: {
					// templates: path.resolve('./src/templates')
					bootstrap: path.resolve('./node_modules/bootstrap-sass/assets/javascripts/bootstrap'),
					bs: path.resolve('./node_modules/bootstrap/js/')
				}
			},
			module: {
				rules: [{
						test: /\.js$/,
						exclude: /node_modules\/(?!bootstrap\/).*/,
						use: {
							loader: 'babel-loader?cacheDirectory',
							options: {
								presets: ['babel-preset-env'],
								plugins: ['transform-object-rest-spread']
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
			plugins: [
				new webpack.webpack.DefinePlugin({
					VERSION: JSON.stringify(pkg.version)
				}),
				new webpack.webpack.BannerPlugin('Build Version: ' + pkg.version),
				$.util.env.production ? new webpack.webpack.optimize.UglifyJsPlugin({
					minimize: true,
					compress: {
						warnings: false
					}
				}) : $.util.noop,
				$.util.env.production ? $.util.noop : new HardSourceWebpackPlugin()
			],
			devtool: $.util.env.production ? '' : 'eval-source-map'
		}))
		.pipe($.preprocess(preprocessContext))
		.pipe((isProdEnv()) ? gulp.dest(paths.dest.default) : gulp.dest(paths.dest.files))
		.pipe($.filter(f => /checkout/.test(f.path)))
		.pipe($.rename(file => file.basename = file.basename.replace('.min', '')))
		.pipe(gulp.dest(paths.dest.files));
});

gulp.task('styles', ['sassLint'], function () {

	return gulp.src(getPath('styles'))
		.pipe($.util.env.page ? $.util.noop() : $.cached('styling'))
		.pipe($.util.env.page ? $.util.noop() : $.sassPartialsImported('src/styles/'))
		.pipe($.plumber())
		.pipe($.util.env.production ? $.util.noop() : $.sourcemaps.init())
		.pipe($.sass({
			errLogToConsole: true,
			outputStyle: $.util.env.production ? 'compressed' : 'nested',
			includePaths: [
				// https://github.com/dlmanning/gulp-sass/commit/6b65a312f44f076c6f92ed3e35c20848bd9cdf6a
				'node_modules/bootstrap-sass/assets/stylesheets/',
				'src/styles',
				'node_modules/'
			]
		}).on('error', $.sass.logError))
		.pipe($.util.env.production ? $.postcss([
			autoprefixer(),
			flexibility(),
			cssMqpacker(),
			cssnano({
				zindex: false,
				reduceIdents: false
			}),
		]) : $.postcss([
			cssMqpacker()
		]))
		.pipe($.util.env.production ? $.preprocess(preprocessContext) : $.util.noop())
		.pipe(!$.util.env.production ? $.sourcemaps.write('.') : $.util.noop())
		.pipe((isProdEnv()) ? gulp.dest(paths.dest.default) : gulp.dest(paths.dest.files))
		.pipe($.filter(f => /checkout/.test(f.path)))
		.pipe($.rename(file => file.basename = file.basename.replace('.min', '')))
		.pipe(gulp.dest(paths.dest.files));
});

gulp.task('images', function () {

	return gulp.src(getPath('images'))
		.pipe($.plumber())
		.pipe($.newer(paths.dest.default))
		/* .pipe($.imagemin({
			optimizationLevel: $.util.env.production ? 5 : 1,
			progressive: true,
			interlaced: true
		}))
		.pipe($.flatten()) */
		.pipe(gulp.dest(paths.dest.default));
});

gulp.task('clean', function () {

	return del.sync('build');
});

gulp.task('server', ['watch'], () => {
	let htmlFile = null;

	let portalHost = `${accountName}.${environment}.com.br`,
		imgProxyOptions = url.parse(`https://${accountName}.vteximg.com.br/arquivos`),
		portalProxyOptions = url.parse(`https://${portalHost}/`),
		localHost = `${accountName}.vtexlocal.com.br`;

	if (proxyPort !== 80) localHost += `:${proxyPort}`;

	imgProxyOptions.route = '/arquivos';
	portalProxyOptions.preserveHost = true;
	portalProxyOptions.cookieRewrite = `${accountName}.vtexlocal.com.br`;

	const rewriteLocation = location => location.replace('https:', 'http:').replace(portalHost, localHost);
	const rewriteReferer = (referer = '') => {
		referer = referer.replace('http:', 'https:');

		return referer.replace(localHost, portalHost);
	};

	bs({
		files: $.util.env.page ? [] : ['build/**', '!build/**/*.map'],
		startPath: `${secureUrl ? `http://${accountName}.vtexlocal.com.br${proxyPort !== 80 ? `:${proxyPort}` : ''}/?debugcss=true&debugjs=true` : '/admin/Site/Login.aspx?ReturnUrl=%2f%3fdebugcss%3dtrue%26debugjs%3dtrue' }`,
		rewriteRules: [{
			match: new RegExp('["\'](?:https?://|//)' + pkg.name + '.*?(/.*?)?["\']', 'gm'),
			replace: '"$1"'
		}],
		proxy: {
			target: `${accountName}.${secureUrl ? 'vtexlocal' : environment}.com.br${secureUrl ? `:${proxyPort}` : ''}/?debugcss=true&debugjs=true`,
			proxyReq: [
				function (proxyReq) {

					proxyReq.setHeader('host', `${accountName}.vtexlocal.com.br`);
					proxyReq.setHeader('protocol', 'https');
					proxyReq.setHeader('accept-encoding', 'identity');
					proxyReq.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
					proxyReq.setHeader('Expires', '-1');
					proxyReq.setHeader('Pragma', 'no-cache');
				}
			]
		},
		middleware: secureUrl ? [
			middlewares.disableCompression,
			middlewares.rewriteLocationHeader(rewriteLocation),
			middlewares.replaceHost(portalHost),
			middlewares.replaceReferer(rewriteReferer),
			middlewares.replaceHtmlBody(environment, accountName, secureUrl),
			httpPlease({
				host: portalHost
			}),
			serveStatic('./build'),
			proxy(imgProxyOptions),
			proxy(portalProxyOptions),
			middlewares.errorHandler
		] : [],
		serveStatic: ['./build'],
		port: proxyPort,
		open: false,
		reloadOnRestart: true
	});

	const options = {
		uri: secureUrl ? `http://${accountName}.vtexlocal.com.br:${proxyPort}/?debugcss=true&debugjs=true` : `http://localhost:3000`,
		app: 'chrome'
	};

	if ($.util.env.page) htmlFile = fs.readdirSync(`${__dirname}/src/pages/${$.util.env.page}`).filter(file => /\.html$/.test(file))[0];

	return $.util.env.page ? bs.create().init({
		files: ['build/**', '!build/**/*.map'],
		server: {
			baseDir: ['build']
		},
		ui: false,
		port: 3002,
		startPath: $.util.env.page.indexOf(',') > 0 ? 'pages' : (htmlFile ? `${$.util.env.page}/${htmlFile}` : $.util.env.page),
		open: !$.util.env.no
	}) : (!$.util.env.no ? gulp.src(__filename).pipe($.open(options)) : null);

});

gulp.task('pages', ['html'], function () {
	/*
		return $.util.env.page && gulp.src( getPath('pages'), {base: 'src/Pages'} )
			.pipe($.newer('build'))
			.pipe(gulp.dest('build')); */
});

//get last git tag and bump version in package.json
gulp.task('gitTag', function () {
	// FORCE DEPLOY CONFIGS / PRODUCTION
	$.util.env.production = true;

	if (shell.exec('git fetch --tags').code !== 0) {
		shell.echo('Error: Git fetch tags failed');
		shell.exit(1);
	} else {
		shell.exec('git for-each-ref --count=1 --sort=-creatordate --format "%(refname)" refs/tags', function (code, stdout) {
			if (isProdEnv()) {
				pkg.version = stdout.replace('refs/tags/v', '').trim();
			} else {
				pkg.version = new Date().getTime();
			}

			preprocessContext = {
				context: {
					...projectConfig[accountName],
					package: {
						...pkg
					},
					DEBUG: false,
				}
			};

			// Tasks que dependem da versão atualizada para build deploy \/
			gulp.start('bump', 'html', 'styles', 'scripts');
		});
	}
});

gulp.task('bump', function () {

	return gulp.src('package.json')
		.pipe($.util.env.nobump ? $.util.noop() : $.bump({
			version: pkg.version
		}))
		.pipe(gulp.dest('.'));
});

gulp.task('templates', function () {
	return $.util.env.production && processHTML(paths.html.templates, paths.dest.html.templates);
});

gulp.task('sub', function () {
	return $.util.env.production && processHTML(paths.html.subTemplates, paths.dest.html.subTemplates);
});

gulp.task('shelves', function () {
	return $.util.env.production && processHTML(paths.html.shelvesTemplates, paths.dest.html.shelvesTemplates);
});

gulp.task('html', function () {
	let pagesDest = [`build/${$.util.env.page}`];

	if ($.util.env.page && $.util.env.page.indexOf(',') > 0) {
		pagesDest = ['build/pages'];
	}

	if ($.util.env.production) {
		gulp.start('templates', 'sub', 'shelves');

		pagesDest = pagesDest.concat(paths.dest.html.templates);
	}

	return $.util.env.page && processHTML(getPath('pages'), pagesDest);
});

gulp.task('watch', ['fonts', 'images', 'styles', 'scripts', 'pages'], function () {

	gulp.watch(getPath('fonts'), ['fonts']);
	gulp.watch(getPath('images'), ['images']);
	gulp.watch(getPath('styles'), ['styles']);
	gulp.watch(getPath('scripts'), ['scripts']);
	gulp.watch(getPath('dust'), ['scripts']);
	gulp.watch(getPath('pages'), ['pages']);
});

gulp.task('default', ['clean'], function () {

	gulp.start('server');
});

gulp.task('deploy', ['clean', 'gitTag'], function () {

	$.util.env.production = true;

	pkg = JSON.parse(require('fs').readFileSync('./package.json')); //fix update pkg from bump

	gulp.start('fonts', 'images');
});

// gulp.task('service-worker', () => {
// 	return workboxBuild.injectManifest({
// 		swSrc: 'src/04 - Portal/src-service-worker.js',
// 		swDest: 'src/04 - Portal/service-worker.js',
// 		globDirectory: 'build/files',
// 		globPatterns: [
// 		'**\/*.{js,css,html,png}',
// 		]
// 	});
// });
