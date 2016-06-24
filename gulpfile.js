// Global variables
var gulp                    = require('gulp');
var $                       = require('gulp-load-plugins')();
var del                     = require('del');
var colors                  = require('colors');
var browserSync             = require('browser-sync');
var reload                  = browserSync.reload;
var path                    = require('path');
var runSequence             = require('run-sequence');

// folders
var jsVendorsDir            = 'node_modules/';
var srcDir                  = 'source/';
var destDir                 = 'web/';

// favicon options
var faviconMasterImage      = srcDir + 'images/favicons/favicon.png';
var faviconDataFile         = srcDir + 'images/favicons/favicon-data.json';
var faviconAndroidName      = 'Mustra';

// customized error message
var errorAlert  = function (error) {
    var fullMessage = 'Error in **' + error.plugin + '**:' + error.message;

    $.notify.onError({
        title: error.plugin,
        message: error.message,
        sound: 'Frog'
    })(error);

    fullMessage = colors.bgRed.white(fullMessage);

    console.log(fullMessage);

    this.emit('end');
};



// Styles Task
// Compiles, autoprefixes and minifies styles
gulp.task('css', function () {
    return gulp.src([
            srcDir + 'less/styles.less',
            srcDir + 'less/styleguide.less'
        ])
        .pipe($.plumber({
            errorHandler: errorAlert
        }))
        .pipe($.sourcemaps.init())
        .pipe($.less({
            compress: true
        }))
        .pipe($.autoprefixer({
            browsers: ['last 3 versions']
        }))
        .pipe($.size({showFiles: true}))
        .pipe($.sourcemaps.write('/'))
        .pipe(gulp.dest(destDir + 'assets/css/'));
});



// Scripts Task
// Merges and minifies scripts
gulp.task('js', function () {
    return gulp
        .src([
            jsVendorsDir + 'jquery/dist/jquery.js',
            srcDir + 'js/app.js'
        ])
        .pipe($.newer(destDir + 'assets/js/app.js'))
        .pipe($.plumber({
            errorHandler: errorAlert
        }))
        .pipe($.concat('app.js'))
        .pipe(gulp.dest(destDir + 'assets/js/'))
        .pipe($.uglify())
        .pipe($.size({showFiles: true}))
        .pipe(gulp.dest(destDir + 'assets/js/'));
});


// Markup Task
// Builds html markup
gulp.task('html', function() {
    return gulp.src(srcDir + 'markup/*.pug')
        .pipe($.newer(destDir))
        .pipe($.plumber({
            errorHandler: errorAlert
        }))
        .pipe($.pug({
            pretty: true
        }))
        .pipe(gulp.dest(destDir));
});



// Images Task
// Compresses and copies images
gulp.task('images', function () {
    return gulp.src([
            srcDir + 'images/**/*.*',
            '!source/images/favicons/*.*',
            '!source/images/icons/*.svg',
        ])
        .pipe($.newer(destDir + 'assets/images/'))
        .pipe($.imagemin())
        .pipe(gulp.dest(destDir + 'assets/images/'));
});



// SVG Sprite Task
// Makes SVG sprite from independed SVG icons
gulp.task('icons', function () {
    return gulp.src(srcDir + 'images/icons/*.svg')
        .pipe($.newer(destDir + 'assets/images/icons.svg'))
        .pipe($.svgmin(function (file) {
            var prefix = path.basename(file.relative, path.extname(file.relative));
            return {
                plugins: [{
                    cleanupIDs: {
                        prefix: prefix + '-',
                        minify: true
                    }
                }]
            };
        }))
        .pipe($.svgstore())
        .pipe(gulp.dest(destDir + 'assets/images/'));
});



// Favicons Task
// Makes favicon files from one master image
gulp.task('favicons', function(done) {
    return $.realFavicon.generateFavicon({
        masterPicture: faviconMasterImage,
        dest: destDir + 'assets/images/favicons/',
        iconsPath: destDir + 'assets/images/favicons/',
        design: {
            ios: {
                pictureAspect: 'noChange'
            },
            desktopBrowser: {},
            windows: {
                pictureAspect: 'noChange',
                backgroundColor: '#da532c',
                onConflict: 'override'
            },
            androidChrome: {
                pictureAspect: 'noChange',
                themeColor: '#ffffff',
                manifest: {
                    name: faviconAndroidName,
                    display: 'browser',
                    orientation: 'notSet',
                    onConflict: 'override',
                    declared: true
                }
            },
            safariPinnedTab: {
                pictureAspect: 'silhouette',
                themeColor: '#5bbad5'
            }
        },
        settings: {
            scalingAlgorithm: 'Mitchell',
            errorOnImageTooSmall: false
        },
        markupFile: faviconDataFile
    }, function() {
        done();
    });
});



// Fonts Task
// Copies fonts to public folder
gulp.task('fonts', function () {
    return gulp
        .src(srcDir + 'fonts/*')
        .pipe(gulp.dest(destDir + 'assets/css/fonts/'));
});



// Copy Task
// Copies defined files
gulp.task('copy', function() {
    return gulp.src([
            srcDir + 'markup/*.{php,txt}',
            srcDir + 'markup/.htaccess'
        ])
        .pipe($.newer(destDir))
        .pipe($.plumber({
            errorHandler: errorAlert
        }))
        .pipe(gulp.dest(destDir));
});



// Clean Task
// Deletes folder with built files
gulp.task('clean', function () {
    return del(destDir);
});



// Watch Task
// Runs watcher mechanism for runing tasks on file update
gulp.task('watch', function () {
    gulp.watch([srcDir + 'less/**/*.less'], ['css', reload]);
    gulp.watch([srcDir + 'js/**/*.js'], ['js', reload]);
    gulp.watch([srcDir + 'markup/**/*.pug'], ['html', reload]);
    gulp.watch([srcDir + 'images/**/*.*', '!source/images/favicons/*.*', '!source/images/icons/*.svg'], ['images', reload]);
    gulp.watch([srcDir + 'images/icons/*.svg'], ['icons', reload]);
    gulp.watch([faviconMasterImage], ['favicons']);
    gulp.watch([srcDir + "markup/**/*.{php,txt}", srcDir + "markup/.htaccess"], ["copy"]);
});



// Watch Task
// Runs a web server with watch tasks
gulp.task('server', function () {
    browserSync({
        server: destDir,
        port: 3001
    });

    gulp.start('watch');
});



// Default and Utility Tasks
gulp.task('assets', ['css', 'js', 'images', 'icons', 'fonts', 'favicons']);
gulp.task('build', function (callback) {
    runSequence('clean', ['html', 'assets', 'copy'], callback);
});
gulp.task('default', ['build']);
