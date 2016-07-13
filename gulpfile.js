// Global variables
var gulp                  = require('gulp');
var $                     = require('gulp-load-plugins')();
var del                   = require('del');
var colors                = require('colors');
var path                  = require('path');
var runSequence           = require('run-sequence');
var browserSync           = require('browser-sync');
var reload                = browserSync.reload;


// Global paths
var npmVendorsDir         = 'node_modules/';
var srcDir                = 'source/';
var destDir               = 'web/';


// Customized error message
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


// Shared plugins options
var options = {
    plumber: {
        errorHandler: errorAlert
    },
    size: {
        showFiles: true
    }
};

// Styles paths
var css = {
    src: [
        srcDir + 'less/styles.less',
        srcDir + 'less/styleguide.less'
    ],
    dest: destDir + 'assets/css/',
    watch: srcDir + 'less/**/*.less'
};


// Scripts paths
var js = {
    src: [
        npmVendorsDir + 'jquery/dist/jquery.js',
        srcDir + 'js/app.js'
    ],
    dest: destDir + 'assets/js/',
    destFile: 'app.js'
};


// Markup paths and options
var html = {
    src: srcDir + 'markup/*.pug',
    dest: destDir,
    watch: srcDir + 'markup/**/*.pug'
};


// Images paths
var images = {
    src: [
        srcDir + 'images/**/*.*',
        '!source/images/favicons/*.*',
        '!source/images/icons/*.svg',
    ],
    dest: destDir + 'assets/images/'
};


// Icons paths
var icons = {
    src: srcDir + 'images/icons/*.svg',
    dest: destDir + 'assets/images/'
};


// Favicons paths and options
var favicons = {
    src: srcDir + 'images/favicons/favicon.png',
    dest: destDir + 'assets/images/favicons/',
    dataFile: srcDir + 'images/favicons/favicon-data.json',
    androidName: 'Mustra'
};


// Fonts paths
var fonts = {
    src: srcDir + 'fonts/*',
    dest: destDir + 'assets/fonts/'
};


// Files paths
var files = {
    src: [
        srcDir + 'markup/*.{php,txt}',
        srcDir + 'markup/.htaccess'
    ],
    dest: destDir
};



// Styles Task
// Compiles, autoprefixes and minifies styles
gulp.task('css', function () {
    return gulp.src(css.src)
        .pipe($.plumber(options.plumber))
        .pipe($.sourcemaps.init())
        .pipe($.less({
            compress: true
        }))
        .pipe($.autoprefixer({
            browsers: ['last 3 versions']
        }))
        .pipe($.size(options.size))
        .pipe($.sourcemaps.write('/'))
        .pipe(gulp.dest(css.dest));
});



// Scripts Task
// Merges and minifies scripts
gulp.task('js', function () {
    return gulp
        .src(js.src)
        .pipe($.newer(js.dest + js.destFile))
        .pipe($.plumber(options.plumber))
        .pipe($.concat(js.destFile))
        .pipe(gulp.dest(js.dest))
        .pipe($.uglify())
        .pipe($.size(options.size))
        .pipe(gulp.dest(js.dest));
});



// Markup Task
// Builds html markup
gulp.task('html', function() {
    return gulp.src(html.src)
        .pipe($.newer(html.dest))
        .pipe($.plumber(options.plumber))
        .pipe($.pug({
            pretty: true
        }))
        .pipe(gulp.dest(html.dest));
});



// Images Task
// Compresses and copies images
gulp.task('images', function () {
    return gulp.src(images.src)
        .pipe($.newer(images.dest))
        .pipe($.imagemin())
        .pipe(gulp.dest(images.dest));
});



// SVG Sprite Task
// Makes SVG sprite from independed SVG icons
gulp.task('icons', function () {
    return gulp.src(icons.src)
        .pipe($.newer(icons.dest + 'icons.svg'))
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
        .pipe(gulp.dest(icons.dest));
});



// Favicons Task
// Makes favicon files from one master image
gulp.task('favicons', function(done) {
    return $.realFavicon.generateFavicon({
        masterPicture: favicons.src,
        dest: favicons.dest,
        iconsPath: favicons.dest,
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
                    name: favicons.androidName,
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
        markupFile: favicons.dataFile
    }, function() {
        done();
    });
});



// Fonts Task
// Copies fonts to public folder
gulp.task('fonts', function () {
    return gulp
        .src(fonts.src)
        .pipe(gulp.dest(fonts.dest));
});



// Copy Task
// Copies defined files
gulp.task('copy', function() {
    return gulp.src(files.src)
        .pipe($.newer(files.dest))
        .pipe($.plumber(options.plumber))
        .pipe(gulp.dest(files.dest));
});



// Clean Task
// Deletes folder with built files
gulp.task('clean', function () {
    return del(destDir);
});



// Watch Task
// Runs watcher mechanism for runing tasks on file update
gulp.task('watch', function () {
    gulp.watch(css.watch, ['css', reload]);
    gulp.watch(js.src, ['js', reload]);
    gulp.watch(html.watch, ['html', reload]);
    gulp.watch(images.src, ['images', reload]);
    gulp.watch(icons.src, ['icons', reload]);
    gulp.watch(favicons.src, ['favicons']);
    gulp.watch(files.src, ["copy"]);
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
