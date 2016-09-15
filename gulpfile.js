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
	shell		= require('shelljs');

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

gulp.task('sassLint', function () {
	return gulp.src([paths.styles, '!src/styles/helpers/*'])
    .pipe(sassLint({
			options: {
				'config-file': '.sass-lint.yml'
			}
		}))
    .pipe(sassLint.format());
    // .pipe(sassLint.failOnError());
});

gulp.task('lint', function () {
	return gulp.src([paths.scripts, '!src/scripts/vendors/*.js', '!src/scripts/modules/helpers.js'])
	.pipe($.eslint())
	.pipe($.eslint.format())
	.pipe($.eslint.failAfterError());
});

gulp.task('fonts', function () {
	return gulp.src(paths.fonts)
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
		shell.exec('git for-each-ref --count=1 --sort=-taggerdate --format "%(tag)" refs/tags ', function(code, stdout, stderr) {
			pkg.version = stdout.replace(/[a-z]+/,'').trim();;
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

gulp.task('styles', ['sassLint'], function () {
	return $.rubySass('src/styles/', {
			sourcemap: ! $.util.env.production,
			style: $.util.env.production ? 'compressed' : 'nested'
		})
		.on('error', $.sass.logError)
		.pipe($.plumber())
		.pipe($.autoprefixer())
		.pipe($.postcss([
	      require('css-mqpacker')(),
				require('cssnano')()
	    ]))
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
				replace: '"$1"'
			}
		],
		proxy: {
			target: 'develop-' + ( $.util.env.account || pkg.accountName ) + '.' + environment + '.com.br/?debugcss=true&debugjs=true',
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
