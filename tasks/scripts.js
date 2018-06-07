/**
 * Scripts Task
 */
import gulp from 'gulp';
import newer from 'gulp-newer';
import babel from 'gulp-babel';
import plumber from 'gulp-plumber';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import size from 'gulp-size';
import rename from 'gulp-rename';
import paths from './lib/paths';
import pluginOptions from './lib/plugin-options';

/**
 * Compile JS files
 */
const compileScripts = () => {
  return gulp
    .src(paths.scripts.src)
    .pipe(newer(paths.scripts.dest))
    .pipe(babel())
    .pipe(plumber(pluginOptions.plumber))
    .pipe(gulp.dest(paths.scripts.dest));
};

/**
 * Minfy JS files
 */
const minifyScripts = () => {
  return gulp
    .src(paths.scripts.src)
    .pipe(newer(paths.scripts.dest + paths.scripts.destMinFile))
    .pipe(plumber(pluginOptions.plumber))
    .pipe(concat(paths.scripts.destFile))
    .pipe(uglify())
    .pipe(size(pluginOptions.size))
    .pipe(rename(pluginOptions.rename))
    .pipe(gulp.dest(paths.scripts.dest));
};

/**
 * Watch changes on JS files
 */
const watchScripts = () => {
  return gulp.watch(paths.scripts.src, gulp.parallel(compileScripts, minifyScripts));
};

/**
 * Export
 */
export {
  compileScripts,
  minifyScripts,
  watchScripts
}
