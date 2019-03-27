module.exports = function (gulp, $, _) {
	return function sassLint(done) {
		gulp.src(_.getPath('styles')
			.concat('!./src/Styles/consul2-icons.scss')
			.concat('!./src/Styles/helpers/_mixins.scss'))
			.pipe($.util.env.preCommit ? $.util.noop() : $.cached('sassLinting'))
			.pipe($.sassLint({
				options: {
					'config-file': `.sass-lint${$.util.env.preCommit ? '.commit' : ''}.yml`
				}
			}))
			.pipe($.sassLint.format())
			.pipe($.util.env.preCommit ? $.sassLint.failOnError() : $.util.noop());

		done();
	};
};

