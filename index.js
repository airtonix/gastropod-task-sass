'use strict';
/**
 * System
 */
var path = require('path'),
	url = require('url');

/**
 * Framework
 */
var gulpSass = require('gulp-sass'),
	sass = require('gulp-sass/node_modules/node-sass'),
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
	includePaths: [],
	functions: []
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
	var logger = gastro.Logging.Logger('Sass');
	var PluginError = gastro.Plugins.util.PluginError;

	/**
	 * Constants
	 */
	function ErrorHandler (err) {
		var error = new PluginError('scss', err, {
			showStack: true
		});
		gastro.Plugins.util.log(error.formatted);
		this.emit('end');
		return
	}

	var Config = gastro.Config,
		Urls = Config.context.Site.urls,
		MediaRoot = path.join(Urls.root, Urls.media),
		StaticRoot = path.join(Urls.root, Urls.static),

		target = buildPath(Config.target.root,
						   Config.target.static,
						   Config.target.styles),

		source = buildPath(Config.source.root,
						   Config.source.styles,
						   Config.filters.styles),

		SassConfig = Config.plugins.css.sass || DEFAULT_CONFIG;

		debug('MediaRoot', MediaRoot);
		debug('StaticRoot', StaticRoot);

		SassConfig.functions = {

			'media-url($url)': function (url, done) {
				var output = path.join(MediaRoot, url.getValue());
				done(new sass.types.String(output || 'error'));
			},

			'static-url($url)': function (url, done) {
				var output = Manifest.db[url.getValue()] || url;
				done(new sass.types.String(output || 'error'));
			},

		}
	gulp.task('scss', function(done){

		debug('Starting');
		debug(' > source', source);
		debug(' > target', target);

		return gulp.src(source)
			.pipe(plumber(ErrorHandler))
			.pipe(named())
			.pipe(sourcemaps.init())
			.pipe(gulpSass(SassConfig).on('error', ErrorHandler))
			.pipe(sourcemaps.write('./maps'))
			.pipe(gulp.dest(target));

	});

	debug('task registered');
}
