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
	accept = require('check-args');

/**
  * Project
  */
var DEFAULT_CONFIG = {
	errLogToConsole: true,
	includePaths: []
}


var buildPath = accept(String, String, String)
				.to(function(root, staticRoot, section){
					return path.join(root,
									 staticRoot,
									 section);
				});


/**
 * Exportable
 */
module.exports = function (gulp, gastro){
	/**
	 * Constants
	 */
	function ErrorHandler (err) {
		gastro.Plugins.util.PluginError('task-sass', err, {
			showStack: true
		});
		this.emit('end');
	}

	var Config = gastro.Config,

		target = buildPath(Config.target.root,
						   Config.target.static,
						   Config.target.styles),

		source = buildPath(Config.source.root,
						   Config.source.styles,
						   Config.filters.styles),

		SassConfig = Config.plugins.css.sass || DEFAULT_CONFIG;

	gulp.task('scss', function(done){

		debug('Starting');
		debug(' > source', source);
		debug(' > target', target);

		return gulp.src(source)
			.pipe(plumber(ErrorHandler))
			.pipe(named())
			.pipe(sourcemaps.init())
			.pipe(sass(SassConfig))
			.pipe(sourcemaps.write('./maps'))
			.pipe(gulp.dest(target));

	});

	debug('task registered');
}
