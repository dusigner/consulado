'use strict';

var gulp		= require('gulp'),
	$			= require('gulp-load-plugins')(),
	del			= require('del'),
	webpack 	= require('webpack-stream'),
	bs			= require('browser-sync'),
	named		= require('vinyl-named'),
	path		= require('path'),
	semver		= require('semver'),
	pkg			= require('./package.json');

var environment = process.env.VTEX_HOST || 'vtexcommercestable',
	ignoreReplace = [/\.js(\?.*)?$/, /\.css(\?.*)?$/, /\.svg(\?.*)?$/, /\.ico(\?.*)?$/, /\.woff(\?.*)?$/, /\.png(\?.*)?$/, /\.jpg(\?.*)?$/, /\.jpeg(\?.*)?$/, /\.gif(\?.*)?$/, /\.pdf(\?.*)?$/],
	paths = {
		scripts: 'src/scripts/**/*.js',
		webpack: 'src/scripts/*.js',
		styles: 'src/styles/**/*.scss',
		fonts: 'src/fonts/**/*.{eot,svg,ttf,woff,woff2}',
		images: 'src/images/**/*.{png,jpeg,jpg,gif,svg}',
		templates: 'src/templates/*.html',
		dest: 'build/arquivos'
	};

gulp.task('lint', function () {
	return gulp.src([paths.scripts, '!src/scripts/vendors/*.js'])
		.pipe($.jshint())
		.pipe($.jshint.reporter('jshint-stylish'));
});

gulp.task('bump', function() {
	return gulp.src('package.json')
		.pipe($.bump({version: pkg.version}))
		.pipe(gulp.dest('.'));
});

gulp.task('scripts', ['lint'], function () {

	var plugins = [];

	if( $.util.env.production ) {

		if( ! $.util.env.nobump ) {
			pkg.version = semver.inc(pkg.version, 'patch');

			gulp.start('bump');
		}

		plugins.push( new webpack.webpack.optimize.UglifyJsPlugin({minimize: true}) );
	}

	return gulp.src(paths.webpack)
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
		.pipe(gulp.dest(paths.dest));
});

gulp.task('styles', function () {
	/*  return gulp.src(paths.styles)
		.pipe($.plumber())
		/*.pipe($.sourcemaps.init())
		.pipe( $.sass({
			/rrLogToConsole: true,
		 	outputStyle: $.util.env.production ? 'compressed' : 'nested'
		}).on('error', $.sass.logError))* /
		.pipe($.rubySass({
			'sourcemap=none': true, //$.util.env.production,
			style: $.util.env.production ? 'compressed' : 'nested'
		}))
		.pipe($.autoprefixer())
		.pipe($.sourcemaps.write())
		.pipe(gulp.dest(paths.dest)); */

	return $.rubySass('src/styles/', {
			sourcemap: ! $.util.env.production,
			style: $.util.env.production ? 'compressed' : 'nested'
		})
		.on('error', $.sass.logError)
		.pipe($.plumber())
		.pipe($.autoprefixer())
		.pipe($.sourcemaps.write('.'))
		.pipe(gulp.dest(paths.dest));
});

gulp.task('images', function () {
	return gulp.src(paths.images)
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
		files: [ 'build/**', '!build/**/*.map'],
		startPath: '/admin/Site/Login.aspx?ReturnUrl=%2f%3fdebugcss%3dtrue%26debugjs%3dtrue',
		rewriteRules: [
			{
				match: new RegExp('[\"\'](?:https?:\/\/|\/\/)' + pkg.name + '.*?(\/.*?)?[\"\']', 'gm'),
				fn: function (match, group) {
					return '"' + ( group || '' ) + '"';
				}
			}
		],
		proxy: {
			target: 'develop-' + ( $.util.env.account || pkg.accountName ) + '.' + environment + '.com.br/?debugcss=true&debugjs=true',
			reqHeaders: function (config) {
				return {
					'host': ( $.util.env.account || pkg.accountName ) + '.vtexlocal.com.br',
					'protocol': 'https',
					'accept-encoding': 'identity',
					'Cache-Control': 'private, no-cache, no-store, must-revalidate',
					'Expires': '-1',
					'Pragma': 'no-cache'
				};
			}/* ,
			middleware: [
				function(req, res, next) {
					var data, end, write;
					if (ignoreReplace.some(function(ignore) {
						return ignore.test(req.url);
					})) {
						return next();
					}
					data = '';
					write = res.write;
					end = res.end;
					res.write = function(chunk) {
						return data += chunk;
					};
					res.end = function(chunk, encoding) {
						if (chunk) {
							data += chunk;
						}
						if (data) {
							data = data.replace(/[\"\']https?:\/\/brastemp.*?(\/.*?)?[\"\']/gm, '"$1"');
						}
						res.write = write;
						res.end = end;
						return res.end(data, encoding);
					};
					return next();
				},
				require('serve-static')('./build')
			] */
		},
		serveStatic: ['./build'],
		open: !$.util.env.no
	});

});

gulp.task('watch', ['scripts', 'styles', 'images'], function () {
	gulp.watch(paths.scripts, ['scripts']);
	gulp.watch(paths.styles, ['styles']);
	gulp.watch(paths.images, ['images']);
	gulp.watch(paths.templates, ['scripts']);
});

gulp.task('default', ['clean'], function() {

	gulp.start( $.util.env.production ? ['scripts', 'styles', 'images'] : 'server' );

});