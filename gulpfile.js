var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var sourcemaps = require("gulp-sourcemaps");
var browserSync = require('browser-sync').create();

var sourceCss = 'src/scss/**/*.scss';

var cssOutputDir = 'assets/css';

var onError = function(err) {
	console.log('An error occurred:', gutil.colors.magenta(err.message));
	gutil.beep();
	this.emit('end');
};

gulp.task('browser-sync', function(){
	browserSync.init({
		proxy: "http://localhost:8888/twitter-maps/",
		files: ["*.php"]

	});
});

gulp.task('minify-css', function(){
	return gulp.src(sourceCss)
	.pipe(plumber({errorHandler: onError}))
	.pipe(sourcemaps.init())
	.pipe(sass())
	.pipe(cleanCSS({}))
	.pipe(sourcemaps.write())
	.pipe(rename(function(path){
		path.extname = '.min.css'
	}))
	.pipe(gulp.dest(cssOutputDir));
})

gulp.task('scss', function() {
	return gulp.src(sourceCss)
	.pipe(plumber({errorHandler: onError}))
	.pipe(sourcemaps.init())
	.pipe(sass())
	.pipe(sourcemaps.write())
	.pipe(gulp.dest(cssOutputDir))
	.pipe(browserSync.stream());
});

gulp.task('server', ['scss', 'browser-sync'], function(){
	gulp.watch(sourceCss, ['scss', 'minify-css']);
	gulp.watch(['**/*.html', cssOutputDir + '/**/*.css']).on('change', browserSync.reload);
})

gulp.task('watch', function() { //
	gulp.watch(sourceCss, ['scss', 'minify-css']);
});

gulp.task('default', ['scss', 'minify-css']);