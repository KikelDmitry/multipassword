'use strict';

//PCKGS
const { src, dest, parallel, series, watch } = require('gulp');

//common
const browserSync = require('browser-sync');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');

//html
const gulpPug = require('gulp-pug');

// css
const gulpSass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const csso = require('postcss-csso');

//js
const minify = require('gulp-minify');

//bitmap
const imagemin = require('gulp-imagemin');
const imageminPngquant = require('imagemin-pngquant');

//CONFIG

const config = {
	src: './src/',
	dest: './build/',
};
const globs = {
	pug: [
		config.src + 'pug/**/*.pug',
		'!' + config.src + 'pug/**/_*/*.pug',
	],
	scss: config.src + 'scss/main.scss',
	js: config.src + 'js/**/*.js',
	images: [
		config.src + 'img/**/*.{png,jpg,jpeg,svg,gif}',
		'!' + config.src + 'img/sprite/**/*.svg'
	],
	fonts: config.src + 'fonts/**/*.*',
}

//server
const server = () => {
	browserSync.init({
		server: {
			baseDir: config.dest,
			directory: true,
		},
		notify: false,
	})
};

//TASKS
const pug = () => {
	return src(globs.pug)
		.pipe(gulpPug({
			pretty: true,
			basedir: './'
		}))
		.pipe(dest(config.dest))
		.pipe(browserSync.stream())
};
exports.pug = pug;

const scss = () => {
	return src(globs.scss)
		.pipe(sourcemaps.init())
		.pipe(gulpSass({
			outputStyle: 'expanded'
		}))
		.on('error', gulpSass.logError)
		.pipe(postcss([
			autoprefixer(),
			csso()
		]))
		.pipe(sourcemaps.write('.'))
		.pipe(dest(config.dest + 'css'))
		.pipe(browserSync.stream())

};
exports.scss = scss;

const scripts = () => {
	return src(globs.js)
		.pipe(concat('bundle.js'))
		.pipe(minify({
			ext: {
				min: '.min.js'
			}
		}))
		.pipe(dest(config.dest + 'js'))
		.pipe(browserSync.stream())
};

const images = () => {
	return src(globs.images)
		.pipe(imagemin([
			imagemin.gifsicle({ interlaced: true }),
			imagemin.mozjpeg({ quality: 75, progressive: true }),
			imagemin.optipng({ optimizationLevel: 5 }),
			imagemin.svgo({
				plugins: [
					{ removeViewBox: true },
					{ cleanupIDs: false }
				]
			}),
			imageminPngquant({
				strip: true,
			}),
		], {
			verbose: true
		}))
		.pipe(dest(config.dest + 'img'))
};
exports.images = images;

const fonts = () => {
	return src(globs.fonts)
		.pipe(dest(config.dest + 'fonts'))
};

const watcher = () => {
	watch(config.src + 'pug/**/*.pug', pug)
	watch(config.src + 'scss/**/*.scss', scss)
	watch(globs.js, scripts)
	watch(globs.images, images)
};

const buildTree = () => {
	console.log(dirTree('./', {
		exclude: './build'
	}))
}
exports.buildTree = buildTree;

const clean = () => {
	return del(config.dest + '**', { force: true })
};
exports.clean = clean;


//build task
exports.build = series(
	clean,
	parallel(
		series(
			scss,
			pug,
		),
		scripts,
		images,
		fonts
	)
);

//development task
exports.dev = series(
	this.build,
	parallel(
		server,
		watcher
	)
);
