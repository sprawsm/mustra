// Global variables
var gulp                  = require('gulp');
var $                     = require('gulp-load-plugins')();
var del                   = require('del');
var colors                = require('colors');
var path                  = require('path');
var runSequence           = require('run-sequence');
var browserSync           = require('browser-sync');
var reload                = browserSync.reload;
var fs                    = require('fs');
var config                = fs.existsSync('./config.json') ?
                            require('./config.json') :
                            require('./config.example.json');

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


// Styles paths
var css = {
    src: [
        srcDir + 'scss/styles.scss',
        srcDir + 'scss/styleguide.scss'
    ],
    dest: destDir + 'assets/css/',
    watch: srcDir + 'scss/**/*.scss'
};


// Scripts paths
var js = {
    src: [
        npmVendorsDir + 'jquery/dist/jquery.js',
        npmVendorsDir + 'popper.js/dist/umd/popper.js',
        npmVendorsDir + 'bootstrap/js/dist/modal.js',
        npmVendorsDir + 'bootstrap/js/dist/dropdown.js',
        npmVendorsDir + 'bootstrap/js/dist/util.js',
        npmVendorsDir + 'bootstrap/js/dist/tab.js',
        npmVendorsDir + 'bootstrap/js/dist/collapse.js',
        npmVendorsDir + 'svg4everybody/dist/svg4everybody.js',
        npmVendorsDir + 'slick-carousel/slick/slick.js',
        srcDir + 'js/**/*.js'
    ],
    dest: destDir + 'assets/js/',
    destFile: 'app.js',
    destMinFile: 'app.min.js'
};


// Markup paths and options
var html = {
    src: [
        srcDir + 'markup/**/*.pug',
        '!source/markup/partials/**/*.pug',
        '!source/markup/styleguide/*.pug'
    ],
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
    dest: destDir + 'assets/images/',
    destIcons: destDir + 'assets/images/icons/'
};


// Favicons paths and options
var favicons = {
    src: srcDir + 'images/favicons/favicon.png',
    dest: destDir + 'assets/images/favicons/',
    dataFile: srcDir + 'images/favicons/favicon-data.json',
    androidName: config.favicons.androidName
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


// Shared plugins options
var options = {
    plumber: {
        errorHandler: errorAlert
    },
    sass: {
        outputStyle: 'expanded'
    },
    sassMin: {
        outputStyle: 'compressed'
    },
    autoprefixer: {
        browsers: ['last 3 versions']
    },
    pug: {
        pretty: true
    },
    size: {
        showFiles: true
    },
    rename: {
        suffix: '.min'
    },
    favicons: {
        masterPicture: favicons.src,
        dest: favicons.dest,
        iconsPath: favicons.dest,
        design: {
            ios: {
                pictureAspect: 'noChange',
                assets: {
                    ios6AndPriorIcons: false,
                    ios7AndLaterIcons: false,
                    precomposedIcons: false,
                    declareOnlyDefaultIcon: true
                }
            },
            desktopBrowser: {},
            windows: {
                pictureAspect: 'noChange',
                onConflict: 'override',
                assets: {
                    windows80Ie10Tile: false,
                    windows10Ie11EdgeTiles: {
                        small: false,
                        medium: true,
                        big: false,
                        rectangle: false
                    }
                }
            },
            androidChrome: {
                pictureAspect: 'noChange',
                manifest: {
                    name: favicons.androidName,
                    display: 'standalone',
                    orientation: 'notSet',
                    onConflict: 'override',
                    declared: true
                },
                assets: {
                    legacyIcon: false,
                    lowResolutionIcons: false
                }
            },
            safariPinnedTab: {
                pictureAspect: 'blackAndWhite',
            }
        },
        settings: {
            scalingAlgorithm: 'Mitchell',
            errorOnImageTooSmall: false
        },
        markupFile: favicons.dataFile
    },
    rsync: {
        root: destDir,
        hostname: config.staging.hostname,
        username: config.staging.username,
        destination: config.staging.destination,
        archive: true,
        incremental: true,
        recursive: true,
        compress: true,
        clean: true,
        silent: false,
        progress: false,
        command: false,
        dryrun: false,
        exclude: []
    }
};



//
// Styles Tasks
//
// Compiles and autoprefixes styles
gulp.task('css', function () {
    return gulp.src(css.src)
        .pipe($.plumber(options.plumber))
        .pipe($.sass(options.sass))
        .pipe($.autoprefixer(options.autoprefixer))
        .pipe($.size(options.size))
        .pipe(gulp.dest(css.dest))
        .pipe(browserSync.stream({match: '**/*.css'}));
});

// Compiles, autoprefixes and minifies styles
gulp.task('css:min', function () {
    return gulp.src(css.src)
        .pipe($.plumber(options.plumber))
        .pipe($.sass(options.sassMin))
        .pipe($.autoprefixer(options.autoprefixer))
        .pipe($.size(options.size))
        .pipe($.rename(options.rename))
        .pipe(gulp.dest(css.dest));
});



//
// Scripts Tasks
//
// Copies listed scripts to the build folder
gulp.task('js', function () {
    return gulp
        .src(js.src)
        .pipe($.newer(js.dest))
        .pipe($.plumber(options.plumber))
        .pipe(gulp.dest(js.dest));
});

// Merges and minifies scripts
gulp.task('js:min', function () {
    return gulp
        .src(js.src)
        .pipe($.newer(js.dest + js.destMinFile))
        .pipe($.plumber(options.plumber))
        .pipe($.concat(js.destFile))
        .pipe($.uglify())
        .pipe($.size(options.size))
        .pipe($.rename(options.rename))
        .pipe(gulp.dest(js.dest));
});



// Markup Task
// Builds html markup
gulp.task('html', function() {
    return gulp.src(html.src)
        .pipe($.newer(html.dest))
        .pipe($.plumber(options.plumber))
        .pipe($.pug(options.pug))
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



// Copies SVG icons to destinations icon folder
gulp.task('icons:copy', function () {
    return gulp.src(icons.src)
        .pipe($.newer(icons.destIcons))
        .pipe($.svgmin())
        .pipe(gulp.dest(icons.destIcons));
});



// Favicons Task
// Makes favicon files from one master image
gulp.task('favicons', function(done) {
    return $.realFavicon.generateFavicon(options.favicons, function () {
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
//
// Copies listed files to destination folder
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
    gulp.watch(css.watch, ['css', 'css:min']);
    gulp.watch(js.src, ['js', 'js:min', reload]);
    gulp.watch(html.watch, ['html', reload]);
    gulp.watch(images.src, ['images', reload]);
    gulp.watch(icons.src, ['icons', 'icons:copy', reload]);
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



// Deploy Task
// Synchorizes files with the destination server (uses rsync)
gulp.task('deploy', function () {
    return gulp.src(destDir)
        .pipe($.rsync(options.rsync));
});


//
// Default and Utility Tasks
//
gulp.task('assets', ['css', 'js', 'images', 'icons', 'icons:copy', 'fonts', 'favicons']);

gulp.task('build', function (callback) {
    runSequence('clean', ['html', 'assets', 'copy'], 'css:min', 'js:min', callback);
});

gulp.task('start', ['server']);
gulp.task('default', ['build']);
