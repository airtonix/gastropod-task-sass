/**
 * System
 */
var path = require('path');

/**
 * Framework
 */
var gulp = require('gulp'),
	gulpSass = require('gulp-sass'),
	sass = require('node-sass'),
	postcss = require('gulp-postcss'),
	autoprefixer = require('autoprefixer'),
	gulpIf = require('gulp-if'),
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
};

var buildPath = accept(String, String, String)
				.to(function (root, staticRoot, section){
					return path.join(root, staticRoot, section);
				});

var Logging = require('gastropod').Logging,
	Config = require('gastropod/src/config'),
	Manifest = require('gastropod/src/core/assets/manifest'),
	logger = new Logging.Logger('Sass'),
	ErrorHandler = new Logging.ErrorHandler('Sass');

/**
 * Exportable
 */
module.exports = function (){

	/**
	 * Constants
	 */
	var Urls = Config.Store.context.Site.urls,
		MediaRoot = path.join(Urls.root, Urls.media),
		StaticRoot = path.join(Urls.root, Urls.static),

		target = buildPath(Config.Store.target.root,
			Config.Store.target.static,
			Config.Store.target.styles),

		source = buildPath(Config.Store.source.root,
			Config.Store.source.styles,
			Config.Store.filters.styles),

		SassConfig = Object.assign(DEFAULT_CONFIG, Config.Store.plugins.css.sass);

		SassConfig.functions['media-url($url)'] = function (urlString, done) {
				var output = path.join(MediaRoot, urlString.getValue());
				done(new sass.types.String(output || 'error'));
			};

		SassConfig.functions['static-url($url)'] = function (urlString, done) {
				var output = Manifest.db[urlString.getValue()] || urlString;
				done(new sass.types.String(output || 'error'));
			};

	gulp.task('scss', function () {

		logger.msg('Starting');
		logger.msg(' > source', source);
		logger.msg(' > target', target);

		return gulp.src(source)
			.pipe(logger.incoming())
			.pipe(plumber(ErrorHandler))
			.pipe(named())
			.pipe(sourcemaps.init())
			.pipe(gulpSass(SassConfig).on('error', ErrorHandler))
			.pipe(gulpIf(SassConfig.prefix, postcss([ autoprefixer(SassConfig.prefix) ])) )
			.pipe(sourcemaps.write())
			.pipe(logger.outgoing())
			.pipe(gulp.dest(target));

	});

	debug('task registered');
};
