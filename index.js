'use strict';
/**
 * System
 */
var path = require('path');

/**
 * Framework
 */
var sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	debug = require('debug')('gastropod/addons/tasks/sass'),
	plumber = require('gulp-plumber'),
	named = require('vinyl-named'),
	accept = require('check-args'),
	through = require('through2');

/**
  * Project
  */
var Logging = require('gastropod/src/core/logging'),
	Logger = Logging.Logger,
	ErrorHandler = Logging.ErrorHandler;

var defaults = {
	errLogToConsole: true,
	includePaths: []
}


var buildPath = accept(String, String, String)
				.to(function(root, staticRoot, section){
					return path.join(root,
									 staticRoot,
									 section);
				});


var logger = new Logger('css:scss');

/**
 * Exportable
 */
module.exports = function (gulp, gastro){
	/**
	 * Constants
	 */
	var Config = gastro.Config,

		incoming = logger.incoming(),
		outgoing = logger.outgoing(),

		target = buildPath(Config.target.root,
						   Config.target.static,
						   Config.target.styles),

		source = buildPath(Config.source.root,
						   Config.source.styles,
						   Config.filters.styles),

		SassConfig = Config.plugins.css.sass || defaults;

	gulp.task('scss', function(done){

		debug('Starting');
		debug(' > source', source);
		debug(' > target', target);

		return gulp.src(source)
			.pipe(named())
			.pipe(incoming)
			.pipe(plumber(ErrorHandler('CSS:Scss')))
			.pipe(sourcemaps.init())
			.pipe(sass(SassConfig))
			.pipe(sourcemaps.write('./maps'))
			.pipe(outgoing)
			.pipe(gulp.dest(target));

	});

	debug('task registered');
}
