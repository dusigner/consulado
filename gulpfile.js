'use strict';

var gulp		= require('gulp'),
	$			= require('gulp-load-plugins')(),
	del			= require('del'),
	webpack 	= require('webpack-stream'),
	bs			= require('browser-sync'),
	named		= require('vinyl-named'),
	path		= require('path'),
	semver		= require('semver'),
	sassLint 	= require('gulp-sass-lint'),
	pkg			= require('./package.json'),
	cssnano		= require('cssnano'),
	cssMqpacker = require('css-mqpacker'),
	shell		= require('shelljs'),
	cached		= require('gulp-cached'),
	sassPartialsImported = require('gulp-sass-partials-imported');

var environment = process.env.VTEX_HOST || 'vtexcommercestable',
	ignoreReplace = [/\.js(\?.*)?$/, /\.css(\?.*)?$/, /\.svg(\?.*)?$/, /\.ico(\?.*)?$/, /\.woff(\?.*)?$/, /\.png(\?.*)?$/, /\.jpg(\?.*)?$/, /\.jpeg(\?.*)?$/, /\.gif(\?.*)?$/, /\.pdf(\?.*)?$/],
	paths = {
		scripts: 'src/scripts/**/*.js',
		webpack: 'src/scripts/*.js',
		styles: 'src/styles/**/*.scss',
		fonts: 'src/fonts/**/*.{eot,svg,ttf,woff,woff2}',
		images: 'src/images/**/*.{png,jpeg,jpg,gif,svg}',
		templates: 'src/templates/*.html',
		dest: 'build/arquivos',
		destCheckout: 'build/files',
		pages: 'src/pages/**/*.html'
	};

var getPath = function ( source ) {

	var newPath = [ paths[ source ] ],
		replaceSource;

	if( $.util.env.page ) {

		if( source === 'webpack' ) {
			source = 'scripts';
		}

		replaceSource = source === 'pages' ? '': '/' + source;

		newPath.push( newPath[0].replace( source,  'pages/' + $.util.env.page + replaceSource ) );
	}

	if( source === 'pages' ) {
		newPath.shift();
	}

	//console.log( newPath );

	return newPath;
};

gulp.task('sassLint', function () {

	return gulp.src(getPath('styles')
	.concat('!src/styles/helpers/*'))
	.pipe(cached('sassLinting'))
	.pipe(sassLint({
			options: {
				'config-file': '.sass-lint.yml'
			}
		}))
	.pipe(sassLint.format());
	// .pipe(sassLint.failOnError());
});

gulp.task('lint', function () {

	return gulp.src(getPath('scripts')
	.concat('!src/scripts/vendors/*.js')
	.concat('!src/scripts/modules/helpers.js'))
	.pipe($.eslint())
	.pipe($.eslint.format())
	.pipe($.eslint.failAfterError());
});

gulp.task('fonts', function () {
	return gulp.src(getPath('fonts'))
		.pipe($.rename(function(file){
			file.extname += '.css'
		}))
		.pipe(gulp.dest(paths.dest));
});

//get last git tag and bump version in package.json
gulp.task('gitTag', function() {
	if( shell.exec('git fetch --tags').code !== 0 ) {
		shell.echo('Error: Git fetch tags failed');
		shell.exit(1);
	}else {
		shell.exec('git for-each-ref --count=1 --sort=-creatordate --format "%(refname)" refs/tags', function(code, stdout, stderr) {
			pkg.version = stdout.replace('refs/tags/v','').trim();
			gulp.start('bump');
		});
	}
});

gulp.task('bump', function() {
	return gulp.src('package.json')
		.pipe($.util.env.nobump ? $.util.noop() : $.bump({ version: pkg.version }))
		.pipe(gulp.dest('.'));
});

gulp.task('scripts', ['lint'], function () {

	var plugins = [];

	if( $.util.env.production ) {

		/*if( ! $.util.env.nobump ) {
			pkg.version = semver.inc(pkg.version, 'patch');

			gulp.start('bump');
		}*/

		plugins.push( new webpack.webpack.optimize.UglifyJsPlugin({minimize: true}) );
	}

	return gulp.src(getPath('webpack'))
		.pipe($.plumber())
		.pipe(named())
		.pipe(webpack({
			output: {
				filename: '[name].min.js'
			},
			externals: {
				'jquery': 'jQuery',
				'dustjs-linkedin': 'dust'
			},
			resolve: {
				root: path.resolve('./src/scripts')
			},
			module: {
				loaders: [
					{
						test: /\.html$/,
						loader: 'dust-loader'
					}
				]
			},
			plugins: plugins.concat([
				new webpack.webpack.DefinePlugin({
					VERSION: JSON.stringify( pkg.version )
				}),
				new webpack.webpack.BannerPlugin('Build Version: ' + pkg.version)
			]),
			devtool: $.util.env.production ? '': '#source-map'
		}))
		.pipe(gulp.dest(paths.dest))
		.pipe(gulp.dest(paths.destCheckout));
});

gulp.task('styles', ['sassLint'], function () {
	return gulp.src(getPath('styles'))
		.pipe($.util.env.page ? $.util.noop() : cached('styling'))
		.pipe($.util.env.page ? $.util.noop() : sassPartialsImported('src/styles/'))
		.pipe($.plumber())
		.pipe($.newer(paths.dest))
		.pipe( $.util.env.production ? $.util.noop() : $.sourcemaps.init() )
		.pipe( $.sass({
			errLogToConsole: true,
			outputStyle: $.util.env.production ? 'compressed' : 'nested',
			includePaths: [
				'node_modules/bootstrap-sass/assets/stylesheets/',

				// https://github.com/dlmanning/gulp-sass/commit/6b65a312f44f076c6f92ed3e35c20848bd9cdf6a
				'src/styles/'
			]
		}).on('error', $.sass.logError))
		.pipe($.autoprefixer())
		.pipe( $.util.env.production ? $.postcss([
			cssnano({zindex:false}),
			cssMqpacker()
		]) : $.postcss([
			cssMqpacker()
		]))
		// REPLACEMENTS
		.pipe($.replace('PKG_ACCOUNTNAME', pkg.accountName))
		.pipe($.replace('PKG_NAME', pkg.name))
		.pipe($.replace('PKG_AUTHOR', pkg.author))
		.pipe($.replace('PKG_BUILD_VERSION', pkg.version))
		.pipe($.sourcemaps.write('.'))
		.pipe(gulp.dest(paths.dest))
		.pipe(gulp.dest(paths.destCheckout));

	// return $.rubySass('src/styles/', {
	// 		sourcemap: ! $.util.env.production,
	// 		style: $.util.env.production ? 'compressed' : 'nested'
	// 	})
	// 	.on('error', $.sass.logError)
	// 	.pipe($.plumber())
	// 	.pipe($.autoprefixer())
	// 	.pipe($.postcss([
	// 	  require('css-mqpacker')(),
	// 			require('cssnano')()
	// 	]))
	// 	.pipe($.sourcemaps.write('.'))
	// 	.pipe(gulp.dest(paths.dest))
	// 	.pipe(gulp.dest(paths.destCheckout));
});

gulp.task('images', function () {
	return gulp.src(getPath('images'))
		.pipe($.plumber())
		.pipe($.newer(paths.dest))
		.pipe($.imagemin({
			optimizationLevel: $.util.env.production ? 5 : 1,
			progressive: true,
			interlaced: true
		}))
		//.pipe($.flatten())
		.pipe(gulp.dest(paths.dest));
});

gulp.task('clean', function (cb) {
	del('build', cb);
});

gulp.task('server', ['watch'], function () {

	bs({
		files: $.util.env.page ? [] : [ 'build/**', '!build/**/*.map'],
		startPath: '/admin/Site/Login.aspx?ReturnUrl=%2f%3fdebugcss%3dtrue%26debugjs%3dtrue',
		rewriteRules: [
			{
				match: new RegExp('[\"\'](?:https?:\/\/|\/\/)' + pkg.name + '.*?(\/.*?)?[\"\']', 'gm'),
				replace: '"$1"'
			}
		],
		proxy: {
			target: ( $.util.env.account || pkg.accountName ) + '.' + environment + '.com.br/?debugcss=true&debugjs=true',
			proxyReq: [
				function (proxyReq) {
					proxyReq.setHeader('host', ( $.util.env.account || pkg.accountName ) + '.vtexlocal.com.br');
					proxyReq.setHeader('protocol', 'https');
					proxyReq.setHeader('accept-encoding', 'identity');
					proxyReq.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
					proxyReq.setHeader('Expires', '-1');
					proxyReq.setHeader('Pragma', 'no-cache');
				}
			]
		},
		serveStatic: ['./build'],
		open: !$.util.env.page && !$.util.env.no
	});

	return $.util.env.page && bs.create().init({
		files: [ 'build/**', '!build/**/*.map'],
		server: {
			baseDir: ['build']
		},
		ui: false,
		port: 3002,
		startPath: $.util.env.page,
		open: !$.util.env.no
	});

});

gulp.task('pages', function () {
	return $.util.env.page && gulp.src( getPath('pages'), {base: 'src/pages'} )
		.pipe($.newer('build'))
		.pipe(gulp.dest('build'));
});

gulp.task('watch', ['scripts', 'styles', 'images', 'pages'], function () {
	gulp.watch(getPath('scripts'), ['scripts']);
	gulp.watch(getPath('styles'), ['styles']);
	gulp.watch(getPath('images'), ['images']);
	gulp.watch(getPath('templates'), ['scripts']);
	gulp.watch( getPath('pages'), ['pages']);
});

gulp.task('default', ['clean'], function() {
	gulp.start( 'server' );
});

/*gulp.task('default', ['clean'], function() {

	gulp.start( $.util.env.production ? ['scripts', 'styles', 'images'] : 'server' );

});
*/

gulp.task('deploy', ['clean', 'gitTag'], function() {
	$.util.env.production = true;

	pkg	= JSON.parse( require('fs').readFileSync('./package.json') ); //fix update pkg from bump

	gulp.start( 'fonts', 'images', 'styles', 'scripts' );
});
